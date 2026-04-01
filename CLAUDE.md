# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a community marketplace for Claude Code plugins. It serves as a centralized registry where users can discover and share plugins. The repository itself doesn't contain executable code—it's a collection/catalog of plugins that are submitted via pull requests.

**All extensions (skills, MCP servers, configurations) must be bundled inside plugins for easy, consistent installation.**

### What Plugins Can Include

Plugins are self-contained packages that can bundle:
- **Skills** - Agent prompts with specialized triggers and capabilities
- **MCP Servers** - Model Context Protocol servers that provide tools and resources
- **Configurations** - Settings, prompts, and resource files
- **Documentation** - Usage guides and examples

## Quick Reference

```bash
# Check current branch
git branch --show-current

# Create feature branch
git checkout -b add-[extension-name]

# Commit and push changes
git add <files>
git commit -m "Description"
git push

# Create pull request
gh pr create --title "Title" --body "Description"

# Test plugin locally
cp -r plugins/[name] ~/.claude/plugins/
# Then enable in ~/.claude/settings.json: {"plugins": ["[name]"]}
```

## Development Workflow

### Branch Management

**CRITICAL**: Always work on the appropriate branch for the user's request.

Before starting work:

1. **Check current branch**: Run `git branch --show-current` to see where you are
2. **Determine correct branch** based on the work type:
   - **New plugins**: Create a feature branch named `add-[plugin-name]`
   - **Plugin updates**: Create a branch named `update-[plugin-name]`
   - **Repository maintenance** (README, marketplace.json, CLAUDE.md updates): Use `main` or ask user
   - **Bug fixes**: Create a branch named `fix-[issue-description]`
3. **Create branch if needed**:
   ```bash
   git checkout -b [branch-name]
   git push -u origin [branch-name]
   ```
4. **If uncertain**: Ask the user which branch to work on before making changes

**Never assume you're on the right branch.** Always verify before committing.

### Branch Cleanup

After PRs are merged and remote branches are deleted, clean up stale local branches:

```bash
# Fetch and prune deleted remote branches
git fetch --prune

# List local branches that no longer exist on remote
git branch -vv | grep ': gone]'

# Delete local branches that were deleted from remote
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs -r git branch -D
```

Run this periodically to keep your local repository clean.

### Pull Request Workflow

**Note**: The main branch is protected and requires pull requests for all changes.

After committing to your feature branch, create a PR:

```bash
gh pr create --title "Brief description of changes" --body "$(cat <<'EOF'
## Summary
- Bullet point summary of changes

## Changes
- Detailed list of what was modified/added

Co-Authored-By: [Current Claude Model] <noreply@anthropic.com>
EOF
)"
```

This will create a PR and return the URL for review.

### Commit and Push

**IMPORTANT**: After every code change, commit and push to the current branch:

```bash
git add <changed-files>
git commit -m "Descriptive commit message

Co-Authored-By: [Current Claude Model] <noreply@anthropic.com>"
git push
```

Replace `[Current Claude Model]` with the specific model you are running as (e.g., "Claude Sonnet 4.5", "Claude Opus 4.6", etc.).

This ensures all changes are immediately persisted and visible to collaborators.

## Architecture

### Directory Structure

- **`plugins/`** - Contains all Claude Code plugins
  - Each plugin is self-contained with its own subdirectory
  - Plugins can bundle skills, MCP servers, configurations, and resources
- **`.claude-plugin/marketplace.json`** - Marketplace manifest defining metadata, categories, and configuration
- **`.github/README.md`** - User-facing documentation

### Plugin Structure

Each plugin should follow this structure:

```
plugins/plugin-name/
├── plugin.json          # Required: manifest
├── README.md            # Required: documentation
├── LICENSE              # Required: license file
├── skills/              # Optional: bundled skills
│   └── skill-name/
│       └── SKILL.md
├── mcp-servers/         # Optional: bundled MCP servers
│   └── server-name/
│       └── index.js
└── resources/           # Optional: additional resources
```

### Plugin Requirements

**All plugins must include:**

1. **`plugin.json` manifest** with:
   - `name` (kebab-case, unique)
   - `version` (semver: 1.0.0) - **MUST be incremented for any changes**
   - `description`
   - `author` (object with name and email)
   - `license` (e.g., MIT, Apache-2.0)
   - Optional: `category` (productivity, development, utilities, networking)
   - Optional: `keywords` (array for discoverability)
   - Optional: `mcpServers` (object defining bundled MCP servers)

**CRITICAL: Version Numbering**

Claude Code only updates plugins when the version number changes. Follow semantic versioning:
- **Patch (1.0.0 → 1.0.1)**: Bug fixes, documentation updates, minor improvements
- **Minor (1.0.0 → 1.1.0)**: New features, backwards-compatible changes
- **Major (1.0.0 → 2.0.0)**: Breaking changes

**When making ANY change to a plugin:**
1. Increment the version in `plugins/[plugin-name]/plugin.json`
2. Update the version in `.claude-plugin/marketplace.json` 
3. Both must match or the update won't work

