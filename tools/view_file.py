"""
View File Tool implementation.
"""
import json
import os
from typing import Dict, Any, List, Optional
from .base_tool import BaseTool
from .utils import safe_path


class ViewFileTool(BaseTool):
    """Tool to view the contents of a file."""
    
    def __init__(self):
        """Initialize the view file tool."""
        schema = """
        {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "properties": {
            "AbsolutePath": {
              "type": "string",
              "description": "Path to file to view. Must be an absolute path."
            },
            "StartLine": {
              "type": "integer",
              "description": "Startline to view"
            },
            "EndLine": {
              "type": "integer",
              "description": "Endline to view, inclusive. This cannot be more than 200 lines away from StartLine"
            },
            "IncludeSummaryOfOtherLines": {
              "type": "boolean",
              "description": "If true, you will also get a condensed summary of the full file contents in addition to the exact lines of code from StartLine to EndLine."
            }
          },
          "additionalProperties": false,
          "type": "object",
          "required": ["AbsolutePath", "StartLine", "EndLine", "IncludeSummaryOfOtherLines"]
        }
        """
        
        description = (
            "View the contents of a file. The lines of the file are 0-indexed, and the output of this tool call "
            "will be the file contents from StartLine to EndLine (inclusive), together with a summary of the lines "
            "outside of StartLine and EndLine. Note that this call can view at most 200 lines at a time.\n\n"
            "When using this tool to gather information, it's your responsibility to ensure you have the COMPLETE context. "
            "Specifically, each time you call this command you should:\n"
            "1) Assess if the file contents you viewed are sufficient to proceed with your task.\n"
            "2) If the file contents you have viewed are insufficient, and you suspect they may be in lines not shown, "
            "proactively call the tool again to view those lines.\n"
            "3) When in doubt, call this tool again to gather more information. Remember that partial file views may "
            "miss critical dependencies, imports, or functionality."
        )
        
        super().__init__("view_file", description, schema)
    
    async def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the view file tool.
        
        Args:
            params: The parameters for the tool
            
        Returns:
            The result of executing the tool
        """
        # Validate parameters
        error = self.validate_params(params)
        if error:
            return {"error": error}
        
        path = params.get("AbsolutePath", "")
        start_line = params.get("StartLine", 0)
        end_line = params.get("EndLine", 0)
        include_summary = params.get("IncludeSummaryOfOtherLines", False)
        
        # Validate path
        path = safe_path(path)
        if not os.path.isfile(path):
            return {"error": f"File not found: {path}"}
        
        # Validate line range
        if end_line < start_line:
            return {"error": "EndLine must be greater than or equal to StartLine"}
        
        if end_line - start_line > 200:
            return {"error": "Cannot view more than 200 lines at once"}
        
        try:
            # Read the file
            with open(path, 'r', encoding='utf-8', errors='replace') as f:
                lines = f.readlines()
            
            # Get the requested lines
            total_lines = len(lines)
            
            # Adjust line numbers to be within bounds
            start_line = max(0, min(start_line, total_lines - 1))
            end_line = max(0, min(end_line, total_lines - 1))
            
            # Extract the requested lines
            requested_lines = lines[start_line:end_line + 1]
            
            result = {
                "file_path": path,
                "start_line": start_line,
                "end_line": end_line,
                "total_lines": total_lines,
                "content": "".join(requested_lines)
            }
            
            # Include summary of other lines if requested
            if include_summary and (start_line > 0 or end_line < total_lines - 1):
                summary = []
                
                # Summarize lines before the requested range
                if start_line > 0:
                    before_lines = lines[:start_line]
                    summary.append(f"Lines 0-{start_line-1} (not shown): {len(before_lines)} lines")
                
                # Summarize lines after the requested range
                if end_line < total_lines - 1:
                    after_lines = lines[end_line+1:]
                    summary.append(f"Lines {end_line+1}-{total_lines-1} (not shown): {len(after_lines)} lines")
                
                result["summary"] = "\n".join(summary)
            
            return result
        
        except Exception as e:
            return {"error": f"Failed to read file: {str(e)}"}
