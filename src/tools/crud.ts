import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { NetBoxClient } from '../netbox/client.js';
import { getAllResourceNames } from '../types/netbox.js';

export function registerCrudTools(server: McpServer, client: NetBoxClient) {
  const resourceList = getAllResourceNames().join(', ');

  server.tool(
    'netbox_list',
    `List resources from NetBox with pagination and filtering. Available resource types: ${resourceList}`,
    {
      resource: z.string().describe('Resource type name (e.g., "devices", "ip-addresses", "sites")'),
      limit: z.number().optional().describe('Number of results per page (default: 50)'),
      offset: z.number().optional().describe('Starting position for pagination'),
      filters: z
        .record(z.unknown())
        .optional()
        .describe('Filter parameters as key-value pairs (e.g., {"status": "active", "site_id": 1})'),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ resource, limit, offset, filters }) => {
      const params: Record<string, unknown> = { ...filters };
      if (limit !== undefined) params.limit = limit;
      if (offset !== undefined) params.offset = offset;

      const result = await client.list(resource, params);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'netbox_get',
    'Get a single resource by ID from NetBox with full details.',
    {
      resource: z.string().describe('Resource type name (e.g., "devices", "ip-addresses")'),
      id: z.number().describe('Resource ID'),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ resource, id }) => {
      const result = await client.get(resource, id);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'netbox_create',
    'Create a new resource in NetBox. Use netbox_schema to check required fields.',
    {
      resource: z.string().describe('Resource type name (e.g., "devices", "ip-addresses")'),
      data: z.record(z.unknown()).describe('Resource data as key-value pairs'),
    },
    { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
    async ({ resource, data }) => {
      const result = await client.create(resource, data);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'netbox_update',
    'Update an existing resource in NetBox (partial update via PATCH).',
    {
      resource: z.string().describe('Resource type name (e.g., "devices", "ip-addresses")'),
      id: z.number().describe('Resource ID to update'),
      data: z.record(z.unknown()).describe('Fields to update as key-value pairs'),
    },
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    async ({ resource, id, data }) => {
      const result = await client.update(resource, id, data);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    'netbox_delete',
    'Delete a resource from NetBox by ID.',
    {
      resource: z.string().describe('Resource type name (e.g., "devices", "ip-addresses")'),
      id: z.number().describe('Resource ID to delete'),
    },
    { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true },
    async ({ resource, id }) => {
      await client.delete(resource, id);
      return {
        content: [
          {
            type: 'text' as const,
            text: `Successfully deleted ${resource} #${id}`,
          },
        ],
      };
    },
  );
}
