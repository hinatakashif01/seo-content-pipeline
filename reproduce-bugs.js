// Reproduce the exact normalize() + lookup from the workflow's Code node.

const tones = {
  direct: "...", structured: "...", conversational: "...", concise: "...",
  explanatory: "...", persuasive: "...", editorial: "...", custom: "..."
};

const openers = {
  direct_pain_promise: "...",
  myth_bust: "...",
  diagnostic: "...",
  short_anecdote_or_stat: "...",
  outcome_led: "...",
  example_first: "..."
};

function normalize(value) {
  return (value || "").toLowerCase().trim().replace(/\s+/g, "_");
}

// The dropdown options actually offered by the form:
const FORM_TONES = ["Editorial","Persuasive","Explanatory","Concise","Conversational","Structured","Direct"];
const FORM_OPENERS = ["Pain Promise","Myth Bust","Diagnostic","Example First","Story"];

console.log("=== TONE DROPDOWN -> LOOKUP ===");
for (const t of FORM_TONES) {
  const k = normalize(t);
  const hit = k in tones;
  console.log(`  ${hit ? "OK  " : "MISS"}  "${t}" -> "${k}"${hit ? "" : "   >>> falls back to DIRECT"}`);
}

console.log("\n=== OPENER DROPDOWN -> LOOKUP ===");
for (const o of FORM_OPENERS) {
  const k = normalize(o);
  const hit = k in openers;
  console.log(`  ${hit ? "OK  " : "MISS"}  "${o}" -> "${k}"${hit ? "" : "   >>> falls back to direct_pain_promise"}`);
}

console.log("\n=== ORPHANED MAP KEYS (unreachable from the form) ===");
console.log("  tones:  ", Object.keys(tones).filter(k => !FORM_TONES.map(normalize).includes(k)));
console.log("  openers:", Object.keys(openers).filter(k => !FORM_OPENERS.map(normalize).includes(k)));

console.log("\n=== FIELD REFERENCED BY CODE BUT NOT ON THE FORM ===");
const FORM_FIELDS = ["Topic","Primary Keyword","Target Audience","Tone",
                     "Article Length (Words)","Opener Type",
                     "What are you trying to convey in the article?"];
const REFERENCED = ["Additional Notes"];
for (const f of REFERENCED) {
  console.log(`  ${FORM_FIELDS.includes(f) ? "OK  " : "MISS"}  "${f}" ${FORM_FIELDS.includes(f) ? "" : ">>> always undefined"}`);
}
