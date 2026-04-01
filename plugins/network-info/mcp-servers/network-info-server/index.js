#!/usr/bin/env node

/**
 * Network Info Server - MCP Implementation
 *
 * Provides network information tools including:
 * - Public IP address lookup
 * - IP geolocation and ISP information
 * - Internet connectivity checking
 *
 * Demonstrates real external API calls that LLMs cannot perform alone.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const https = require('https');

// Helper function to make HTTPS GET requests
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(res.statusCode === 200 ? JSON.parse(data) : data);
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

// Create MCP server instance
const server = new Server(
  {
    name: 'network-info-server',
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
        name: 'get_my_ip',
        description: 'Get your public WAN IP address. This is something the LLM cannot determine on its own - it requires making an external API call to discover your public internet IP address.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_ip_info',
        description: 'Get detailed information about your public IP address including location (city, region, country), ISP, timezone, and coordinates. Requires external API call.',
        inputSchema: {
          type: 'object',
          properties: {
            ip: {
              type: 'string',
              description: 'IP address to look up (optional - defaults to your public IP)',
            },
          },
        },
      },
      {
        name: 'check_internet_connectivity',
        description: 'Verify internet connectivity by attempting to reach a public API endpoint. Returns success/failure with timing information.',
        inputSchema: {
          type: 'object',
          properties: {},
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
      case 'get_my_ip': {
        // Fetch public IP from ipify API
        const ip = await httpsGet('https://api.ipify.org?format=json');

        return {
          content: [
            {
              type: 'text',
              text: `Your public IP address is: ${ip.ip}`,
            },
          ],
        };
      }

      case 'get_ip_info': {
        // Get detailed IP information from ipinfo.io
        const targetIp = args?.ip || '';
        const url = targetIp
          ? `https://ipinfo.io/${targetIp}/json`
          : 'https://ipinfo.io/json';

        const info = await httpsGet(url);

        // Format the response nicely
        const details = [
          `IP Address: ${info.ip}`,
          info.city && info.region ? `Location: ${info.city}, ${info.region}, ${info.country}` : `Country: ${info.country}`,
          info.org ? `ISP/Organization: ${info.org}` : null,
          info.timezone ? `Timezone: ${info.timezone}` : null,
          info.loc ? `Coordinates: ${info.loc}` : null,
        ].filter(Boolean).join('\n');

        return {
          content: [
            {
              type: 'text',
              text: details,
            },
          ],
        };
      }

      case 'check_internet_connectivity': {
        const startTime = Date.now();

        try {
          await httpsGet('https://api.ipify.org?format=json');
          const duration = Date.now() - startTime;

          return {
            content: [
              {
                type: 'text',
                text: `✓ Internet connectivity confirmed\nResponse time: ${duration}ms`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `✗ No internet connectivity\nError: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
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
  console.error('Network Info Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
