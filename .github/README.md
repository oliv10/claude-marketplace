# Marketplace

A curated collection of plugins, skills, and MCP servers for Claude Code, designed to extend and enhance your Claude development experience.

## Overview

This marketplace provides a centralized repository for discovering, sharing, and installing Claude Code extensions. Whether you're looking to boost productivity, add new capabilities, or customize your workflow, you'll find community-contributed extensions here.

### Extension Types

- **Plugins** - Claude Code plugins that bundle skills, configurations, and resources
- **Skills** - Standalone agent prompts with specialized triggers and capabilities
- **MCP Servers** - Model Context Protocol servers that provide tools and resources to Claude

## Directory Structure

```
marketplace/
├── .claude-plugin/       # Marketplace metadata and configuration
│   └── marketplace.json  # Marketplace manifest
├── plugins/              # Claude Code plugins
├── skills/               # Standalone Claude Code skills
├── mcp-servers/          # Model Context Protocol servers
└── README.md            # This file
```

## Installation

To use extensions from this marketplace:

1. Clone this repository:
   ```bash
   git clone https://github.com/oliv10/claude-marketplace.git
   cd claude-marketplace
   ```

2. Browse the available plugins and skills in their respective directories

3. Install desired extensions by following their individual installation instructions

## Available Extensions

### Plugins

Browse the [plugins/](../plugins/) directory for available plugins.

**Available:**
- [network-tools](../plugins/network-tools/) - Network utility skills for ping and DNS lookups

### Skills

Browse the [skills/](../skills/) directory for standalone skills.

*No standalone skills available yet - contributions welcome!*

### MCP Servers

Browse the [mcp-servers/](../mcp-servers/) directory for Model Context Protocol servers.

*No MCP servers available yet - contributions welcome!*

## Contributing

We welcome contributions! To add your extension to the marketplace:

1. Fork this repository
2. Add your extension to the appropriate directory:
   - `plugins/` for Claude Code plugins
   - `skills/` for standalone skills
   - `mcp-servers/` for MCP servers
3. Include proper documentation and metadata
4. Submit a pull request

### Submission Guidelines

**Plugins:**
- Must include a `plugin.json` manifest file with name, version, description, and author
- Should document any bundled skills or resources
- Include installation and configuration instructions

**Skills:**
- Must include proper YAML frontmatter with name, description, and trigger conditions
- Document usage examples and expected behavior

**MCP Servers:**
- Must include a manifest file (package.json or server config)
- Specify tools/resources provided and protocol version
- Include setup instructions and dependencies
- Document API endpoints and capabilities

**All Extensions:**
- Each extension should have clear usage instructions
- Code should be well-tested and follow best practices
- Clearly specify the license for your extension

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
