# Demo Plugin - Reference Implementation

This plugin serves as a **complete reference implementation** demonstrating all capabilities of Claude Code plugins. Use it as a template when creating your own plugins for the Claude Code marketplace.

## What This Plugin Demonstrates

The demo-plugin showcases every type of component you can include in a plugin:

- **Skills** - Custom commands invokable by users (`/code-review`)
- **MCP Server** - Tools exposed to Claude (echo, greet, random_number)
- **Agent** - Specialized AI agent for specific tasks
- **Command** - Executable shell script
- **Hooks** - Auto-installation of dependencies on session start
- **Settings** - Default configuration when plugin is enabled

## Quick Start

### Installing This Plugin Locally

```bash
# From the marketplace repository root
cp -r plugins/demo-plugin ~/.claude/plugins/

# Enable in ~/.claude/settings.json
# Add "demo-plugin" to the plugins array:
{
  "plugins": ["demo-plugin"]
}

# Restart Claude Code
```

### Testing the Components

Once installed:

```bash
# Test the skill
/code-review

# Test MCP server tools (Claude will have access to these)
# - echo: "Echo back my message"
# - greet: "Greet me as John"
# - random_number: "Generate a random number between 1 and 100"

# Test the command
bash ~/.claude/plugins/demo-plugin/commands/demo.sh

# Test the agent
# In Claude Code: "Use the demo-plugin-agent to show me how agents work"
```

---

## Creating Your Own Plugin

Follow this guide to create a new plugin and add it to the marketplace.

### Step 1: Set Up Plugin Structure

Create your plugin directory in `plugins/`:

```bash
cd /path/to/claude-marketplace
mkdir -p plugins/your-plugin-name/.claude-plugin
cd plugins/your-plugin-name
```

### Step 2: Create the Manifest (`plugin.json`)

Create `.claude-plugin/plugin.json` with required metadata:

```json
{
  "name": "your-plugin-name",
  "description": "Brief description of what your plugin does",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "license": "MIT",
  "category": "utilities",
  "keywords": ["keyword1", "keyword2"]
}
```

**Valid categories**: `demo`, `development`, `utilities`, `productivity`, `networking`, `tutorial`

### Step 3: Add Components (Choose What You Need)

#### A. Adding a Skill

Skills are commands users can invoke with `/skill-name`.

1. Create `skills/your-skill-name/SKILL.md`:

```markdown
---
name: your-skill-name
description: What this skill does. Include trigger keywords that match user intent.
---

Instructions for Claude when this skill is invoked.

For example:
- What to analyze
- How to format output
- What to check for
```

**Example from demo-plugin**: See [skills/code-review/SKILL.md](./skills/code-review/SKILL.md)

#### B. Adding an MCP Server

MCP servers expose tools and resources to Claude.

1. Create your server in `mcp-servers/server-name/`:

```bash
mkdir -p mcp-servers/your-server
cd mcp-servers/your-server
npm init -y
npm install @modelcontextprotocol/sdk
```

2. Create `mcp-servers/your-server/index.js` (see [mcp-servers/demo-server/index.js](./mcp-servers/demo-server/index.js) for example)

3. Configure in `.mcp.json` at plugin root:

```json
{
  "mcpServers": {
    "your-server": {
      "command": "node",
      "args": [
        "${CLAUDE_PLUGIN_ROOT}/mcp-servers/your-server/index.js"
      ]
    }
  }
}
```

**CRITICAL**: Always use `${CLAUDE_PLUGIN_ROOT}` for paths to plugin files.

4. Add dependency auto-installation in `hooks/hooks.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "npm install --silent --prefix \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/your-server\"",
            "statusMessage": "Installing your-server dependencies..."
          }
        ]
      }
    ]
  }
}
```

Without this hook, your MCP server tools won't be exposed to Claude!

**Example from demo-plugin**: 
- Server: [mcp-servers/demo-server/index.js](./mcp-servers/demo-server/index.js)
- Config: [.mcp.json](./.mcp.json)
- Hook: [hooks/hooks.json](./hooks/hooks.json)

#### C. Adding an Agent

Agents are specialized AI assistants for specific tasks.

1. Create `agents/your-agent-name.md`:

```markdown
---
name: your-agent-name
description: "When to use this agent with trigger examples.\\n\\nExamples:\\n- User: 'trigger phrase'\\n  Assistant: 'I'll use the Agent tool to launch your-agent-name'"
model: sonnet
---

System prompt for your agent.

Define:
- What the agent does
- How it should approach tasks
- What tools it has access to
- Quality standards and guidelines
```

**Example from demo-plugin**: See [agents/demo-plugin-agent.md](./agents/demo-plugin-agent.md)

#### D. Adding Commands

Executable shell scripts for automation.

1. Create `commands/your-command.sh`:

```bash
#!/bin/bash

# Your command implementation
echo "Command executed!"
echo "Plugin root: ${CLAUDE_PLUGIN_ROOT}"
```

2. Make it executable:

```bash
chmod +x commands/your-command.sh
```

**Example from demo-plugin**: See [commands/demo.sh](./commands/demo.sh)

#### E. Adding Default Settings

Default configurations applied when the plugin is enabled.

Create `settings.json` at plugin root:

```json
{
  "yourSetting": "defaultValue"
}
```

**Example from demo-plugin**: See [settings.json](./settings.json)

### Step 4: Add Required Documentation

Create `README.md` describing:
- What your plugin does
- Installation instructions
- Usage examples
- List of bundled components

### Step 5: Add License

Create `LICENSE` file (e.g., MIT, Apache-2.0). You can use the same license as the marketplace or choose your own.

### Step 6: Test Locally

