export interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Record<string, unknown>[];
}

export interface ResourceCategory {
  label: string;
  resources: Record<string, string>;
}

export const RESOURCE_REGISTRY: Record<string, ResourceCategory> = {
  dcim: {
    label: 'DCIM (Data Center Infrastructure)',
    resources: {
      sites: 'dcim/sites',
      regions: 'dcim/regions',
      'site-groups': 'dcim/site-groups',
      locations: 'dcim/locations',
      racks: 'dcim/racks',
      'rack-reservations': 'dcim/rack-reservations',
      'rack-roles': 'dcim/rack-roles',
      devices: 'dcim/devices',
      'device-types': 'dcim/device-types',
      'device-roles': 'dcim/device-roles',
      manufacturers: 'dcim/manufacturers',
      platforms: 'dcim/platforms',
      modules: 'dcim/modules',
      'module-types': 'dcim/module-types',
      'module-bays': 'dcim/module-bays',
      interfaces: 'dcim/interfaces',
      'console-ports': 'dcim/console-ports',
      'console-server-ports': 'dcim/console-server-ports',
      'power-ports': 'dcim/power-ports',
      'power-outlets': 'dcim/power-outlets',
      'power-panels': 'dcim/power-panels',
      'power-feeds': 'dcim/power-feeds',
      'front-ports': 'dcim/front-ports',
      'rear-ports': 'dcim/rear-ports',
      'device-bays': 'dcim/device-bays',
      'inventory-items': 'dcim/inventory-items',
      'inventory-item-roles': 'dcim/inventory-item-roles',
      cables: 'dcim/cables',
      'connected-device': 'dcim/connected-device',
      'virtual-chassis': 'dcim/virtual-chassis',
      'virtual-device-contexts': 'dcim/virtual-device-contexts',
    },
  },
  ipam: {
    label: 'IPAM (IP Address Management)',
    resources: {
      'ip-addresses': 'ipam/ip-addresses',
      prefixes: 'ipam/prefixes',
      'ip-ranges': 'ipam/ip-ranges',
      aggregates: 'ipam/aggregates',
      rirs: 'ipam/rirs',
      vrfs: 'ipam/vrfs',
      'route-targets': 'ipam/route-targets',
      vlans: 'ipam/vlans',
      'vlan-groups': 'ipam/vlan-groups',
      roles: 'ipam/roles',
      'fhrp-groups': 'ipam/fhrp-groups',
      'fhrp-group-assignments': 'ipam/fhrp-group-assignments',
      'service-templates': 'ipam/service-templates',
      services: 'ipam/services',
      asns: 'ipam/asns',
      'asn-ranges': 'ipam/asn-ranges',
    },
  },
  circuits: {
    label: 'Circuits',
    resources: {
      circuits: 'circuits/circuits',
      'circuit-types': 'circuits/circuit-types',
      'circuit-terminations': 'circuits/circuit-terminations',
      providers: 'circuits/providers',
      'provider-accounts': 'circuits/provider-accounts',
      'provider-networks': 'circuits/provider-networks',
    },
  },
  virtualization: {
    label: 'Virtualization',
    resources: {
      'virtual-machines': 'virtualization/virtual-machines',
      'vm-interfaces': 'virtualization/interfaces',
      clusters: 'virtualization/clusters',
      'cluster-types': 'virtualization/cluster-types',
      'cluster-groups': 'virtualization/cluster-groups',
    },
  },
  tenancy: {
    label: 'Tenancy',
    resources: {
      tenants: 'tenancy/tenants',
      'tenant-groups': 'tenancy/tenant-groups',
      contacts: 'tenancy/contacts',
      'contact-groups': 'tenancy/contact-groups',
      'contact-roles': 'tenancy/contact-roles',
      'contact-assignments': 'tenancy/contact-assignments',
    },
  },
  wireless: {
    label: 'Wireless',
    resources: {
      'wireless-lans': 'wireless/wireless-lans',
      'wireless-lan-groups': 'wireless/wireless-lan-groups',
      'wireless-links': 'wireless/wireless-links',
    },
  },
  vpn: {
    label: 'VPN',
    resources: {
      tunnels: 'vpn/tunnels',
      'tunnel-terminations': 'vpn/tunnel-terminations',
      'tunnel-groups': 'vpn/tunnel-groups',
      'ike-policies': 'vpn/ike-policies',
      'ike-proposals': 'vpn/ike-proposals',
      'ipsec-policies': 'vpn/ipsec-policies',
      'ipsec-proposals': 'vpn/ipsec-proposals',
      'ipsec-profiles': 'vpn/ipsec-profiles',
      l2vpns: 'vpn/l2vpns',
      'l2vpn-terminations': 'vpn/l2vpn-terminations',
    },
  },
  extras: {
    label: 'Extras',
    resources: {
      tags: 'extras/tags',
      'custom-fields': 'extras/custom-fields',
      'custom-field-choice-sets': 'extras/custom-field-choice-sets',
      'custom-links': 'extras/custom-links',
      'export-templates': 'extras/export-templates',
      'saved-filters': 'extras/saved-filters',
      bookmarks: 'extras/bookmarks',
      webhooks: 'extras/webhooks',
      'event-rules': 'extras/event-rules',
      'journal-entries': 'extras/journal-entries',
      'config-contexts': 'extras/config-contexts',
      'config-templates': 'extras/config-templates',
      'image-attachments': 'extras/image-attachments',
      scripts: 'extras/scripts',
      reports: 'extras/reports',
    },
  },
  users: {
    label: 'Users',
    resources: {
      users: 'users/users',
      groups: 'users/groups',
      tokens: 'users/tokens',
      permissions: 'users/permissions',
      'object-permissions': 'users/object-permissions',
    },
  },
  core: {
    label: 'Core',
    resources: {
      'data-sources': 'core/data-sources',
      'data-files': 'core/data-files',
      jobs: 'core/jobs',
    },
  },
};

export function resolveResource(name: string): string | null {
  for (const category of Object.values(RESOURCE_REGISTRY)) {
    if (category.resources[name]) {
      return category.resources[name];
    }
  }
  return null;
}

export function getAllResourceNames(): string[] {
  const names: string[] = [];
  for (const category of Object.values(RESOURCE_REGISTRY)) {
    names.push(...Object.keys(category.resources));
  }
  return names.sort();
}

export function getResourcesByCategory(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const [key, category] of Object.entries(RESOURCE_REGISTRY)) {
    result[`${key} (${category.label})`] = Object.keys(category.resources).sort();
  }
  return result;
}
