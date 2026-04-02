# Creating MCP Servers

MCP (Model Context Protocol) servers expose tools and resources that Claude can use during conversations. They run as separate processes and communicate with Claude Code via stdio.

## MCP Server Structure

Each MCP server should be in its own directory:

```
mcp-servers/
└── your-server-name/
    ├── index.js       # Server implementation
    ├── package.json   # Dependencies
    └── README.md      # Optional: server documentation
```

## Quick Start

### 1. Create Server Directory

```bash
mkdir -p mcp-servers/your-server
cd mcp-servers/your-server
```

### 2. Initialize npm Package

```bash
npm init -y
npm install @modelcontextprotocol/sdk
```

### 3. Create Server Implementation

Create `index.js`:

```javascript
#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

// Create server instance
const server = new Server(
  {
    name: 'your-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'your_tool',
        description: 'What this tool does',
        inputSchema: {
          type: 'object',
          properties: {
            param1: {
              type: 'string',
              description: 'Parameter description',
            },
          },
          required: ['param1'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'your_tool') {
    // Tool implementation
    return {
      content: [
        {
          type: 'text',
          text: `Result: ${args.param1}`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Your Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
```

### 4. Configure in Plugin

Create/edit `.mcp.json` at plugin root:

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

**CRITICAL**: Always use `${CLAUDE_PLUGIN_ROOT}` for paths to plugin files!

### 5. Add Auto-Installation Hook

Create/edit `hooks/hooks.json` at plugin root:

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

Without this hook, your server won't have its dependencies installed and won't work!

## Real Example: Demo Server

See [demo-server/](./demo-server/) for a complete working implementation with three tools:
- **echo** - Echo back messages
- **greet** - Greet users by name  
- **random_number** - Generate random numbers in a range

Study this example to understand the full pattern.

## Tool Design Best Practices

### 1. Clear Tool Names
Use descriptive, snake_case names:
- ✅ `send_slack_message`
- ❌ `ssm` or `sendSlackMsg`

### 2. Comprehensive Descriptions
Explain what the tool does AND when to use it:
```javascript
{
  name: 'search_code',
  description: 'Search codebase for patterns. Use when user asks to find functions, classes, or specific code patterns across files.',
  // ...
}
```

### 3. Well-Defined Input Schemas
Use JSON Schema with clear descriptions:
```javascript
inputSchema: {
  type: 'object',
  properties: {
    pattern: {
      type: 'string',
      description: 'Regex pattern to search for (e.g., "class \\w+Controller")',
    },
    file_types: {
      type: 'array',
      items: { type: 'string' },
      description: 'File extensions to search (e.g., ["js", "ts"])',
    },
  },
  required: ['pattern'],
}
```

### 4. Helpful Error Messages
Return clear errors when something goes wrong:
```javascript
if (!isValidInput(args.param)) {
  return {
    content: [
      {
        type: 'text',
        text: 'Error: param must be between 1 and 100',
      },
    ],
    isError: true,
  };
}
```

### 5. Structured Output
Return well-formatted, parseable results:
```javascript
return {
  content: [
    {
      type: 'text',
      text: JSON.stringify({
        success: true,
        results: [...],
        count: 5,
      }, null, 2),
    },
  ],
};
```

## Testing Your MCP Server

### Manual Testing

```bash
# Test server starts correctly
cd mcp-servers/your-server
node index.js

# Should see: "Your Server running on stdio"
# Press Ctrl+C to stop
```

### Integration Testing

```bash
# Install plugin
cp -r plugins/your-plugin ~/.claude/plugins/

# Enable in ~/.claude/settings.json
{
  "plugins": ["your-plugin"]
}

# Restart Claude Code
# Your tools should now be available to Claude
```

Ask Claude to use your tools:
```
"Use the your_tool to process 'test input'"
```

## Common Use Cases

MCP servers excel at:
- **API integrations** (Slack, GitHub, Jira, etc.)
- **Database queries** (read-only access to data)
- **File system operations** (search, read, list)
- **External service calls** (weather, translation, etc.)
- **Data processing** (CSV parsing, JSON transformation)
- **System information** (process lists, disk usage, etc.)

## Resources vs Tools

MCP servers can provide both:

**Tools** - Actions Claude can perform:
```javascript
{
  name: 'send_message',
  description: 'Send a message to a channel',
  // ...
}
```

**Resources** - Data Claude can read:
```javascript
{
  uri: 'config://database',
  name: 'Database Configuration',
  mimeType: 'application/json',
  // ...
}
```

This demo focuses on tools. See [MCP documentation](https://modelcontextprotocol.io) for resources.

## Security Considerations

### Input Validation
Always validate and sanitize inputs:
```javascript
if (typeof args.param !== 'string' || args.param.length > 1000) {
  throw new Error('Invalid input');
}
```

### Least Privilege
Only provide access to what's necessary:
- ❌ Full file system access
- ✅ Read-only access to specific directories

### No Secrets in Code
Never hardcode credentials:
```javascript
// ❌ Bad
const apiKey = 'sk-1234567890';

// ✅ Good
const apiKey = process.env.API_KEY;
```

### Rate Limiting
Implement rate limits for external API calls:
```javascript
// Prevent abuse
if (callCount > MAX_CALLS_PER_MINUTE) {
  throw new Error('Rate limit exceeded');
}
```

## Troubleshooting

### Tools Don't Appear
- Verify `.mcp.json` exists with correct path
- Check SessionStart hook runs `npm install`
- Look for errors in Claude Code output
- Test server manually: `node index.js`

### Server Crashes
- Add error handling around all operations
- Log errors to stderr: `console.error('Error:', err)`
- Check for missing dependencies

### Wrong Results
- Add logging to debug: `console.error('Processing:', args)`
- Verify input validation logic
- Test with various inputs

---

**Next Steps**: See [../README.md](../README.md) for complete plugin creation guide.
