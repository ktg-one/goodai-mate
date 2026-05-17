---
name: "source-command-component"
description: "Scaffold a new component with test file"
---

# source-command-component

Use this skill when the user asks to run the migrated source command `component`.

## Command Template

Create a new component:

1. Determine if Server or Client component based on requirements
2. Create `src/components/{component-name}.tsx` using component-builder skill patterns
3. Create `__tests__/unit/components/{component-name}.test.tsx`
4. If Client component, add `'use client'` directive
5. Export with TypeScript props interface
6. Use Tailwind CSS for all styling
