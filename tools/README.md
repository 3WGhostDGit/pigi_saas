# Multi-Agent MCP Server

This package provides a Python implementation of a Multi-Agent MCP (Message Control Protocol) server with various specialized agents and tools for AI assistants.

## Architecture

The Multi-Agent MCP server consists of the following components:

1. **Orchestrator**: Coordinates the agents and manages workflows
2. **Specialized Agents**:
   - **MemoryBank**: Stores and retrieves information about the codebase
   - **Coder**: Plans and implements code changes
   - **DeeperSearcher**: Analyzes the codebase in depth
   - **Debugger**: Identifies and fixes errors
3. **Tools**: Various tools that agents can use to interact with the codebase and environment

## Installation

```bash
pip install -r requirements.txt
```

## Usage

### Starting the Server

```bash
# Start the basic MCP server
python -m tools.cli

# Start the multi-agent MCP server
python -m tools.multi_agent_cli
```

By default, the server will listen on `localhost:8765`. You can change this with the `--host` and `--port` options:

```bash
python -m tools.multi_agent_cli --host 0.0.0.0 --port 9000
```

### Listing Available Tools, Agents, and Workflows

```bash
# List tools
python -m tools.multi_agent_cli --list-tools

# List agents
python -m tools.multi_agent_cli --list-agents

# List workflows
python -m tools.multi_agent_cli --list-workflows
```

### Connecting to the Server

The server uses WebSockets for communication. Here are some examples of how to connect to the server and use its features:

#### Direct Tool Call

```python
import asyncio
import websockets
import json

async def main():
    uri = "ws://localhost:8765"
    async with websockets.connect(uri) as websocket:
        # Call the view_file tool
        message = '<view_file>{"AbsolutePath": "/path/to/file.txt", "StartLine": 0, "EndLine": 10, "IncludeSummaryOfOtherLines": true}</view_file>'
        await websocket.send(message)
        response = await websocket.recv()
        print(response)

asyncio.run(main())
```

#### Calling the Orchestrator

```python
import asyncio
import websockets
import json

async def main():
    uri = "ws://localhost:8765"
    async with websockets.connect(uri) as websocket:
        # List available workflows
        message = {
            "target": "orchestrator",
            "action": "list_workflows"
        }
        await websocket.send(json.dumps(message))
        response = await websocket.recv()
        print(response)

        # Start a workflow
        message = {
            "target": "orchestrator",
            "action": "start_workflow",
            "workflow_name": "code_analysis",
            "parameters": {
                "folder_path": "/path/to/folder"
            }
        }
        await websocket.send(json.dumps(message))
        response = await websocket.recv()
        print(response)

asyncio.run(main())
```

#### Calling an Agent Directly

```python
import asyncio
import websockets
import json

async def main():
    uri = "ws://localhost:8765"
    async with websockets.connect(uri) as websocket:
        # Call the DeeperSearcher agent
        message = {
            "target": "deeper_searcher",
            "action": "analyze_file",
            "file_path": "/path/to/file.txt"
        }
        await websocket.send(json.dumps(message))
        response = await websocket.recv()
        print(response)

asyncio.run(main())
```

## Available Tools

The following tools are available:

- `browser_preview`: Spin up a browser preview for a web server
- `run_command`: Run a command on the user's system
- `view_file`: View the contents of a file
- `write_to_file`: Create a new file
- `edit_file`: Edit an existing file

## Available Agents

The following agents are available:

- `memory_bank`: Stores and retrieves information about the codebase
- `coder`: Plans and implements code changes
- `deeper_searcher`: Analyzes the codebase in depth
- `debugger`: Identifies and fixes errors

## Available Workflows

The following workflows are available:

- `code_implementation`: Implement a new feature or change
- `bug_fixing`: Fix a bug in the code
- `code_analysis`: Analyze the codebase
- `code_refactoring`: Refactor code to improve quality

## Adding New Tools and Agents

To add a new tool, create a new Python file in the `tools` directory with a class that inherits from `BaseTool`. Then, register the tool in the `_register_tools` method of the `MultiAgentMCPServer` class in `multi_agent_mcp_server.py`.

To add a new agent, create a new Python file in the `tools` directory with a class that inherits from `Agent`. Then, register the agent in the `_register_agents` method of the `Orchestrator` class in `orchestrator.py`.

## Message Formats

### Tool Call Format

Tool calls should be formatted as XML tags with JSON parameters:

```
<tool_name>{"param1": "value1", "param2": "value2"}</tool_name>
```

The server will respond with:

```
<tool_name_response>{"result": "..."}</tool_name_response>
```

### Agent and Orchestrator Call Format

Agent and orchestrator calls should be formatted as JSON:

```json
{
  "target": "orchestrator",
  "action": "start_workflow",
  "workflow_name": "code_analysis",
  "parameters": {
    "folder_path": "/path/to/folder"
  }
}
```

The server will respond with JSON:

```json
{
  "status": "success",
  "message": "Started workflow code_analysis",
  "workflow_id": "wf_1234567890_code_analysis"
}
```
