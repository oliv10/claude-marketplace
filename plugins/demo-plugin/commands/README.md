# Creating Commands

Commands are executable shell scripts bundled with your plugin. They can be invoked by Claude during conversations or run manually by users.

## Command Structure

Commands are shell scripts in the `commands/` directory:

```
commands/
├── your-command.sh
├── another-command.sh
└── build-script.py
```

## Creating a Command

### 1. Create Script File

Create a new file in `commands/`:

```bash
#!/bin/bash

# Your command implementation
echo "Hello from my command!"

# Access plugin root
echo "Plugin is located at: ${CLAUDE_PLUGIN_ROOT}"

# Accept arguments
if [ -n "$1" ]; then
  echo "First argument: $1"
fi
```

### 2. Make Executable

```bash
chmod +x commands/your-command.sh
```

### 3. Test Locally

```bash
# Run directly
./commands/your-command.sh

# Or with arguments
./commands/your-command.sh arg1 arg2
```

## Real Example: Demo Command

See [demo.sh](./demo.sh) for a working example that:
- Prints a welcome message
- Shows the `${CLAUDE_PLUGIN_ROOT}` variable
- Displays current time
- Demonstrates output formatting

## Command Best Practices

### 1. Use Shebang

Always start with a shebang to specify the interpreter:

```bash
#!/bin/bash          # Bash script
#!/usr/bin/env node  # Node.js script
#!/usr/bin/env python3  # Python script
```

### 2. Handle Arguments

Accept and validate arguments:

```bash
#!/bin/bash

if [ $# -eq 0 ]; then
  echo "Usage: $0 <argument>"
  exit 1
fi

ARG1=$1
echo "Processing: $ARG1"
```

### 3. Check Dependencies

Verify required tools are available:

```bash
#!/bin/bash

# Check if required command exists
if ! command -v jq &> /dev/null; then
  echo "Error: jq is not installed"
  exit 1
fi

# Proceed with command
jq '.' input.json
```

### 4. Provide Clear Output

Use structured, parseable output:

```bash
#!/bin/bash

# Good: Structured output
echo "Status: success"
echo "Files processed: 5"
echo "Duration: 2.3s"

# Better: JSON output
cat <<EOF
{
  "status": "success",
  "filesProcessed": 5,
  "duration": 2.3
}
EOF
```

### 5. Handle Errors

Exit with appropriate codes and messages:

```bash
#!/bin/bash

# Function to handle errors
error_exit() {
  echo "Error: $1" >&2
  exit 1
}

# Use it
grep "pattern" file.txt || error_exit "Pattern not found"

# Process file or exit
if [ ! -f "config.json" ]; then
  error_exit "Config file not found"
fi
```

## Environment Variables

### Available Variables

- **${CLAUDE_PLUGIN_ROOT}** - Absolute path to your plugin directory
- **${CLAUDE_CONFIG_DIR}** - Path to Claude config directory (~/.claude)
- Standard env vars: `$HOME`, `$USER`, `$PATH`, etc.

### Using Plugin Root

```bash
#!/bin/bash

# Access plugin files
CONFIG="${CLAUDE_PLUGIN_ROOT}/config.json"
DATA_DIR="${CLAUDE_PLUGIN_ROOT}/data"

# Read plugin config
if [ -f "$CONFIG" ]; then
  cat "$CONFIG"
fi

# Write to plugin directory
echo "Output data" > "${DATA_DIR}/output.txt"
```

## Common Command Patterns

### Data Processing

```bash
#!/bin/bash
# Process CSV files

INPUT=$1
OUTPUT=$2

if [ ! -f "$INPUT" ]; then
  echo "Error: Input file not found"
  exit 1
fi

# Process CSV (example: extract column)
cut -d',' -f2 "$INPUT" > "$OUTPUT"
echo "Processed $INPUT -> $OUTPUT"
```

### API Integration

```bash
#!/bin/bash
# Fetch data from API

API_URL="https://api.example.com/data"
API_KEY="${API_KEY:-}"

if [ -z "$API_KEY" ]; then
  echo "Error: API_KEY environment variable not set"
  exit 1
fi

curl -s -H "Authorization: Bearer $API_KEY" "$API_URL"
```

### Build Automation

```bash
#!/bin/bash
# Build and test project

set -e  # Exit on any error

echo "Building project..."
npm run build

echo "Running tests..."
npm test

echo "Linting code..."
npm run lint

echo "Build complete!"
```

### File System Operations

```bash
#!/bin/bash
# Search and organize files

SEARCH_DIR=${1:-.}
SEARCH_PATTERN=${2:-"*.log"}

echo "Searching for $SEARCH_PATTERN in $SEARCH_DIR"

find "$SEARCH_DIR" -name "$SEARCH_PATTERN" -type f | while read -r file; do
  echo "Found: $file"
  # Process file...
done
```

