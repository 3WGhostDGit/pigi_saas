"""
Edit File Tool implementation.
"""
import json
import os
import re
from typing import Dict, Any, List, Tuple
from .base_tool import BaseTool
from .utils import safe_path


class EditFileTool(BaseTool):
    """Tool to edit an existing file."""
    
    def __init__(self):
        """Initialize the edit file tool."""
        schema = """
        {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "properties": {
            "CodeMarkdownLanguage": {
              "type": "string",
              "description": "Markdown language for the code block, e.g 'python' or 'javascript'"
            },
            "TargetFile": {
              "type": "string",
              "description": "The target file to modify. Always specify the target file as the very first argument."
            },
            "Instruction": {
              "type": "string",
              "description": "A description of the changes that you are making to the file."
            },
            "TargetLintErrorIds": {
              "items": {
                "type": "string"
              },
              "type": "array",
              "description": "If applicable, IDs of lint errors this edit aims to fix (they'll have been given in recent IDE feedback). If you believe the edit could fix lints, do specify lint IDs; if the edit is wholly unrelated, do not. A rule of thumb is, if your edit was influenced by lint feedback, include lint IDs. Exercise honest judgement here."
            },
            "CodeEdit": {
              "type": "string",
              "description": "Specify ONLY the precise lines of code that you wish to edit. **NEVER specify or write out unchanged code**. Instead, represent all unchanged code using this special placeholder: {{ ... }}"
            }
          },
          "additionalProperties": false,
          "type": "object",
          "required": ["CodeMarkdownLanguage", "TargetFile", "Instruction", "TargetLintErrorIds", "CodeEdit"]
        }
        """
        
        description = (
            "Do NOT make parallel edits to the same file.\n"
            "Use this tool to edit an existing file. Follow these rules:\n"
            "1. Specify ONLY the precise lines of code that you wish to edit.\n"
            "2. **NEVER specify or write out unchanged code**. Instead, represent all unchanged code using this special placeholder: {{ ... }}.\n"
            "3. To edit multiple, non-adjacent lines of code in the same file, make a single call to this tool. Specify each edit in sequence with the special placeholder {{ ... }} to represent unchanged code in between edited lines.\n"
            "Here's an example of how to edit three non-adjacent lines of code at once:\n"
            "CodeContent:\n"
            "{{ ... }}\n"
            "edited_line_1\n"
            "{{ ... }}\n"
            "edited_line_2\n"
            "{{ ... }}\n"
            "edited_line_3\n"
            "{{ ... }}\n\n"
            "5. You may not edit file extensions: [.ipynb]\n"
            "You should specify the following arguments before the others: [TargetFile]"
        )
        
        super().__init__("edit_file", description, schema)
    
    async def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the edit file tool.
        
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
        code_edit = params.get("CodeEdit", "")
        instruction = params.get("Instruction", "")
        language = params.get("CodeMarkdownLanguage", "")
        lint_error_ids = params.get("TargetLintErrorIds", [])
        
        # Validate target file
        target_file = safe_path(target_file)
        
        # Check if file exists
        if not os.path.isfile(target_file):
            return {"error": f"File not found: {target_file}"}
        
        # Check if file has a forbidden extension
        if target_file.endswith(".ipynb"):
            return {"error": "Editing .ipynb files is not supported"}
        
        try:
            # Read the file
            with open(target_file, 'r', encoding='utf-8', errors='replace') as f:
                original_content = f.read()
            
            # Apply the edits
            new_content = self._apply_edits(original_content, code_edit)
            
            # Write the file
            with open(target_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            return {
                "success": True,
                "message": f"File edited: {target_file}",
                "file_path": target_file,
                "instruction": instruction,
                "language": language,
                "lint_error_ids": lint_error_ids
            }
        
        except Exception as e:
            return {"error": f"Failed to edit file: {str(e)}"}
    
    def _apply_edits(self, original_content: str, code_edit: str) -> str:
        """
        Apply edits to the original content.
        
        Args:
            original_content: The original file content
            code_edit: The code edit specification
            
        Returns:
            The new content with edits applied
        """
        # Split the original content into lines
        original_lines = original_content.splitlines()
        
        # Split the code edit into sections
        edit_sections = re.split(r'{{ *\.\.\. *}}', code_edit)
        
        # If there's only one section and no placeholders, replace the entire file
        if len(edit_sections) == 1 and "{{ ... }}" not in code_edit:
            return edit_sections[0]
        
        # Initialize the result with the original content
        result = original_content
        
        # Apply each edit section
        current_pos = 0
        for section in edit_sections:
            # Skip empty sections
            if not section.strip():
                continue
            
            # Find the next occurrence of the section in the original content
            section_pos = result.find(section, current_pos)
            
            if section_pos == -1:
                # If the section is not found, append it to the end
                result += "\n" + section
            else:
                # Update the current position
                current_pos = section_pos + len(section)
        
        return result
