Write a publish-ready long-form article. The outline is a GUIDELINE, not a straitjacket.

Inputs:
- Outline: {{ $json.output }}
- Topic: {{ $('On form submission').item.json.Topic }}
- Goal: {{ $('On form submission').item.json['What are you trying to convey in the article?'] }}
- Primary keyword: {{ $('On form submission').item.json['Primary Keyword'] }}
- Target audience: {{ $('On form submission').item.json['Target Audience'] }}
- Tone: {{ $('Resolve Tone & Opener').item.json.instructions.writing_style }}
- Opener (introduction ONLY): {{ $('Resolve Tone & Opener').item.json.instructions.opener }}
- Length target: {{ $('On form submission').item.json['Article Length (Words)'] }} words
- Additional notes: {{ $('On form submission').item.json['Additional Notes'] }}

You MAY rename, merge or reorder sections where it improves flow for this topic.
You MAY NOT drop a required content block.

FORMAT RULES (HARD)
- Markdown only. No code fences, no HTML.
- Short paragraphs, 3-4 lines maximum.
- Second person ("you").
- Mentor tone: confident, tactical, honest.

LINKS (this rule replaces the old contradictory one)
- No URLs in the body of the article.
- URLs are permitted ONLY inside the "Further Reading" section, 5 items maximum.
- If you use web search, cite what you found ONLY in Further Reading. Never inline.
- Never invent a source. If you cannot verify it, leave it out.

INTRODUCTION
- 120-220 words.
- Primary keyword appears early.
- Apply ONLY the supplied opener instruction. Do not mix opener patterns.

REQUIRED CONTENT BLOCKS (all must appear)
TL;DR / Who this is for / Outcomes / Table of Contents / Setup /
Step-by-step / Templates / Common mistakes / Metrics / Troubleshooting (if-then) /
Next Steps (7-day plan) / Direct answer (2-3 sentences) / Decision tree (if-then) /
FAQ (6-10 Q&As) / "If you only do 3 things..." / Further Reading (5 max)

CALLOUTS (exact prefixes, anywhere in the body)
- "Rule:"            6 or more
- "Common mistake:"  6 or more
- "Insight:"         4 or more

PRACTICAL TOOLS (required)
- 3 or more sections labelled "Template: [Name]"
- 1 checklist
- 1 worked example walked through end to end

METRICS (required)
3-7 KPIs. Each one written as: KPI -> Target -> If low -> Action.

HONESTY RULES
- Do not invent statistics, studies, or quotes.
- Do not claim results you cannot support.
- If the topic has genuine disagreement, say so rather than flattening it.

FAIL CONDITIONS
- Any required block missing
- Callout counts not met
- Templates, checklist or worked example missing
- Metrics missing the Target or Action legs
- URLs outside Further Reading
- Paragraphs longer than 4 lines

Return ONLY this JSON:
{
  "article_title": "string",
  "article": "string"
}
