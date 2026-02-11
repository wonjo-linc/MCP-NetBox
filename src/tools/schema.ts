import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { NetBoxClient } from '../netbox/client.js';
import { getResourcesByCategory } from '../types/netbox.js';

export function registerSchemaTools(server: McpServer, client: NetBoxClient) {
  server.tool(
    'netbox_schema',
    'Get the field schema for a resource type, or list all available resource types. Use this to discover required fields before creating resources.',
    {
      resource: z
        .string()
        .optional()
        .describe('Resource type name to get schema for. Omit to list all available resource types.'),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async ({ resource }) => {
      if (!resource) {
        const categories = getResourcesByCategory();
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(categories, null, 2),
            },
          ],
        };
      }

      const schema = await client.options(resource);
      const actions = schema.actions as Record<string, unknown> | undefined;
      if (!actions) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(schema, null, 2),
            },
          ],
        };
      }

      const summary: Record<string, unknown> = {};
      if (actions.POST) {
        summary.create_fields = actions.POST;
      }
      if (actions.PUT) {
        summary.update_fields = actions.PUT;
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(summary, null, 2),
          },
        ],
      };
    },
  );
}
