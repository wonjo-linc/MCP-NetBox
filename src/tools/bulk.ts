import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { NetBoxClient } from '../netbox/client.js';

export function registerBulkTools(server: McpServer, client: NetBoxClient) {
  server.tool(
    'netbox_bulk_create',
    'Create multiple resources at once in NetBox.',
    {
      resource: z.string().describe('Resource type name (e.g., "devices", "ip-addresses")'),
      items: z
        .array(z.record(z.unknown()))
        .describe('Array of resource data objects to create'),
    },
    async ({ resource, items }) => {
      const result = await client.bulkCreate(resource, items);
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
    'netbox_bulk_update',
    'Update multiple resources at once in NetBox. Each item must include an "id" field.',
    {
      resource: z.string().describe('Resource type name (e.g., "devices", "ip-addresses")'),
      items: z
        .array(
          z.object({ id: z.number() }).passthrough(),
        )
        .describe('Array of objects with "id" and fields to update'),
    },
    async ({ resource, items }) => {
      const result = await client.bulkUpdate(
        resource,
        items as Array<{ id: number } & Record<string, unknown>>,
      );
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
    'netbox_bulk_delete',
    'Delete multiple resources at once from NetBox.',
    {
      resource: z.string().describe('Resource type name (e.g., "devices", "ip-addresses")'),
      ids: z.array(z.number()).describe('Array of resource IDs to delete'),
    },
    async ({ resource, ids }) => {
      await client.bulkDelete(resource, ids);
      return {
        content: [
          {
            type: 'text' as const,
            text: `Successfully deleted ${ids.length} ${resource} items`,
          },
        ],
      };
    },
  );
}
