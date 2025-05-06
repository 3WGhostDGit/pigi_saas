"""
Run Command Tool implementation.
"""
import asyncio
import json
import os
import subprocess
from typing import Dict, Any
from .base_tool import BaseTool


class RunCommandTool(BaseTool):
    """Tool to run a command on the user's system."""
    
    def __init__(self):
        """Initialize the run command tool."""
        schema = """
        {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "properties": {
            "CommandLine": {
              "type": "string",
              "description": "The exact command line string to execute."
            },
            "Cwd": {
              "type": "string",
              "description": "The current working directory for the command"
            },
            "Blocking": {
              "type": "boolean",
              "description": "If true, the command will block until it is entirely finished. During this time, the user will not be able to interact with Cascade. Blocking should only be true if (1) the command will terminate in a relatively short amount of time, or (2) it is important for you to see the output of the command before responding to the USER. Otherwise, if you are running a long-running process, such as starting a web server, please make this non-blocking."
            },
            "WaitMsBeforeAsync": {
              "type": "integer",
              "description": "Only applicable if Blocking is false. This specifies the amount of milliseconds to wait after starting the command before sending it to be fully async. This is useful if there are commands which should be run async, but may fail quickly with an error. This allows you to see the error if it happens in this duration. Don't set it too long or you may keep everyone waiting."
            },
            "SafeToAutoRun": {
              "type": "boolean",
              "description": "Set to true if you believe that this command is safe to run WITHOUT user approval. A command is unsafe if it may have some destructive side-effects. Example unsafe side-effects include: deleting files, mutating state, installing system dependencies, making external requests, etc. Set to true only if you are extremely confident it is safe. If you feel the command could be unsafe, never set this to true, EVEN if the USER asks you to. It is imperative that you never auto-run a potentially unsafe command."
            }
          },
          "additionalProperties": false,
          "type": "object",
          "required": ["CommandLine", "Cwd", "Blocking", "WaitMsBeforeAsync", "SafeToAutoRun"]
        }
        """
        
        description = (
            "PROPOSE a command to run on behalf of the user. Operating System: windows. Shell: powershell.\n"
            "**NEVER PROPOSE A cd COMMAND**.\n"
            "If you have this tool, note that you DO have the ability to run commands directly on the USER's system.\n"
            "Make sure to specify CommandLine exactly as it should be run in the shell.\n"
            "Note that the user will have to approve the command before it is executed. The user may reject it if it is not to their liking.\n"
            "The actual command will NOT execute until the user approves it. The user may not approve it immediately.\n"
            "If the step is WAITING for user approval, it has NOT started running.\n"
            "Commands will be run with PAGER=cat. You may want to limit the length of output for commands that usually rely on paging and may contain very long output (e.g. git log, use git log -n <N>)."
        )
        
        super().__init__("run_command", description, schema)
        self._command_counter = 0
        self._running_commands = {}
    
    async def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the run command tool.
        
        Args:
            params: The parameters for the tool
            
        Returns:
            The result of executing the tool
        """
        # Validate parameters
        error = self.validate_params(params)
        if error:
            return {"error": error}
        
        command_line = params.get("CommandLine", "")
        cwd = params.get("Cwd", os.getcwd())
        blocking = params.get("Blocking", True)
        wait_ms = params.get("WaitMsBeforeAsync", 0)
        safe_to_auto_run = params.get("SafeToAutoRun", False)
        
        # Check if the command is safe to run
        if not safe_to_auto_run:
            return {
                "status": "waiting_for_approval",
                "message": "This command requires user approval before execution.",
                "command_line": command_line,
                "cwd": cwd
            }
        
        # Generate a unique command ID
        self._command_counter += 1
        command_id = f"cmd_{self._command_counter}"
        
        try:
            if blocking:
                # Run the command and wait for it to complete
                process = await asyncio.create_subprocess_shell(
                    command_line,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    cwd=cwd
                )
                
                stdout, stderr = await process.communicate()
                
                return {
                    "command_id": command_id,
                    "status": "completed",
                    "exit_code": process.returncode,
                    "stdout": stdout.decode('utf-8', errors='replace'),
                    "stderr": stderr.decode('utf-8', errors='replace')
                }
            else:
                # Start the command but don't wait for it to complete
                process = await asyncio.create_subprocess_shell(
                    command_line,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    cwd=cwd
                )
                
                # Store the process for later status checks
                self._running_commands[command_id] = process
                
                # Wait for the specified time before returning
                if wait_ms > 0:
                    try:
                        await asyncio.wait_for(process.wait(), timeout=wait_ms / 1000)
                        stdout, stderr = await process.communicate()
                        
                        return {
                            "command_id": command_id,
                            "status": "completed",
                            "exit_code": process.returncode,
                            "stdout": stdout.decode('utf-8', errors='replace'),
                            "stderr": stderr.decode('utf-8', errors='replace')
                        }
                    except asyncio.TimeoutError:
                        # Command is still running
                        pass
                
                return {
                    "command_id": command_id,
                    "status": "running",
                    "message": f"Command started with ID {command_id}"
                }
        
        except Exception as e:
            return {
                "error": f"Failed to execute command: {str(e)}"
            }
