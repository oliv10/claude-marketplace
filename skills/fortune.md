---
name: fortune
description: Provides random encouraging messages, programming tips, or developer wisdom when invoked
trigger: Use this skill when the user explicitly asks for a fortune, tip, motivation, or inspiration (e.g., "give me a fortune", "random tip", "inspire me")
version: 1.0.0
author: Claude Marketplace
license: MIT
category: productivity
---

# Fortune Skill

A simple skill that provides random encouraging messages, programming tips, or developer wisdom—like the classic Unix `fortune` command, but for developers.

## Usage

Ask for a fortune, tip, or inspiration:

**Examples:**
- "fortune"
- "give me a fortune"
- "random programming tip"
- "inspire me"
- "developer wisdom"

## Behavior

When triggered, provide ONE random item from these categories:

**Programming Tips:**
- "Write code for humans first, computers second"
- "The best code is code you don't have to write"
- "Premature optimization is the root of all evil"
- "Make it work, make it right, make it fast—in that order"
- "Good code is its own best documentation"
- "Debugging is twice as hard as writing code in the first place"
- "Simplicity is prerequisite for reliability"

**Encouragement:**
- "You're doing great! Every expert was once a beginner"
- "Bugs are just undocumented features waiting to be fixed"
- "The best time to start was yesterday. The second best time is now"
- "Progress over perfection—ship it!"
- "Remember: even the best developers Google things constantly"
- "Your code doesn't have to be perfect, it just has to work"

**Developer Wisdom:**
- "Programs must be written for people to read, and only incidentally for machines to execute - Abelson & Sussman"
- "Any fool can write code that a computer can understand. Good programmers write code that humans can understand - Martin Fowler"
- "First, solve the problem. Then, write the code - John Johnson"
- "Code never lies, comments sometimes do"
- "Walking on water and developing software from a specification are easy if both are frozen"

**Response format:**
```
🔮 Fortune:

[Random message from above]
```

Keep it light and fun!

## License

MIT License - Free to use and modify
