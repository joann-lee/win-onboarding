# Documentation Rules

## Core Principles
- Maintain clear separation between documentation types
- Ensure chronological accuracy
- Provide comprehensive context
- Enable traceability
- Support future reference

## Documentation Types

### 1. README
- **Purpose**: High-level project overview
- **Location**: `README.md`
- **Guidelines**: See `instructions/readme-guidelines.md` for detailed format and content requirements
- **Key Principles**: Focus on what the project does, not how it works; keep concise; avoid implementation details

### 2. Prompt-Journal
- **Purpose**: Track high-level project milestones and decisions
- **Location**: `docs/prompt-journal.md`
- **Format**:
  ```markdown
  ## YYYY-MM-DD: Clear, Descriptive Title

  ### Prompt
  [Original request or trigger]

  ### Summary of Response & Actions
  - [Bulleted list of key actions]
  - [Include context and rationale]

  ### Technical Details
  - Files modified:
    - [List of changed files]
  - Key changes:
    - [Technical implementation details]

  ### Next Steps
  - [Future considerations]
  - [Follow-up actions]

  ### Impact
  - [Significant effects on project]
  - [User experience changes]

  ### Related Documentation
  - [Links to related logs/docs]
  ```

### 3. Implementation Logs
- **Purpose**: Detailed technical analysis and implementation records
- **Location**: `docs/logs/YYYY-MM-DD-descriptive-name.md`
- **Format**:
  ```markdown
  # Clear, Descriptive Title

  ## Context
  [Background and motivation]

  ## Technical Decisions
  ### [Decision Name]
  - **Decision**: [What was decided]
  - **Rationale**: [Why it was decided]
  - **Implementation**: [How it was implemented]
    ```[language]
    [Relevant code snippets]
    ```

  ## Implementation Details
  ### [Component/Feature Name]
  - **Location**: [File path]
  - **Changes**:
    - [Specific modifications]
    - [Implementation details]
    - [Configuration changes]

  ## Testing Notes
  ### [Test Category]
  - [Verification steps]
  - [Test results]
  - [Edge cases]

  ## Impact Analysis
  ### Positive Impacts
  1. **[Category]**
     - [Specific impacts]
     - [Benefits]

  ### Potential Challenges
  1. **[Category]**
     - [Potential issues]
     - [Mitigation strategies]

  ## Next Steps
  1. **Short Term**
     - [Immediate actions]
     - [Quick wins]

  2. **Medium Term**
     - [Planned improvements]
     - [Feature enhancements]

  3. **Long Term**
     - [Strategic goals]
     - [Future considerations]

  ## Related Files
  - [List of modified files]
  - [Related documentation]
  ```

### 4. History Tracking
- **Purpose**: Track component and feature evolution
- **Location**: `.specstory/history/`
- **Format**:
  ```markdown
  # Component/Feature Name History

  ## YYYY-MM-DD: Change Title
  ### Context
  [Why the change was made]

  ### Changes
  - [Specific modifications]
  - [Implementation details]

  ### Impact
  - [Effects on functionality]
  - [User experience changes]
  ```

## Required Content

### All Documentation
- ISO 8601 date (verified)
- Clear, descriptive title
- Context and motivation
- Technical details
- Impact assessment
- Related documentation links

### README Specific
- Project name
- One-paragraph description
- Quick start instructions
- Tech stack list
- Documentation links

### Prompt-Journal Specific
- Original prompt/request
- Summary of actions
- Next steps
- Cross-references to logs

### Implementation Logs Specific
- Technical decisions with rationale
- Implementation details with code
- Testing notes by category
- Impact analysis
- Short/medium/long term next steps

### History Specific
- Component/feature context
- Change details
- Impact on functionality
- User experience effects

## Best Practices

### Writing Guidelines
1. **Clarity**
   - Use clear, concise language
   - Provide sufficient context
   - Include rationale for decisions
   - Document assumptions

2. **Structure**
   - Follow consistent formatting
   - Use appropriate headings
   - Include required sections
   - Maintain chronological order

3. **Technical Details**
   - Include relevant code snippets
   - Document configuration changes
   - Note testing procedures
   - List affected files

4. **Cross-Referencing**
   - Link related documentation
   - Reference previous changes
   - Note dependencies
   - Track impact

### README Guidelines
1. **Description**
   - Focus on user perspective
   - Explain core functionality
   - Avoid implementation details
   - Keep it concise

2. **Content**
   - What the project does
   - How it works at a high level
   - Basic setup instructions
   - Main technologies used
   - Links to detailed docs

