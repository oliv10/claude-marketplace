# Skills

This directory contains standalone Claude Code skills - specialized agent prompts with trigger conditions that enhance Claude's capabilities.

## What are Skills?

Skills are markdown files with YAML frontmatter that define specialized behaviors for Claude. They can be triggered by keywords, patterns, or conditions, allowing Claude to respond with domain-specific knowledge and capabilities.

## Structure

Skills are individual markdown files:

```
skills/
├── skill-name.md
├── another-skill.md
└── README.md (this file)
```

## Requirements

Each skill must include:

1. **YAML Frontmatter** with required fields:
   ```yaml
   ---
   name: skill-name
   description: Brief description of what this skill does
   trigger: |
     When to invoke this skill (keywords, patterns, or conditions)
   version: 1.0.0
   author: Your Name
   license: MIT
   ---
   ```

2. **Skill Content**: The main body contains:
   - Detailed instructions for Claude
   - Examples and use cases
   - Any reference information
   - Usage guidelines

3. **Clear Documentation**:
   - What the skill does
   - When it should be triggered
   - Example interactions
   - Any dependencies or prerequisites

## Example Skill

```markdown
---
name: api-helper
description: Assists with REST API design and troubleshooting
trigger: |
  Use when the user asks about REST APIs, HTTP methods, status codes,
  or API design best practices
version: 1.0.0
author: Community
license: MIT
---

# API Helper Skill

This skill helps users with REST API development.

## Capabilities

- Explain HTTP methods and when to use them
- Help design RESTful endpoints
- Troubleshoot API errors and status codes
- Suggest best practices for API design

## Usage

When users ask about APIs, provide clear explanations with examples...
```

## Installation

To use a skill from this marketplace:

1. Copy the skill file to your Claude skills directory:
   ```bash
   cp skills/skill-name.md ~/.claude/skills/
   ```

2. Skills are automatically discovered - no configuration needed!

3. Restart Claude Code or reload to make the skill available

## Contributing

To contribute a skill:

1. Create a new markdown file with kebab-case naming
2. Include complete YAML frontmatter
3. Write clear, detailed skill content
4. Test the skill thoroughly
5. Submit a pull request

See [CLAUDE.md](../CLAUDE.md) for detailed submission guidelines.

## Examples

Check out these skills for reference:

*No standalone skills available yet - be the first to contribute!*

Note: The [network-tools](../plugins/network-tools/) plugin includes skills for ping and DNS lookups.

## Resources

- [Claude Code Documentation](https://claude.ai/code)
- [Skill Development Guide](https://claude.ai/code/skills)
