# MCP-NetBox

NetBox DCIM/IPAM용 MCP (Model Context Protocol) 서버.

14개의 범용 도구로 100+ NetBox 리소스 타입을 지원합니다.

## 도구 목록

| 도구 | 설명 |
|------|------|
| `netbox_list` | 리소스 목록 조회 (페이지네이션, 필터링) |
| `netbox_get` | 단일 리소스 상세 조회 |
| `netbox_create` | 리소스 생성 |
| `netbox_update` | 리소스 수정 (PATCH) |
| `netbox_delete` | 리소스 삭제 |
| `netbox_search` | 텍스트 기반 검색 |
| `netbox_available_ips` | 사용 가능한 IP 조회/할당 |
| `netbox_available_prefixes` | 사용 가능한 서브넷 조회/할당 |
| `netbox_available_vlans` | 사용 가능한 VLAN 조회/할당 |
| `netbox_available_asns` | 사용 가능한 ASN 조회/할당 |
| `netbox_schema` | 리소스 필드 스키마 조회 |
| `netbox_bulk_create` | 일괄 생성 |
| `netbox_bulk_update` | 일괄 수정 |
| `netbox_bulk_delete` | 일괄 삭제 |

## 배포 (Dockge)

1. Dockge에서 `mcp-netbox` 스택 생성
2. 아래 compose 파일 사용:

```yaml
services:
  mcp-netbox:
    image: ghcr.io/wonjo-linc/mcp-netbox:latest
    container_name: mcp-netbox
    restart: unless-stopped
    ports:
      - "3101:3000"
    environment:
      - NETBOX_URL=https://netbox.example.com
      - NETBOX_API_TOKEN=your_token
      - MCP_API_KEY=your_api_key
      - OAUTH_CLIENT_ID=your_client_id
      - OAUTH_CLIENT_SECRET=your_client_secret
      - PORT=3000
```

3. Nginx Proxy Manager에서 `mcp-netbox.lincsolution.net` → `10.16.111.180:3101` 프록시 설정

## Claude Code 연동

`~/.claude.json`의 `mcpServers`에 추가:

```json
{
  "netbox": {
    "type": "http",
    "url": "https://mcp-netbox.lincsolution.net/mcp",
    "headers": {
      "Authorization": "Bearer YOUR_MCP_API_KEY"
    }
  }
}
```

## Claude 웹 연동

Settings > Connectors > Add custom connector:
- Server URL: `https://mcp-netbox.lincsolution.net`
- Client ID / Client Secret: 환경변수에 설정한 값