3. **Style**
   - Clear and direct language
   - No technical jargon
   - No unnecessary descriptors
   - No redundant information

### Maintenance
1. **Regular Updates**
   - Update documentation promptly
   - Review for accuracy
   - Remove outdated information
   - Archive when necessary

2. **Quality Checks**
   - Verify date accuracy
   - Check formatting consistency
   - Validate links
   - Review completeness

3. **Organization**
   - Maintain clear file structure
   - Use consistent naming
   - Follow location guidelines
   - Update indexes

## Common Pitfalls to Avoid
- ❌ Missing dates or incorrect date formats
- ❌ Incomplete context or rationale
- ❌ Missing technical details
- ❌ Poor cross-referencing
- ❌ Inconsistent formatting
- ❌ Outdated information
- ❌ Missing impact assessment
- ❌ Incomplete testing notes
- ❌ README with implementation details
- ❌ README with features section
- ❌ README with technical specifications

## Review Checklist
- [ ] Date is in ISO 8601 format
- [ ] Title is clear and descriptive
- [ ] All required sections are present
- [ ] Technical details are complete
- [ ] Cross-references are valid
- [ ] Formatting is consistent
- [ ] Impact is assessed
- [ ] Testing is documented
- [ ] Next steps are identified
- [ ] Related documentation is linked
- [ ] README is high-level only
- [ ] README has no technical details
- [ ] README has no features section

## CRITICAL: Date Accuracy Requirements

### Mandatory Date Verification
- **ALWAYS** verify current date before creating any documentation entries
- **REQUIRED**: Run `date` command or equivalent to get accurate timestamp
- **FORBIDDEN**: Using assumed, cached, or incorrect dates
- **FORMAT**: YYYY-MM-DD (ISO 8601 standard)
- **VERIFICATION**: Double-check date accuracy in all timestamps

### Date Verification Process
1. **Before Documentation**: Execute `date` command to get current system date
2. **Cross-Reference**: Verify date matches expected timeframe
3. **Consistency Check**: Ensure all related files use same accurate date
4. **File Naming**: Use verified date in log filenames (`YYYY-MM-DD-description.md`)

## Documentation Update Process

1. **When to Update**
   - After completing significant tasks
   - When making architectural decisions
   - Following important refactoring
   - Upon resolving critical issues
   - When changing project structure
   - **MANDATORY**: When adding new rules or major features

2. **Update Guidelines**
   - Maintain existing formatting and structure
   - Place new entries in chronological order
   - Be concise but comprehensive
   - Include dates for all entries (VERIFIED)
   - Reference related code files or components
   - **REQUIRED**: Update README.md with new features, rules, or significant changes

3. **File Organization**
   - Keep related documentation together
   - Use consistent naming conventions
   - Maintain clear directory structure
   - Cross-reference related documents

### Mandatory Documentation Updates for Major Changes

When creating journal entries or logs for significant milestones, **ALWAYS** update:

1. **README.md** - Add new features, rules, or capabilities to:
   - Quick Start section (if applicable)
   - Recent Updates section with verified date
   - Project Structure (if files added/changed)
   - Rules Overview (if new rules added)
   - Key Features (if new capabilities added)

2. **Analytics** - Update rule usage tracking in `docs/analytics.md`

3. **Cross-References** - Update any related documentation that references the changed components

### README Update Requirements

**CRITICAL**: README updates are **MANDATORY** for:
- New rule files created
- Major feature implementations
- Significant process changes
- Security or privacy enhancements
- Version updates or releases
- Critical fixes or improvements

**Format**: Always include:
- Clear description of new features/changes
- Updated project structure if applicable
- Getting started guidance for new features
- Proper versioning and last updated date (VERIFIED)

## Documentation Standards

1. **Formatting**
   - Use consistent markdown formatting
   - Include clear section headers
   - Maintain proper indentation
   - Use lists for better readability

2. **Content**
   - Be clear and concise
   - Include relevant context
   - Provide examples when helpful
   - Link to related resources

3. **Maintenance**
   - Regular review and updates
   - Version control for all docs
   - Keep documentation current
   - Remove outdated information

## Integration with Development

1. **Code Documentation**
   - Document code changes
   - Update API documentation
   - Maintain README files
   - Keep changelog current

2. **Process Documentation**
   - Document development workflows
   - Maintain setup instructions
   - Keep deployment guides current
   - Document testing procedures

3. **Knowledge Base**
   - Build searchable documentation
   - Maintain troubleshooting guides
   - Document common solutions
   - Keep FAQs updated

