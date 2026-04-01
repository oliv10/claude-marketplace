#!/usr/bin/env node

/**
 * Hello MCP Server - Demo Implementation
 *
 * A simple Model Context Protocol server that demonstrates:
 * - Providing tools to Claude
 * - Handling tool calls
 * - Returning structured responses
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

// Create MCP server instance
const server = new Server(
  {
    name: 'hello-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_greeting',
        description: 'Get a friendly greeting message. Optionally provide a name to personalize the greeting.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the person to greet (optional)',
            },
          },
        },
      },
      {
        name: 'get_server_time',
        description: 'Get the current server time in ISO format',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'echo',
        description: 'Echo back any message you provide - useful for testing',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'The message to echo back',
            },
          },
          required: ['message'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_greeting': {
        const personName = args?.name || 'there';
        const greeting = `Hello, ${personName}! 👋 Welcome to the MCP demo server.`;

        return {
          content: [
            {
              type: 'text',
              text: greeting,
            },
          ],
        };
      }

      case 'get_server_time': {
        const currentTime = new Date().toISOString();

        return {
          content: [
            {
              type: 'text',
              text: `Current server time: ${currentTime}`,
            },
          ],
        };
      }

      case 'echo': {
        const message = args?.message;

        if (!message) {
          throw new Error('Message parameter is required');
        }

        return {
          content: [
            {
              type: 'text',
              text: `Echo: ${message}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (stdout is reserved for MCP protocol)
  console.error('Hello MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
