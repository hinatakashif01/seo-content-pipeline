# SEO Content Pipeline

**Form in, publish-ready Google Doc out. A two-stage LLM pipeline that plans an article before it writes one, enforces a hard structural contract, and delivers formatted output straight into Drive.**

> **Status:** Production. Built during a client engagement, 2025.
> Client identifiers, Drive folder IDs, webhook IDs and credentials are not in this repository.

---

## The problem

Ask a model for a 2,600-word article and you get 2,600 words of confident mush. It will be fluent, structurally shapeless, and indistinguishable from every other AI article on the internet.

Three things go wrong, every time:

1. **No plan.** The model writes forward one sentence at a time. It has no idea what section 9 will be until it gets there, so the piece drifts and the ending doesn't answer the beginning.
2. **No contract.** "Include an FAQ" produces an FAQ sometimes. There is nothing that *fails* when it doesn't.
3. **No output discipline.** The result is a wall of prose that someone still has to format, restructure and paste somewhere.

This pipeline fixes all three: **plan, then write against the plan, then ship the artifact.**

---

## How it works

```
   Form submission
   (topic, keyword, audience, tone, length, opener, goal, notes)
         │
         ▼
   ┌──────────────────────┐
   │ Resolve Tone & Opener│   maps dropdown -> explicit writing instruction
   └──────────┬───────────┘
              ▼
   ┌──────────────────────┐
   │   Generate Outline   │   OUTLINE ONLY. No prose.
   │  12-section spine,   │   Fails if a required heading is missing,
   │  verbatim headings   │   renamed, or out of order.
   └──────────┬───────────┘
              ▼
   ┌──────────────────────┐
   │    Draft Article     │   Outline is a guideline, not a straitjacket:
   │  web search enabled  │   may rename/merge/reorder, may NOT drop a block.
   │  schema-enforced     │   Enforces callout counts, templates, KPI format.
   └──────────┬───────────┘
              ▼
      ┌───────────────┐
      │ Set Output    │
      └───┬───────┬───┘
          │       │
          ▼       ▼
   ┌──────────┐  ┌──────────────────┐
   │ MD →HTML │  │ Create Empty Doc │   (Drive, converted to Google Doc)
   │ → file   │  └────────┬─────────┘
   │ → set    │           │
   │  mime    │           │
   └────┬─────┘           │
        └────────┬────────┘
                 ▼
          ┌─────────────┐
          │  Merge +    │
          │  Wait 0.5s  │   Drive needs a beat before the doc accepts content
          └──────┬──────┘
                 ▼
        ┌──────────────────┐
        │ Write HTML → Doc │
        └────────┬─────────┘
                 ▼
        ┌──────────────────┐
        │ Redirect user to │
        │  the finished doc│
        └──────────────────┘
```

The user fills a form and lands on a formatted Google Doc. There is no copy-paste step.

---

## Why two stages instead of one

The outline agent is **forbidden from writing prose.** Its only job is to commit to a structure before a single sentence exists.

The draft agent then writes *against* that commitment. It is explicitly allowed to rename, merge and reorder sections where it improves the piece — because a rigid template produces rigid writing — but it cannot silently drop a required block.

That split is the whole trick. Planning and writing are different tasks, and a model doing both at once does neither well.

---

## The structural contract

The draft prompt defines fail conditions, not suggestions:

| Requirement | Threshold |
|---|---|
| `Rule:` callouts | 6 or more |
| `Common mistake:` callouts | 6 or more |
| `Insight:` callouts | 4 or more |
| `Template: [Name]` sections | 3 or more |
| Checklist | 1 |
| Worked example | 1 |
| KPIs | 3–7, each as `KPI → Target → If low → Action` |
| FAQ | 6–10 questions |
| Troubleshooting | strict if/then |
| Paragraph length | 4 lines maximum |
| Introduction | 120–220 words, keyword early, one opener pattern only |

**Rule: a requirement without a fail condition is a suggestion, and models ignore suggestions.**

---

## Honesty constraints

Web search is enabled on the drafting model, which makes hallucinated sourcing a real risk. The prompt therefore hard-codes:

- **No URLs in the body.** Links appear only in Further Reading, 5 maximum.
- **Never invent a source.** If it can't be verified, it doesn't go in.
- **No invented statistics, studies or quotes.**
- **Where a topic has genuine disagreement, say so** rather than flattening it into false consensus.

An SEO article that fabricates a statistic is worse than no article. It's a liability with the client's name on it.

---

## The Drive delivery trick

Getting formatted Markdown into a real Google Doc is fiddlier than it looks. Drive will only convert an upload into a native Doc if the MIME type is `text/html`, but n8n's `convertToFile` node emits `text/plain`.

So the pipeline:
1. Converts Markdown → HTML
2. Writes it to a file, then **overrides the MIME type to `text/html` in code**
3. Creates an empty Doc in parallel to get an ID
4. Merges the two branches, **waits 0.5s** for Drive to settle
5. Writes the HTML into the existing Doc
6. Redirects the user's browser straight to it

Steps 2 and 4 are the ones that took the longest to find. They are not in any tutorial.

---

## Known bugs, found and fixed

The version that ran in production had four defects. They are fixed here, and documented rather than quietly patched, because two of them were **silent** — the pipeline reported success while doing the wrong thing.

| # | Bug | Effect | Fix |
|---|-----|--------|-----|
| 1 | Opener map keyed `direct_pain_promise`, form emitted `pain_promise` | Key miss, fell back to default. Worked by accident. | Keys realigned to the form |
| 2 | Form offered a **"Story"** opener; no `story` key existed | **Every Story request silently rendered as Pain Promise.** User picks one thing, gets another. | `story` key added |
| 3 | Code and both prompts referenced `Additional Notes`; **the form had no such field** | Always `undefined`. The entire Custom-tone branch was unreachable dead code. | Field added to the form |
| 4 | Prompt said "use web search and add related articles" *and* "DO NOT include raw URLs anywhere" | Contradictory instructions. Model behaviour undefined. | One coherent link rule |

Plus a typo, `Conten in Markdown`, propagated through three nodes.

**Insight: the dangerous bug is not the one that crashes. It's number 2 — the user chose "Story," the pipeline said "success," and delivered something else.** Unmapped keys now log a warning instead of silently degrading.

---

## Running it

```bash
docker run -it --rm -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n
```

1. Import `workflows/seo-content-pipeline.json`
2. Set `YOUR_MODEL` on the three model nodes and add your LLM credential
3. Add a Google Drive credential
4. Replace `YOUR_DRIVE_FOLDER_ID` in **Set Output Fields**
5. Open the form URL and submit

---

## Repo contents

```
/workflows
  seo-content-pipeline.json     n8n workflow, 19 nodes
/prompts
  outline-agent.md              Structural planner
  draft-agent.md                Writer, with fail conditions
/docs
  bugs-found.md                 The four defects, reproduced and fixed
  architecture.md
README.md
LICENSE                         MIT
```

---

**Hinata Kashif** · [LinkedIn](https://www.linkedin.com/in/hinata-kashif) · hinatakashif05@gmail.com
