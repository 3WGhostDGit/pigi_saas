"""
Browser Preview Tool implementation.
"""
import json
from typing import Dict, Any
import webbrowser
from .base_tool import BaseTool
from .utils import validate_url


class BrowserPreviewTool(BaseTool):
    """Tool to provide a browser preview for a web server."""
    
    def __init__(self):
        """Initialize the browser preview tool."""
        schema = """
        {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "properties": {
            "Url": {
              "type": "string",
              "description": "The URL of the target web server to provide a browser preview for. This should contain the scheme (e.g. http:// or https://), domain (e.g. localhost or 127.0.0.1), and port (e.g. :8080) but no path."
            },
            "Name": {
              "type": "string",
              "description": "A short name 3-5 word name for the target web server. Should be title-cased e.g. 'Personal Website'. Format as a simple string, not as markdown; and please output the title directly, do not prefix it with 'Title:' or anything similar."
            }
          },
          "additionalProperties": false,
          "type": "object",
          "required": ["Url", "Name"]
        }
        """
        
        description = (
            "Spin up a browser preview for a web server. This allows the USER to interact with the web server "
            "normally as well as provide console logs and other information from the web server to Cascade. "
            "Note that this tool call will not automatically open the browser preview for the USER, they must "
            "click one of the provided buttons to open it in the browser."
        )
        
        super().__init__("browser_preview", description, schema)
    
    async def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the browser preview tool.
        
        Args:
            params: The parameters for the tool
            
        Returns:
            The result of executing the tool
        """
        # Validate parameters
        error = self.validate_params(params)
        if error:
            return {"error": error}
        
        url = params.get("Url", "")
        name = params.get("Name", "")
        
        # Validate URL
        if not validate_url(url):
            return {"error": "Invalid URL format"}
        
        # In a real implementation, you would set up a browser preview
        # Here we'll just return a success message
        return {
            "success": True,
            "message": f"Browser preview created for {name} at {url}",
            "preview_url": url,
            "preview_name": name
        }
