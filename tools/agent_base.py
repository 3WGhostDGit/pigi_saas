"""
Base Agent class for the multi-agent MCP server.
"""
import json
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Callable

from .base_tool import BaseTool


class Agent(ABC):
    """Base class for all agents in the multi-agent system."""
    
    def __init__(self, name: str, description: str, tools: List[BaseTool] = None):
        """
        Initialize an agent.
        
        Args:
            name: The name of the agent
            description: A description of what the agent does
            tools: A list of tools the agent can use
        """
        self.name = name
        self.description = description
        self.tools = tools or []
        self.logger = logging.getLogger(f"agent.{name}")
        
    @abstractmethod
    async def process(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a message and return a response.
        
        Args:
            message: The message to process
            context: The context for processing the message
            
        Returns:
            The response from the agent
        """
        pass
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the agent to a dictionary representation.
        
        Returns:
            A dictionary with the agent's name, description, and tools
        """
        return {
            "name": self.name,
            "description": self.description,
            "tools": [tool.to_dict() for tool in self.tools]
        }
    
    def get_system_prompt(self) -> str:
        """
        Get the system prompt for the agent.
        
        Returns:
            The system prompt for the agent
        """
        tools_json = json.dumps({tool.name: tool.to_dict() for tool in self.tools}, indent=2)
        
        return f"""
You are the {self.name} agent, part of a multi-agent system.

{self.description}

You have access to the following tools:
{tools_json}

When you need to use a tool, format your request as:
<tool_name>{{"param1": "value1", "param2": "value2"}}</tool_name>

Always follow the tool's schema exactly and provide all required parameters.
"""
