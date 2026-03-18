"use client";
import { useState, useEffect, useRef } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@400;500;600;700;800&display=swap');
`;

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0a0a0a; }
:root {
  --bg: #0a0a0a; --surface: #111111; --surface2: #1a1a1a;
  --border: #242424; --amber: #f5a623; --amber-dim: #8a5e14;
  --green: #3ecf8e; --red: #ff5f5f; --text: #e8e4dc;
  --muted: #6b6860; --mono: 'IBM Plex Mono', monospace; --sans: 'Syne', sans-serif;
}
.app { min-height: 100vh; background: var(--bg); color: var(--text); font-family: var(--sans); padding: 32px 24px 80px; max-width: 860px; margin: 0 auto; }
.header { margin-bottom: 40px; border-bottom: 1px solid var(--border); padding-bottom: 24px; display: flex; align-items: flex-end; justify-content: space-between; }
.logo-tag { font-family: var(--mono); font-size: 10px; color: var(--amber); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 6px; }
.logo-title { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
.logo-title span { color: var(--amber); }
.header-meta { font-family: var(--mono); font-size: 10px; color: var(--muted); text-align: right; line-height: 1.8; }
.section-label { font-family: var(--mono); font-size: 10px; color: var(--amber); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; }
.input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.field { display: flex; flex-direction: column; }
.field label { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px; }
.field input, .field select, .field textarea { background: var(--surface); border: 1px solid var(--border); color: var(--text); font-family: var(--sans); font-size: 13px; padding: 10px 12px; border-radius: 4px; outline: none; resize: none; transition: border-color 0.15s; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: var(--amber-dim); }
.field select option { background: #1a1a1a; }
.msg-field textarea { height: 160px; line-height: 1.6; }
.analyze-btn { width: 100%; padding: 14px; background: var(--amber); color: #0a0a0a; font-family: var(--mono); font-size: 12px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; border: none; border-radius: 4px; cursor: pointer; margin-top: 4px; transition: opacity 0.15s, transform 0.1s; }
.analyze-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.analyze-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
.loading-bar { width: 100%; height: 2px; background: var(--border); border-radius: 1px; margin-top: 12px; overflow: hidden; }
.loading-bar-fill { height: 100%; background: var(--amber); border-radius: 1px; animation: loadpulse 1.4s ease-in-out infinite; width: 40%; }
@keyframes loadpulse { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
.results { margin-top: 40px; animation: fadeUp 0.4s ease; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.overall-score { display: flex; align-items: baseline; gap: 4px; }
.score-big { font-family: var(--mono); font-size: 52px; font-weight: 600; line-height: 1; color: var(--amber); }
.score-denom { font-family: var(--mono); font-size: 18px; color: var(--muted); }
.score-label { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: 0.15em; text-transform: uppercase; margin-top: 4px; }
.verdict-pill { font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 14px; border-radius: 2px; border: 1px solid; }
.verdict-weak { color: var(--red); border-color: var(--red); background: rgba(255,95,95,0.07); }
.verdict-decent { color: var(--amber); border-color: var(--amber); background: rgba(245,166,35,0.07); }
.verdict-strong { color: var(--green); border-color: var(--green); background: rgba(62,207,142,0.07); }
.score-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 24px; }
.score-card { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 12px 10px; text-align: center; }
.score-card-label { font-family: var(--mono); font-size: 9px; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
.score-card-val { font-family: var(--mono); font-size: 22px; font-weight: 600; }
.score-bar { height: 2px; background: var(--border); border-radius: 1px; margin-top: 8px; overflow: hidden; }
.score-bar-fill { height: 100%; border-radius: 1px; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.block { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 20px; margin-bottom: 12px; }
.block-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.block-title { font-family: var(--mono); font-size: 10px; color: var(--amber); letter-spacing: 0.2em; text-transform: uppercase; }
.copy-btn { font-family: var(--mono); font-size: 9px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; background: transparent; border: 1px solid var(--border); padding: 4px 10px; border-radius: 2px; cursor: pointer; transition: color 0.15s, border-color 0.15s; }
.copy-btn:hover { color: var(--amber); border-color: var(--amber-dim); }
.rewritten-text { font-size: 13px; line-height: 1.75; color: #d4cfc7; white-space: pre-wrap; }
.subjects { display: flex; flex-direction: column; gap: 8px; }
.subject-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; background: var(--surface2); border: 1px solid var(--border); border-radius: 3px; }
.subject-num { font-family: var(--mono); font-size: 10px; color: var(--amber); padding-top: 1px; flex-shrink: 0; }
.subject-text { font-size: 13px; color: var(--text); }
.insights-list { display: flex; flex-direction: column; gap: 8px; }
.insight-item { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: #b8b4ac; line-height: 1.6; }
.insight-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--amber); margin-top: 7px; flex-shrink: 0; }
.error-box { background: rgba(255,95,95,0.06); border: 1px solid rgba(255,95,95,0.2); border-radius: 4px; padding: 14px 16px; font-family: var(--mono); font-size: 11px; color: var(--red); margin-top: 12px; }
`;

