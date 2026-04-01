# MCP Servers

This directory contains Model Context Protocol (MCP) servers that extend Claude's capabilities with custom tools and resources.

## What are MCP Servers?

MCP servers are standalone services that implement the [Model Context Protocol](https://modelcontextprotocol.io), allowing Claude to interact with external systems, APIs, databases, and services through a standardized interface.

## Distribution Methods

MCP servers in this marketplace can be distributed in two ways:

### 1. Standalone MCP Servers (This Directory)
MCP servers stored here are **standalone** and installed directly by users who manually configure them in their `settings.json`. This gives users full control over configuration but requires manual setup.

**Best for:**
- General-purpose servers that many users might want to customize
- Servers that need environment-specific configuration
- Maximum flexibility and transparency

### 2. Plugin-Bundled MCP Servers
MCP servers can also be bundled inside plugins (see [`plugins/`](../plugins/) directory). The plugin's `plugin.json` automatically configures the MCP server when the plugin is enabled.

**Best for:**
- Integrated experiences where the MCP server and skills work together
- Simplified installation (users just enable the plugin)
- Servers with sensible defaults that rarely need customization

**Example:** The `network-tools` plugin could bundle an MCP server alongside its ping/DNS skills for a complete networking toolkit.

Both approaches work system-wide once configured. Choose based on your use case and target audience.

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

### Installing Standalone MCP Servers

To use a standalone MCP server from this directory:

1. Copy the server directory to your Claude configuration:
   ```bash
   cp -r mcp-servers/server-name ~/.claude/mcp-servers/
   ```

2. Manually configure the server in `~/.claude/settings.json`:
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

### Installing Plugin-Bundled MCP Servers

If an MCP server is bundled in a plugin:

1. Copy the plugin to your plugins directory:
   ```bash
   cp -r plugins/plugin-name ~/.claude/plugins/
   ```

2. Enable the plugin in `~/.claude/settings.json`:
   ```json
   {
     "plugins": ["plugin-name"]
   }
   ```

3. The plugin's `plugin.json` automatically configures the MCP server - no additional setup needed!

4. Restart Claude Code to load the plugin and its bundled MCP server

## Contributing

### Contributing a Standalone MCP Server

To contribute a standalone MCP server to this directory:

1. Create a new subdirectory with your server name (use kebab-case)
2. Include all required files (manifest, documentation, license)
3. Test your server locally by installing it in `~/.claude/mcp-servers/` and configuring `settings.json`
4. Submit a pull request

### Contributing a Plugin-Bundled MCP Server

To bundle an MCP server in a plugin:

1. Add your server to a new or existing plugin in [`plugins/`](../plugins/)
2. Configure it in the plugin's `plugin.json`:
   ```json
   {
     "name": "my-plugin",
     "version": "1.0.0",
     "mcpServers": {
       "my-server": {
         "command": "node",
         "args": ["./server/index.js"]
       }
     }
   }
   ```
3. Test by installing the plugin in `~/.claude/plugins/`
4. Submit a pull request

See [CLAUDE.md](../CLAUDE.md) for detailed submission guidelines.

### Choosing Between Standalone and Plugin-Bundled

- **Choose standalone** if users will likely customize configuration, or the server is general-purpose
- **Choose plugin-bundled** if the server works best with specific skills/resources, or you want zero-configuration installation

## Examples

Check out these MCP servers for reference:

*No MCP servers available yet - be the first to contribute!*

## Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [Claude Code Documentation](https://claude.ai/code)
