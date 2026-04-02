# Claude Code Plugin Marketplace

A community marketplace and development template for Claude Code plugins. This repository demonstrates the plugin system architecture and serves as a reference implementation for building your own plugins.

## What's Inside

This repository contains:

- **Marketplace Infrastructure** - The structure and configuration files needed to create a Claude Code plugin marketplace
- **Demo Plugin** - A fully-featured example plugin showcasing all available plugin capabilities
- **Documentation** - Guidelines for building, packaging, and distributing plugins

## Demo Plugin

The `demo-plugin` demonstrates the complete Claude Code plugin system:

### Features

- **Skills** - `code-review` skill that analyzes code for best practices and potential issues
- **MCP Server** - Example server with tools for `echo`, `greet`, and `random_number`
- **Agents** - Custom agent definitions for specialized workflows
- **Commands** - Pre-configured commands for common tasks
- **Hooks** - Event handlers that run on SessionStart
- **LSP Integration** - Example LSP configuration (`.lsp.json`)

### Plugin Structure

```
plugins/demo-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── skills/
│   └── code-review/
│       └── SKILL.md         # Code review skill definition
├── mcp-servers/
│   └── demo-server/
│       ├── index.js         # MCP server implementation
│       └── package.json     # Server dependencies
├── agents/                  # Custom agent definitions
├── commands/                # Pre-configured commands
├── hooks/
│   └── hooks.json          # Event handlers
├── example.lsp.json        # LSP configuration example
├── settings.json           # Plugin-specific settings
└── README.md               # Plugin documentation
```

## Installation

### Install Demo Plugin

1. Clone this repository:
   ```bash
   git clone https://github.com/oliv10/claude-marketplace.git
   cd claude-marketplace
   ```

2. Copy the demo plugin to your Claude plugins directory:
   ```bash
   cp -r plugins/demo-plugin ~/.claude/plugins/
   ```

3. Enable the plugin in `~/.claude/settings.json`:
   ```json
   {
     "plugins": ["demo-plugin"]
   }
   ```

4. Restart Claude Code

The plugin's skills, MCP servers, and configurations will automatically load.

## Building Your Own Plugin

Use the demo-plugin as a template for creating your own plugins.

### Minimum Requirements

Every plugin must include:

1. **`.claude-plugin/plugin.json`** - Plugin manifest with:
   ```json
   {
     "name": "your-plugin",
     "description": "What your plugin does",
     "version": "1.0.0",
     "author": {
       "name": "Your Name",
       "email": "you@example.com"
     },
     "license": "MIT"
   }
   ```

2. **`README.md`** - Documentation with:
   - What the plugin does
   - Installation instructions
   - Usage examples
   - Dependencies

3. **`LICENSE`** - License file (e.g., MIT, Apache 2.0)

### Plugin Components (Optional)

Add any of these to extend functionality:

- **`skills/`** - Agent skills with YAML frontmatter
- **`mcp-servers/`** - MCP servers that provide tools/resources
- **`agents/`** - Custom agent definitions
- **`commands/`** - Pre-configured commands
- **`hooks/hooks.json`** - Event handlers (SessionStart, etc.)
- **`.mcp.json`** - MCP server configurations
- **`.lsp.json`** - LSP server configurations
- **`settings.json`** - Default settings

### MCP Server Configuration

To bundle an MCP server, configure it in `plugin.json`:

```json
{
  "name": "your-plugin",
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/server-name/index.js"],
      "cwd": "${CLAUDE_PLUGIN_ROOT}/mcp-servers/server-name"
    }
  }
}
```

**IMPORTANT:** Always use `${CLAUDE_PLUGIN_ROOT}` for paths to bundled files.

### Auto-Installing Dependencies

If your MCP server has npm dependencies, add a SessionStart hook:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "test -d \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server-name/node_modules\" || (cd \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server-name\" && npm install --silent)"
          }
        ]
      }
    ]
  }
}
```

## Marketplace Configuration

The marketplace is configured via `.claude-plugin/marketplace.json`:

```json
{
  "name": "community-marketplace",
  "version": "1.0.0",
  "description": "A curated collection of plugins for Claude Code",
  "owner": {
    "name": "Your Name",
    "email": "you@example.com"
  },
  "metadata": {
    "pluginRoot": "./plugins"
  },
  "marketplace": {
    "type": "community",
    "featured": ["demo-plugin"],
    "categories": ["demo", "development", "utilities"]
  },
  "plugins": [
    {
      "name": "demo-plugin",
      "source": "./plugins/demo-plugin",
      "description": "Demo plugin showcasing all features",
      "version": "1.0.0"
    }
  ]
}
```

## Contributing

Contributions are welcome! To add a plugin:

1. Fork this repository
2. Add your plugin to the `plugins/` directory
3. Update `marketplace.json` with your plugin details
4. Include complete documentation
5. Submit a pull request

### Quality Guidelines

- Follow the plugin structure shown in demo-plugin
- Include comprehensive documentation
- Test all features thoroughly
- Specify all dependencies clearly
- Use semantic versioning

## Development

### Prerequisites

- Claude Code CLI or desktop app
- Git for version control
- Node.js (if building MCP servers)

### Testing Locally

1. Copy your plugin to `~/.claude/plugins/`
2. Enable it in `~/.claude/settings.json`
3. Restart Claude Code
4. Test all features and document behavior

## Resources

- [Claude Code Documentation](https://claude.ai/code)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Plugin Development Guide](.github/README.md)

## License

MIT License - see [LICENSE](LICENSE) file for details.

Individual plugins may have their own licenses.

## Support

- **Issues**: [GitHub Issues](https://github.com/oliv10/claude-marketplace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/oliv10/claude-marketplace/discussions)

---

**Built with [Claude Code](https://claude.ai/code)**
