import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { NetBoxClient } from '../netbox/client.js';

export function registerAvailabilityTools(server: McpServer, client: NetBoxClient) {
  server.tool(
    'netbox_available_ips',
    'Get or allocate available IP addresses from a prefix. Use action "list" to see available IPs, or "create" to allocate new ones.',
    {
      prefix_id: z.number().describe('Prefix ID to get available IPs from'),
      action: z.enum(['list', 'create']).describe('"list" to view available IPs, "create" to allocate'),
      count: z.number().optional().describe('Number of IPs to list or allocate (default: 1)'),
      data: z
        .array(z.record(z.unknown()))
        .optional()
        .describe('For "create": array of IP allocation data (e.g., [{"description": "Server 1"}])'),
    },
    async ({ prefix_id, action, count, data }) => {
      if (action === 'list') {
        const result = await client.getAvailableIps(prefix_id, count);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      const allocations = data || Array.from({ length: count || 1 }, () => ({}));
      const result = await client.createAvailableIps(prefix_id, allocations);
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
    'netbox_available_prefixes',
    'Get or allocate available child prefixes from a parent prefix.',
    {
      prefix_id: z.number().describe('Parent prefix ID'),
      action: z.enum(['list', 'create']).describe('"list" to view available prefixes, "create" to allocate'),
      prefix_length: z
        .number()
        .optional()
        .describe('For "create": the prefix length to allocate (e.g., 24 for /24)'),
      data: z
        .record(z.unknown())
        .optional()
        .describe('For "create": additional data (e.g., {"description": "New subnet"})'),
    },
    async ({ prefix_id, action, prefix_length, data }) => {
      if (action === 'list') {
        const result = await client.getAvailablePrefixes(prefix_id);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      const createData = { prefix_length, ...data };
      const result = await client.createAvailablePrefix(prefix_id, createData);
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
    'netbox_available_vlans',
    'Get or allocate available VLANs from a VLAN group.',
    {
      group_id: z.number().describe('VLAN group ID'),
      action: z.enum(['list', 'create']).describe('"list" to view available VLANs, "create" to allocate'),
      data: z
        .record(z.unknown())
        .optional()
        .describe('For "create": VLAN data (e.g., {"name": "New VLAN"})'),
    },
    async ({ group_id, action, data }) => {
      if (action === 'list') {
        const result = await client.getAvailableVlans(group_id);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      const result = await client.createAvailableVlan(group_id, data);
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
    'netbox_available_asns',
    'Get or allocate available ASNs from an ASN range.',
    {
      range_id: z.number().describe('ASN range ID'),
      action: z.enum(['list', 'create']).describe('"list" to view available ASNs, "create" to allocate'),
      data: z
        .record(z.unknown())
        .optional()
        .describe('For "create": ASN data (e.g., {"description": "New ASN"})'),
    },
    async ({ range_id, action, data }) => {
      if (action === 'list') {
        const result = await client.getAvailableAsns(range_id);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      const result = await client.createAvailableAsn(range_id, data);
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
