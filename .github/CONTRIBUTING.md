# Contributing to Claude Code Marketplace

Thank you for your interest in contributing to the Claude Code community marketplace!

## Quick Links

- **[Main README](../README.md)** - Installation, browsing plugins, contribution overview
- **[Demo Plugin Guide](../plugins/demo-plugin/README.md)** - Step-by-step guide for creating plugins
- **[CLAUDE.md](../CLAUDE.md)** - Technical documentation and architecture details

## How to Contribute a Plugin

### 1. Study the Reference Implementation

Start with [demo-plugin](../plugins/demo-plugin/README.md) - it demonstrates all plugin capabilities:
- Skills (custom commands)
- MCP servers (tools for Claude)
- Agents (specialized AI assistants)
- Commands (shell scripts)
- Hooks (event handlers)
- Settings (default configuration)

### 2. Create Your Plugin

Follow the detailed guide in [plugins/demo-plugin/README.md](../plugins/demo-plugin/README.md) which walks through:
- Setting up plugin structure
- Creating each component type
- Testing locally
- Registering in the marketplace
- Submitting a PR

### 3. Testing Checklist

Before submitting:
- [ ] Plugin installs correctly to `~/.claude/plugins/`
- [ ] All skills appear as `/commands`
- [ ] MCP server tools are exposed to Claude
- [ ] Agents can be invoked
- [ ] Hooks execute on session start
- [ ] README documents all features
- [ ] LICENSE file included
- [ ] Version in `plugin.json` matches `marketplace.json`

### 4. PR Submission

Your PR should include:
1. **Plugin directory** in `plugins/your-plugin-name/`
2. **Marketplace registration** in `.claude-plugin/marketplace.json`
3. **Clear description** of what your plugin does
4. **Examples or screenshots** (if applicable)
5. **Confirmation** that you've tested locally

### 5. Review Criteria

We review for:
- **Functionality** - Works as described
- **Documentation** - Clear README
- **Code quality** - Clean, well-structured
- **Security** - No malicious code or vulnerabilities
- **Licensing** - Proper LICENSE file
- **Structure** - Follows plugin format

## Plugin Ideas

Looking for inspiration?
- API integrations (GitHub, Jira, Slack)
- Code analysis tools (linters, formatters)
- Data processing utilities
- Testing frameworks
- Documentation generators
- Project templates
- Deployment helpers

## Getting Help

- **Issues**: [Report bugs or request features](https://github.com/oliv10/claude-marketplace/issues)
- **Discussions**: [Ask questions or share ideas](https://github.com/oliv10/claude-marketplace/discussions)
- **Claude Code**: Use `/help` in Claude Code or visit [official docs](https://docs.anthropic.com/claude/docs/claude-code)

## Code of Conduct

Please be respectful and constructive in all interactions. We're building this marketplace together as a community.

---

**Ready to start?** Head to [plugins/demo-plugin/README.md](../plugins/demo-plugin/README.md) for the complete creation guide!
