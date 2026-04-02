# Creating Hooks

Hooks are event handlers that execute automatically when specific events occur in Claude Code. They're essential for plugin initialization, dependency installation, and automation.

## Hook Structure

Hooks are defined in a `hooks.json` file:

```
hooks/
└── hooks.json
```

## hooks.json Format

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Session started'",
            "statusMessage": "Initializing plugin..."
          }
        ]
      }
    ],
    "ToolCall": [
      {
        "matcher": "tool_name",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Tool called'",
            "statusMessage": "Processing tool call..."
          }
        ]
      }
    ]
  }
}
```

## Real Example: Demo Plugin Hooks

See [hooks.json](./hooks.json) for a working example that auto-installs MCP server dependencies on session start.

## Available Hook Events

### SessionStart

Runs when a Claude Code session begins. Perfect for:
- Installing dependencies
- Initializing services
- Checking prerequisites
- Setting up environment

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
            "statusMessage": "Installing dependencies..."
          }
        ]
      }
    ]
  }
}
```

### ToolCall

Runs when Claude invokes a specific tool. Useful for:
- Logging tool usage
- Validation
- Pre/post-processing
- Notifications

```json
{
  "hooks": {
    "ToolCall": [
      {
        "matcher": "send_message",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Message sent' >> ${CLAUDE_PLUGIN_ROOT}/logs/activity.log",
            "statusMessage": "Logging activity..."
          }
        ]
      }
    ]
  }
}
```

## Hook Configuration Fields

### type
Type of hook to execute:
- `"command"` - Execute a shell command

### command
The command to execute. Can use:
- `${CLAUDE_PLUGIN_ROOT}` - Path to plugin directory
- `${CLAUDE_CONFIG_DIR}` - Path to ~/.claude
- Standard environment variables

### statusMessage (optional)
Message shown to user while hook executes:
```json
{
  "statusMessage": "Installing dependencies..."
}
```

### matcher
Determines when the hook runs:
- **SessionStart**: Usually `"startup"`
- **ToolCall**: Tool name to match (e.g., `"send_message"`)

## Common Hook Patterns

### 1. MCP Server Dependency Installation

**Critical for MCP servers!** Without this, your server won't have dependencies:

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

**Why this is needed:**
- MCP servers run as separate processes
- They need their npm dependencies installed
- Users may install plugin but not manually run `npm install`
- This hook ensures dependencies are always ready

### 2. Multiple Dependency Installations

If you have multiple MCP servers:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "npm install --silent --prefix \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server-one\"",
            "statusMessage": "Installing server-one dependencies..."
          },
          {
            "type": "command",
            "command": "npm install --silent --prefix \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server-two\"",
            "statusMessage": "Installing server-two dependencies..."
          }
        ]
      }
    ]
  }
}
```

### 3. Environment Validation

Check prerequisites before plugin loads:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "command -v jq >/dev/null 2>&1 || echo 'Warning: jq not installed'",
            "statusMessage": "Checking prerequisites..."
          }
        ]
      }
    ]
  }
}
```

### 4. Service Initialization

Start required background services:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/commands/start-service.sh",
            "statusMessage": "Starting background service..."
          }
        ]
      }
    ]
  }
}
```

### 5. Activity Logging

Log tool usage for analytics:

```json
{
  "hooks": {
    "ToolCall": [
      {
        "matcher": "important_tool",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"$(date): important_tool called\" >> ${CLAUDE_PLUGIN_ROOT}/logs/usage.log",
            "statusMessage": "Logging activity..."
          }
        ]
      }
    ]
  }
}
```

### 6. Cache Warming

Pre-load data for faster responses:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/commands/warm-cache.sh",
            "statusMessage": "Warming cache..."
          }
        ]
      }
    ]
  }
}
```

## Best Practices

### 1. Keep Hooks Fast

Hooks run synchronously and block the session. Make them quick:

```json
// ✅ Good - Fast, silent install
{
  "command": "npm install --silent --prefix \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server\"",
  "statusMessage": "Installing dependencies..."
}

// ❌ Bad - Slow, verbose
{
  "command": "npm install --verbose --prefix \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server\" && npm audit",
  "statusMessage": "Installing..."
}
```

### 2. Use Absolute Paths

Always use `${CLAUDE_PLUGIN_ROOT}`:

```json
// ✅ Good
{
  "command": "node ${CLAUDE_PLUGIN_ROOT}/scripts/init.js"
}

// ❌ Bad - Relative path depends on CWD
{
  "command": "node scripts/init.js"
}
```

### 3. Handle Errors Gracefully

Don't fail the entire session if a hook fails:

```json
{
  "command": "npm install --silent --prefix \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server\" || echo 'Warning: Install failed'"
}
```

### 4. Provide Clear Status Messages

Users see these while waiting:

```json
// ✅ Good - Clear and specific
{
  "statusMessage": "Installing demo-server dependencies..."
}

// ❌ Bad - Vague
{
  "statusMessage": "Loading..."
}
```

### 5. Use Silent/Quiet Flags

Reduce noise in output:

```json
{
  "command": "npm install --silent --prefix \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server\""
}
```

### 6. Check Conditions Before Acting

