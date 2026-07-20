import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const TECHNIQUES = [
  {
    id: "box-breathing",
    icon: "🫁",
    title: "Box Breathing",
    tag: "~2 min",
    symptoms: ["panic"],
    teaser: "4-4-4-4 breathing to settle stress and panic symptoms.",
    body: [
      "Breathe in for 4 seconds, hold for 4, breathe out for 4, and hold for 4. Repeat for four to six rounds.",
      "Keep the breaths gentle rather than taking enormous breaths. Slow, controlled breathing can help settle stress and panic symptoms.",
    ],
    safety: "Skip the breath holds if they make you light-headed or more anxious — just breathe in and out gently instead.",
    type: "breathing",
    phases: [
      { label: "Breathe in", seconds: 4, scale: 1.45 },
      { label: "Hold", seconds: 4, scale: 1.45 },
      { label: "Breathe out", seconds: 4, scale: 1 },
      { label: "Hold", seconds: 4, scale: 1 },
    ],
    totalRounds: 6,
    doneMessage: "Nice work — you can stop here or start another round.",
  },
  {
    id: "longer-exhale",
    icon: "🌬️",
    title: "Longer-Exhale Breathing",
    tag: "2–5 min",
    symptoms: ["panic"],
    teaser: "Inhale 4s, exhale 6–8s — often easier than box breathing.",
    body: [
      "Breathe in gently through your nose for 4 seconds, then breathe out for 6 to 8 seconds. Repeat for two to five minutes.",
      "This is often easier than box breathing because there is no breath holding.",
    ],
    type: "breathing",
    phases: [
      { label: "Breathe in", seconds: 4, scale: 1.4 },
      { label: "Breathe out", seconds: 7, scale: 1 },
    ],
    totalRounds: null,
    note: "Aim for 2–5 minutes, then stop whenever you're ready.",
  },
  {
    id: "cold-face",
    icon: "❄️",
    title: "Cold-Face Reset",
    tag: "Needs water",
    symptoms: ["panic", "body-tension"],
    teaser: "Cool water or a damp cloth to interrupt a spike fast.",
    body: [
      "Splash cool water on your face, or hold a cool, damp cloth over your eyes and cheeks for 10 to 20 seconds. Pause, breathe normally, and repeat if helpful.",
      "Cold facial exposure can affect heart rate and blood pressure.",
    ],
    safety: "Avoid prolonged ice-water immersion. If you have a heart, circulation, or blood-pressure condition, use a cool cloth rather than extreme cold, and check with a clinician before trying this.",
    type: "countdown",
    options: [10, 20],
    defaultSeconds: 15,
    timerLabel: "Cool cloth or water",
  },
  {
    id: "grounding-54321",
    icon: "🖐️",
    title: "5-4-3-2-1 Grounding",
    tag: "Anywhere",
    symptoms: ["disconnection", "racing-thoughts"],
    teaser: "Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
    body: [
      "Slowly work through your senses. Describe specific details — texture, shape, temperature, distance, colour. Sensory grounding redirects attention toward your immediate surroundings.",
    ],
    type: "steps",
    steps: [
      { title: "5 things you can see", body: "Look around and name five things you can see. Notice their colour, shape, and distance from you." },
      { title: "4 things you can feel", body: "Notice four things you can physically feel — your clothes, the chair, the floor, the air on your skin." },
      { title: "3 things you can hear", body: "Listen for three sounds, near or far. Notice their pitch and rhythm." },
      { title: "2 things you can smell", body: "Notice two smells around you, even faint ones." },
      { title: "1 thing you can taste", body: "Notice one taste in your mouth right now, or take a sip of something and notice it fully." },
    ],
  },
  {
    id: "pmr",
    icon: "💪",
    title: "Progressive Muscle Relaxation",
    tag: "~5 min",
    symptoms: ["body-tension"],
    teaser: "Tense and release muscle groups to release physical tension.",
    body: [
      "Starting with your hands, gently tense one muscle group for about five seconds, then release it for 10 to 15 seconds and notice the difference. Continue through your arms, shoulders, face, stomach, and legs.",
    ],
    safety: "Do not tense an injured or painful area — skip that step and move to the next one.",
    type: "pmr",
    steps: [
      { title: "Hands", body: "Gently clench your hands into fists." },
      { title: "Arms", body: "Bend your elbows and flex your biceps." },
      { title: "Shoulders", body: "Raise your shoulders up toward your ears." },
      { title: "Face", body: "Scrunch your eyes, jaw, and forehead." },
      { title: "Stomach", body: "Tighten your stomach muscles." },
      { title: "Legs and feet", body: "Press your feet into the floor and tense your legs." },
    ],
  },
  {
    id: "orienting",
    icon: "🧭",
    title: "Orienting to the Present",
    tag: "Anywhere",
    symptoms: ["disconnection"],
    teaser: "State basic facts aloud to reconnect with here and now.",
    body: ["Look around and state basic facts aloud, for example:"],
    quote: "My name is [your name]. It is [today]. I am in [this room]. My feet are on the floor. I am experiencing anxiety, and I am safe enough to pause.",
    list: ["Doors", "Windows", "Furniture", "Other stable objects in the room"],
    tailBody: "Then identify those things around you. This can be useful when your thoughts feel unreal, chaotic, or disconnected from the present.",
    type: "none",
  },
  {
    id: "rhythmic-movement",
    icon: "🚶",
    title: "Rhythmic Movement",
    tag: "Movement",
    symptoms: ["body-tension"],
    teaser: "Walk, march, or shake it out to burn off adrenaline.",
    body: [
      "Walk briskly, climb stairs, shake out your arms, do wall pushes, or march in place for several minutes. Concentrate on the repeated motion and the contact between your feet and the ground.",
    ],
    safety: "Keep the intensity appropriate for your health and surroundings.",
    list: ["Walk briskly", "Climb stairs", "Shake out your arms", "Do wall push-ups", "March in place"],
    type: "countdown",
    options: [60, 120, 180, 300],
    defaultSeconds: 180,
    timerLabel: "Movement timer",
  },
  {
    id: "mindful-observation",
    icon: "🔍",
    title: "Mindful Observation",
    tag: "~1–2 min",
    symptoms: ["racing-thoughts"],
    teaser: "Study one object closely to anchor a racing mind.",
    body: [
      "Pick one object and study it for one to two minutes. Notice its colour, shadows, texture, edges, weight, and imperfections. Whenever your thoughts return to the upsetting situation, gently return to the object.",
    ],
    type: "countdown",
    options: [60, 90, 120],
    defaultSeconds: 90,
    timerLabel: "Observation timer",
  },
  {
    id: "calming-place",
    icon: "🏞️",
    title: "Calming-Place Visualization",
    tag: "Eyes closed",
    symptoms: ["disconnection"],
    teaser: "Build a safe place in your senses and rest there a moment.",
    body: [
      "Imagine a real or invented place where you feel secure. Build the scene through your senses, then picture yourself breathing slowly and moving safely through that location.",
    ],
    safety: "Stop and open your eyes if visualization makes you feel more distressed or disconnected.",
    list: ["What do you see?", "What do you hear?", "What do you smell?", "What do you feel?", "What do you taste?"],
    type: "countdown",
    options: [60, 120],
    defaultSeconds: 120,
    timerLabel: "Time in the scene",
  },
  {
    id: "name-normalize-delay",
    icon: "🏷️",
    title: "Name, Normalize, and Delay",
    tag: "Anywhere",
    symptoms: ["racing-thoughts"],
    teaser: "Put the feeling into words without needing to act on it.",
    body: ["Put the experience into words, for example:"],
    quotes: [
      "I notice anger in my chest.",
      "My mind is telling me I am being dismissed.",
      "This feeling is intense, but I do not need to act on it immediately.",
    ],
    type: "countdown",
    options: [120, 300, 600],
    defaultSeconds: 300,
    timerLabel: "Optional: pause before you decide",
  },
  {
    id: "butterfly-hug",
    icon: "🦋",
    title: "Butterfly Hug",
    tag: "~1 min",
    symptoms: ["body-tension", "panic"],
    teaser: "Cross your arms and tap gently, left-right, to self-soothe.",
    body: [
      "Cross your arms over your chest, hands resting near your opposite shoulders. Alternate gently tapping your left and right sides, like a slow, steady heartbeat.",
      "This alternating touch is a simple self-soothing technique that can help calm the nervous system when things feel like too much.",
    ],
    safety: "Stop if the tapping feels overstimulating rather than calming — not every grounding technique works the same way for everyone.",
    type: "breathing",
    phases: [
      { label: "Tap: left", seconds: 1, scale: 1.12 },
      { label: "Tap: right", seconds: 1, scale: 1 },
    ],
    totalRounds: 20,
    variant: "tap",
    doneMessage: "Well done — pause and notice how you feel.",
  },
  {
    id: "categories-game",
    icon: "🧩",
    title: "Categories Game",
    tag: "Anywhere",
    symptoms: ["racing-thoughts"],
    teaser: "Silently list items in a category to interrupt racing thoughts.",
    body: [
      "When you can't focus on your breath or senses — like when you're driving or in a meeting — try a short mental game instead. Silently list as many items as you can in a category before moving to the next one.",
      "This keeps your working memory occupied with something neutral, which can help crowd out anxious or racing thoughts.",
    ],
    type: "steps",
    steps: [
      { title: "Animals", body: "Silently name as many animals as you can think of." },
      { title: "Foods", body: "Silently name as many foods as you can think of." },
      { title: "Colours", body: "Silently name as many colours as you can think of." },
      { title: "Places", body: "Silently name as many countries or cities as you can think of." },
      { title: "Things in this room", body: "Silently name as many objects around you as you can think of." },
    ],
  },
];

