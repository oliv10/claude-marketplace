| Directory | Location | Purpose |
|-----------|----------|---------|
| .claude-plugin/ | Plugin root | Contains plugin.json manifest (optional if components use default locations) |
| commands/ | Plugin root | Skills as Markdown files |
| agents/ | Plugin root | Custom agent definitions |
| skills/ | Plugin root | Agent Skills with SKILL.md files |
| hooks/ | Plugin root | Event handlers in hooks.json |
| .mcp.json | Plugin root | MCP server configurations |
| .lsp.json | Plugin root | LSP server configurations for code intelligence |
| settings.json | Plugin root | Default settings applied when the plugin is enabled |
| mcp-servers/ | Plugin root | Contains MCP servers that the plugin will run when sessions start |