# Demo Server - MCP Implementation Example

A minimal MCP (Model Context Protocol) server demonstrating how to create tools that Claude can use. This server provides three simple tools as learning examples.

## What This Server Demonstrates

- **Tool registration** - How to define tools Claude can call
- **Input schemas** - How to specify parameters with JSON Schema
- **Request handling** - How to process tool calls and return results
- **Error handling** - How to handle invalid inputs
- **Stdio transport** - How to communicate with Claude Code

## Available Tools

### 1. echo
Echoes back a message - demonstrates basic input/output.

**Parameters:**
- `message` (string, required) - The message to echo back

**Example:**
```
User: "Echo back 'Hello World'"
Claude calls: echo(message="Hello World")
Result: "Echo: Hello World"
```

### 2. greet
Greets a user by name - demonstrates string formatting.

**Parameters:**
- `name` (string, required) - The name to greet

**Example:**
```
User: "Greet me as Alice"
Claude calls: greet(name="Alice")
Result: "Hello, Alice! Welcome to the demo plugin."
```

### 3. random_number
Generates a random number in a range - demonstrates number handling.

**Parameters:**
- `min` (number, required) - Minimum value (inclusive)
- `max` (number, required) - Maximum value (inclusive)

**Example:**
```
User: "Generate a random number between 1 and 100"
Claude calls: random_number(min=1, max=100)
Result: "Random number between 1 and 100: 42"
```

## Installation

This server's dependencies are automatically installed by the plugin's SessionStart hook. See [../../hooks/hooks.json](../../hooks/hooks.json).

To install manually:
```bash
npm install
```

## Testing

### Manual Test
```bash
# Run the server
node index.js

# Should output: "Demo Server running on stdio"
# Press Ctrl+C to stop
```

### Integration Test
Once the plugin is installed and enabled, ask Claude to use the tools:
```
"Echo back my message"
"Greet me as John"
"Generate a random number between 1 and 100"
```

## Code Structure

### Server Setup
```javascript
const server = new Server(
  {
    name: 'demo-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);
```

### Tool Registration
```javascript
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'tool_name',
        description: 'What the tool does and when to use it',
        inputSchema: {
          type: 'object',
          properties: {
            param: {
              type: 'string',
              description: 'Parameter description',
            },
          },
          required: ['param'],
        },
      },
    ],
  };
});
```

### Tool Implementation
```javascript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'tool_name') {
    // Validate input
    if (!args.param) {
      throw new Error('param is required');
    }

    // Process and return result
    return {
      content: [
        {
          type: 'text',
          text: `Result: ${args.param}`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});
```

## Key Concepts

### Input Schemas
Use JSON Schema to define parameters:

```javascript
inputSchema: {
  type: 'object',
  properties: {
    message: {
      type: 'string',           // Data type
      description: 'The message to echo',  // Help Claude understand
    },
    count: {
      type: 'number',
      description: 'Number of times to repeat',
      minimum: 1,               // Validation
      maximum: 10,
    },
  },
  required: ['message'],        // Required fields
}
```

### Descriptions Matter
Good descriptions help Claude use your tools correctly:

```javascript
// ❌ Bad - Too vague
description: 'Does something with text'

// ✅ Good - Clear and specific
description: 'Converts text to uppercase. Use when user wants to capitalize text.'
```

### Error Handling
Return clear error messages:

```javascript
if (args.min > args.max) {
  return {
    content: [
      {
        type: 'text',
        text: 'Error: min must be less than or equal to max',
      },
    ],
    isError: true,
  };
}
```

### Stdio Transport
MCP servers communicate via stdio (standard input/output):
- Requests come through stdin
- Responses go to stdout
- Logs go to stderr (use `console.error()`)

```javascript
// ✅ Good - Log to stderr
console.error('Processing request...');

// ❌ Bad - Don't write to stdout
console.log('Processing request...');  // Corrupts protocol
```

## Building on This Example

### Add a New Tool

1. **Define the tool** in `ListToolsRequestSchema` handler:
```javascript
{
  name: 'reverse_string',
  description: 'Reverses a string. Use when user wants to flip text.',
  inputSchema: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: 'The text to reverse',
      },
    },
    required: ['text'],
  },
}
```

