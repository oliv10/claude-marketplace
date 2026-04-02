#!/usr/bin/env node

/**
 * Demo Server - Simple MCP Implementation
 *
 * A minimal MCP server demonstrating basic tool capabilities:
 * - Echo messages
 * - Generate random numbers
 * - Greet users
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
    name: 'demo-server',
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
        name: 'echo',
        description: 'Echo back a message. Simple demonstration of basic input/output.',
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
      {
        name: 'random_number',
        description: 'Generate a random number within a specified range.',
        inputSchema: {
          type: 'object',
          properties: {
            min: {
              type: 'number',
              description: 'Minimum value (default: 1)',
            },
            max: {
              type: 'number',
              description: 'Maximum value (default: 100)',
            },
          },
        },
      },
      {
        name: 'greet',
        description: 'Generate a personalized greeting message.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name of the person to greet',
            },
            style: {
              type: 'string',
              description: 'Greeting style: casual, formal, or enthusiastic',
              enum: ['casual', 'formal', 'enthusiastic'],
            },
          },
          required: ['name'],
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
      case 'echo': {
        return {
          content: [
            {
              type: 'text',
              text: args.message,
            },
          ],
        };
      }

      case 'random_number': {
        const min = args?.min || 1;
        const max = args?.max || 100;
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

        return {
          content: [
            {
              type: 'text',
              text: `Random number between ${min} and ${max}: ${randomNum}`,
            },
          ],
        };
      }

      case 'greet': {
        const name = args.name;
        const style = args?.style || 'casual';

        let greeting;
        switch (style) {
          case 'formal':
            greeting = `Good day, ${name}. It is a pleasure to make your acquaintance.`;
            break;
          case 'enthusiastic':
            greeting = `Hey ${name}! So awesome to meet you! This is going to be great!`;
            break;
          case 'casual':
          default:
            greeting = `Hi ${name}! Nice to meet you.`;
            break;
        }

        return {
          content: [
            {
              type: 'text',
              text: greeting,
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
  console.error('Demo Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
