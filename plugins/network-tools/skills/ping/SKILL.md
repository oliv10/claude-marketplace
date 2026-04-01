---
name: ping
description: Ping a web address or IP address to check connectivity and response time
trigger: Use this skill when the user asks to ping a host, check connectivity, or test network response to a domain or IP address (e.g., "ping google.com", "check if example.com is up")
version: 1.0.0
author: Community Marketplace
license: MIT
category: utilities
---

# Ping Skill

Tests network connectivity to a host by sending ICMP echo requests and displaying response times.

## Usage

Ask to ping a hostname or IP address:

**Examples:**
- "ping google.com"
- "check if example.com is up"
- "test connectivity to 8.8.8.8"
- "ping 192.168.1.1"

## Behavior

When triggered:

1. Extract the hostname or IP address from the user's request
2. Use the Bash tool to run the ping command:
   - On macOS/Linux: `ping -c 4 <host>` (send 4 packets)
   - Parse and display the results including:
     - Whether the host is reachable
     - Response times (min/avg/max)
     - Packet loss percentage
3. Present results clearly to the user

**Example output format:**
```
Pinging google.com...

✓ Host is reachable
- Packets sent: 4
- Packets received: 4  
- Packet loss: 0%
- Response time: min=15ms, avg=18ms, max=22ms
```

**Handle errors gracefully:**
- Unknown host: "Could not resolve hostname"
- Network unreachable: "No network connection"
- 100% packet loss: "Host is not responding"

## License

MIT License - Free to use and modify
