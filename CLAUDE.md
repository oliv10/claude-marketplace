# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a community marketplace for Claude Code extensions (plugins and skills). It serves as a centralized registry where users can discover and share extensions. The repository itself doesn't contain executable code—it's a collection/catalog of extensions that are submitted via pull requests.

## Development Workflow

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

- **`plugins/`** - Contains Claude Code plugins (MCP servers, tool integrations, etc.)
- **`skills/`** - Contains Claude Code skills (specialized agent prompts with triggers)
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

### Marketplace Manifest

The `.claude-plugin/marketplace.json` defines:
- `directories` - Maps extension types to their filesystem locations
- `marketplace.type` - Set to "community" (vs official)
- `marketplace.featured` - Array of featured extension names
- `marketplace.collections` - Grouped extension sets

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
```

## Metadata Conventions

- Version format: semver (1.0.0)
- Names: kebab-case for files/directories, any case for display names
- Categories: Must match those defined in marketplace.json (productivity, development, utilities)
- Each extension is self-contained within its own subdirectory