Avoid unnecessary work:

```bash
# Only install if node_modules doesn't exist
[ ! -d \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server/node_modules\" ] && npm install --silent --prefix \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server\"
```

## Testing Hooks

### 1. Test Commands Manually

```bash
# Test the actual command
cd plugins/your-plugin
npm install --silent --prefix "./mcp-servers/server-name"

# Verify it works
echo $?  # Should be 0 for success
```

### 2. Test with Plugin Root Variable

```bash
# Simulate the environment
export CLAUDE_PLUGIN_ROOT="/path/to/plugins/your-plugin"

# Test command with variable
npm install --silent --prefix "${CLAUDE_PLUGIN_ROOT}/mcp-servers/server-name"
```

### 3. Test Full Integration

```bash
# Install plugin
cp -r plugins/your-plugin ~/.claude/plugins/

# Enable in settings
# Edit ~/.claude/settings.json

# Restart Claude Code
# Watch for status message and check logs
```

### 4. Verify Hook Execution

Check that hooks ran successfully:

```bash
# Check that dependencies were installed
ls ~/.claude/plugins/your-plugin/mcp-servers/server-name/node_modules

# Check for log files if using logging hooks
cat ~/.claude/plugins/your-plugin/logs/activity.log
```

## Common Issues

### Hook Not Running

**Symptoms**: Dependencies missing, services not started

**Solutions**:
- Verify hooks.json syntax with `jq . hooks/hooks.json`
- Check hook event name is correct (SessionStart, ToolCall)
- Ensure plugin is enabled in settings.json
- Restart Claude Code after changes

### Hook Fails Silently

**Symptoms**: No error, but expected results don't occur

**Solutions**:
- Test command manually first
- Add `|| echo 'Failed'` to see errors
- Check file permissions
- Verify `${CLAUDE_PLUGIN_ROOT}` is correct

### Hook Takes Too Long

**Symptoms**: Claude Code hangs on startup

**Solutions**:
- Use `--silent` flags to reduce output
- Skip unnecessary operations
- Consider async initialization if possible
- Add timeout handling

### Path Issues

**Symptoms**: "command not found" or "file not found" errors

**Solutions**:
- Always use `${CLAUDE_PLUGIN_ROOT}`
- Use absolute paths or full paths
- Quote paths with spaces: `"${CLAUDE_PLUGIN_ROOT}/path with spaces"`

## Environment Variables

Available in hook commands:

- **${CLAUDE_PLUGIN_ROOT}** - Absolute path to your plugin
- **${CLAUDE_CONFIG_DIR}** - Path to ~/.claude directory
- **$HOME** - User's home directory
- **$USER** - Current username
- **$PATH** - System PATH

## Security Considerations

### Validate Commands

Don't execute arbitrary user input:

```json
// ❌ DANGEROUS - Could be exploited
{
  "command": "eval ${USER_INPUT}"
}

// ✅ SAFE - Fixed command
{
  "command": "npm install --silent --prefix \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server\""
}
```

### Least Privilege

Only do what's necessary:

```json
// ❌ Too much privilege
{
  "command": "sudo npm install -g package"
}

// ✅ Local install only
{
  "command": "npm install --silent --prefix \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server\""
}
```

### No Secrets

Never include credentials in hooks:

```json
// ❌ NEVER DO THIS
{
  "command": "curl -H 'Authorization: Bearer sk-secret' api.example.com"
}

// ✅ Use environment variables
{
  "command": "[ -n \"$API_KEY\" ] && curl -H \"Authorization: Bearer $API_KEY\" api.example.com"
}
```

## Advanced Patterns

### Conditional Execution

```json
{
  "command": "[ ! -f \"${CLAUDE_PLUGIN_ROOT}/.initialized\" ] && ${CLAUDE_PLUGIN_ROOT}/commands/init.sh && touch \"${CLAUDE_PLUGIN_ROOT}/.initialized\""
}
```

### Chained Commands

```json
{
  "command": "cd \"${CLAUDE_PLUGIN_ROOT}\" && npm install --silent && npm run build"
}
```

### Logging with Timestamps

```json
{
  "command": "echo \"[$(date)] Session started\" >> \"${CLAUDE_PLUGIN_ROOT}/logs/session.log\""
}
```

### Error Handling

```json
{
  "command": "npm install --silent --prefix \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/server\" 2>&1 | tee \"${CLAUDE_PLUGIN_ROOT}/logs/install.log\" || echo 'Install failed - check logs'"
}
```

## When to Use Hooks

Use hooks for:
- **MCP server dependency installation** (essential!)
- **Service initialization**
- **Environment validation**
- **Logging and analytics**
- **Cache warming**
- **License checks**

Don't use hooks for:
- Long-running operations (blocks session)
- Interactive commands (no user input)
- Operations requiring network (unreliable)
- Destructive operations (too risky)

## Resources

- **[Demo Hooks](./hooks.json)** - Working example
- **[Parent README](../README.md)** - Full plugin creation guide
- **[Settings Documentation](https://docs.anthropic.com/claude/docs/claude-code)** - Hook configuration details

---

**Next Steps**: Create your hooks.json and test the hooks fire correctly!
