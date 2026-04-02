# Claude Code Community Marketplace

A curated collection of community-contributed plugins for [Claude Code](https://claude.ai/code). This marketplace enables developers to discover, share, and install plugins that extend Claude Code's capabilities with custom skills, MCP servers, agents, and more.

## What Are Claude Code Plugins?

Claude Code plugins are self-contained packages that can include:

- **Skills** - Custom commands and capabilities that Claude can invoke (e.g., `/code-review`)
- **MCP Servers** - Model Context Protocol servers that expose tools and resources to Claude
- **Agents** - Specialized AI agents optimized for specific tasks
- **Commands** - Executable shell scripts for automation
- **Hooks** - Event handlers that run on session start, tool calls, etc.
- **Settings** - Default configurations applied when the plugin is enabled

All extensions must be bundled inside plugins for consistent installation and distribution.

## Browse Plugins

Current plugins in this marketplace:

### [demo-plugin](./plugins/demo-plugin)
**Category**: Demo  
**Version**: 1.0.0

A comprehensive reference implementation demonstrating all plugin capabilities. Includes:
- Code review skill
- Demo MCP server with multiple tools
- Custom agent example
- Shell command example
- Hook configurations

Perfect for learning how to build your own plugin.

---

## Installing Plugins

### From This Marketplace

1. **Clone the repository:**
   ```bash
   git clone https://github.com/oliv10/claude-marketplace.git
   cd claude-marketplace
   ```

2. **Copy the plugin to your Claude plugins directory:**
   ```bash
   cp -r plugins/<plugin-name> ~/.claude/plugins/
   ```

3. **Enable the plugin in `~/.claude/settings.json`:**
   ```json
   {
     "plugins": ["plugin-name"]
   }
   ```

4. **Restart Claude Code** to load the plugin

### Verifying Installation

Once installed and enabled:
- Skills will be available as slash commands (e.g., `/skill-name`)
- MCP server tools will be automatically exposed to Claude
- Agents can be invoked through the Agent tool
- Hooks will run at configured events

## Contributing a Plugin

We welcome community contributions! Here's how to submit your plugin:

### 1. Create Your Plugin

Follow the plugin structure defined in [CLAUDE.md](./CLAUDE.md):

```
plugins/your-plugin-name/
├── .claude-plugin/
│   └── plugin.json        # Required: plugin manifest
├── README.md              # Required: documentation
├── LICENSE                # Required: license file
├── skills/                # Optional: agent skills
├── mcp-servers/           # Optional: MCP servers
├── agents/                # Optional: custom agents
├── commands/              # Optional: shell scripts
├── hooks/                 # Optional: event handlers
├── settings.json          # Optional: default settings
└── .mcp.json             # Optional: MCP server config
```

**Required fields in `plugin.json`:**
- `name` (kebab-case, unique)
- `version` (semver: e.g., "1.0.0")
- `description`
- `author` (object with `name` and `email`)
- `license` (e.g., "MIT", "Apache-2.0")

See [plugins/demo-plugin](./plugins/demo-plugin) for a complete reference implementation.

### 2. Test Your Plugin Locally

```bash
# Copy to plugins directory
cp -r plugins/your-plugin-name ~/.claude/plugins/

# Enable in settings
# Add "your-plugin-name" to plugins array in ~/.claude/settings.json

# Restart Claude Code and test all features
```

### 3. Submit a Pull Request

1. **Fork this repository**

2. **Add your plugin** to `plugins/your-plugin-name/`

3. **Register in marketplace.json:**
   
   Edit `.claude-plugin/marketplace.json` and add your plugin to the `plugins` array:
   
   ```json
   {
     "name": "your-plugin-name",
     "source": "./plugins/your-plugin-name",
     "description": "Brief description of what your plugin does",
     "version": "1.0.0",
     "author": {
       "name": "Your Name",
       "email": "your.email@example.com"
     },
     "license": "MIT",
     "keywords": ["keyword1", "keyword2"],
     "category": "utilities"
   }
   ```
   
   Valid categories: `demo`, `development`, `utilities`, `productivity`, `networking`, `tutorial`

4. **Create a pull request** with:
   - Clear description of what your plugin does
   - Screenshots or examples if applicable
   - Confirmation that you've tested it locally

### PR Review Criteria

Your plugin submission will be reviewed for:
- **Functionality** - Does it work as described?
- **Documentation** - Is the README clear and complete?
- **Code Quality** - Is the code clean and well-structured?
- **Security** - No malicious code or security vulnerabilities
- **Licensing** - Proper license file included
- **Structure** - Follows the required plugin format

## Updating Your Plugin

**CRITICAL**: Claude Code only updates plugins when version numbers change.

To release an update:

1. Increment `version` in `plugins/your-plugin-name/.claude-plugin/plugin.json`
2. Update matching `version` in `.claude-plugin/marketplace.json` plugins array
3. Both versions must match or users won't receive updates
4. Submit a pull request with your changes

Follow [semantic versioning](https://semver.org/):
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

## Developer Resources

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive developer guide with:
  - Detailed plugin structure
  - MCP server configuration
  - Version management
  - Testing and validation
  - Best practices
  
- **[demo-plugin](./plugins/demo-plugin)** - Reference implementation showing all capabilities

- **[Claude Code Documentation](https://docs.anthropic.com/claude/docs/claude-code)** - Official Claude Code docs

- **[MCP Documentation](https://modelcontextprotocol.io)** - Model Context Protocol specification

## Plugin Ideas

Looking for inspiration? Here are some plugin ideas the community might find useful:

- **API Integration Skills** - GitHub, Jira, Slack, etc.
- **Code Analysis Tools** - Linters, formatters, security scanners
- **Data Processing** - CSV/JSON manipulation, data validation
- **Testing Utilities** - Test generation, coverage analysis
- **Documentation Generators** - API docs, README generators
- **Project Templates** - Boilerplate generators for common frameworks
- **Deployment Tools** - CI/CD helpers, deployment scripts

## Support & Community

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/oliv10/claude-marketplace/issues)
- **Discussions**: Share ideas and ask questions in [GitHub Discussions](https://github.com/oliv10/claude-marketplace/discussions)
- **Claude Code Help**: Use `/help` command in Claude Code or visit [official docs](https://docs.anthropic.com/claude/docs/claude-code)

## License

This marketplace repository is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

Individual plugins may have their own licenses - check each plugin's LICENSE file before use.

---

**Ready to contribute?** Start by exploring [demo-plugin](./plugins/demo-plugin) and reading [CLAUDE.md](./CLAUDE.md)!
