# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a community marketplace for Claude Code plugins - a curated registry where plugins are submitted via pull requests. The repository is a catalog/collection, not an executable application.

**Key Concept**: All Claude Code extensions (skills, MCP servers, configurations, agents) must be bundled inside plugins for consistent installation.

## Architecture

### Marketplace Structure

- `.claude-plugin/marketplace.json` - Marketplace manifest defining metadata, featured plugins, categories, and plugin registry
- `plugins/` - Each plugin is self-contained in its own subdirectory
- `.github/README.md` - User-facing marketplace documentation

### Plugin Component Structure

Plugins are discovered by their `plugin.json` manifest and can include:

```
plugins/plugin-name/
├── .claude-plugin/
│   └── plugin.json        # Main manifest - metadata only
├── skills/                # Agent skills
│   └── skill-name/
│       └── SKILL.md       # YAML frontmatter + skill content
├── mcp-servers/           # MCP server implementations
│   └── server-name/
│       ├── index.js
│       └── package.json
├── agents/                # Custom agent definitions
│   └── agent-name.md      # YAML frontmatter + system prompt
├── commands/              # Executable shell scripts
│   └── command.sh
├── hooks/                 # Event handlers
│   └── hooks.json         # SessionStart, etc.
├── settings.json          # Default settings when plugin enabled
├── .mcp.json             # MCP server configurations (recommended)
├── .lsp.json             # LSP server configurations
├── README.md             # Required documentation
└── LICENSE               # Required license file
```

## Critical Patterns

### 1. Version Management

**CRITICAL**: Claude Code only updates plugins when version numbers change.

When making ANY change to a plugin:
1. Increment version in `plugins/[name]/plugin.json` (semver: 1.0.0)
2. Update matching version in `.claude-plugin/marketplace.json` plugins array
3. Both must match or users won't receive updates

### 2. MCP Server Configuration

MCP servers should be configured in `.mcp.json` (not in `plugin.json`) to keep configuration clean and separated.

All paths to plugin-bundled files MUST use `${CLAUDE_PLUGIN_ROOT}`:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp-servers/server-name/index.js"]
    }
  }
}
```

**Note**: While `plugin.json` can include `mcpServers`, using `.mcp.json` is the recommended approach for cleaner separation.

### 3. MCP Server Dependency Installation

MCP servers with npm dependencies MUST include a SessionStart hook for auto-installation:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "npm install --silent --prefix \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server-name\"",
            "statusMessage": "Installing server-name dependencies..."
          }
        ]
      }
    ]
  }
}
```

Without this hook, MCP server tools won't be exposed to Claude.

### 4. Skill Definition Format

Skills use YAML frontmatter:

```markdown
---
name: skill-name
description: Description including when to trigger. Use keywords that match user intent.
---

Skill content and instructions here.
```

### 5. Agent Definition Format

Agents in `agents/` directory use YAML frontmatter:

```markdown
---
name: agent-name
description: When to use this agent with trigger examples
model: sonnet
---

System prompt and agent instructions here.
```

## Development Commands

### Testing Plugins Locally

```bash
# Copy plugin to Claude plugins directory
cp -r plugins/plugin-name ~/.claude/plugins/

# Enable in ~/.claude/settings.json
# Add "plugin-name" to plugins array: {"plugins": ["plugin-name"]}

# Restart Claude Code to load the plugin
```

### Validating Plugin Structure

```bash
# Check required files exist
ls plugins/plugin-name/plugin.json
ls plugins/plugin-name/README.md
ls plugins/plugin-name/LICENSE

# Validate JSON syntax
jq empty plugins/plugin-name/plugin.json

# Check required manifest fields
jq '{name, version, description, author, license}' plugins/plugin-name/plugin.json
```

### Testing MCP Servers

```bash
# Test MCP server can start
cd plugins/plugin-name/mcp-servers/server-name
node index.js

# Should see: "Demo Server running on stdio" (or similar)
# Ctrl+C to stop
```

## Plugin Requirements

### Required Files

1. **plugin.json** - Manifest with:
   - `name` (kebab-case, unique)
   - `version` (semver: 1.0.0)
   - `description`
   - `author` (object with name and email)
   - `license` (e.g., MIT, Apache-2.0)

2. **README.md** - Documentation with:
   - What the plugin does
   - Installation instructions
   - Usage examples
   - List of bundled components

3. **LICENSE** - License file

### Marketplace Registration

Plugins must be registered in `.claude-plugin/marketplace.json`:

```json
{
  "plugins": [
    {
      "name": "plugin-name",
      "source": "./plugins/plugin-name",
      "description": "Brief description",
      "version": "1.0.0",
      "author": {"name": "Name", "email": "email@example.com"},
      "license": "MIT",
      "keywords": ["keyword1", "keyword2"],
      "category": "utilities"
    }
  ]
}
```

Valid categories: `demo`, `development`, `utilities`, `productivity`, `networking`, `tutorial`

## Reference Implementation

The `plugins/demo-plugin/` demonstrates all plugin capabilities:
- Skills bundled in `skills/code-review/`
- MCP server with SessionStart hook in `mcp-servers/demo-server/`
- Custom agent in `agents/demo-plugin-agent.md`
- Shell command in `commands/demo.sh`
- Hooks configuration in `hooks/hooks.json`

Use as a template for creating new plugins.
