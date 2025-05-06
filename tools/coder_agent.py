"""
Coder Agent implementation.
"""
import json
from typing import Dict, Any, List, Optional

from .agent_base import Agent
from .base_tool import BaseTool


class CoderAgent(Agent):
    """
    Agent responsible for planning and implementing code changes.
    """
    
    def __init__(self, tools: List[BaseTool] = None):
        """
        Initialize the Coder agent.
        
        Args:
            tools: Tools the agent can use
        """
        description = (
            "You are the Coder agent, responsible for planning and implementing code changes. "
            "Your job is to understand the requirements, plan the necessary changes, and implement them. "
            "You should break down complex tasks into smaller, manageable steps and execute them one by one. "
            "Always explain your reasoning and the changes you're making. When you encounter difficulties, "
            "ask for help from other agents through the Orchestrator."
        )
        
        super().__init__("Coder", description, tools)
    
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
        
        if action == "plan":
            return await self._create_plan(message, context)
        elif action == "implement":
            return await self._implement_code(message, context)
        elif action == "review":
            return await self._review_code(message, context)
        elif action == "refactor":
            return await self._refactor_code(message, context)
        else:
            return {
                "status": "error",
                "message": f"Unknown action: {action}",
                "available_actions": ["plan", "implement", "review", "refactor"]
            }
    
    async def _create_plan(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Create a plan for implementing code changes."""
        task = message.get("task", "")
        requirements = message.get("requirements", [])
        constraints = message.get("constraints", [])
        
        if not task:
            return {"status": "error", "message": "Missing task description"}
        
        # In a real implementation, this would call an LLM to create a plan
        # For now, we'll just return a mock plan
        
        plan = {
            "task": task,
            "steps": [
                {
                    "id": 1,
                    "description": "Analyze the requirements and constraints",
                    "status": "pending"
                },
                {
                    "id": 2,
                    "description": "Identify the files that need to be modified",
                    "status": "pending"
                },
                {
                    "id": 3,
                    "description": "Implement the changes",
                    "status": "pending"
                },
                {
                    "id": 4,
                    "description": "Test the changes",
                    "status": "pending"
                },
                {
                    "id": 5,
                    "description": "Review and refactor if necessary",
                    "status": "pending"
                }
            ],
            "estimated_time": "30 minutes"
        }
        
        return {
            "status": "success",
            "plan": plan
        }
    
    async def _implement_code(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Implement code changes based on a plan."""
        plan = message.get("plan", {})
        step_id = message.get("step_id", None)
        file_path = message.get("file_path", "")
        code_changes = message.get("code_changes", "")
        
        if not plan:
            return {"status": "error", "message": "Missing plan"}
        
        if step_id is None:
            return {"status": "error", "message": "Missing step_id"}
        
        if not file_path:
            return {"status": "error", "message": "Missing file_path"}
        
        # In a real implementation, this would use tools to implement the changes
        # For now, we'll just return a mock response
        
        return {
            "status": "success",
            "message": f"Implemented changes for step {step_id} in file {file_path}",
            "file_path": file_path,
            "changes_made": True
        }
    
    async def _review_code(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Review code changes."""
        file_path = message.get("file_path", "")
        
        if not file_path:
            return {"status": "error", "message": "Missing file_path"}
        
        # In a real implementation, this would use tools to review the code
        # For now, we'll just return a mock response
        
        return {
            "status": "success",
            "message": f"Reviewed code in file {file_path}",
            "issues": [],
            "suggestions": []
        }
    
    async def _refactor_code(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Refactor code."""
        file_path = message.get("file_path", "")
        refactoring_type = message.get("refactoring_type", "")
        
        if not file_path:
            return {"status": "error", "message": "Missing file_path"}
        
        if not refactoring_type:
            return {"status": "error", "message": "Missing refactoring_type"}
        
        # In a real implementation, this would use tools to refactor the code
        # For now, we'll just return a mock response
        
        return {
            "status": "success",
            "message": f"Refactored code in file {file_path} using {refactoring_type} refactoring",
            "file_path": file_path,
            "changes_made": True
        }
