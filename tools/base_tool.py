"""
Base Tool class for MCP server tools.
"""
import json
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional


class BaseTool(ABC):
    """Base class for all tools."""
    
    def __init__(self, name: str, description: str, schema: str):
        """
        Initialize a tool with its name, description, and schema.
        
        Args:
            name: The name of the tool
            description: A description of what the tool does
            schema: The JSON schema for the tool's parameters
        """
        self.name = name
        self.description = description
        self.schema = schema
        
    @abstractmethod
    async def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the tool with the given parameters.
        
        Args:
            params: The parameters for the tool
            
        Returns:
            The result of executing the tool
        """
        pass
    
    def to_dict(self) -> Dict[str, str]:
        """
        Convert the tool to a dictionary representation.
        
        Returns:
            A dictionary with the tool's name, description, and schema
        """
        return {
            "name": self.name,
            "description": self.description,
            "schema": self.schema
        }
    
    def validate_params(self, params: Dict[str, Any]) -> Optional[str]:
        """
        Validate the parameters against the schema.
        
        Args:
            params: The parameters to validate
            
        Returns:
            An error message if validation fails, None otherwise
        """
        # This is a simplified validation - in a real implementation,
        # you would use a JSON schema validator
        try:
            schema_obj = json.loads(self.schema)
            required = schema_obj.get("required", [])
            
            # Check required parameters
            for param in required:
                if param not in params:
                    return f"Missing required parameter: {param}"
            
            # Additional validation could be added here
            
            return None
        except json.JSONDecodeError:
            return "Invalid schema format"
