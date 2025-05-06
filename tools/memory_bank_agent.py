"""
MemoryBank Agent implementation.
"""
import json
import os
import pickle
from typing import Dict, Any, List, Optional, Union
import aiofiles

from .agent_base import Agent
from .base_tool import BaseTool


class MemoryBankAgent(Agent):
    """
    Agent responsible for storing and retrieving information about the codebase.
    Acts as a context engine that can be queried with natural language.
    """
    
    def __init__(self, memory_dir: str = ".memory", tools: List[BaseTool] = None):
        """
        Initialize the MemoryBank agent.
        
        Args:
            memory_dir: Directory to store memory files
            tools: Tools the agent can use
        """
        description = (
            "You are the MemoryBank agent, responsible for storing and retrieving information "
            "about the codebase. You act as a context engine that can be queried with natural language. "
            "Your job is to maintain an index of code snippets, file structures, and other relevant "
            "information that can be quickly retrieved when needed by other agents."
        )
        
        super().__init__("MemoryBank", description, tools)
        
        self.memory_dir = memory_dir
        self.memory_index = {}
        self.memory_content = {}
        
        # Create memory directory if it doesn't exist
        os.makedirs(memory_dir, exist_ok=True)
        
        # Load existing memory if available
        self._load_memory()
    
    async def process(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a message and return a response.
        
        Args:
            message: The message to process
            context: The context for processing the message
            
        Returns:
            The response from the agent
        """
        action = message.get("action", "")
        
        if action == "store":
            return await self._store_memory(message, context)
        elif action == "retrieve":
            return await self._retrieve_memory(message, context)
        elif action == "update":
            return await self._update_memory(message, context)
        elif action == "delete":
            return await self._delete_memory(message, context)
        elif action == "list":
            return await self._list_memory(message, context)
        else:
            return {
                "status": "error",
                "message": f"Unknown action: {action}",
                "available_actions": ["store", "retrieve", "update", "delete", "list"]
            }
    
    async def _store_memory(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Store a new memory."""
        key = message.get("key", "")
        content = message.get("content", "")
        tags = message.get("tags", [])
        
        if not key:
            return {"status": "error", "message": "Missing key for memory"}
        
        if not content:
            return {"status": "error", "message": "Missing content for memory"}
        
        # Store the memory
        self.memory_content[key] = content
        
        # Update the index
        self.memory_index[key] = {
            "tags": tags,
            "timestamp": context.get("timestamp", 0)
        }
        
        # Save to disk
        await self._save_memory()
        
        return {
            "status": "success",
            "message": f"Memory stored with key: {key}",
            "key": key
        }
    
    async def _retrieve_memory(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Retrieve a memory by key or query."""
        key = message.get("key", "")
        query = message.get("query", "")
        tags = message.get("tags", [])
        
        if key:
            # Retrieve by exact key
            if key in self.memory_content:
                return {
                    "status": "success",
                    "key": key,
                    "content": self.memory_content[key],
                    "metadata": self.memory_index.get(key, {})
                }
            else:
                return {"status": "error", "message": f"Memory not found with key: {key}"}
        
        elif query or tags:
            # Retrieve by query or tags
            results = []
            
            for k, metadata in self.memory_index.items():
                # Check if tags match
                if tags and not any(tag in metadata.get("tags", []) for tag in tags):
                    continue
                
                # Check if query matches (simple substring match for now)
                if query and query.lower() not in self.memory_content[k].lower():
                    continue
                
                results.append({
                    "key": k,
                    "content": self.memory_content[k],
                    "metadata": metadata
                })
            
            return {
                "status": "success",
                "count": len(results),
                "results": results
            }
        
        else:
            return {"status": "error", "message": "Must provide either key, query, or tags"}
    
    async def _update_memory(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing memory."""
        key = message.get("key", "")
        content = message.get("content", None)
        tags = message.get("tags", None)
        
        if not key:
            return {"status": "error", "message": "Missing key for memory update"}
        
        if key not in self.memory_content:
            return {"status": "error", "message": f"Memory not found with key: {key}"}
        
        # Update content if provided
        if content is not None:
            self.memory_content[key] = content
        
        # Update tags if provided
        if tags is not None:
            self.memory_index[key]["tags"] = tags
        
        # Update timestamp
        self.memory_index[key]["timestamp"] = context.get("timestamp", 0)
        
        # Save to disk
        await self._save_memory()
        
        return {
            "status": "success",
            "message": f"Memory updated with key: {key}",
            "key": key
        }
    
    async def _delete_memory(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Delete a memory."""
        key = message.get("key", "")
        
        if not key:
            return {"status": "error", "message": "Missing key for memory deletion"}
        
        if key not in self.memory_content:
            return {"status": "error", "message": f"Memory not found with key: {key}"}
        
        # Delete the memory
        del self.memory_content[key]
        del self.memory_index[key]
        
        # Save to disk
        await self._save_memory()
        
        return {
            "status": "success",
            "message": f"Memory deleted with key: {key}"
        }
    
    async def _list_memory(self, message: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """List all memories or filter by tags."""
        tags = message.get("tags", [])
        
        if tags:
            # Filter by tags
            keys = [
                k for k, metadata in self.memory_index.items()
                if any(tag in metadata.get("tags", []) for tag in tags)
            ]
        else:
            # List all
            keys = list(self.memory_index.keys())
        
        return {
            "status": "success",
            "count": len(keys),
            "keys": keys
        }
    
    def _load_memory(self):
        """Load memory from disk."""
        index_path = os.path.join(self.memory_dir, "index.pkl")
        content_path = os.path.join(self.memory_dir, "content.pkl")
        
        try:
            if os.path.exists(index_path) and os.path.exists(content_path):
                with open(index_path, "rb") as f:
                    self.memory_index = pickle.load(f)
                
                with open(content_path, "rb") as f:
                    self.memory_content = pickle.load(f)
                
                self.logger.info(f"Loaded {len(self.memory_index)} memories from disk")
        except Exception as e:
            self.logger.error(f"Failed to load memory: {str(e)}")
    
    async def _save_memory(self):
        """Save memory to disk."""
        index_path = os.path.join(self.memory_dir, "index.pkl")
        content_path = os.path.join(self.memory_dir, "content.pkl")
        
        try:
            async with aiofiles.open(index_path, "wb") as f:
                await f.write(pickle.dumps(self.memory_index))
            
            async with aiofiles.open(content_path, "wb") as f:
                await f.write(pickle.dumps(self.memory_content))
            
            self.logger.info(f"Saved {len(self.memory_index)} memories to disk")
        except Exception as e:
            self.logger.error(f"Failed to save memory: {str(e)}")
