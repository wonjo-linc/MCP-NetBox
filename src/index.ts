import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { NetBoxClient } from './netbox/client.js';
import { registerCrudTools } from './tools/crud.js';
import { registerSearchTools } from './tools/search.js';
import { registerAvailabilityTools } from './tools/availability.js';
import { registerSchemaTools } from './tools/schema.js';
import { registerBulkTools } from './tools/bulk.js';

const NETBOX_URL = process.env.NETBOX_URL;
const NETBOX_API_TOKEN = process.env.NETBOX_API_TOKEN;

if (!NETBOX_URL || !NETBOX_API_TOKEN) {
  console.error('Missing required environment variables: NETBOX_URL, NETBOX_API_TOKEN');
  process.exit(1);
}

const client = new NetBoxClient(NETBOX_URL, NETBOX_API_TOKEN);
const server = new McpServer({ name: 'mcp-netbox', version: '1.0.0' });

registerCrudTools(server, client);
registerSearchTools(server, client);
registerAvailabilityTools(server, client);
registerSchemaTools(server, client);
registerBulkTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
