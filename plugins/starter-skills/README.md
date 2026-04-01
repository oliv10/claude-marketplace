# Starter Skills Plugin

Simple, fun skills to get started with Claude Code and the community marketplace.

## What's Included

This plugin provides two beginner-friendly skills:

### 🙋 Hello Skill
Responds with a friendly greeting when you say "hi", "hello", "hey", or similar greetings.

**Usage:**
```
hi
hello
hey there
```

### 🔮 Fortune Skill
Provides random encouraging messages, programming tips, or developer wisdom—like the classic Unix `fortune` command.

**Usage:**
```
fortune
give me a fortune
random programming tip
inspire me
```

## Installation

### Via Marketplace (Recommended)
```bash
# Add the marketplace
/plugin marketplace add oliv10/claude-marketplace

# Install the plugin
/plugin install starter-skills@claude-marketplace

# Reload plugins
/reload-plugins
```

### Manual Installation
```bash
# Copy the plugin directory
cp -r plugins/starter-skills ~/.claude/plugins/

# Add to your settings.json
# The skills will be automatically discovered
```

## License

MIT License - Free to use and modify
