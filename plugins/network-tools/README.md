# Network Tools Plugin

Network utility skills for ping and DNS lookups.

## What's Included

This plugin provides two practical network diagnostic skills:

### 🏓 Ping Skill
Test network connectivity and measure response times to any host.

**Usage:**
```
ping google.com
check if example.com is up
test connectivity to 8.8.8.8
```

Shows response times, packet loss, and whether the host is reachable.

### 🔍 DNS Lookup Skill
Resolve domain names and query DNS records.

**Usage:**
```
lookup github.com
what's the IP of google.com
DNS records for example.com
show me the nameservers for anthropic.com
```

Displays A, AAAA, CNAME, MX, NS, TXT records and more.

## Installation

### Via Marketplace (Recommended)
```bash
# Add the marketplace
/plugin marketplace add oliv10/claude-marketplace

# Install the plugin
/plugin install network-tools@community-marketplace

# Reload plugins
/reload-plugins
```

### Manual Installation
```bash
# Copy the plugin directory
cp -r plugins/network-tools ~/.claude/plugins/

# Skills will be automatically discovered
```

## Requirements

- macOS, Linux, or WSL on Windows
- Standard network utilities: `ping`, `dig` or `nslookup`

## License

MIT License - Free to use and modify
