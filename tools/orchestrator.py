"""
Orchestrator for the multi-agent MCP server.
"""
import json
import logging
import time
from typing import Dict, Any, List, Optional, Callable

from .agent_base import Agent
from .memory_bank_agent import MemoryBankAgent
from .coder_agent import CoderAgent
from .deeper_searcher_agent import DeeperSearcherAgent
from .debugger_agent import DebuggerAgent


class Orchestrator:
    """
    Orchestrator for the multi-agent system.
    Coordinates the agents and manages the workflow.
    """
    
    def __init__(self):
        """Initialize the Orchestrator."""
        self.logger = logging.getLogger("orchestrator")
        self.agents: Dict[str, Agent] = {}
        self.workflows: Dict[str, Dict[str, Any]] = {}
        self.active_workflows: Dict[str, Dict[str, Any]] = {}
        
        # Register agents
        self._register_agents()
        
        # Register workflows
        self._register_workflows()
    
    def _register_agents(self):
        """Register all agents."""
        self.agents = {
            "memory_bank": MemoryBankAgent(),
            "coder": CoderAgent(),
            "deeper_searcher": DeeperSearcherAgent(),
            "debugger": DebuggerAgent()
        }
        
        self.logger.info(f"Registered {len(self.agents)} agents: {', '.join(self.agents.keys())}")
    
    def _register_workflows(self):
        """Register all workflows."""
        self.workflows = {
            "code_implementation": {
                "description": "Implement a new feature or change",
                "steps": [
                    {"agent": "deeper_searcher", "action": "analyze_folder", "description": "Analyze the codebase"},
                    {"agent": "memory_bank", "action": "store", "description": "Store analysis results"},
                    {"agent": "coder", "action": "plan", "description": "Create an implementation plan"},
                    {"agent": "coder", "action": "implement", "description": "Implement the changes"},
                    {"agent": "debugger", "action": "verify_fix", "description": "Verify the implementation"}
                ]
            },
            "bug_fixing": {
                "description": "Fix a bug in the code",
                "steps": [
                    {"agent": "debugger", "action": "analyze_error", "description": "Analyze the error"},
                    {"agent": "deeper_searcher", "action": "analyze_file", "description": "Analyze the affected files"},
                    {"agent": "debugger", "action": "trace_execution", "description": "Trace code execution"},
                    {"agent": "debugger", "action": "suggest_fix", "description": "Suggest a fix"},
                    {"agent": "coder", "action": "implement", "description": "Implement the fix"},
                    {"agent": "debugger", "action": "verify_fix", "description": "Verify the fix"}
                ]
            },
            "code_analysis": {
                "description": "Analyze the codebase",
                "steps": [
                    {"agent": "deeper_searcher", "action": "analyze_folder", "description": "Analyze the codebase structure"},
                    {"agent": "deeper_searcher", "action": "find_patterns", "description": "Identify code patterns"},
                    {"agent": "deeper_searcher", "action": "identify_issues", "description": "Identify potential issues"},
                    {"agent": "deeper_searcher", "action": "suggest_improvements", "description": "Suggest improvements"},
                    {"agent": "memory_bank", "action": "store", "description": "Store analysis results"}
                ]
            },
            "code_refactoring": {
                "description": "Refactor code to improve quality",
                "steps": [
                    {"agent": "deeper_searcher", "action": "analyze_file", "description": "Analyze the code to refactor"},
                    {"agent": "deeper_searcher", "action": "suggest_improvements", "description": "Suggest refactoring options"},
                    {"agent": "coder", "action": "plan", "description": "Create a refactoring plan"},
                    {"agent": "coder", "action": "refactor", "description": "Implement the refactoring"},
                    {"agent": "debugger", "action": "verify_fix", "description": "Verify the refactoring"}
                ]
            }
        }
        
        self.logger.info(f"Registered {len(self.workflows)} workflows: {', '.join(self.workflows.keys())}")
    
    async def process_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a message from the client.
        
        Args:
            message: The message to process
            
        Returns:
            The response from the Orchestrator
        """
        action = message.get("action", "")
        
        if action == "start_workflow":
            return await self._start_workflow(message)
        elif action == "get_workflow_status":
            return await self._get_workflow_status(message)
        elif action == "list_workflows":
            return await self._list_workflows(message)
        elif action == "list_agents":
            return await self._list_agents(message)
        elif action == "direct_agent_call":
            return await self._direct_agent_call(message)
        else:
            return {
                "status": "error",
                "message": f"Unknown action: {action}",
                "available_actions": [
                    "start_workflow", "get_workflow_status", "list_workflows", 
                    "list_agents", "direct_agent_call"
                ]
            }
    
    async def _start_workflow(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Start a workflow."""
        workflow_name = message.get("workflow_name", "")
        parameters = message.get("parameters", {})
        
        if not workflow_name:
            return {"status": "error", "message": "Missing workflow_name"}
        
        if workflow_name not in self.workflows:
            return {
                "status": "error", 
                "message": f"Unknown workflow: {workflow_name}",
                "available_workflows": list(self.workflows.keys())
            }
        
        # Generate a unique workflow ID
        workflow_id = f"wf_{int(time.time())}_{workflow_name}"
        
        # Create a new active workflow
        self.active_workflows[workflow_id] = {
            "id": workflow_id,
            "name": workflow_name,
            "status": "running",
            "start_time": time.time(),
            "current_step": 0,
            "steps": self.workflows[workflow_name]["steps"],
            "parameters": parameters,
            "results": []
        }
        
        self.logger.info(f"Started workflow {workflow_name} with ID {workflow_id}")
        
        # Start the workflow execution (in a real implementation, this would be asynchronous)
        # For now, we'll just return the workflow ID
        
        return {
            "status": "success",
            "message": f"Started workflow {workflow_name}",
            "workflow_id": workflow_id
        }
    
    async def _get_workflow_status(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Get the status of a workflow."""
        workflow_id = message.get("workflow_id", "")
        
        if not workflow_id:
            return {"status": "error", "message": "Missing workflow_id"}
        
        if workflow_id not in self.active_workflows:
            return {"status": "error", "message": f"Unknown workflow ID: {workflow_id}"}
        
        workflow = self.active_workflows[workflow_id]
        
        return {
            "status": "success",
            "workflow": {
                "id": workflow["id"],
                "name": workflow["name"],
                "status": workflow["status"],
                "start_time": workflow["start_time"],
                "current_step": workflow["current_step"],
                "total_steps": len(workflow["steps"]),
                "current_step_description": workflow["steps"][workflow["current_step"]]["description"] if workflow["current_step"] < len(workflow["steps"]) else None,
                "results": workflow["results"]
            }
        }
    
    async def _list_workflows(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """List all available workflows."""
        return {
            "status": "success",
            "workflows": [
                {
                    "name": name,
                    "description": workflow["description"],
                    "steps": len(workflow["steps"])
                }
                for name, workflow in self.workflows.items()
            ]
        }
    
    async def _list_agents(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """List all available agents."""
        return {
            "status": "success",
            "agents": [
                {
                    "name": name,
                    "description": agent.description,
                    "tools": [tool.name for tool in agent.tools]
                }
                for name, agent in self.agents.items()
            ]
        }
    
    async def _direct_agent_call(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Call an agent directly."""
        agent_name = message.get("agent_name", "")
        agent_message = message.get("agent_message", {})
        
        if not agent_name:
            return {"status": "error", "message": "Missing agent_name"}
        
        if agent_name not in self.agents:
            return {
                "status": "error", 
                "message": f"Unknown agent: {agent_name}",
                "available_agents": list(self.agents.keys())
            }
        
        if not agent_message:
            return {"status": "error", "message": "Missing agent_message"}
        
        # Create context for the agent
        context = {
            "timestamp": time.time(),
            "orchestrator": self
        }
        
        # Call the agent
        agent = self.agents[agent_name]
        result = await agent.process(agent_message, context)
        
        return {
            "status": "success",
            "agent_name": agent_name,
            "result": result
        }
    
    async def execute_workflow_step(self, workflow_id: str) -> Dict[str, Any]:
        """
        Execute a step in a workflow.
        
        Args:
            workflow_id: The ID of the workflow
            
        Returns:
            The result of executing the step
        """
        if workflow_id not in self.active_workflows:
            return {"status": "error", "message": f"Unknown workflow ID: {workflow_id}"}
        
        workflow = self.active_workflows[workflow_id]
        
        if workflow["status"] != "running":
            return {"status": "error", "message": f"Workflow is not running: {workflow_id}"}
        
        if workflow["current_step"] >= len(workflow["steps"]):
            return {"status": "error", "message": f"Workflow has no more steps: {workflow_id}"}
        
        # Get the current step
        step = workflow["steps"][workflow["current_step"]]
        
        # Get the agent for this step
        agent_name = step["agent"]
        if agent_name not in self.agents:
            return {"status": "error", "message": f"Unknown agent: {agent_name}"}
        
        agent = self.agents[agent_name]
        
        # Create the message for the agent
        agent_message = {
            "action": step["action"],
            **workflow["parameters"]
        }
        
        # Create context for the agent
        context = {
            "timestamp": time.time(),
            "workflow_id": workflow_id,
            "step": workflow["current_step"],
            "orchestrator": self
        }
        
        # Call the agent
        result = await agent.process(agent_message, context)
        
        # Store the result
        workflow["results"].append({
            "step": workflow["current_step"],
            "agent": agent_name,
            "action": step["action"],
            "result": result
        })
        
        # Move to the next step
        workflow["current_step"] += 1
        
        # Check if the workflow is complete
        if workflow["current_step"] >= len(workflow["steps"]):
            workflow["status"] = "completed"
            workflow["end_time"] = time.time()
        
        return {
            "status": "success",
            "workflow_id": workflow_id,
            "step": workflow["current_step"] - 1,
            "result": result
        }
