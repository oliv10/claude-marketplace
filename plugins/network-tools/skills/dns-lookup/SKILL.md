---
name: dns-lookup
description: Perform DNS lookups to resolve domain names to IP addresses and query DNS records
trigger: Use this skill when the user asks to lookup DNS records, resolve a domain name, find IP addresses, or query DNS information (e.g., "lookup example.com", "what's the IP of google.com", "DNS records for github.com")
version: 1.0.0
author: Community Marketplace
license: MIT
category: utilities
---

# DNS Lookup Skill

Performs DNS lookups to resolve domain names and retrieve various DNS record types.

## Usage

Ask to lookup DNS information for a domain:

**Examples:**
- "lookup google.com"
- "what's the IP address of github.com"
- "DNS records for example.com"
- "resolve cloudflare.com"
- "show me the nameservers for anthropic.com"

## Behavior

When triggered:

1. Extract the domain name from the user's request
2. Use the Bash tool to run DNS lookup commands:
   - Basic lookup: `dig +short <domain>` or `nslookup <domain>`
   - For more details: `dig <domain> ANY` (shows multiple record types)
3. Present the information clearly

**Example output format:**
```
DNS Lookup for github.com:

A Records (IPv4):
- 140.82.121.4

AAAA Records (IPv6):
- 2606:50c0:8000::154
- 2606:50c0:8001::154

Name Servers:
- ns1.github.com
- ns2.github.com
```

**Common DNS record types to show:**
- **A** - IPv4 addresses
- **AAAA** - IPv6 addresses
- **CNAME** - Canonical name (alias)
- **MX** - Mail exchange servers
- **NS** - Name servers
- **TXT** - Text records

**Handle errors gracefully:**
- Domain not found: "Domain does not exist or could not be resolved"
- No DNS server: "Could not contact DNS server"
- Invalid domain: "Invalid domain name format"

**Tool choice:**
- Prefer `dig` if available (more detailed, standard on macOS/Linux)
- Fall back to `nslookup` if dig is not available
- Use `host` as another alternative

## License

MIT License - Free to use and modify