const SYMPTOMS = [
  { id: "racing-thoughts", label: "Racing thoughts" },
  { id: "body-tension", label: "Body tension" },
  { id: "panic", label: "Panic" },
  { id: "disconnection", label: "Disconnection" },
];

function formatSeconds(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function useStopwatch() {
  const [running, setRunning] = useState(false);
  const [, forceTick] = useState(0);
  const accumulatedRef = useRef(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (!running) return undefined;
    startRef.current = Date.now();
    const id = setInterval(() => forceTick((t) => t + 1), 100);
    return () => {
      clearInterval(id);
      accumulatedRef.current += Date.now() - startRef.current;
    };
  }, [running]);

  const elapsedMs = accumulatedRef.current + (running ? Date.now() - (startRef.current || Date.now()) : 0);

  return {
    elapsedMs,
    running,
    start: () => setRunning(true),
    pause: () => setRunning(false),
    reset: () => {
      setRunning(false);
      accumulatedRef.current = 0;
      forceTick((t) => t + 1);
    },
  };
}

function BreathingTool({ phases, totalRounds, variant = "breath", note, doneMessage = "Nice work — round complete." }) {
  const { elapsedMs, running, start, pause, reset } = useStopwatch();
  const cycleMs = phases.reduce((s, p) => s + p.seconds * 1000, 0);

  let phaseIdx = 0;
  let round = 1;
  let msIntoPhase = 0;
  let done = false;

  if (totalRounds && elapsedMs >= cycleMs * totalRounds) {
    done = true;
    round = totalRounds;
    phaseIdx = phases.length - 1;
    msIntoPhase = phases[phaseIdx].seconds * 1000;
  } else {
    round = Math.floor(elapsedMs / cycleMs) + 1;
    let t = elapsedMs % cycleMs;
    for (let i = 0; i < phases.length; i++) {
      const durMs = phases[i].seconds * 1000;
      if (t < durMs) {
        phaseIdx = i;
        msIntoPhase = t;
        break;
      }
      t -= durMs;
    }
  }

  useEffect(() => {
    if (done && running) pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, running]);

  const phase = phases[phaseIdx];
  const secondsLeft = Math.max(0, Math.ceil((phase.seconds * 1000 - msIntoPhase) / 1000));
  const scale = done ? phases[phases.length - 1].scale : phase.scale;

  return (
    <div className="tool breathing-tool">
      <div className="breath-circle-wrap">
        <div
          className={`breath-circle breath-circle--${variant}`}
          style={{ transform: `scale(${scale})`, transitionDuration: `${phase.seconds}s` }}
        >
          <div className="breath-circle-inner">
            <div className="breath-phase-label">{done ? "Done" : phase.label}</div>
            {!done && <div className="breath-seconds">{secondsLeft}</div>}
          </div>
        </div>
      </div>
      <div className="breath-meta">
        {totalRounds ? (
          <span>Round {round} of {totalRounds}</span>
        ) : (
          <span>Elapsed {formatSeconds(Math.floor(elapsedMs / 1000))}</span>
        )}
      </div>
      {note && <div className="tool-note">{note}</div>}
      <div className="tool-controls">
        {!running && !done && (
          <button className="btn btn-primary" onClick={start}>{elapsedMs > 0 ? "Resume" : "Start"}</button>
        )}
        {running && <button className="btn" onClick={pause}>Pause</button>}
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
      </div>
      {done && <div className="tool-done">{doneMessage}</div>}
    </div>
  );
}

