import axios, { AxiosInstance } from 'axios';
import { PaginatedResponse, resolveResource } from '../types/netbox.js';

export class NetBoxClient {
  private api: AxiosInstance;

  constructor(baseUrl: string, apiToken: string) {
    this.api = axios.create({
      baseURL: `${baseUrl}/api`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${apiToken}`,
      },
    });
  }

  private getPath(resource: string): string {
    const path = resolveResource(resource);
    if (!path) {
      throw new Error(
        `Unknown resource type: "${resource}". Use netbox_schema tool to list available resources.`,
      );
    }
    return `/${path}/`;
  }

  async list(
    resource: string,
    params?: Record<string, unknown>,
  ): Promise<PaginatedResponse> {
    const response = await this.api.get<PaginatedResponse>(this.getPath(resource), { params });
    return response.data;
  }

  async get(resource: string, id: number): Promise<Record<string, unknown>> {
    const response = await this.api.get(`${this.getPath(resource)}${id}/`);
    return response.data;
  }

  async create(
    resource: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const response = await this.api.post(this.getPath(resource), data);
    return response.data;
  }

  async update(
    resource: string,
    id: number,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const response = await this.api.patch(`${this.getPath(resource)}${id}/`, data);
    return response.data;
  }

  async delete(resource: string, id: number): Promise<void> {
    await this.api.delete(`${this.getPath(resource)}${id}/`);
  }

  async search(
    resource: string,
    query: string,
    filters?: Record<string, unknown>,
  ): Promise<PaginatedResponse> {
    const params = { q: query, ...filters };
    const response = await this.api.get<PaginatedResponse>(this.getPath(resource), { params });
    return response.data;
  }

  async getAvailableIps(prefixId: number, limit?: number): Promise<Record<string, unknown>[]> {
    const params = limit ? { limit } : {};
    const response = await this.api.get(`/ipam/prefixes/${prefixId}/available-ips/`, { params });
    return response.data;
  }

  async createAvailableIps(
    prefixId: number,
    data: Record<string, unknown>[],
  ): Promise<Record<string, unknown>[]> {
    const response = await this.api.post(`/ipam/prefixes/${prefixId}/available-ips/`, data);
    return Array.isArray(response.data) ? response.data : [response.data];
  }

  async getAvailablePrefixes(prefixId: number): Promise<Record<string, unknown>[]> {
    const response = await this.api.get(`/ipam/prefixes/${prefixId}/available-prefixes/`);
    return response.data;
  }

  async createAvailablePrefix(
    prefixId: number,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const response = await this.api.post(`/ipam/prefixes/${prefixId}/available-prefixes/`, data);
    return response.data;
  }

  async getAvailableVlans(groupId: number): Promise<Record<string, unknown>[]> {
    const response = await this.api.get(`/ipam/vlan-groups/${groupId}/available-vlans/`);
    return response.data;
  }

  async createAvailableVlan(
    groupId: number,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const response = await this.api.post(
      `/ipam/vlan-groups/${groupId}/available-vlans/`,
      data || {},
    );
    return response.data;
  }

  async getAvailableAsns(rangeId: number): Promise<Record<string, unknown>[]> {
    const response = await this.api.get(`/ipam/asn-ranges/${rangeId}/available-asns/`);
    return response.data;
  }

  async createAvailableAsn(
    rangeId: number,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const response = await this.api.post(
      `/ipam/asn-ranges/${rangeId}/available-asns/`,
      data || {},
    );
    return response.data;
  }

  async options(resource: string): Promise<Record<string, unknown>> {
    const response = await this.api.request({
      method: 'OPTIONS',
      url: this.getPath(resource),
    });
    return response.data;
  }

  async bulkCreate(
    resource: string,
    items: Record<string, unknown>[],
  ): Promise<Record<string, unknown>[]> {
    const response = await this.api.post(this.getPath(resource), items);
    return Array.isArray(response.data) ? response.data : [response.data];
  }

  async bulkUpdate(
    resource: string,
    items: Array<{ id: number } & Record<string, unknown>>,
  ): Promise<Record<string, unknown>[]> {
    const response = await this.api.patch(this.getPath(resource), items);
    return Array.isArray(response.data) ? response.data : [response.data];
  }

  async bulkDelete(resource: string, ids: number[]): Promise<void> {
    await this.api.delete(this.getPath(resource), {
      data: ids.map((id) => ({ id })),
    });
  }
}
