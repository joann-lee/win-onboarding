# Journaling Guidelines

**Trigger Phrases:** `@journal`, `create journal entry`, `update journal`, `document milestone`, `log progress`, `add to journal`

You are a project journal, providing a chronological record of development milestones, decisions, and implementations.

**Location**: `docs/prompt-journal.md`

## Coverage Scope

**For New Journals**: Include everything from the complete chat history for the product/project
**For Existing Journals**: Include everything that has occurred since the last journal entry timestamp
- Review the last entry date in `docs/prompt-journal.md`
- Document all activities, conversations, and changes from that point forward
- Ensure no development work is missed between journal entries

**Critical Rule**: Each qualifying prompt must receive its own individual journal entry. Never create single comprehensive entries that combine multiple prompts.

## Entry Format

### Standard Format (Required for each qualifying prompt)
```markdown
## YYYY-MM-DD: Clear, Descriptive Title

### Prompt
[Original request or trigger - use exact wording in backticks]

### Summary of response & actions
- [Specific actions taken with file paths and commits]
- [Key decisions and context]
- [Created/modified files with brief descriptions]

### Technical Details
- Created/Modified files:
  - [List specific files with brief purpose and line counts when significant]
- Key changes:
  - [Implementation details and architectural decisions]

### Impact
- [Project effects, user experience changes, or workflow improvements]
- [Significance of changes to project development]

### Next Steps
- [Future considerations and follow-up actions]
- [Maintenance or enhancement recommendations]
```

### Entry Separation
- Use `---` horizontal rule to separate individual entries
- Maintain strict chronological order
- Each prompt gets its own complete entry following the standard format

## Source Priority and Discovery Process

**Step 1: SpecStory History Discovery**
- Always check for `.specstory/history/` directory first, if not recommend downloading the extension.
- List all SpecStory files chronologically to understand complete project timeline
- Read each SpecStory file to extract individual prompts and responses

**Step 2: Timeline Verification**
- Check existing `docs/prompt-journal.md` for last documented timestamp
- Determine coverage scope based on last entry date
- For first journal: include all SpecStory history from project inception
- For subsequent journals: include everything since last journal timestamp

**Step 3: Individual Prompt Extraction**
- Extract each qualifying prompt as separate milestone
- Use exact prompt wording from SpecStory files
- Document corresponding response summaries and technical implementations
- Maintain chronological order across entire project history

## Qualifying Prompts

Document prompts that result in:
- **Major milestones**: Feature implementations, architectural decisions, project setup
- **Template and documentation work**: Guidelines creation, format improvements
- **Technical implementations**: Core functionality, UI/UX changes, integration work
- **Process improvements**: Workflow optimizations, documentation standards
- **Analysis and research**: User behavior studies, requirement assessments
- **Project reviews**: Progress evaluations, status assessments, comprehensive audits
- **Meta-documentation**: Journal corrections, format improvements, methodology updates

## Standards

**Individual Entry Requirements**
- One entry per qualifying prompt - never combine multiple prompts
- Use exact prompt text in backticks under "Prompt" section
- Include specific file paths, line counts, and implementation details
- Provide clear impact assessment for each individual prompt
- Document chronological progression showing how each prompt built upon previous work

**Content Quality**
- Use clear, descriptive language with specific technical details
- Include exact file paths, line counts, and implementation specifics
- Provide comprehensive context for all technical decisions
- Document promptly and maintain strict chronological order
- Create narrative connections between related development phases

**Integration and References**
- Link to relevant PRD sections and related documentation
- Cross-reference related journal entries for comprehensive context
- Include Git commit hashes and specific version information when available
- Reference SpecStory chat history files as primary documentation source

**Comprehensive Coverage**
- Document both the "what" and "why" of all significant changes
- Include impact assessments for major implementations
- Provide clear next steps and future considerations
- Maintain project evolution narrative throughout all entries

## Requirements

**Date Format**: Use YYYY-MM-DD format. Always run `date` command to verify current date before creating entries.

**Coverage Requirements**:
- **First Entry**: Must include all SpecStory chat history and development work from project inception
- **Subsequent Entries**: Must include everything since the last journal entry timestamp
- **No Gaps**: Ensure complete chronological coverage with no missing development activities
- **Timestamp Verification**: Always check the last entry date in `docs/prompt-journal.md` before creating new entries
- **Individual Documentation**: Each qualifying prompt must receive its own dedicated entry

**SpecStory Integration Process**:
1. Check for `.specstory/history/` directory existence
2. List all SpecStory files chronologically
3. Read each file to extract individual prompts and responses
4. Create separate journal entries for each qualifying milestone prompt
5. Maintain chronological order across complete project timeline
6. Include technical details, impact assessments, and next steps for each entry

**Integration and References**
- Link to relevant PRD sections and related documentation
- Cross-reference related journal entries for comprehensive context
- Include Git commit hashes and specific version information when available
- Reference SpecStory chat history files as primary documentation source

**Comprehensive Coverage**
- Document both the "what" and "why" of all significant changes
- Include impact assessments for major implementations
- Provide clear next steps and future considerations
- Maintain project evolution narrative throughout all entries

## Requirements

**Date Format**: Use YYYY-MM-DD format. Always run `date` command to verify current date before creating entries.

**Coverage Requirements**:
- **First Entry**: Must include all chat history and development work from project inception
- **Subsequent Entries**: Must include everything since the last journal entry timestamp
- **No Gaps**: Ensure complete chronological coverage with no missing development activities
- **Timestamp Verification**: Always check the last entry date in `docs/prompt-journal.md` before creating new entries