Without a version bump, users who already installed the plugin won't get your fixes!

2. **`README.md`** with:
   - What the plugin does
   - Installation instructions
   - Usage examples
   - List of included skills/MCP servers/resources
   - Dependencies and prerequisites

3. **`LICENSE` file**: Clear license specification

**Bundled Skills:**
- Located in `skills/` subdirectory
- Each skill has YAML frontmatter with: name, description, trigger conditions
- Usage documentation included

**Bundled MCP Servers:**
- Located in `mcp-servers/` subdirectory
- Configured in plugin.json's `mcpServers` field
- Automatically configured when plugin is enabled
- **IMPORTANT**: If your MCP server has npm dependencies, you MUST add a SessionStart hook to auto-install them

**SessionStart Hook for MCP Servers with Dependencies:**

If your MCP server requires npm packages, add this hook to plugin.json:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "test -d \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/[server-name]/node_modules\" || (cd \"${CLAUDE_PLUGIN_ROOT}/mcp-servers/[server-name]\" && npm install --silent)"
          }
        ]
      }
    ]
  }
}
```

Replace `[server-name]` with your MCP server directory name. This ensures dependencies are automatically installed when users first start Claude Code after installing your plugin.

### Marketplace Manifest

The `.claude-plugin/marketplace.json` defines:
- `directories.plugins` - Path to plugins directory (./plugins)
- `marketplace.type` - Set to "community" (vs official)
- `marketplace.featured` - Array of featured plugin names
- `marketplace.collections` - Grouped plugin sets
- `marketplace.categories` - Valid categories (productivity, development, utilities, networking)
- `plugins` - Array of plugin metadata entries

## Validation Commands

### Validating Plugin Structure

Before submitting or reviewing plugins, validate their structure:

```bash
# Check required files
test -f plugins/[plugin-name]/plugin.json && echo "✓ plugin.json exists" || echo "✗ Missing plugin.json"
test -f plugins/[plugin-name]/README.md && echo "✓ README.md exists" || echo "✗ Missing README.md"
test -f plugins/[plugin-name]/LICENSE && echo "✓ LICENSE exists" || echo "✗ Missing LICENSE"

# Validate JSON syntax
jq empty plugins/[plugin-name]/plugin.json && echo "✓ Valid JSON" || echo "✗ Invalid JSON"

# Check required fields in plugin.json
jq -r '.name, .version, .description, .author, .license' plugins/[plugin-name]/plugin.json

# Check for bundled skills (if present)
if [ -d plugins/[plugin-name]/skills ]; then
  echo "✓ Plugin includes skills"
  ls -la plugins/[plugin-name]/skills/
fi

# Check for bundled MCP servers (if present)
if [ -d plugins/[plugin-name]/mcp-servers ]; then
  echo "✓ Plugin includes MCP servers"
  jq '.mcpServers' plugins/[plugin-name]/plugin.json
fi
```

### Validating Categories

Plugins must use categories defined in marketplace.json. Valid categories:
- productivity
- development
- utilities
- networking

## Working with Submissions

### Reviewing Pull Requests

When reviewing plugin submissions:

1. **Validate structure**: Check for required files (plugin.json, README.md, LICENSE)
2. **Check metadata completeness**: Name, version, description, author, license must be present in plugin.json
3. **Verify documentation**: README.md must have clear installation steps and usage examples
4. **Check bundled content**: If plugin includes skills or MCP servers, ensure they're properly structured
5. **Test locally**: Copy to `~/.claude/plugins/`, enable in `settings.json`, test functionality
6. **License verification**: Each plugin must specify its license (can differ from marketplace's MIT)

### Adding Plugins to Collections

To feature or group plugins, update `.claude-plugin/marketplace.json`:

```json
{
  "marketplace": {
    "featured": ["plugin-name"],
    "collections": [
      {
        "name": "collection-name",
        "description": "Description of this collection",
        "items": ["plugin1", "plugin2"]
      }
    ]
  }
}
```

### Local Testing Workflow

To test a submitted plugin before merging:

```bash
# Copy plugin to your local Claude directory
cp -r plugins/new-plugin ~/.claude/plugins/

# Enable the plugin in ~/.claude/settings.json
# Add "new-plugin" to the plugins array:
{
  "plugins": ["new-plugin"]
}

# Restart Claude Code to load the plugin

# Test all functionality:
# - If it includes skills, verify they trigger correctly
# - If it includes MCP servers, verify they're configured automatically
# - Check all documented features work as expected
```

## Metadata Conventions

- **Version format**: semver (1.0.0)
- **Plugin names**: kebab-case for directories (e.g., `network-tools`), any case for display names in plugin.json
- **Categories**: Must match those defined in marketplace.json (productivity, development, utilities, networking)
- **Self-contained**: Each plugin is fully self-contained within its own subdirectory
- **Bundled MCP servers**: Should follow the Model Context Protocol specification
- **Bundled skills**: Should have YAML frontmatter with name, description, and trigger conditions
- **License**: Each plugin must have a LICENSE file (can differ from marketplace's MIT)
