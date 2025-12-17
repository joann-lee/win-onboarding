# PRD Writing Guidelines

## Where to document Product Requirements
**Location**: `docs/prd.md`

## Core Principles

1. **State Management**
   - Explicitly define all possible states
   - Document state transitions
   - List what triggers state changes
   - Specify what should NOT happen

2. **Component Behavior**
   - Define behavior in each state
   - Document interaction rules
   - Specify priority of actions
   - List edge cases and constraints

3. **Animation and Transitions**
   - Define what animates
   - Specify timing and easing
   - Document pre/post animation states
   - List what should NOT animate

## Required Sections

### 1. Component States
```
Component States:
- State 1: [Description]
  - Visual appearance
  - Interactive elements
  - Constraints
- State 2: [Description]
  ...
```

### 2. State Transitions
```
State Transitions:
- Trigger: [What causes the transition]
- From State: [Starting state]
- To State: [Ending state]
- Animation: [What animates]
- Constraints: [What should not happen]
```

### 3. Interaction Rules
```
Interaction Rules:
- Rule 1: [Clear statement]
- Rule 2: [Clear statement]
- Constraints: [What should not happen]
```

### 4. Edge Cases
```
Edge Cases:
- Case 1: [Description]
  - Expected behavior
  - Constraints
- Case 2: [Description]
  ...
```

## Writing Tips

1. **Be Explicit**
   - Use "must", "should", "will" for requirements
   - Avoid ambiguous terms like "may", "could", "might"
   - Define all terms and abbreviations

2. **Use Clear Structure**
   - Group related requirements
   - Use consistent formatting
   - Include examples where helpful
   - Use bullet points for clarity

3. **Include Constraints**
   - List what should NOT happen
   - Specify timing requirements
   - Define performance expectations
   - Document error cases

4. **Document Dependencies**
   - List required components
   - Specify data requirements
   - Document external dependencies
   - Define integration points

## Example Format

```
### Component Name
- Primary purpose
- Key features
- Visual requirements

States:
- State 1: [Name]
  - Appearance
  - Behavior
  - Constraints

State Transitions:
- Trigger: [Event]
  - From: [State]
  - To: [State]
  - Animation: [Details]
  - Constraints: [Limitations]

Interaction Rules:
- Rule 1: [Clear statement]
- Rule 2: [Clear statement]
- Constraints: [What should not happen]

Edge Cases:
- Case 1: [Description]
  - Expected behavior
  - Constraints
```

## Common Pitfalls to Avoid

1. **Ambiguity**
   - Vague requirements
   - Unclear state definitions
   - Missing constraints
   - Undefined terms

2. **Incompleteness**
   - Missing edge cases
   - Incomplete state definitions
   - Unclear transitions
   - Missing constraints

3. **Inconsistency**
   - Mixed terminology
   - Inconsistent formatting
   - Contradictory requirements
   - Unclear priorities

4. **Over-specification**
   - Implementation details
   - Technology choices
   - Unnecessary constraints
   - Overly specific solutions

## Review Checklist

- [ ] All states are explicitly defined
- [ ] All transitions are documented
- [ ] Constraints are clearly stated
- [ ] Edge cases are covered
- [ ] No ambiguous terms
- [ ] Consistent formatting
- [ ] Clear examples provided
- [ ] Dependencies documented
- [ ] Performance requirements specified
- [ ] Error cases covered