## Multi-Language Commands

### Node.js Command

```javascript
#!/usr/bin/env node

// Access environment variables
const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT;

// Parse arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: command.js <argument>');
  process.exit(1);
}

// Command logic
console.log(`Processing: ${args[0]}`);
console.log(`Plugin root: ${pluginRoot}`);
```

### Python Command

```python
#!/usr/bin/env python3

import os
import sys
import json

# Access environment variables
plugin_root = os.environ.get('CLAUDE_PLUGIN_ROOT')

# Parse arguments
if len(sys.argv) < 2:
    print('Usage: command.py <argument>', file=sys.stderr)
    sys.exit(1)

arg = sys.argv[1]

# Command logic
result = {
    'status': 'success',
    'input': arg,
    'pluginRoot': plugin_root
}

print(json.dumps(result, indent=2))
```

## Testing Commands

### Manual Testing

```bash
# Test with various inputs
./commands/your-command.sh test-input
./commands/your-command.sh "input with spaces"
./commands/your-command.sh

# Test error conditions
./commands/your-command.sh invalid-input

# Test with plugin root
CLAUDE_PLUGIN_ROOT=/path/to/plugin ./commands/your-command.sh
```

### Integration Testing

```bash
# Install plugin
cp -r plugins/your-plugin ~/.claude/plugins/

# Enable plugin
# Edit ~/.claude/settings.json

# Restart Claude Code

# Ask Claude to run your command
"Run the your-command script"
```

## Security Considerations

### Input Validation

Always validate and sanitize inputs:

```bash
#!/bin/bash

# Validate input is a number
if ! [[ "$1" =~ ^[0-9]+$ ]]; then
  echo "Error: Argument must be a number"
  exit 1
fi

# Validate file path
if [[ "$1" == *".."* ]]; then
  echo "Error: Invalid path"
  exit 1
fi
```

### Avoid Command Injection

Never use user input directly in commands:

```bash
#!/bin/bash

# ❌ DANGEROUS - Command injection vulnerability
FILE=$1
cat $FILE  # User could pass "file.txt; rm -rf /"

# ✅ SAFE - Properly quoted
FILE=$1
cat "$FILE"

# ✅ SAFER - Validate first
if [ -f "$FILE" ]; then
  cat "$FILE"
fi
```

### Least Privilege

Only request necessary permissions:

```bash
#!/bin/bash

# ❌ BAD - Unnecessary sudo
sudo rm /tmp/myapp.log

# ✅ GOOD - Run as user
rm /tmp/myapp.log

# ✅ BETTER - Clean only your files
rm "${CLAUDE_PLUGIN_ROOT}/logs/"*.log
```

### Secret Management

Never hardcode secrets:

```bash
#!/bin/bash

# ❌ NEVER DO THIS
API_KEY="sk-1234567890abcdef"

# ✅ Read from environment
API_KEY="${API_KEY:-}"
if [ -z "$API_KEY" ]; then
  echo "Error: API_KEY environment variable required"
  exit 1
fi

# ✅ Or from secure config file
API_KEY=$(cat ~/.config/myapp/api_key 2>/dev/null)
```

## Troubleshooting

### Command Not Executable
```bash
# Make sure file is executable
chmod +x commands/your-command.sh

# Verify
ls -l commands/your-command.sh
```

### Shebang Issues
```bash
# Wrong
#! /bin/bash

# Right
#!/bin/bash

# Also right (more portable)
#!/usr/bin/env bash
```

### Path Problems
```bash
# Always use absolute paths or plugin root
GOOD="${CLAUDE_PLUGIN_ROOT}/data/file.txt"
BAD="data/file.txt"  # Relative paths depend on CWD
```

### Permission Errors
```bash
# Write to plugin directory, not system directories
GOOD="${CLAUDE_PLUGIN_ROOT}/output.txt"
BAD="/usr/local/bin/output.txt"  # May need sudo
```

## When to Use Commands

Commands work well for:
- **Shell automation** - File operations, system tasks
- **External tools** - Wrapping CLI tools (git, docker, etc.)
- **Build processes** - Compilation, packaging, deployment
- **Data pipelines** - ETL scripts, data transformation
- **Integration scripts** - Connecting external systems

Consider MCP servers instead if you need:
- Interactive back-and-forth with Claude
- Complex parameter validation
- Structured error handling
- Multiple related operations

## Resources

- **[Demo Command](./demo.sh)** - Working example
- **[Parent README](../README.md)** - Full plugin creation guide
- **[Bash Guide](https://mywiki.wooledge.org/BashGuide)** - Bash scripting reference

---

**Next Steps**: Create your command script and test it!
