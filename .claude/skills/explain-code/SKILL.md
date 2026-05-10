---
name: explain-code
description: Generate beautiful, non-technical HTML explainer documents from any agentic coding tool. Scans the codebase to understand the topic and produces a premium dark-themed standalone HTML file for non-technical stakeholders. Use when user needs to explain code, document a system flow, or create explainer docs.
---

# Explain Code / Explainer Skill

Source: https://github.com/heysarver/explainer-skill

Generate beautiful 3-column HTML explainer documents for any system, feature, or code flow.

## What it Does
1. Scans the codebase to understand the topic
2. Generates a premium dark-themed 3-column HTML document
3. Optionally publishes to explainers.fyi for a shareable URL

## Output Format
- 3 columns: Receive / Validate / Deliver (or similar phases)
- Dark aesthetic, color-coded sections
- Stat chips with key numbers
- Step cards, check rows, guardrail chips
- Fully self-contained HTML (no external dependencies)

## Triggers
Use when user mentions: explain code, explain this flow, explain this feature, document this system, create explainer, how does this work, non-technical explanation, stakeholder docs

## Usage
Invoke with: /explainer <topic>
Example: /explainer auth flow
Example: /explainer lesson plan generation
Example: /explainer checkout pipeline
