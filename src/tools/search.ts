import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { NetBoxClient } from '../netbox/client.js';

export function registerSearchTools(server: McpServer, client: NetBoxClient) {
  server.tool(
    'netbox_search',
    'Search for resources in NetBox using text query. Searches across name, description, and other text fields.',
    {
      resource: z.string().describe('Resource type name (e.g., "devices", "ip-addresses", "sites")'),
      query: z.string().describe('Search text to find in resource names, descriptions, etc.'),
      filters: z
        .record(z.unknown())
        .optional()
        .describe('Additional filter parameters (e.g., {"status": "active"})'),
      limit: z.number().optional().describe('Number of results (default: 50)'),
      offset: z.number().optional().describe('Starting position for pagination'),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ resource, query, filters, limit, offset }) => {
      const mergedFilters: Record<string, unknown> = { ...filters };
      if (limit !== undefined) mergedFilters.limit = limit;
      if (offset !== undefined) mergedFilters.offset = offset;

      const result = await client.search(resource, query, mergedFilters);
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
}
