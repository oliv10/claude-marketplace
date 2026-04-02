# Creating Agents

Agents are specialized AI assistants optimized for specific tasks. They have their own system prompts and can be invoked by Claude during conversations when their capabilities match the user's needs.

## Agent Structure

Each agent is defined in a single Markdown file:

```
agents/
├── your-agent-name.md
└── another-agent.md
```

## Agent Definition Format

Agents use YAML frontmatter followed by a system prompt:

```markdown
---
name: your-agent-name
description: "When to use this agent with trigger examples.\\n\\nExamples:\\n- User: 'trigger phrase'\\n  Assistant: 'I'll use the Agent tool to launch your-agent-name'"
model: sonnet
---

System prompt for your agent.

Define the agent's:
- Role and purpose
- Capabilities and limitations
- How to approach tasks
- Quality standards
- Output format expectations
```

### Frontmatter Fields

- **name** (required): Agent identifier (kebab-case)
- **description** (required): When and how to use this agent. Include trigger examples to help Claude know when to invoke it.
- **model** (optional): Which model to use (`sonnet`, `opus`, `haiku`). Defaults to `sonnet`.

### System Prompt Content

The system prompt defines how the agent thinks and operates. Be specific and comprehensive.

## Real Example: Demo Plugin Agent

See [demo-plugin-agent.md](./demo-plugin-agent.md) for a complete implementation.

This agent:
- **Purpose**: Demonstrates plugin agent capabilities
- **Triggers**: When users ask about plugin agents or want to test them
- **Model**: Sonnet (balanced capability and speed)
- **Approach**: Educational, provides code examples

## Creating Effective Agents

### 1. Define Clear Purpose

Start your system prompt with a clear role statement:

```markdown
You are a Security Audit Agent for Claude Code plugins. Your purpose is to analyze code for security vulnerabilities and provide actionable remediation steps.
```

### 2. Specify Capabilities

List what the agent can and should do:

```markdown
**Core Capabilities**:

1. **Vulnerability Detection**:
   - Identify SQL injection risks
   - Detect XSS vulnerabilities
   - Find authentication/authorization issues
   
2. **Code Analysis**:
   - Review input validation
   - Check cryptographic implementations
   - Audit dependency versions

3. **Reporting**:
   - Provide severity ratings (Critical/High/Medium/Low)
   - Include specific file:line references
   - Suggest concrete fixes with code examples
```

### 3. Set Operational Guidelines

Define how the agent should work:

```markdown
**Operational Guidelines**:

- Always scan the entire codebase unless directed otherwise
- Prioritize findings by severity and exploitability
- Provide evidence for each finding (code snippet + explanation)
- Include both automated and manual review insights
- Focus on actionable recommendations, not just problem identification
```

### 4. Include Output Format

Specify how results should be structured:

```markdown
**Output Format**:

For each vulnerability:
1. **Severity**: [Critical/High/Medium/Low]
2. **Location**: [file:line]
3. **Issue**: Brief description
4. **Risk**: What could happen if exploited
5. **Fix**: Specific code changes to remediate

Example:
**Severity**: High
**Location**: auth.js:42
**Issue**: SQL injection in user login
**Risk**: Attacker could bypass authentication
**Fix**: Use parameterized queries...
```

### 5. Write Clear Trigger Examples

Help Claude know when to invoke your agent:

```markdown
---
description: "Security audit agent for finding vulnerabilities.\\n\\nExamples:\\n- User: 'Check this code for security issues'\\n  Assistant: 'I'll use the Agent tool to launch security-audit-agent'\\n\\n- User: 'Audit the authentication system'\\n  Assistant: 'I'll use the Agent tool to launch security-audit-agent to analyze authentication security'\\n\\n- User: 'Are there any SQL injection risks?'\\n  Assistant: 'I'll use the Agent tool to launch security-audit-agent to check for SQL injection vulnerabilities'"
---
```

## Agent Design Patterns

### Research Agent
Gathers information and synthesizes findings:
```markdown
---
name: api-documentation-researcher
description: "Research and analyze API documentation..."
model: sonnet
---

You are an API Documentation Research Agent. Your role is to:
1. Explore API endpoints systematically
2. Identify patterns and conventions
3. Map relationships between endpoints
4. Summarize capabilities clearly
```

