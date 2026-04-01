# MCP Servers

This directory contains Model Context Protocol (MCP) servers that extend Claude's capabilities with custom tools and resources.

## What are MCP Servers?

MCP servers are standalone services that implement the [Model Context Protocol](https://modelcontextprotocol.io), allowing Claude to interact with external systems, APIs, databases, and services through a standardized interface.

## Structure

Each MCP server should be in its own subdirectory:

```
mcp-servers/
├── server-name/
│   ├── package.json          # Server manifest
│   ├── README.md             # Documentation
│   ├── src/                  # Server implementation
│   └── LICENSE               # License file
```

## Requirements

Each MCP server must include:

1. **Manifest File** (`package.json` or equivalent):
   ```json
   {
     "name": "server-name",
     "version": "1.0.0",
     "description": "What this server does",
     "author": "Your Name",
     "license": "MIT",
     "mcp": {
       "version": "1.0",
       "capabilities": ["tools", "resources"]
     }
   }
   ```

2. **Documentation** (`README.md`):
   - Description of what the server provides
   - Installation and setup instructions
   - List of tools/resources provided
   - Configuration options
   - Usage examples
   - Dependencies and requirements

3. **License File**: Clearly specify the license (e.g., MIT, Apache-2.0)

4. **Server Implementation**:
   - Follow MCP specification
   - Include error handling
   - Document all tools and resources
   - Provide setup/configuration instructions

## Installation

To use an MCP server from this marketplace:

1. Copy the server directory to your Claude configuration:
   ```bash
   cp -r mcp-servers/server-name ~/.claude/mcp-servers/
   ```

2. Configure the server in `~/.claude/settings.json`:
   ```json
   {
     "mcpServers": {
       "server-name": {
         "command": "node",
         "args": ["~/.claude/mcp-servers/server-name/src/index.js"],
         "env": {
           "API_KEY": "your-api-key-here"
         }
       }
     }
   }
   ```

3. Restart Claude Code to load the server

## Contributing

To contribute an MCP server:

1. Create a new subdirectory with your server name (use kebab-case)
2. Include all required files (manifest, documentation, license)
3. Test your server locally
4. Submit a pull request

See [CLAUDE.md](../CLAUDE.md) for detailed submission guidelines.

## Examples

Check out these MCP servers for reference:

*No MCP servers available yet - be the first to contribute!*

## Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [Claude Code Documentation](https://claude.ai/code)
