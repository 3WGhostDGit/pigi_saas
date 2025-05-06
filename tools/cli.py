#!/usr/bin/env python
"""
Command-line interface for the MCP server.
"""
import argparse
import asyncio
import json
import logging
import sys
from typing import Dict, Any

from .mcp_server import MCPServer


def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="MCP Server")
    parser.add_argument("--host", default="localhost", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8765, help="Port to bind to")
    parser.add_argument("--list-tools", action="store_true", help="List available tools and exit")
    parser.add_argument("--debug", action="store_true", help="Enable debug logging")
    return parser.parse_args()


async def main():
    """Main entry point for the CLI."""
    args = parse_args()
    
    # Configure logging
    log_level = logging.DEBUG if args.debug else logging.INFO
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    
    # Create the MCP server
    server = MCPServer(host=args.host, port=args.port)
    
    # List tools if requested
    if args.list_tools:
        tool_definitions = server.get_tool_definitions()
        print(json.dumps(tool_definitions, indent=2))
        return
    
    # Start the server
    await server.start()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Server stopped")
        sys.exit(0)