2. **Implement the tool** in `CallToolRequestSchema` handler:
```javascript
if (name === 'reverse_string') {
  const reversed = args.text.split('').reverse().join('');
  return {
    content: [
      {
        type: 'text',
        text: `Reversed: ${reversed}`,
      },
    ],
  };
}
```

3. **Test it**:
```
"Reverse the string 'hello'"
```

### Add Complex Types

Arrays:
```javascript
items: {
  type: 'array',
  items: { type: 'string' },
  description: 'List of items to process',
}
```

Objects:
```javascript
config: {
  type: 'object',
  properties: {
    enabled: { type: 'boolean' },
    timeout: { type: 'number' },
  },
}
```

Enums:
```javascript
format: {
  type: 'string',
  enum: ['json', 'csv', 'xml'],
  description: 'Output format',
}
```

### Add Validation

```javascript
// Validate string length
if (args.message.length > 1000) {
  throw new Error('Message too long (max 1000 characters)');
}

// Validate number range
if (args.min < 0 || args.max > 1000) {
  throw new Error('Numbers must be between 0 and 1000');
}

// Validate format
const validFormats = ['json', 'csv', 'xml'];
if (!validFormats.includes(args.format)) {
  throw new Error(`Invalid format. Must be one of: ${validFormats.join(', ')}`);
}
```

### Return Structured Data

Return JSON for complex results:
```javascript
return {
  content: [
    {
      type: 'text',
      text: JSON.stringify({
        success: true,
        data: {
          result: processedData,
          timestamp: new Date().toISOString(),
        },
        metadata: {
          processingTime: 123,
        },
      }, null, 2),
    },
  ],
};
```

## Common Patterns

### File Operations
```javascript
if (name === 'read_config') {
  const fs = require('fs');
  const path = require('path');
  
  const configPath = path.join(process.env.CLAUDE_PLUGIN_ROOT, 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  
  return {
    content: [{ type: 'text', text: JSON.stringify(config, null, 2) }],
  };
}
```

### API Calls
```javascript
if (name === 'fetch_data') {
  const fetch = require('node-fetch');
  
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}
```

### Database Queries
```javascript
if (name === 'query_database') {
  const sqlite3 = require('sqlite3');
  const db = new sqlite3.Database('data.db');
  
  const rows = await new Promise((resolve, reject) => {
    db.all('SELECT * FROM users WHERE active = ?', [true], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
  
  return {
    content: [{ type: 'text', text: JSON.stringify(rows, null, 2) }],
  };
}
```

## Debugging

### Enable Logging
```javascript
// Log to stderr (won't interfere with protocol)
console.error('Tool called:', name);
console.error('Arguments:', JSON.stringify(args, null, 2));
```

### Test Tools Independently
Create a test file:
```javascript
// test.js
const { greet } = require('./tools');

console.log(greet({ name: 'Alice' }));
console.log(greet({ name: 'Bob' }));
```

### Check for Errors
```bash
# Run and check exit code
node index.js
echo $?  # Should be 0

# Check for syntax errors
node -c index.js

# Run with Node debugger
node --inspect index.js
```

## Dependencies

Current dependencies (see [package.json](./package.json)):
```json
{
  "@modelcontextprotocol/sdk": "^1.0.4"
}
```

Add more as needed:
```bash
npm install --save node-fetch  # For API calls
npm install --save sqlite3     # For databases
npm install --save axios       # For HTTP requests
```

## Best Practices

1. **Clear tool names** - Use snake_case, be descriptive
2. **Comprehensive descriptions** - Help Claude understand when to use each tool
3. **Validate inputs** - Check types, ranges, formats
4. **Handle errors gracefully** - Return helpful error messages
5. **Log to stderr** - Use `console.error()` for debugging
6. **Return structured data** - Use JSON for complex results
7. **Keep tools focused** - One tool, one purpose
8. **Document parameters** - Clear descriptions for each field

## Resources

- **[MCP Documentation](https://modelcontextprotocol.io)** - Official MCP spec
- **[MCP SDK on npm](https://www.npmjs.com/package/@modelcontextprotocol/sdk)** - SDK documentation
- **[Parent README](../../README.md)** - Plugin creation guide
- **[MCP Servers Guide](../README.md)** - General MCP server guide

---

Use this server as a template for creating your own MCP servers!
