---
name: deep-research
description: Automatic deep research skill for AI agents. Multi-round search with multi-source verification, outputs structured reports. Use when user needs to research a topic, verify information, compare tools, track events, or analyze trends.
---

# Deep Research Skill

Source: https://github.com/Pancat009/auto-deep-research-skill

Automatic deep research through multi-round search and multi-source verification.

## Core Logic
1. Break topic into 3 sub-problems
2. Parallel search all sub-problems
3. Read pages and extract key info into memo
4. Evaluate: enough evidence? New concepts? Continue or finish
5. Max 5 iterations, then generate final report

## Output Files
Creates output/{topic-slug}/ folder with:
- state.json - execution state
- memo.json - structured research notes
- sources.json - all source URLs
- report.md - final structured report

## Iron Rules
1. Every conclusion needs 2+ independent sources
2. Uncertain points must be explicitly marked

## Triggers
Use when user mentions: research, deep research, investigate, compare tools, analyze trends, verify information, find sources about

## Usage
Invoke with: /auto-deep-research <question>
Example: /auto-deep-research How does the BNCC define competencies for early childhood education?
