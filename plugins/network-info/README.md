# Network Info

Get network information including your public IP address, IP geolocation, and internet connectivity status. This plugin demonstrates **real-world MCP capabilities** by fetching live data from external APIs - something an LLM cannot do on its own.

## What's Included

This plugin includes an MCP server (`network-info-server`) that provides tools for fetching network information via external APIs:

- **`get_my_ip`** - Get your public WAN IP address (fetches from ipify.org API)
- **`get_ip_info`** - Get detailed information about any IP address including location, ISP, timezone, and coordinates (uses ipinfo.io API)
- **`check_internet_connectivity`** - Verify internet connectivity with response time measurement

**Why this matters:** These tools demonstrate the true value of MCP servers - they enable Claude to access real-time external data that it cannot determine on its own.

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
   cd plugins/network-info/mcp-servers/network-info-server
   npm install
   cd ../../../..
   ```

3. Copy the plugin to your Claude plugins directory:
   ```bash
   cp -r plugins/network-info ~/.claude/plugins/
   ```

4. Enable the plugin in `~/.claude/settings.json`:
   ```json
   {
     "plugins": ["network-info"]
   }
   ```

5. Restart Claude Code

The MCP server will be automatically configured and started when the plugin loads!

## Usage

Once installed, Claude can use the tools provided by the MCP server. Try asking Claude:

- **"What's my public IP address?"** (uses `get_my_ip`)
- **"Where am I located based on my IP?"** (uses `get_ip_info`)
- **"Get information about IP address 8.8.8.8"** (uses `get_ip_info` with specific IP)
- **"Check if I have internet connectivity"** (uses `check_internet_connectivity`)

Claude will automatically discover and use these tools when appropriate. These requests demonstrate **real external API calls** that the LLM cannot perform without the MCP server.

## How It Works

### Plugin Configuration

The `plugin.json` file declares the MCP server:

```json
{
  "mcpServers": {
    "network-info-server": {
      "command": "node",
      "args": ["./mcp-servers/network-info-server/index.js"]
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

The server:
- Makes HTTPS requests to external APIs (ipify.org, ipinfo.io)
- Fetches real-time data that the LLM cannot access directly
- Returns structured responses to Claude
- Communicates via stdio (standard input/output) using the MCP protocol

**Key APIs used:**
- `https://api.ipify.org` - For getting public IP address
- `https://ipinfo.io` - For detailed IP geolocation information

## Customizing

Want to create your own MCP server? Use this as a template:

1. Copy the `network-info` plugin directory
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
