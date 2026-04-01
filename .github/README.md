# Marketplace

A curated collection of plugins and skills for Claude Code, designed to extend and enhance your Claude development experience.

## Overview

This marketplace provides a centralized repository for discovering, sharing, and installing Claude Code plugins and skills. Whether you're looking to boost productivity, add new capabilities, or customize your workflow, you'll find community-contributed extensions here.

## Directory Structure

```
marketplace/
├── .claude-plugin/       # Marketplace metadata and configuration
│   └── marketplace.json  # Marketplace manifest
├── plugins/              # Claude Code plugins
├── skills/               # Claude Code skills
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

Browse the [plugins/](plugins/) directory for available plugins.

*No plugins available yet - contributions welcome!*

### Skills

Browse the [skills/](skills/) directory for available skills.

*No skills available yet - contributions welcome!*

## Contributing

We welcome contributions! To add your plugin or skill to the marketplace:

1. Fork this repository
2. Add your extension to the appropriate directory (`plugins/` or `skills/`)
3. Include proper documentation and metadata
4. Submit a pull request

### Submission Guidelines

- **Plugins**: Must include a `plugin.json` manifest file with name, version, description, and author
- **Skills**: Must include proper frontmatter with description and trigger conditions
- **Documentation**: Each extension should have clear usage instructions
- **Quality**: Code should be well-tested and follow best practices
- **License**: Clearly specify the license for your extension

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
