"""
Debugger Agent implementation.
"""
import json
import os
import re
from typing import Dict, Any, List, Optional, Tuple

from .agent_base import Agent
from .base_tool import BaseTool


class DebuggerAgent(Agent):
    """
    Agent responsible for identifying and fixing errors in the code.
    """
    
    def __init__(self, tools: List[BaseTool] = None):
        """
        Initialize the Debugger agent.
        
        Args:
            tools: Tools the agent can use
        """
        description = (
            "You are the Debugger agent, responsible for identifying and fixing errors in the code. "
            "Your job is to analyze error messages, trace code execution, and suggest fixes for bugs. "
            "You should be methodical in your approach, testing hypotheses and verifying fixes. "
            "When you encounter complex issues, you can ask for help from other agents through the Orchestrator."
        )
        
        super().__init__("Debugger", description, tools)
    
    async def process(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a message and return a response.
        
        Args:
            message: The message to process
            context: The context for processing the message
            
        Returns:
            The response from the agent
        """
        action = message.get("action", "")
        
        if action == "analyze_error":
            return await self._analyze_error(message, context)
        elif action == "trace_execution":
            return await self._trace_execution(message, context)
        elif action == "add_logging":
            return await self._add_logging(message, context)
        elif action == "suggest_fix":
            return await self._suggest_fix(message, context)
        elif action == "verify_fix":
            return await self._verify_fix(message, context)
        else:
            return {
                "status": "error",
                "message": f"Unknown action: {action}",
                "available_actions": [
                    "analyze_error", "trace_execution", "add_logging", 
                    "suggest_fix", "verify_fix"
                ]
            }
    
    async def _analyze_error(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze an error message."""
        error_message = message.get("error_message", "")
        stack_trace = message.get("stack_trace", "")
        
        if not error_message and not stack_trace:
            return {"status": "error", "message": "Missing error_message or stack_trace"}
        
        # In a real implementation, this would use tools to analyze the error
        # For now, we'll just return a mock response
        
        # Parse the error message and stack trace
        error_type, error_details = self._parse_error(error_message, stack_trace)
        
        return {
            "status": "success",
            "error_type": error_type,
            "error_details": error_details,
            "analysis": {
                "probable_cause": "Null reference in function xyz",
                "affected_files": ["file1.py", "file2.py"],
                "severity": "high",
                "suggested_actions": [
                    "Add null check in file1.py:42",
                    "Fix the input validation in file2.py:87"
                ]
            }
        }
    
    async def _trace_execution(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Trace code execution to identify the source of an error."""
        file_path = message.get("file_path", "")
        function_name = message.get("function_name", "")
        input_values = message.get("input_values", {})
        
        if not file_path:
            return {"status": "error", "message": "Missing file_path"}
        
        if not function_name:
            return {"status": "error", "message": "Missing function_name"}
        
        # In a real implementation, this would use tools to trace execution
        # For now, we'll just return a mock response
        
        return {
            "status": "success",
            "file_path": file_path,
            "function_name": function_name,
            "trace": [
                {
                    "line": 42,
                    "code": "result = process_data(input_data)",
                    "variables": {
                        "input_data": "None"
                    },
                    "note": "input_data is None, which causes the error"
                },
                {
                    "line": 43,
                    "code": "return result.value",
                    "variables": {
                        "result": "None"
                    },
                    "note": "Attempting to access 'value' on None"
                }
            ]
        }
    
    async def _add_logging(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Add logging statements to help debug an issue."""
        file_path = message.get("file_path", "")
        line_numbers = message.get("line_numbers", [])
        log_level = message.get("log_level", "debug")
        
        if not file_path:
            return {"status": "error", "message": "Missing file_path"}
        
        if not line_numbers:
            return {"status": "error", "message": "Missing line_numbers"}
        
        # In a real implementation, this would use tools to add logging
        # For now, we'll just return a mock response
        
        return {
            "status": "success",
            "file_path": file_path,
            "line_numbers": line_numbers,
            "log_level": log_level,
            "changes": [
                {
                    "line": 42,
                    "original": "result = process_data(input_data)",
                    "modified": "logger.debug(f\"input_data: {input_data}\"); result = process_data(input_data)"
                },
                {
                    "line": 43,
                    "original": "return result.value",
                    "modified": "logger.debug(f\"result: {result}\"); return result.value if result else None"
                }
            ]
        }
    
    async def _suggest_fix(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Suggest a fix for an issue."""
        file_path = message.get("file_path", "")
        error_type = message.get("error_type", "")
        error_details = message.get("error_details", {})
        
        if not file_path:
            return {"status": "error", "message": "Missing file_path"}
        
        if not error_type:
            return {"status": "error", "message": "Missing error_type"}
        
        # In a real implementation, this would use tools to suggest a fix
        # For now, we'll just return a mock response
        
        return {
            "status": "success",
            "file_path": file_path,
            "error_type": error_type,
            "suggested_fixes": [
                {
                    "line": 42,
                    "original": "result = process_data(input_data)",
                    "fix": "result = process_data(input_data) if input_data is not None else None",
                    "explanation": "Add a null check to prevent calling process_data with None"
                },
                {
                    "line": 43,
                    "original": "return result.value",
                    "fix": "return result.value if result is not None else None",
                    "explanation": "Add a null check to prevent accessing 'value' on None"
                }
            ]
        }
    
    async def _verify_fix(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Verify that a fix resolves the issue."""
        file_path = message.get("file_path", "")
        applied_fixes = message.get("applied_fixes", [])
        test_case = message.get("test_case", {})
        
        if not file_path:
            return {"status": "error", "message": "Missing file_path"}
        
        if not applied_fixes:
            return {"status": "error", "message": "Missing applied_fixes"}
        
        # In a real implementation, this would use tools to verify the fix
        # For now, we'll just return a mock response
        
        return {
            "status": "success",
            "file_path": file_path,
            "verification_result": {
                "success": True,
                "message": "The fix resolved the issue",
                "test_output": "All tests passed",
                "performance_impact": "Negligible"
            }
        }
    
    def _parse_error(self, error_message: str, stack_trace: str) -> Tuple[str, Dict[str, Any]]:
        """
        Parse an error message and stack trace to extract useful information.
        
        Args:
            error_message: The error message
            stack_trace: The stack trace
            
        Returns:
            A tuple of (error_type, error_details)
        """
        # This is a simplified implementation
        # In a real implementation, this would be much more sophisticated
        
        error_type = "Unknown Error"
        error_details = {}
        
        # Try to extract the error type
        if error_message:
            match = re.search(r'^([A-Za-z0-9_]+Error|Exception):', error_message)
            if match:
                error_type = match.group(1)
        
        # Try to extract file and line information from the stack trace
        if stack_trace:
            file_matches = re.findall(r'File "([^"]+)", line (\d+)', stack_trace)
            if file_matches:
                error_details["files"] = [
                    {"file": file, "line": int(line)}
                    for file, line in file_matches
                ]
        
        return error_type, error_details
