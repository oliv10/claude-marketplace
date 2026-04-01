# Marketplace

A curated collection of plugins for Claude Code, designed to extend and enhance your Claude development experience.

## Overview

This marketplace provides a centralized repository for discovering, sharing, and installing Claude Code plugins. Whether you're looking to boost productivity, add new capabilities, or customize your workflow, you'll find community-contributed plugins here.

**All extensions (skills, MCP servers, configurations) are bundled inside plugins for easy, consistent installation.**

### What Plugins Can Include

Plugins are self-contained packages that can bundle:
- **Skills** - Agent prompts with specialized triggers and capabilities
- **MCP Servers** - Model Context Protocol servers that provide tools and resources
- **Configurations** - Settings, prompts, and resource files
- **Documentation** - Usage guides and examples

## Directory Structure

```
marketplace/
├── .claude-plugin/       # Marketplace metadata and configuration
│   └── marketplace.json  # Marketplace manifest
├── plugins/              # Claude Code plugins (includes all extension types)
└── README.md            # This file
```

## Installation

To install plugins from this marketplace:

1. Clone this repository:
   ```bash
   git clone https://github.com/oliv10/claude-marketplace.git
   cd claude-marketplace
   ```

2. Copy the desired plugin to your Claude plugins directory:
   ```bash
   cp -r plugins/plugin-name ~/.claude/plugins/
   ```

3. Enable the plugin in `~/.claude/settings.json`:
   ```json
   {
     "plugins": ["plugin-name"]
   }
   ```

4. Restart Claude Code

The plugin's bundled skills, MCP servers, and configurations are automatically loaded!

## Available Plugins

Browse the [plugins/](../plugins/) directory for available plugins. Each plugin may include skills, MCP servers, configurations, and more.

### Currently Available

- **[network-info](../plugins/network-info/)** ⭐ *Featured* - Get your public IP address, geolocation, and connectivity status via external APIs
- **[network-tools](../plugins/network-tools/)** - Network utility skills for ping and DNS lookups

*More plugins coming soon - contributions welcome!*

## Contributing

We welcome contributions! To add your plugin to the marketplace:

1. Fork this repository
2. Create your plugin in the `plugins/` directory
3. Include proper documentation and metadata
4. Submit a pull request

### Plugin Requirements

**All plugins must include:**

1. **`plugin.json` manifest** with:
   - `name` (kebab-case)
   - `version` (semver: 1.0.0)
   - `description`
   - `author` (name and email)
   - `license` (e.g., MIT)
   - Optional: `category` (productivity, development, utilities, networking)
   - Optional: `keywords` for discoverability

2. **README.md** with:
   - What the plugin does
   - Installation instructions
   - Usage examples
   - List of included skills/MCP servers/resources
   - Any dependencies or prerequisites

3. **Clear structure**:
   ```
   plugins/your-plugin/
   ├── plugin.json          # Required manifest
   ├── README.md            # Required documentation
   ├── LICENSE              # Required license file
   ├── skills/              # Optional: bundled skills
   ├── mcp-servers/         # Optional: bundled MCP servers
   └── resources/           # Optional: additional resources
   ```

### Bundling Skills

To include skills in your plugin, add them to a `skills/` subdirectory:

```
plugins/your-plugin/
├── plugin.json
└── skills/
    └── skill-name/
        └── SKILL.md     # YAML frontmatter + skill content
```

### Bundling MCP Servers

To include MCP servers in your plugin, configure them in `plugin.json`:

**IMPORTANT:** You MUST use `${CLAUDE_PLUGIN_ROOT}` for all paths to bundled files.

```json
{
  "name": "your-plugin",
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/server-name/index.js"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

Then include the server implementation:

```
plugins/your-plugin/
├── plugin.json
└── mcp-servers/
    └── server-name/
        ├── index.js
        └── package.json
```

**IMPORTANT: Auto-installing Dependencies**

If your MCP server has npm dependencies, you MUST add a SessionStart hook to automatically install them:

```json
{
  "name": "your-plugin",
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
  },
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/server-name/index.js"]
    }
  }
}
```

This ensures dependencies are automatically installed when users first start Claude Code after installing your plugin. Without this hook, your MCP server tools won't be exposed to Claude.

### Quality Guidelines

- Code should be well-tested and follow best practices
- Document all features and usage examples
- Include error handling and validation
- Clearly specify any external dependencies
- Follow semantic versioning

## Development

### Prerequisites

- Claude Code CLI or desktop app
- Git for version control
- Node.js (optional, for plugins requiring dependencies)

### Local Testing

Test extensions locally before submitting:

1. Copy the extension to your local `.claude/` directory
2. Enable it in your `settings.json`
3. Test thoroughly with various use cases
4. Document any dependencies or requirements

## License

This marketplace repository is licensed under the MIT License. Individual plugins and skills may have their own licenses - please check each extension's documentation.

## Support

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/oliv10/claude-marketplace/issues)
- **Discussions**: Join conversations in [GitHub Discussions](https://github.com/oliv10/claude-marketplace/discussions)
- **Documentation**: Visit the [Claude Code documentation](https://claude.ai/code) for general help

## Roadmap

- [ ] Add plugin and skill templates
- [ ] Implement automated testing for submissions
- [ ] Create web-based marketplace browser
- [ ] Add rating and review system
- [ ] Develop CLI tool for easy installation

## Acknowledgments

Built for the Claude Code community. Special thanks to all contributors who help grow this marketplace!

---

**Made with [Claude Code](https://claude.ai/code)**
