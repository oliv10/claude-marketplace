# Hello MCP

A demo plugin showcasing how to bundle a Model Context Protocol (MCP) server with a Claude Code plugin. This is a great starting point for understanding how MCP servers work and how to create your own.

## What's Included

This plugin includes a simple MCP server (`hello-server`) that provides three example tools:

- **`get_greeting`** - Get a friendly greeting message (optionally personalized with a name)
- **`get_server_time`** - Get the current server time in ISO format
- **`echo`** - Echo back any message (useful for testing)

## Installation

### Prerequisites

- Node.js 18 or higher
- Claude Code CLI or desktop app

### Steps

1. Clone the marketplace repository:
   ```bash
   git clone https://github.com/oliv10/claude-marketplace.git
   cd claude-marketplace
   ```

2. Install dependencies for the MCP server:
   ```bash
   cd plugins/hello-mcp/mcp-servers/hello-server
   npm install
   cd ../../../..
   ```

3. Copy the plugin to your Claude plugins directory:
   ```bash
   cp -r plugins/hello-mcp ~/.claude/plugins/
   ```

4. Enable the plugin in `~/.claude/settings.json`:
   ```json
   {
     "plugins": ["hello-mcp"]
   }
   ```

5. Restart Claude Code

The MCP server will be automatically configured and started when the plugin loads!

## Usage

Once installed, Claude can use the tools provided by the MCP server. Try asking Claude:

- "Give me a greeting" (uses `get_greeting`)
- "What time is it on the server?" (uses `get_server_time`)
- "Echo back: Hello World!" (uses `echo`)

Claude will automatically discover and use these tools when appropriate.

## How It Works

### Plugin Configuration

The `plugin.json` file declares the MCP server:

```json
{
  "mcpServers": {
    "hello-server": {
      "command": "node",
      "args": ["./mcp-servers/hello-server/index.js"]
    }
  }
}
```

This tells Claude Code to:
1. Start the MCP server using Node.js
2. Run the server script at the specified path
3. Communicate with it via the Model Context Protocol

### Server Implementation

The MCP server (`index.js`) implements two key handlers:

1. **`ListToolsRequestSchema`** - Declares what tools are available
2. **`CallToolRequestSchema`** - Handles tool invocations from Claude

The server communicates with Claude via stdio (standard input/output) using the MCP protocol.

## Customizing

Want to create your own MCP server? Use this as a template:

1. Copy the `hello-mcp` plugin directory
2. Rename it to your plugin name
3. Modify `plugin.json` with your plugin details
4. Update the MCP server implementation in `index.js`:
   - Define your own tools in the `ListToolsRequestSchema` handler
   - Implement tool logic in the `CallToolRequestSchema` handler
5. Update the README with your plugin's documentation

## Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Code Documentation](https://claude.ai/code)

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Support

For issues or questions:
- Open an issue at [github.com/oliv10/claude-marketplace/issues](https://github.com/oliv10/claude-marketplace/issues)
- Check the [Claude Code documentation](https://claude.ai/code)
