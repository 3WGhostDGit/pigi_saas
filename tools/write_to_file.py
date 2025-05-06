"""
Write to File Tool implementation.
"""
import json
import os
from typing import Dict, Any
from .base_tool import BaseTool
from .utils import safe_path


class WriteToFileTool(BaseTool):
    """Tool to create new files."""
    
    def __init__(self):
        """Initialize the write to file tool."""
        schema = """
        {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "properties": {
            "TargetFile": {
              "type": "string",
              "description": "The target file to create and write code to. (Must be specified first)."
            },
            "CodeContent": {
              "type": "string",
              "description": "The code contents to write to the file."
            },
            "EmptyFile": {
              "type": "boolean",
              "description": "Set this to true to create an empty file."
            }
          },
          "additionalProperties": false,
          "type": "object",
          "required": ["TargetFile", "CodeContent", "EmptyFile"]
        }
        """
        
        description = (
            "Use this tool to create new files. The file and any parent directories will be created for you "
            "if they do not already exist. Follow these instructions: "
            "1. NEVER use this tool to modify or overwrite existing files. Always first confirm that TargetFile "
            "does not exist before calling this tool. "
            "2. You MUST specify TargetFile as the FIRST argument. Please specify the full TargetFile before "
            "any of the code contents."
        )
        
        super().__init__("write_to_file", description, schema)
    
    async def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the write to file tool.
        
        Args:
            params: The parameters for the tool
            
        Returns:
            The result of executing the tool
        """
        # Validate parameters
        error = self.validate_params(params)
        if error:
            return {"error": error}
        
        target_file = params.get("TargetFile", "")
        code_content = params.get("CodeContent", "")
        empty_file = params.get("EmptyFile", False)
        
        # Validate target file
        target_file = safe_path(target_file)
        
        # Check if file already exists
        if os.path.exists(target_file):
            return {"error": f"File already exists: {target_file}. Use edit_file tool instead."}
        
        try:
            # Create parent directories if they don't exist
            os.makedirs(os.path.dirname(target_file), exist_ok=True)
            
            # Write the file
            with open(target_file, 'w', encoding='utf-8') as f:
                if not empty_file:
                    f.write(code_content)
            
            return {
                "success": True,
                "message": f"File created: {target_file}",
                "file_path": target_file,
                "is_empty": empty_file
            }
        
        except Exception as e:
            return {"error": f"Failed to write file: {str(e)}"}