const scoreColor = (v) => v >= 75 ? "var(--green)" : v >= 50 ? "var(--amber)" : "var(--red)";
const verdictLabel = (v) => v >= 75 ? ["strong", "Strong Outreach"] : v >= 50 ? ["decent", "Needs Polish"] : ["weak", "Weak — Rewrite"];

function AnimatedScore({ value }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = () => {
      start += 2;
      if (start >= value) { setDisplayed(value); return; }
      setDisplayed(start);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span className="score-big">{displayed}</span>;
}

export default function OutreachOptimizer() {
  const [icp, setIcp] = useState("");
  const [channel, setChannel] = useState("cold-email");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  const analyze = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    const systemPrompt = `You are an expert B2B outreach strategist. Analyze the given outreach message and respond ONLY with a valid JSON object (no markdown, no preamble).

JSON schema:
{
  "overall": <integer 0-100>,
  "scores": {
    "personalization": <integer 0-100>,
    "clarity": <integer 0-100>,
    "value_prop": <integer 0-100>,
    "cta": <integer 0-100>,
    "subject": <integer 0-100>
  },
  "rewritten": "<full rewritten message, preserve line breaks with \\n>",
  "subjects": ["<subject line 1>", "<subject line 2>", "<subject line 3>"],
  "insights": ["<insight 1>", "<insight 2>", "<insight 3>", "<insight 4>"]
}

Scoring: personalization 25%, value_prop 30%, clarity 20%, cta 15%, subject 10%.
Rewrite to be concise, human, and high-converting.`;

    const userPrompt = `Channel: ${channel}\nICP: ${icp || "Not specified"}\n\nMessage:\n${message}`;

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(parsed);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError("Analysis failed. Check your message and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const [vClass, vLabel] = result ? verdictLabel(result.overall) : ["", ""];

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div className="app">
        <div className="header">
          <div className="logo-block">
            <div className="logo-tag">GenAI Tool · v1.0</div>
            <div className="logo-title">Outreach<span>OS</span></div>
          </div>
          <div className="header-meta">
            <div>Score · Rewrite · Subject Lines</div>
            <div>B2B Cold Outreach Optimizer</div>
          </div>
        </div>

        <div className="section-label">01 · Context</div>
        <div className="input-grid">
          <div className="field">
            <label>ICP / Target Persona</label>
            <input value={icp} onChange={e => setIcp(e.target.value)} placeholder="e.g. SaaS CTOs at 50-200 person startups" />
          </div>
          <div className="field">
            <label>Channel</label>
            <select value={channel} onChange={e => setChannel(e.target.value)}>
              <option value="cold-email">Cold Email</option>
              <option value="linkedin">LinkedIn DM</option>
              <option value="linkedin-inmail">LinkedIn InMail</option>
              <option value="twitter-dm">Twitter / X DM</option>
            </select>
          </div>
        </div>

        <div className="section-label">02 · Your Message</div>
        <div className="field msg-field" style={{ marginBottom: "12px" }}>
          <label>Paste your outreach copy</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={"Subject: Quick question\n\nHi [Name],\n\nI noticed you're scaling your sales team..."} />
        </div>

        <button className="analyze-btn" onClick={analyze} disabled={loading || !message.trim()}>
          {loading ? "Analyzing..." : "→ Analyze & Rewrite"}
        </button>

        {loading && <div className="loading-bar"><div className="loading-bar-fill" /></div>}
        {error && <div className="error-box">{error}</div>}

        {result && (
          <div className="results" ref={resultRef}>
            <div className="results-header">
              <div>
                <div className="score-label" style={{ marginBottom: 6 }}>Overall Score</div>
                <div className="overall-score">
                  <AnimatedScore value={result.overall} />
                  <span className="score-denom">/100</span>
                </div>
              </div>
              <div className={`verdict-pill verdict-${vClass}`}>{vLabel}</div>
            </div>

            <div className="score-grid">
              {Object.entries(result.scores).map(([key, val]) => (
                <div className="score-card" key={key}>
                  <div className="score-card-label">{key.replace("_", " ")}</div>
                  <div className="score-card-val" style={{ color: scoreColor(val) }}>{val}</div>
                  <div className="score-bar">
                    <div className="score-bar-fill" style={{ width: `${val}%`, background: scoreColor(val) }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="block">
              <div className="block-head">
                <div className="block-title">↗ Rewritten Message</div>
                <button className="copy-btn" onClick={() => copy(result.rewritten)}>{copied ? "Copied!" : "Copy"}</button>
              </div>
              <div className="rewritten-text">{result.rewritten}</div>
            </div>

            <div className="block">
              <div className="block-head"><div className="block-title">Subject Line Variants</div></div>
              <div className="subjects">
                {result.subjects.map((s, i) => (
                  <div className="subject-item" key={i}>
                    <span className="subject-num">0{i + 1}</span>
                    <span className="subject-text">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="block">
              <div className="block-head"><div className="block-title">Diagnosis</div></div>
              <div className="insights-list">
                {result.insights.map((ins, i) => (
                  <div className="insight-item" key={i}>
                    <div className="insight-dot" />
                    <span>{ins}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}