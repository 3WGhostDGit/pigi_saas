"""
Multi-Agent MCP (Message Control Protocol) Server implementation.
"""
import asyncio
import json
import logging
import time
from typing import Dict, Any, List, Optional, Callable
import websockets

from .base_tool import BaseTool
from .utils import extract_tool_calls, format_tool_response
from .orchestrator import Orchestrator

# Import all tool implementations
from .browser_preview import BrowserPreviewTool
from .run_command import RunCommandTool
from .view_file import ViewFileTool
from .write_to_file import WriteToFileTool
from .edit_file import EditFileTool


class MultiAgentMCPServer:
    """Multi-Agent MCP Server for handling tool calls and agent coordination."""
    
    def __init__(self, host: str = "localhost", port: int = 8765):
        """
        Initialize the Multi-Agent MCP server.
        
        Args:
            host: The host to bind to
            port: The port to bind to
        """
        self.host = host
        self.port = port
        self.tools: Dict[str, BaseTool] = {}
        self.clients = set()
        self.logger = logging.getLogger("multi_agent_mcp_server")
        
        # Create the orchestrator
        self.orchestrator = Orchestrator()
        
        # Register all tools
        self._register_tools()
    
    def _register_tools(self):
        """Register all available tools."""
        tools = [
            BrowserPreviewTool(),
            RunCommandTool(),
            ViewFileTool(),
            WriteToFileTool(),
            EditFileTool(),
            # Add more tools here
        ]
        
        for tool in tools:
            self.tools[tool.name] = tool
    
    async def handle_client(self, websocket, path):
        """
        Handle a client connection.
        
        Args:
            websocket: The WebSocket connection
            path: The connection path
        """
        self.clients.add(websocket)
        try:
            async for message in websocket:
                await self.process_message(websocket, message)
        finally:
            self.clients.remove(websocket)
    
    async def process_message(self, websocket, message: str):
        """
        Process a message from a client.
        
        Args:
            websocket: The WebSocket connection
            message: The message to process
        """
        try:
            # Check if this is a direct tool call
            tool_calls = extract_tool_calls(message)
            
            if tool_calls:
                # Process each tool call
                for tool_call in tool_calls:
                    tool_name = tool_call.get("name")
                    parameters = tool_call.get("parameters", {})
                    
                    # Execute the tool
                    response = await self.execute_tool(tool_name, parameters)
                    
                    # Format the response
                    formatted_response = format_tool_response(tool_name, response)
                    
                    # Send the response back to the client
                    await websocket.send(formatted_response)
            else:
                # Try to parse as JSON
                try:
                    json_message = json.loads(message)
                    
                    # Check if this is an agent or orchestrator call
                    if "target" in json_message:
                        target = json_message.get("target")
                        
                        if target == "orchestrator":
                            # Call the orchestrator
                            response = await self.orchestrator.process_message(json_message)
                            
                            # Send the response back to the client
                            await websocket.send(json.dumps(response))
                        elif target in self.orchestrator.agents:
                            # Call the agent directly
                            agent = self.orchestrator.agents[target]
                            context = {"timestamp": time.time(), "orchestrator": self.orchestrator}
                            response = await agent.process(json_message, context)
                            
                            # Send the response back to the client
                            await websocket.send(json.dumps(response))
                        else:
                            # Unknown target
                            error_response = {
                                "status": "error",
                                "message": f"Unknown target: {target}",
                                "available_targets": ["orchestrator"] + list(self.orchestrator.agents.keys())
                            }
                            
                            # Send the error response back to the client
                            await websocket.send(json.dumps(error_response))
                    else:
                        # Unknown message format
                        error_response = {
                            "status": "error",
                            "message": "Unknown message format. Expected either tool calls or a JSON message with a 'target' field."
                        }
                        
                        # Send the error response back to the client
                        await websocket.send(json.dumps(error_response))
                
                except json.JSONDecodeError:
                    # Not a valid JSON message or tool call
                    error_response = {
                        "status": "error",
                        "message": "Invalid message format. Expected either tool calls or a valid JSON message."
                    }
                    
                    # Send the error response back to the client
                    await websocket.send(json.dumps(error_response))
        
        except Exception as e:
            self.logger.error(f"Error processing message: {str(e)}")
            await websocket.send(json.dumps({"error": str(e)}))
    
    async def execute_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a tool with the given parameters.
        
        Args:
            tool_name: The name of the tool to execute
            parameters: The parameters for the tool
            
        Returns:
            The result of executing the tool
        """
        # Check if the tool exists
        if tool_name not in self.tools:
            return {"error": f"Tool not found: {tool_name}"}
        
        # Get the tool
        tool = self.tools[tool_name]
        
        # Execute the tool
        return await tool.execute(parameters)
    
    def get_tool_definitions(self) -> Dict[str, Dict[str, str]]:
        """
        Get the definitions of all registered tools.
        
        Returns:
            A dictionary mapping tool names to their definitions
        """
        return {name: tool.to_dict() for name, tool in self.tools.items()}
    
    def get_agent_definitions(self) -> Dict[str, Dict[str, Any]]:
        """
        Get the definitions of all registered agents.
        
        Returns:
            A dictionary mapping agent names to their definitions
        """
        return {name: agent.to_dict() for name, agent in self.orchestrator.agents.items()}
    
    def get_workflow_definitions(self) -> Dict[str, Dict[str, Any]]:
        """
        Get the definitions of all registered workflows.
        
        Returns:
            A dictionary mapping workflow names to their definitions
        """
        return self.orchestrator.workflows
    
    async def start(self):
        """Start the Multi-Agent MCP server."""
        self.logger.info(f"Starting Multi-Agent MCP server on {self.host}:{self.port}")
        server = await websockets.serve(self.handle_client, self.host, self.port)
        await server.wait_closed()


async def main():
    """Main entry point for the Multi-Agent MCP server."""
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    # Create and start the Multi-Agent MCP server
    server = MultiAgentMCPServer()
    await server.start()


if __name__ == "__main__":
    asyncio.run(main())
