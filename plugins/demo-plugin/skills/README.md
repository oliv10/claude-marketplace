# Creating Skills

Skills are custom commands that users can invoke in Claude Code with `/skill-name`. They provide Claude with specialized instructions for specific tasks.

## Skill Structure

Each skill must be in its own directory with a `SKILL.md` file:

```
skills/
└── your-skill-name/
    └── SKILL.md
```

## SKILL.md Format

Skills use YAML frontmatter followed by instructions:

```markdown
---
name: your-skill-name
description: What this skill does. Include trigger keywords that match user intent.
---

Instructions for Claude when this skill is invoked.

Be specific about:
- What to analyze or process
- How to format the output
- What to check for
- Any specific patterns to follow
```

### Frontmatter Fields

- **name** (required): Skill identifier, should match directory name (kebab-case)
- **description** (required): Clear description including when to use this skill. Include keywords that match user intent.

### Instruction Content

The content after the frontmatter tells Claude how to execute the skill. Be clear and specific:

**Good example:**
```markdown
When reviewing code, check for:
1. Code organization and structure
2. Error handling and edge cases
3. Security vulnerabilities (XSS, SQL injection, etc.)
4. Test coverage
5. Documentation quality

Provide specific line numbers and actionable recommendations.
```

**Bad example:**
```markdown
Review the code and make it better.
```

## Real Example: Code Review Skill

See [code-review/SKILL.md](./code-review/SKILL.md) for a working implementation.

This skill:
- **Name**: `code-review`
- **Invoked by**: User typing `/code-review` in Claude Code
- **Description**: Mentions "reviews", "best practices", "code quality" - keywords that help Claude know when to suggest this skill
- **Instructions**: Specific checklist of what to review

## Usage

Once your plugin is installed, users can:
```bash
# Invoke directly
/your-skill-name

# Claude may also suggest the skill when relevant
"Can you review this code?" → Claude might suggest /code-review
```

## Tips for Great Skills

### 1. Clear Trigger Keywords
Include terms users might say in your description:
- ✅ "Reviews code for best practices and potential issues"
- ❌ "A code checking tool"

### 2. Specific Instructions
Tell Claude exactly what to do:
- ✅ "Check for SQL injection in database queries"
- ❌ "Look for security issues"

### 3. Output Format
Specify how results should be presented:
- ✅ "Provide a bulleted list with file:line references"
- ❌ "Show the results"

### 4. Scope Definition
Define what's in and out of scope:
- ✅ "Focus on security vulnerabilities, not style issues"
- ❌ "Review everything"

### 5. Examples in Instructions
Include examples of what to look for:
```markdown
Check for SQL injection vulnerabilities:
- Direct string concatenation in queries
- Unparameterized database calls
- User input used directly in WHERE clauses
```

## Testing Your Skill

```bash
# Install your plugin
cp -r plugins/your-plugin ~/.claude/plugins/

# Enable in ~/.claude/settings.json
{
  "plugins": ["your-plugin"]
}

# Restart Claude Code and test
/your-skill-name
```

## Common Use Cases

Skills work great for:
- **Code analysis** (review, security audit, performance)
- **Documentation generation** (README, API docs, comments)
- **Testing** (test generation, coverage analysis)
- **Refactoring** (rename, restructure, optimize)
- **Project setup** (boilerplate, configuration)
- **Data processing** (CSV parsing, JSON transformation)

## Multiple Skills in One Plugin

You can bundle multiple related skills:

```
skills/
├── code-review/
│   └── SKILL.md
├── security-audit/
│   └── SKILL.md
└── performance-check/
    └── SKILL.md
```

Each appears as a separate command: `/code-review`, `/security-audit`, `/performance-check`

---

**Next Steps**: See [../README.md](../README.md) for complete plugin creation guide.
