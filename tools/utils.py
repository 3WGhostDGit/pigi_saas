"""
Utility functions for the MCP server tools.
"""
import json
import re
from typing import Dict, Any, List, Optional


def extract_tool_calls(text: str) -> List[Dict[str, Any]]:
    """
    Extract tool calls from text.
    
    Args:
        text: The text to extract tool calls from
        
    Returns:
        A list of dictionaries with tool name and parameters
    """
    # Pattern to match tool calls like <tool_name> {...} </tool_name>
    pattern = r'<([a-zA-Z_][a-zA-Z0-9_]*)>\s*(.*?)\s*</\1>'
    
    # Find all matches
    matches = re.finditer(pattern, text, re.DOTALL)
    
    tool_calls = []
    for match in matches:
        tool_name = match.group(1)
        params_str = match.group(2)
        
        try:
            # Parse parameters as JSON
            params = json.loads(params_str)
            tool_calls.append({
                "name": tool_name,
                "parameters": params
            })
        except json.JSONDecodeError:
            # Skip invalid JSON
            continue
    
    return tool_calls


def format_tool_response(tool_name: str, response: Dict[str, Any]) -> str:
    """
    Format a tool response.
    
    Args:
        tool_name: The name of the tool
        response: The response from the tool
        
    Returns:
        A formatted string with the tool response
    """
    response_json = json.dumps(response, indent=2)
    return f"<{tool_name}_response>\n{response_json}\n</{tool_name}_response>"


def validate_url(url: str) -> bool:
    """
    Validate a URL.
    
    Args:
        url: The URL to validate
        
    Returns:
        True if the URL is valid, False otherwise
    """
    # Simple URL validation - could be improved
    pattern = r'^https?://[^\s/$.?#].[^\s]*$'
    return bool(re.match(pattern, url))


def safe_path(path: str) -> str:
    """
    Ensure a path is safe to use.
    
    Args:
        path: The path to sanitize
        
    Returns:
        A sanitized path
    """
    # Remove any path traversal attempts
    return re.sub(r'\.\./', '', path)
