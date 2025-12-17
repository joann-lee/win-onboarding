# README Guidelines

**Trigger Phrases:** `@readme`, `create readme`, `update readme`, `readme guidelines`, `write readme`

READMEs provide a high-level project overview focused on what the project does and how to get started.

## Filename
The readme file is ALWAYS NAMED `README.md` and located in the root of the project. If there's an exisitng README.md - merge (if contents are related to the project based on chat history, prd, or anyother project context) or replace (if contents are boilerplate or unrelated to the project) the generated content into the file. If no file exists create one and add generated content.

## Template

```markdown
# Project Name

[One paragraph description of what the project does and how it works at a glance]

## Quick Start
```bash
[Installation commands]
[Repo reference use remote origin from git]
```

## Tech Stack
- [List of main technologies - short simple list, for details defer to package.json if one exists]

## Documentation
- [Links to other documentation]
```

## Content Rules

**Include:**
- Project name and one-paragraph description
- Quick start instructions
- Tech stack and documentation links

**Exclude:**
- Implementation details or technical specifications
- Project structure or development setup
- Features section or changelog

## Standards

- Focus on what the project does, not how it works
- Keep description to one paragraph maximum
- Use clear, accessible language
- Update for major changes

## Common Mistakes

- Too much technical detail
- Missing quick start instructions
- Outdated information