function CountdownTool({ options, defaultSeconds, label }) {
  const [duration, setDuration] = useState(defaultSeconds);
  const { elapsedMs, running, start, pause, reset } = useStopwatch();
  const remainingMs = Math.max(0, duration * 1000 - elapsedMs);
  const isDone = elapsedMs >= duration * 1000 && elapsedMs > 0;

  useEffect(() => {
    if (isDone && running) pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone, running]);

  function handleDurationChange(sec) {
    reset();
    setDuration(sec);
  }

  return (
    <div className="tool countdown-tool">
      {label && <div className="tool-label">{label}</div>}
      <div className="duration-picker">
        {options.map((opt) => (
          <button
            key={opt}
            className={"chip" + (duration === opt ? " chip-active" : "")}
            onClick={() => handleDurationChange(opt)}
          >
            {formatSeconds(opt)}
          </button>
        ))}
      </div>
      <div className="countdown-display">{isDone ? "✓" : formatSeconds(remainingMs / 1000)}</div>
      <div className="tool-controls">
        {!running && !isDone && (
          <button className="btn btn-primary" onClick={start}>{elapsedMs > 0 ? "Resume" : "Start"}</button>
        )}
        {running && <button className="btn" onClick={pause}>Pause</button>}
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
      </div>
      {isDone && <div className="tool-done">Time's up — repeat if it helps.</div>}
    </div>
  );
}

function StepList({ steps }) {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  return (
    <div className="tool steps-tool">
      <div className="step-progress">Step {index + 1} of {steps.length}</div>
      <div className="step-dots">
        {steps.map((_, i) => (
          <span key={i} className={"dot" + (i === index ? " dot-active" : "")} />
        ))}
      </div>
      <h3 className="step-title">{step.title}</h3>
      <p className="step-body">{step.body}</p>
      <div className="tool-controls step-nav">
        <button className="btn btn-ghost" disabled={index === 0} onClick={() => setIndex(Math.max(0, index - 1))}>Back</button>
        <button
          className="btn btn-primary"
          disabled={index === steps.length - 1}
          onClick={() => setIndex(Math.min(steps.length - 1, index + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function PMRList({ steps }) {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const step = steps[index];

  if (finished) {
    return (
      <div className="tool steps-tool">
        <div className="tool-done">You've worked through every muscle group. Notice how your body feels now.</div>
        <div className="tool-controls">
          <button className="btn btn-ghost" onClick={() => { setIndex(0); setFinished(false); }}>Restart</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tool steps-tool">
      <div className="step-progress">Muscle group {index + 1} of {steps.length}</div>
      <h3 className="step-title">{step.title}</h3>
      <p className="step-body">{step.body}</p>
      <BreathingTool
        key={index}
        phases={[
          { label: "Tense", seconds: 5, scale: 1.12 },
          { label: "Release", seconds: 12, scale: 1 },
        ]}
        totalRounds={1}
        variant="pulse"
        doneMessage="Tension released."
      />
      <div className="tool-controls step-nav">
        <button className="btn btn-ghost" disabled={index === 0} onClick={() => setIndex(Math.max(0, index - 1))}>Back</button>
        <button className="btn btn-primary" onClick={() => (index === steps.length - 1 ? setFinished(true) : setIndex(index + 1))}>
          {index === steps.length - 1 ? "Finish" : "Next muscle group"}
        </button>
      </div>
    </div>
  );
}

function ToolFor({ tech }) {
  switch (tech.type) {
    case "breathing":
      return (
        <BreathingTool
          phases={tech.phases}
          totalRounds={tech.totalRounds}
          note={tech.note}
          doneMessage={tech.doneMessage}
          variant={tech.variant || "breath"}
        />
      );
    case "countdown":
      return <CountdownTool options={tech.options} defaultSeconds={tech.defaultSeconds} label={tech.timerLabel} />;
    case "steps":
      return <StepList steps={tech.steps} />;
    case "pmr":
      return <PMRList steps={tech.steps} />;
    default:
      return null;
  }
}

function Modal({ tech, onClose }) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (fullscreen) setFullscreen(false);
        else onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, fullscreen]);

  return (
    <div className={"overlay" + (fullscreen ? " overlay--full" : "")} onClick={onClose}>
      <div
        className={"modal" + (fullscreen ? " modal--full" : "")}
        role="dialog"
        aria-modal="true"
        aria-label={tech.title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-actions">
          <button
            className="modal-icon-btn"
            onClick={() => setFullscreen((f) => !f)}
            aria-label={fullscreen ? "Exit full screen" : "Full screen"}
          >
            {fullscreen ? "⤡" : "⤢"}
          </button>
          <button className="modal-icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-content">
          <div className="modal-icon" aria-hidden="true">{tech.icon}</div>
          <h2>{tech.title}</h2>
          {tech.body.map((p, i) => (
            <p className="modal-body-p" key={i}>{p}</p>
          ))}
          {tech.quote && <blockquote className="modal-quote">{tech.quote}</blockquote>}
          {tech.quotes && tech.quotes.map((q, i) => (
            <blockquote className="modal-quote" key={i}>{q}</blockquote>
          ))}
          {tech.list && (
            <ul className="modal-list">
              {tech.list.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          )}
          {tech.tailBody && <p className="modal-body-p">{tech.tailBody}</p>}
          {tech.safety && <div className="modal-safety">⚠️ {tech.safety}</div>}
          <div className="modal-tool-wrap">
            <ToolFor key={tech.id} tech={tech} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TechniqueCard({ tech, onOpen, suggested }) {
  return (
    <button
      className={"card" + (suggested ? " card--suggested" : "")}
      onClick={() => onOpen(tech.id)}
    >
      <div className="card-icon" aria-hidden="true">{tech.icon}</div>
      <h3>{tech.title}</h3>
      <p>{tech.teaser}</p>
      <div className="card-meta">
        <span className="card-tag">{tech.tag}</span>
        <span className="card-cta">Start →</span>
      </div>
    </button>
  );
}

export default function Home() {
  const [activeId, setActiveId] = useState(null);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const active = TECHNIQUES.find((t) => t.id === activeId) || null;
  const suggested = selectedSymptom
    ? TECHNIQUES.filter((t) => t.symptoms && t.symptoms.includes(selectedSymptom)).slice(0, 3)
    : [];

  return (
    <>
      <Head>
        <title>Grounded — Ease anxiety in the moment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Simple, evidence-informed techniques to ease anxiety right now." />
        <style>{`
:root {
  --bg-a: #eef5fb;
  --bg-b: #f7f0fb;
  --text: #1f2430;
  --text-soft: #565f73;
  --card-bg: rgba(255,255,255,0.72);
  --card-border: rgba(99,102,241,0.14);
  --card-shadow: 0 12px 30px rgba(60,70,110,0.10);
  --accent: #5b6bd6;
  --accent-soft: rgba(91,107,214,0.12);
  --accent-strong: #4453c4;
  --modal-bg: #ffffff;
  --safety-bg: rgba(240,171,60,0.14);
  --safety-text: #8a5a12;
  --quote-bg: rgba(91,107,214,0.07);
  --chip-bg: rgba(91,107,214,0.08);
  --chip-active-bg: #5b6bd6;
  --chip-active-text: #ffffff;
  --btn-ghost-text: #565f73;
  --divider: rgba(31,36,48,0.08);
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg-a: #10131f;
    --bg-b: #1a1530;
    --text: #eef0f6;
    --text-soft: #a7adc2;
    --card-bg: rgba(32,36,56,0.6);
    --card-border: rgba(165,180,252,0.14);
    --card-shadow: 0 12px 30px rgba(0,0,0,0.35);
    --accent: #a5b4fc;
    --accent-soft: rgba(165,180,252,0.14);
    --accent-strong: #c7d2fe;
    --modal-bg: #181c2e;
    --safety-bg: rgba(240,171,60,0.12);
    --safety-text: #f0c169;
    --quote-bg: rgba(165,180,252,0.08);
    --chip-bg: rgba(165,180,252,0.10);
    --chip-active-bg: #a5b4fc;
    --chip-active-text: #14172a;
    --btn-ghost-text: #a7adc2;
    --divider: rgba(255,255,255,0.08);
  }
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: linear-gradient(160deg, var(--bg-a) 0%, var(--bg-b) 100%);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
}
header { text-align: center; padding: 48px 20px 8px; }
header h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.3px; margin: 0; }
header .tagline { font-size: 15px; color: var(--text-soft); margin: 8px 0 0; }

main { max-width: 1080px; margin: 0 auto; padding: 32px 20px 24px; }

.hero { text-align: center; margin: 4px 0 36px; }
.hero-btn {
  border: none; border-radius: 999px; background: var(--accent); color: #fff;
  font-family: inherit; font-size: 17px; font-weight: 800; cursor: pointer;
  padding: 16px 34px; box-shadow: 0 14px 30px rgba(91,107,214,0.32);
  transition: transform 0.15s ease;
}
.hero-btn:hover { transform: translateY(-2px); }
.hero-btn:focus-visible { outline: 2px solid var(--accent-strong); outline-offset: 3px; }
.hero-sub { font-size: 13px; color: var(--text-soft); margin: 12px 0 0; }

.section-label {
  font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--text-soft); text-align: center; margin: 0 0 14px;
}

.symptom-picker { margin-bottom: 32px; }
.symptom-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.symptom-chip {
  border: 1px solid var(--card-border); background: var(--card-bg); color: var(--text);
  border-radius: 999px; padding: 10px 20px; font-size: 14px; font-weight: 700;
  cursor: pointer; font-family: inherit; backdrop-filter: blur(8px);
}
.symptom-chip-active { background: var(--accent); color: #fff; border-color: transparent; }
.symptom-chip:focus-visible { outline: 2px solid var(--accent-strong); outline-offset: 2px; }

.suggested { margin-bottom: 36px; }
.suggested-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px; max-width: 780px; margin: 0 auto;
}
.card--suggested { border-color: var(--accent); box-shadow: 0 16px 32px rgba(91,107,214,0.2); }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px; }

.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
  border-radius: 22px;
  padding: 26px 22px 22px;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  color: var(--text);
  backdrop-filter: blur(8px);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 190px;
}
.card:hover, .card:focus-visible { transform: translateY(-3px); box-shadow: 0 18px 34px rgba(60,70,110,0.16); }
.card:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.card-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 27px; }
.card h3 { font-size: 17px; margin: 4px 0 0; font-weight: 700; }
.card p { font-size: 13.5px; color: var(--text-soft); line-height: 1.45; margin: 0; flex: 1; }
.card-meta { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 8px; margin-top: 6px; }
.card-tag {
  font-size: 11px; font-weight: 700; color: var(--accent-strong); background: var(--accent-soft);
  padding: 3px 10px; border-radius: 999px; white-space: nowrap;
}
.card-cta { font-size: 13px; font-weight: 700; color: var(--accent-strong); }

.footer {
  max-width: 720px;
  margin: 20px auto 0;
  padding: 0 24px;
  text-align: center;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-soft);
}
.urgent-support {
  max-width: 640px;
  margin: 18px auto 60px;
  padding: 16px 22px;
  background: var(--safety-bg);
  color: var(--safety-text);
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.6;
  text-align: center;
}
.urgent-support a { color: inherit; font-weight: 700; text-decoration: underline; }

.overlay {
  position: fixed; inset: 0;
  background: rgba(15,17,30,0.45);
  backdrop-filter: blur(2px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  z-index: 50;
}
.modal {
  background: var(--modal-bg);
  color: var(--text);
  border-radius: 24px;
  max-width: 480px;
  width: 100%;
  max-height: 88vh;
  overflow-y: auto;
  padding: 30px 26px 26px;
  position: relative;
  box-shadow: 0 30px 80px rgba(0,0,0,0.35);
}
.modal-actions {
  position: absolute; top: 16px; right: 16px;
  display: flex; gap: 8px;
}
.modal-icon-btn {
  width: 32px; height: 32px; border-radius: 50%;
  border: none; background: var(--accent-soft); color: var(--text);
  font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.modal--full {
  max-width: 100%; width: 100%; height: 100%; max-height: 100%;
  border-radius: 0;
  display: flex; flex-direction: column;
  overflow-y: auto;
  padding: 0;
}
.overlay--full { padding: 0; }
.modal--full .modal-content {
  flex: 1;
  width: 100%;
  max-width: min(760px, 94vw);
  margin: 0 auto;
  padding: clamp(16px, 3.5vh, 40px) clamp(20px, 4vw, 40px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(2px, 0.6vh, 8px);
}
.modal--full .modal-icon { font-size: clamp(28px, 3.6vw, 40px); }
.modal--full h2 { font-size: clamp(22px, 3vw, 32px); margin: 4px 0 8px; }
.modal--full .modal-body-p { font-size: clamp(15px, 1.6vw, 18px); line-height: 1.6; margin: 0 0 8px; }
.modal--full .modal-quote { font-size: clamp(14px, 1.5vw, 17px); padding: clamp(10px, 1.4vw, 16px) clamp(14px, 1.8vw, 20px); }
.modal--full .modal-list { font-size: clamp(14px, 1.5vw, 17px); line-height: 1.6; }
.modal--full .modal-safety { font-size: clamp(13px, 1.3vw, 15px); padding: clamp(10px, 1.2vw, 14px) clamp(14px, 1.6vw, 18px); margin-bottom: 10px; }
.modal--full .tool-label { font-size: clamp(13px, 1.4vw, 16px); }
.modal--full .tool-note,
.modal--full .breath-meta,
.modal--full .step-progress { font-size: clamp(12px, 1.2vw, 14px); }
.modal--full .tool-done { font-size: clamp(14px, 1.6vw, 18px); }
.modal--full .btn { font-size: clamp(13px, 1.4vw, 15px); padding: clamp(9px, 1.2vw, 12px) clamp(16px, 2vw, 22px); }
.modal--full .breath-circle-wrap,
.modal--full .breath-circle {
  --circle-base: clamp(120px, 16vw, 190px);
}
.modal--full .tool { gap: clamp(6px, 1vh, 12px); }
.modal--full .modal-tool-wrap { padding-top: clamp(10px, 1.6vh, 18px); }
.modal--full .breath-phase-label { font-size: clamp(13px, 1.6vw, 17px); }
.modal--full .breath-seconds { font-size: clamp(24px, 3.6vw, 40px); }
.modal--full .countdown-display { font-size: clamp(34px, 5vw, 60px); }
.modal--full .chip { font-size: clamp(12px, 1.3vw, 15px); padding: clamp(6px, 0.9vw, 9px) clamp(12px, 1.6vw, 18px); }
.modal--full .step-title { font-size: clamp(18px, 2.2vw, 24px); }
.modal--full .step-body { font-size: clamp(14px, 1.6vw, 17px); }
.modal-icon { font-size: 34px; }
.modal h2 { font-size: 21px; margin: 10px 0 14px; }
.modal-body-p { font-size: 14.5px; line-height: 1.65; color: var(--text-soft); margin: 0 0 12px; }
.modal-quote {
  margin: 0 0 12px; padding: 12px 16px;
  background: var(--quote-bg); border-left: 3px solid var(--accent);
  border-radius: 8px; font-size: 14px; font-style: italic; color: var(--text);
  line-height: 1.55;
}
.modal-list { margin: 0 0 14px; padding-left: 20px; font-size: 14px; color: var(--text-soft); line-height: 1.7; }
.modal-safety {
  font-size: 13px; line-height: 1.55; color: var(--safety-text);
  background: var(--safety-bg); border-radius: 10px; padding: 10px 14px; margin-bottom: 18px;
}
.modal-tool-wrap { border-top: 1px solid var(--divider); padding-top: 18px; margin-top: 4px; }

.tool { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.tool-label { font-size: 13px; font-weight: 700; color: var(--text-soft); }
.tool-note { font-size: 12.5px; color: var(--text-soft); }
.tool-done { font-size: 13.5px; font-weight: 600; color: var(--accent-strong); }

.tool-controls { display: flex; gap: 10px; }
.btn {
  border: none; border-radius: 999px; padding: 9px 18px; font-size: 13.5px; font-weight: 700;
  cursor: pointer; font-family: inherit; background: var(--accent-soft); color: var(--text);
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-ghost { background: transparent; color: var(--btn-ghost-text); border: 1px solid var(--divider); }
.btn:disabled { opacity: 0.4; cursor: default; }

.breath-circle-wrap {
  --circle-base: 150px;
  width: calc(var(--circle-base) * 1.53); height: calc(var(--circle-base) * 1.53);
  display: flex; align-items: center; justify-content: center;
  margin: 6px 0 2px;
}
.breath-circle {
  --circle-base: 150px;
  width: var(--circle-base); height: var(--circle-base); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition-property: transform; transition-timing-function: ease-in-out;
}
.breath-circle--breath { background: radial-gradient(circle at 35% 30%, #b9c6ff, var(--accent)); }
.breath-circle--pulse { background: radial-gradient(circle at 35% 30%, #ffd9a0, #e8a33f); }
.breath-circle--tap { background: radial-gradient(circle at 35% 30%, #a7f3d0, #10b981); }
.breath-circle-inner { color: #fff; text-align: center; }
.breath-phase-label { font-size: 13.5px; font-weight: 700; }
.breath-seconds { font-size: 26px; font-weight: 800; }
.breath-meta { font-size: 13px; color: var(--text-soft); font-weight: 600; }

.duration-picker { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.chip {
  border: 1px solid var(--divider); background: var(--chip-bg); color: var(--text);
  border-radius: 999px; padding: 6px 14px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit;
}
.chip-active { background: var(--chip-active-bg); color: var(--chip-active-text); border-color: transparent; }
.countdown-display { font-size: 40px; font-weight: 800; color: var(--accent-strong); font-variant-numeric: tabular-nums; }

.steps-tool { width: 100%; }
.step-progress { font-size: 12.5px; font-weight: 700; color: var(--text-soft); text-transform: uppercase; letter-spacing: 0.4px; }
.step-dots { display: flex; gap: 6px; justify-content: center; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--divider); }
.dot-active { background: var(--accent); }
.step-title { font-size: 17px; margin: 2px 0 0; }
.step-body { font-size: 14px; color: var(--text-soft); line-height: 1.55; margin: 0; }
.step-nav { width: 100%; justify-content: center; }

@media (max-width: 480px) {
  header h1 { font-size: 25px; }
  .modal { padding: 26px 18px 22px; border-radius: 18px; }
}
        `}</style>
      </Head>

      <header>
        <h1>🌿 Grounded</h1>
        <p className="tagline">Simple ways to ease anxiety, right now.</p>
      </header>

      <main>
        <section className="hero">
          <button className="hero-btn" onClick={() => setActiveId("longer-exhale")}>
            Start with a simple reset →
          </button>
          <p className="hero-sub">Not sure where to begin? This is a gentle breathing exercise to try first.</p>
        </section>

        <section className="symptom-picker">
          <h2 className="section-label">What feels strongest right now?</h2>
          <div className="symptom-row">
            {SYMPTOMS.map((s) => (
              <button
                key={s.id}
                className={"symptom-chip" + (selectedSymptom === s.id ? " symptom-chip-active" : "")}
                aria-pressed={selectedSymptom === s.id}
                onClick={() => setSelectedSymptom((cur) => (cur === s.id ? null : s.id))}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {suggested.length > 0 && (
          <section className="suggested">
            <h2 className="section-label">Suggested for you</h2>
            <div className="suggested-grid">
              {suggested.map((t) => (
                <TechniqueCard key={t.id} tech={t} onOpen={setActiveId} suggested />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="section-label">All techniques</h2>
          <div className="grid">
            {TECHNIQUES.map((t) => (
              <TechniqueCard key={t.id} tech={t} onOpen={setActiveId} />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        These techniques can help in the moment, but they aren't a substitute for professional support.
      </footer>
      <div className="urgent-support">
        <strong>If you're in crisis:</strong> call or text <strong>988</strong> (US &amp; Canada), free and available
        24/7. Outside North America, find a local helpline at{" "}
        <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">findahelpline.com</a>.
      </div>

      {active && <Modal tech={active} onClose={() => setActiveId(null)} />}
    </>
  );
}