### Analysis Agent
Deep-dive into specific aspects:
```markdown
---
name: performance-analyzer
description: "Analyze code for performance bottlenecks..."
model: sonnet
---

You are a Performance Analysis Agent. Focus on:
1. Identifying algorithmic complexity issues
2. Finding memory leaks and excessive allocations
3. Detecting inefficient database queries
4. Profiling hot paths in the code
```

### Generation Agent
Creates content based on requirements:
```markdown
---
name: test-generator
description: "Generate comprehensive test suites..."
model: sonnet
---

You are a Test Generation Agent. Generate tests that:
1. Cover happy paths and edge cases
2. Include descriptive test names
3. Follow project testing conventions
4. Achieve high code coverage
```

### Orchestration Agent
Coordinates complex multi-step tasks:
```markdown
---
name: deployment-coordinator
description: "Coordinate deployment tasks..."
model: opus
---

You are a Deployment Coordination Agent. Orchestrate:
1. Pre-deployment checks (tests, linting, builds)
2. Staging deployment and verification
3. Production deployment
4. Post-deployment validation
5. Rollback if issues detected
```

## Testing Your Agent

```bash
# Install plugin
cp -r plugins/your-plugin ~/.claude/plugins/

# Enable in ~/.claude/settings.json
{
  "plugins": ["your-plugin"]
}

# Restart Claude Code

# Trigger the agent
"Use the your-agent-name to [do something]"
```

Claude should recognize the trigger and invoke your agent via the Agent tool.

## Best Practices

### Naming
- Use kebab-case: `security-audit-agent`
- Be descriptive: `api-doc-researcher` not `researcher`
- Consider prefixing with plugin name to avoid conflicts: `myplugin-analyzer`

### Scope
- **Focused agents** > **General-purpose agents**
- One specialized task > Many unrelated tasks
- Clear boundaries prevent confusion

### Model Selection
- **opus**: Complex reasoning, multi-step coordination
- **sonnet**: Most tasks, good balance (default)
- **haiku**: Simple, fast operations

### Documentation
- Explain WHY decisions were made
- Include concrete examples in the prompt
- Reference standards/best practices when relevant

### Error Handling
Include guidance for when things go wrong:
```markdown
**When You Encounter Issues**:

- If files are missing: Ask user to confirm the path
- If requirements are unclear: Request specific examples
- If results are too large: Summarize and offer to provide details
- If the task is outside your scope: Explain limitations and suggest alternatives
```

## Agent vs Skill: When to Use What?

### Use a Skill when:
- User explicitly invokes with `/command`
- Task has well-defined steps
- Instructions are short and simple
- No need for complex reasoning

### Use an Agent when:
- Task requires research or exploration
- Multiple steps with decision points
- Need to synthesize information
- Complex analysis or generation
- Benefit from specialized context

### Example:
- **Skill**: `/code-review` - Quick checklist review
- **Agent**: `deep-code-analyzer` - Comprehensive analysis with architectural insights

## Multiple Agents in One Plugin

You can bundle related agents:

```
agents/
├── security-scanner.md
├── security-fixer.md
└── security-reporter.md
```

Design them to work together:
1. Scanner finds issues
2. Fixer suggests remediation
3. Reporter creates summary

## Common Agent Types

### Code Analysis
- Security auditor
- Performance profiler
- Code quality checker
- Dependency analyzer

### Documentation
- API doc generator
- README writer
- Code commenter
- Tutorial creator

### Testing
- Test generator
- Coverage analyzer
- E2E test coordinator
- Test fixer

### DevOps
- CI/CD coordinator
- Deployment orchestrator
- Log analyzer
- Incident responder

### Project Management
- Task planner
- Sprint organizer
- PR reviewer
- Issue triager

## Resources

- **[MCP Documentation](https://modelcontextprotocol.io)** - If agents need tools, add MCP servers
- **[Demo Agent](./demo-plugin-agent.md)** - Complete reference implementation
- **[Parent README](../README.md)** - Full plugin creation guide

---

**Next Steps**: Create your agent definition and test it locally!
