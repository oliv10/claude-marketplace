# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a community marketplace for Claude Code extensions (plugins, skills, and MCP servers). It serves as a centralized registry where users can discover and share extensions. The repository itself doesn't contain executable code—it's a collection/catalog of extensions that are submitted via pull requests.

### Extension Types

- **Plugins** - Claude Code plugins that can bundle skills, configurations, and resources
- **Skills** - Standalone agent prompts with specialized triggers and capabilities  
- **MCP Servers** - Model Context Protocol servers that provide tools and resources to Claude

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

# Test extensions locally
cp -r plugins/[name] ~/.claude/plugins/
cp skills/[name].md ~/.claude/skills/
cp -r mcp-servers/[name] ~/.claude/mcp-servers/
```

## Development Workflow

### Branch Management

**CRITICAL**: Always work on the appropriate branch for the user's request.

Before starting work:

1. **Check current branch**: Run `git branch --show-current` to see where you are
2. **Determine correct branch** based on the work type:
   - **New extensions (plugins/skills/mcp-servers)**: Create a feature branch named `add-[extension-name]`
   - **Extension updates**: Create a branch named `update-[extension-name]`
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

- **`plugins/`** - Contains Claude Code plugins (can bundle skills and configurations)
- **`skills/`** - Contains standalone Claude Code skills (specialized agent prompts with triggers)
- **`mcp-servers/`** - Contains Model Context Protocol servers (tools and resources for Claude)
- **`.claude-plugin/marketplace.json`** - Marketplace manifest defining metadata, categories, and configuration
- **`.github/README.md`** - User-facing documentation

### Extension Requirements

**Plugins** must include:
- `plugin.json` manifest with: name, version, description, author
- Clear documentation with installation and usage instructions
- License specification

**Skills** must include:
- Proper YAML frontmatter with: name, description, trigger conditions
- Usage documentation
- License specification

**MCP Servers** must include:
- Manifest file (package.json or server config) with: name, version, description
- Documentation of provided tools/resources and protocol version
- Setup instructions and dependencies
- License specification

### Marketplace Manifest

The `.claude-plugin/marketplace.json` defines:
- `directories` - Maps extension types to their filesystem locations (plugins, skills, mcp-servers)
- `marketplace.type` - Set to "community" (vs official)
- `marketplace.featured` - Array of featured extension names
- `marketplace.collections` - Grouped extension sets
- `marketplace.categories` - Valid categories for extensions (productivity, development, utilities, networking)

## Validation Commands

### Validating Extension Structure

Before submitting or reviewing extensions, validate their structure:

```bash
# Check if plugin has required plugin.json
test -f plugins/[plugin-name]/plugin.json && echo "✓ plugin.json exists" || echo "✗ Missing plugin.json"

# Validate JSON syntax
jq empty plugins/[plugin-name]/plugin.json && echo "✓ Valid JSON" || echo "✗ Invalid JSON"

# Check required fields in plugin.json
jq -r '.name, .version, .description, .author, .license' plugins/[plugin-name]/plugin.json

# For skills, check YAML frontmatter
head -20 skills/[skill-name].md | grep -E "^(name|description):"

# For MCP servers, check manifest
test -f mcp-servers/[server-name]/package.json && echo "✓ package.json exists" || echo "✗ Missing package.json"
jq -r '.name, .version, .description' mcp-servers/[server-name]/package.json
```

### Validating Categories

Extensions must use categories defined in marketplace.json. Valid categories:
- productivity
- development
- utilities
- networking

## Working with Submissions

### Reviewing Pull Requests

When reviewing extension submissions:

1. **Validate structure**: Check for required manifest files (plugin.json or skill frontmatter)
2. **Check metadata completeness**: Name, version, description, author, license must be present
3. **Verify documentation**: Installation steps and usage examples must be clear
4. **Test locally**: Copy to `.claude/` directory, enable in `settings.json`, test functionality
5. **License verification**: Each extension must specify its license (can differ from marketplace's MIT)

### Adding Extensions to Collections

To feature or group extensions, update `.claude-plugin/marketplace.json`:

```json
{
  "marketplace": {
    "featured": ["extension-name"],
    "collections": [
      {
        "name": "collection-name",
        "items": ["ext1", "ext2"]
      }
    ]
  }
}
```

### Local Testing Workflow

To test a submitted extension before merging:

```bash
# For plugins
cp -r plugins/new-plugin ~/.claude/plugins/
# Edit ~/.claude/settings.json to enable the plugin

# For skills  
cp skills/new-skill.md ~/.claude/skills/
# Skills are auto-discovered, no settings change needed

# For MCP servers
cp -r mcp-servers/new-server ~/.claude/mcp-servers/
# Edit ~/.claude/settings.json to configure the MCP server
```

## Metadata Conventions

- Version format: semver (1.0.0)
- Names: kebab-case for files/directories, any case for display names
- Categories: Must match those defined in marketplace.json (productivity, development, utilities, networking)
- Each extension is self-contained within its own subdirectory
- MCP servers should follow the Model Context Protocol specification