```bash
# Copy to plugins directory
cp -r plugins/your-plugin-name ~/.claude/plugins/

# Enable in ~/.claude/settings.json
{
  "plugins": ["your-plugin-name"]
}

# Restart Claude Code and test everything:
# - Skills appear as /commands
# - MCP tools are available to Claude
# - Agents can be invoked
# - Hooks run on session start
```

### Step 7: Register in Marketplace

Edit `.claude-plugin/marketplace.json` at repository root and add your plugin:

```json
{
  "plugins": [
    {
      "name": "your-plugin-name",
      "source": "./plugins/your-plugin-name",
      "description": "Brief description",
      "version": "1.0.0",
      "author": {
        "name": "Your Name",
        "email": "your.email@example.com"
      },
      "license": "MIT",
      "keywords": ["keyword1", "keyword2"],
      "category": "utilities"
    }
  ]
}
```

**CRITICAL**: Version in `marketplace.json` must match version in `plugin.json`!

### Step 8: Submit Pull Request

1. Fork the repository
2. Create a branch for your plugin
3. Commit your changes
4. Submit a PR with:
   - Description of what your plugin does
   - Screenshots or examples
   - Confirmation that you tested locally

---

## Plugin Directory Reference

```
your-plugin-name/
├── .claude-plugin/
│   └── plugin.json        # REQUIRED: Plugin manifest
├── README.md              # REQUIRED: Documentation
├── LICENSE                # REQUIRED: License file
├── skills/                # OPTIONAL: Agent skills
│   └── skill-name/
│       └── SKILL.md       # YAML frontmatter + instructions
├── mcp-servers/           # OPTIONAL: MCP servers
│   └── server-name/
│       ├── index.js
│       └── package.json
├── agents/                # OPTIONAL: Custom agents
│   └── agent-name.md      # YAML frontmatter + system prompt
├── commands/              # OPTIONAL: Shell scripts
│   └── command.sh
├── hooks/                 # OPTIONAL: Event handlers
│   └── hooks.json         # SessionStart, etc.
├── settings.json          # OPTIONAL: Default settings
├── .mcp.json             # OPTIONAL: MCP server config (recommended)
└── .lsp.json             # OPTIONAL: LSP server config
```

## Updating Your Plugin

**CRITICAL**: Claude Code only updates plugins when version numbers change!

To release an update:

1. Increment `version` in `.claude-plugin/plugin.json`
2. Update matching `version` in marketplace's `.claude-plugin/marketplace.json`
3. Follow semantic versioning:
   - **MAJOR** (1.0.0 → 2.0.0): Breaking changes
   - **MINOR** (1.0.0 → 1.1.0): New features
   - **PATCH** (1.0.0 → 1.0.1): Bug fixes

## Best Practices

### Security
- Never include credentials or secrets in your plugin
- Validate all user inputs in MCP tools
- Be cautious with shell commands - sanitize inputs
- Review all dependencies for vulnerabilities

### Documentation
- Write clear, concise descriptions
- Include usage examples
- Document all configuration options
- Keep README up to date

### Naming
- Use kebab-case for all identifiers
- Choose descriptive, unique names
- Prefix agent names with plugin name to avoid conflicts

### Testing
- Test all components thoroughly before submitting
- Verify MCP servers start correctly
- Test skills with various inputs
- Check that hooks execute properly

### Code Quality
- Follow consistent formatting
- Add comments for complex logic
- Keep dependencies minimal
- Use appropriate error handling

## Troubleshooting

### MCP Server Tools Not Appearing
- Check that `.mcp.json` uses `${CLAUDE_PLUGIN_ROOT}`
- Verify SessionStart hook runs `npm install`
- Test server manually: `node mcp-servers/your-server/index.js`
- Check for errors in Claude Code output

### Skill Not Available
- Ensure SKILL.md has proper YAML frontmatter
- Verify file is in `skills/skill-name/SKILL.md`
- Check that plugin is enabled in settings.json
- Restart Claude Code

### Version Update Not Applied
- Confirm version changed in BOTH `plugin.json` AND `marketplace.json`
- Versions must match exactly
- Restart Claude Code after update

## Resources

- **[Marketplace README](../../README.md)** - Installation and contribution guidelines
- **[CLAUDE.md](../../CLAUDE.md)** - Comprehensive developer documentation
- **[MCP Documentation](https://modelcontextprotocol.io)** - Model Context Protocol spec
- **[Claude Code Docs](https://docs.anthropic.com/claude/docs/claude-code)** - Official documentation

---

## Demo Plugin Components

This plugin includes:

### 1. Code Review Skill
**Location**: [skills/code-review/SKILL.md](./skills/code-review/SKILL.md)  
**Usage**: `/code-review`  
**Description**: Reviews code for best practices, security, and quality

### 2. Demo MCP Server
**Location**: [mcp-servers/demo-server/](./mcp-servers/demo-server/)  
**Tools**:
- `echo` - Echo back a message
- `greet` - Greet a user by name
- `random_number` - Generate random numbers in a range

### 3. Demo Agent
**Location**: [agents/demo-plugin-agent.md](./agents/demo-plugin-agent.md)  
**Purpose**: Demonstrates how agents work in plugins  
**Usage**: Ask Claude to use the demo-plugin-agent

### 4. Demo Command
**Location**: [commands/demo.sh](./commands/demo.sh)  
**Purpose**: Shows how to create executable commands

### 5. Dependency Installation Hook
**Location**: [hooks/hooks.json](./hooks/hooks.json)  
**Purpose**: Auto-installs MCP server dependencies on session start

---

**Ready to build?** Use this plugin as your template and start creating!
