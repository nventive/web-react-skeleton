---
mode: agent
description: Review uncommitted changes (or a given scope) against the repo's conventions and flag issues only, grouped by severity.
---

# Code review

You are performing a **read-only code review** for the web-react-skeleton repo. Do not edit files. Do not run builds, tests, or install commands. Only inspect the code.

## 1. Determine the scope

If the user provided a scope in their message (a file path, a folder, a glob, "staged", "last commit", or a code selection is attached), use that. Otherwise default to **uncommitted changes**:

```
git --no-pager diff
git --no-pager diff --stat
git --no-pager status --short
```

Also read the full current contents of every file that appears in the diff — a diff hunk alone is not enough context to judge a rule violation.

## 2. Load the rules that apply

For each changed file, load the matching scoped instruction files from `.github/instructions/` by consulting the `applyTo` glob at the top of each `.instructions.md` file. Also load `.github/copilot-instructions.md` for the repo-wide invariants.

Do **not** invent rules. If a concern is not covered by an instruction file, a skill, or a clearly broken piece of code (type error, dead import, obvious bug, security issue), do not raise it.

## 3. Judge each change

For every hunk, ask:

- Does it violate a rule in the loaded instruction files? (cite the file)
- Does it break a repo-wide invariant from `copilot-instructions.md`? (e.g. wrong package manager, forbidden library, relative import across folders, hand-edited generated file)
- Does it introduce a bug, a type-safety hole, an unhandled failure at a system boundary, or an OWASP-class vulnerability?
- Does it leak secrets, hardcoded URLs, or debug/console noise?

Ignore purely stylistic preferences that are not codified. Ignore anything the linter (`yarn lint`) would already catch — assume the developer will run it.

## 4. Assign a severity

Use exactly these three levels:

| Severity     | Meaning                                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| `blocker`    | Must fix before merging: broken build/type, security issue, repo-wide invariant violated, data-loss bug.    |
| `warning`    | Should fix: scoped instruction rule violated, likely bug, wrong folder/pattern, missing i18n, dead code.    |
| `suggestion` | Nice to have: minor clarity or consistency improvement clearly supported by an existing convention.         |

If you cannot justify a finding with a rule reference or a concrete failure mode, drop it.

## 5. Report — UI-friendly, terse

Do not flood the developer. Aim for signal, not volume.

- If there are **zero findings**, reply with a single line: `✅ No issues found in <scope>.` and stop.
- Otherwise, output **only** the sections that have findings, in this order: `Blockers` → `Warnings` → `Suggestions`.
- Start with a one-line summary: `Reviewed <scope> — <N> blocker(s), <N> warning(s), <N> suggestion(s).`
- Cap output at **10 findings total**. If more exist, keep the highest-severity ones and end with `_… N more lower-severity findings omitted._`
- Never restate what the code does. Never praise. Never suggest running `yarn lint` or `yarn build`.

### Format each finding exactly like this

> #### 🔴 Blocker — short title
>
> [path/to/file.ts](path/to/file.ts#L42)
>
> One or two sentences: what is wrong, and which rule or failure mode.
>
> _Rule:_ [instructions/react.instructions.md](.github/instructions/react.instructions.md) · _Fix:_ one short sentence.

Icons per severity: `🔴 Blocker`, `🟠 Warning`, `🟡 Suggestion`. Use a level-4 heading (`####`) so each finding renders as a distinct card in the chat UI. Separate findings with a blank line.

The `_Fix:_` line is a one-sentence hint only — do not produce diffs, do not offer to apply changes unless the user asks.

## 6. Stop

After the report, stop. Do not ask follow-up questions unless the scope was ambiguous and you could not determine it in step 1.
