import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Droplet,
  Coffee,
  Sun,
  Moon,
  Apple,
  Footprints,
  Dumbbell,
  Zap,
  NotebookPen,
  Quote,
  Check,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react';

// ---------- storage helpers ----------
const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultState = () => ({
  date: todayKey(),
  morning: { water: false, coffee: false, fasting: false },
  lunch: { chicken: false, rice: false, water: false, veggies: false },
  walk: { done: false, seconds: 0 },
  shake: { done: false, withWater: false },
  workout: {
    pushups: [false, false, false],
    squats: [false, false, false],
    plank: [false, false, false],
    jacks: [false, false],
  },
  dinner: { protein: false, avoid: false, water: false },
  water: 0,
  notes: { energy: '', hunger: '', weight: '', mood: '' },
  streak: 0,
  lastCompleted: null,
});

const QUOTES = [
  "Body recomposition rewards the patient. Show up, don't burn out.",
  "Skinny fat isn't fixed with starvation — it's fixed with protein and consistency.",
  'Muscle is earned in months, not minutes. Protect it on every plate.',
  "Discipline is doing the boring thing on the day you don't feel like it.",
  "You're not on a diet. You're building a body that lasts.",
  'Walks count. Pushups count. Today counts.',
  'Definition is just consistency, made visible.',
  "Eat enough protein. Move every day. Sleep. Repeat. That's the secret.",
  "Perfection isn't the goal — a streak you can sustain is.",
  'Lean comes from years of average days done well.',
];

function Card({
  icon: Icon,
  title,
  accent = 'amber',
  right,
  children,
  delay = 0,
}) {
  const accents = {
    amber: 'text-amber-300',
    cyan: 'text-cyan-300',
    rose: 'text-rose-300',
    lime: 'text-lime-300',
    violet: 'text-violet-300',
    sky: 'text-sky-300',
    orange: 'text-orange-300',
  };
  return (
    <div
      className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 sm:p-6 transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.035] animate-[fadeUp_0.6s_ease-out_both]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center ${accents[accent]}`}
          >
            <Icon className="w-4 h-4" strokeWidth={2} />
          </div>
          <h3 className="text-[13px] uppercase tracking-[0.18em] text-neutral-300 font-medium">
            {title}
          </h3>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function CheckItem({ checked, onToggle, label, sub }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg hover:bg-white/[0.03] transition-colors text-left group/item"
    >
      <span
        className={`relative w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-300 ${
          checked
            ? 'bg-amber-300 border-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.35)]'
            : 'border-white/15 bg-white/[0.02] group-hover/item:border-white/30'
        }`}
      >
        <Check
          className={`w-3.5 h-3.5 text-neutral-950 transition-all duration-300 ${
            checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          strokeWidth={3.5}
        />
      </span>
      <span className="flex-1 min-w-0">
        <span
          className={`block text-[15px] transition-colors ${
            checked
              ? 'text-neutral-500 line-through decoration-neutral-700'
              : 'text-neutral-100'
          }`}
        >
          {label}
        </span>
        {sub && (
          <span className="block text-xs text-neutral-500 mt-0.5">{sub}</span>
        )}
      </span>
    </button>
  );
}

function SetButton({ done, onClick, n }) {
  return (
    <button
      onClick={onClick}
      className={`relative h-11 rounded-lg border text-sm font-medium transition-all duration-300 active:scale-95 ${
        done
          ? 'bg-amber-300 border-amber-300 text-neutral-950 shadow-[0_0_24px_rgba(252,211,77,0.25)]'
          : 'border-white/10 bg-white/[0.02] text-neutral-300 hover:border-white/25 hover:bg-white/[0.04]'
      }`}
    >
      Set {n}
    </button>
  );
}

export default function App() {
  const [state, setState] = useState(defaultState());
  const [quote, setQuote] = useState(QUOTES[0]);
  const [hydrated, setHydrated] = useState(false);
  const [running, setRunning] = useState(false);
  const tickRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('fitdash:v1');
      const streakRaw = localStorage.getItem('fitdash:streak');
      const lastDayRaw = localStorage.getItem('fitdash:lastDay');
      const today = todayKey();
      let next = defaultState();
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.date === today) next = { ...next, ...parsed };
      }
      next.streak = parseInt(streakRaw || '0', 10) || 0;
      next.lastCompleted = lastDayRaw || null;
      setState(next);
    } catch (e) {}
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('fitdash:v1', JSON.stringify(state));
    } catch (e) {}
  }, [state, hydrated]);

  useEffect(() => {
    if (running) {
      tickRef.current = setInterval(() => {
        setState((s) => ({
          ...s,
          walk: { ...s.walk, seconds: s.walk.seconds + 1 },
        }));
      }, 1000);
    } else if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    return () => tickRef.current && clearInterval(tickRef.current);
  }, [running]);

  const tasks = (() => {
    const t = [];
    t.push(state.morning.water, state.morning.fasting);
    t.push(state.lunch.chicken, state.lunch.rice, state.lunch.water);
    t.push(state.walk.done);
    t.push(state.shake.done);
    t.push(
      ...state.workout.pushups,
      ...state.workout.squats,
      ...state.workout.plank,
      ...state.workout.jacks
    );
    t.push(state.dinner.protein, state.dinner.avoid, state.dinner.water);
    t.push(state.water >= 8);
    return t;
  })();
  const done = tasks.filter(Boolean).length;
  const total = tasks.length;
  const pct = Math.round((done / total) * 100);

  useEffect(() => {
    if (!hydrated) return;
    if (pct === 100 && state.lastCompleted !== state.date) {
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .slice(0, 10);
      const nextStreak =
        state.lastCompleted === yesterday ? state.streak + 1 : 1;
      setState((s) => ({ ...s, streak: nextStreak, lastCompleted: s.date }));
      try {
        localStorage.setItem('fitdash:streak', String(nextStreak));
        localStorage.setItem('fitdash:lastDay', state.date);
      } catch (e) {}
    }
  }, [pct, hydrated]);

  const tog = (path) => {
    setState((s) => {
      const next = JSON.parse(JSON.stringify(s));
      const keys = path.split('.');
      let ref = next;
      for (let i = 0; i < keys.length - 1; i++) ref = ref[keys[i]];
      ref[keys[keys.length - 1]] = !ref[keys[keys.length - 1]];
      return next;
    });
  };

  const togSet = (ex, i) => {
    setState((s) => {
      const next = JSON.parse(JSON.stringify(s));
      next.workout[ex][i] = !next.workout[ex][i];
      return next;
    });
  };

  const setNote = (key, val) =>
    setState((s) => ({ ...s, notes: { ...s.notes, [key]: val } }));
  const setWater = (n) =>
    setState((s) => ({ ...s, water: n === s.water ? n - 1 : n }));

  const resetDay = () => {
    if (confirm("Reset today's progress? Your streak stays intact.")) {
      setState((s) => ({
        ...defaultState(),
        streak: s.streak,
        lastCompleted: s.lastCompleted,
      }));
    }
  };

  const proteinEst =
    (state.lunch.chicken ? 35 : 0) +
    (state.lunch.rice ? 5 : 0) +
    (state.lunch.veggies ? 3 : 0);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  };
  const walkMinutes = Math.floor(state.walk.seconds / 60);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[440px] h-[440px] rounded-full bg-orange-500/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[380px] h-[380px] rounded-full bg-rose-500/[0.05] blur-[120px]" />
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .font-display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.02em; }
        .font-mono-d { font-family: 'JetBrains Mono', ui-monospace, monospace; }
      `}</style>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@400;500&display=swap"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="flex items-start justify-between mb-10 sm:mb-14 animate-[fadeUp_0.6s_ease-out_both]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-amber-300/80 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Operating System</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.95]">
              Recomp.<span className="text-amber-300">Daily</span>
            </h1>
            <p className="text-neutral-400 mt-3 text-sm sm:text-base max-w-md">
              Lose fat. Keep muscle. Build the kind of consistency that quietly
              changes everything.
            </p>
          </div>
          <button
            onClick={resetDay}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-xs text-neutral-400 hover:text-neutral-100 hover:border-white/20 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset day
          </button>
        </header>

        <section
          className="mb-8 animate-[fadeUp_0.6s_ease-out_both]"
          style={{ animationDelay: '80ms' }}
        >
          <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 sm:p-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
              <div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-neutral-500 mb-3">
                  <TrendingUp className="w-3.5 h-3.5" /> Today's progress
                </div>
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-display text-7xl sm:text-8xl text-white tabular-nums leading-none">
                    {pct}
                  </span>
                  <span className="font-display text-3xl text-amber-300">
                    %
                  </span>
                  <span className="text-neutral-500 text-sm ml-2 mb-2">
                    {done} / {total} done
                  </span>
                </div>
                <div className="relative h-2 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-orange-300 transition-all duration-700 ease-out shadow-[0_0_24px_rgba(252,211,77,0.4)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-4 text-sm text-neutral-400 max-w-lg">
                  {pct < 25 &&
                    'Slow start is still a start. Knock out the easy ones first.'}
                  {pct >= 25 &&
                    pct < 60 &&
                    'Good momentum — keep stacking small wins.'}
                  {pct >= 60 &&
                    pct < 100 &&
                    "You're in the back half. Don't coast — finish."}
                  {pct === 100 &&
                    'Day complete. This is what compounding looks like.'}
                </p>
              </div>

              <div className="flex md:flex-col gap-4 md:gap-3 md:items-end">
                <div className="flex-1 md:flex-none rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] px-5 py-4 min-w-[140px]">
                  <div className="flex items-center gap-2 text-amber-300/80 text-[11px] uppercase tracking-[0.18em] mb-1">
                    <Flame className="w-3.5 h-3.5" /> Streak
                  </div>
                  <div className="font-display text-4xl text-white tabular-nums">
                    {state.streak}
                    <span className="text-amber-300/60 text-xl ml-1">d</span>
                  </div>
                </div>
                <div className="flex-1 md:flex-none rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 min-w-[140px]">
                  <div className="flex items-center gap-2 text-neutral-400 text-[11px] uppercase tracking-[0.18em] mb-1">
                    <Award className="w-3.5 h-3.5" /> Goal
                  </div>
                  <div className="text-white text-sm font-medium leading-tight">
                    Body
                    <br />
                    recomposition
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mb-8 animate-[fadeUp_0.6s_ease-out_both]"
          style={{ animationDelay: '160ms' }}
        >
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 flex gap-4 items-start">
            <Quote className="w-5 h-5 text-amber-300 shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-display text-lg sm:text-xl text-neutral-100 leading-snug">
                "{quote}"
              </p>
              <button
                onClick={() =>
                  setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
                }
                className="mt-3 text-xs uppercase tracking-[0.18em] text-amber-300/80 hover:text-amber-300 transition"
              >
                Another →
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <Card icon={Sun} title="Morning · Fasting" accent="amber" delay={200}>
            <CheckItem
              checked={state.morning.water}
              onToggle={() => tog('morning.water')}
              label="Drink a full glass of water"
              sub="Wake up dehydrated. Fix it first."
            />
            <CheckItem
              checked={state.morning.coffee}
              onToggle={() => tog('morning.coffee')}
              label="Coffee"
              sub="Optional — black or with minimal calories"
            />
            <CheckItem
              checked={state.morning.fasting}
              onToggle={() => tog('morning.fasting')}
              label="Maintain fast until 12 PM"
              sub="Water, coffee, tea only"
            />
          </Card>

          <Card
            icon={Apple}
            title="Lunch · 12 PM"
            accent="lime"
            delay={260}
            right={
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  Est. protein
                </div>
                <div className="font-mono-d text-lime-300 text-sm">
                  ~{proteinEst}g
                </div>
              </div>
            }
          >
            <CheckItem
              checked={state.lunch.chicken}
              onToggle={() => tog('lunch.chicken')}
              label="Chicken (palm-sized portion)"
              sub="~150g cooked = ~35g protein"
            />
            <CheckItem
              checked={state.lunch.rice}
              onToggle={() => tog('lunch.rice')}
              label="Moderate rice portion"
              sub="~1 cup cooked, fist-sized"
            />
            <CheckItem
              checked={state.lunch.water}
              onToggle={() => tog('lunch.water')}
              label="Drink water with the meal"
            />
            <CheckItem
              checked={state.lunch.veggies}
              onToggle={() => tog('lunch.veggies')}
              label="Add vegetables"
              sub="Optional but recommended"
            />
          </Card>

          <Card
            icon={Footprints}
            title="Walking · 30–45 min"
            accent="cyan"
            delay={320}
            right={
              <div className="font-mono-d text-cyan-300 text-lg tabular-nums">
                {fmt(state.walk.seconds)}
              </div>
            }
          >
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setRunning((r) => !r)}
                className="flex-1 h-11 rounded-lg bg-cyan-300 text-neutral-950 font-medium text-sm flex items-center justify-center gap-2 hover:bg-cyan-200 transition active:scale-95"
              >
                {running ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />{' '}
                    {state.walk.seconds > 0 ? 'Resume' : 'Start'}
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setState((s) => ({ ...s, walk: { ...s.walk, seconds: 0 } }));
                }}
                className="px-4 h-11 rounded-lg border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-neutral-100 hover:border-white/25 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="relative h-1.5 rounded-full bg-white/[0.05] overflow-hidden mb-3">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-cyan-300 transition-all duration-500"
                style={{ width: `${Math.min(100, (walkMinutes / 30) * 100)}%` }}
              />
            </div>
            <div className="text-xs text-neutral-500 mb-3">
              {walkMinutes} of 30 minutes minimum
            </div>
            <CheckItem
              checked={state.walk.done}
              onToggle={() => tog('walk.done')}
              label="Walk complete"
              sub={
                walkMinutes >= 30
                  ? '✓ Hit your minimum'
                  : 'Mark when done — even short walks count'
              }
            />
          </Card>

          <Card icon={Zap} title="Protein Shake" accent="violet" delay={380}>
            <CheckItem
              checked={state.shake.done}
              onToggle={() => tog('shake.done')}
              label="Drink 1 protein shake"
              sub="~25–30g protein. Anchor of your day."
            />
            <CheckItem
              checked={state.shake.withWater}
              onToggle={() => tog('shake.withWater')}
              label="Mixed with water"
              sub="Lower calories than milk"
            />
          </Card>

          <div className="md:col-span-2">
            <Card
              icon={Dumbbell}
              title="Home Workout · 15–20 min"
              accent="rose"
              delay={440}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
                  <div className="flex items-baseline justify-between mb-3">
                    <h4 className="text-neutral-100 font-medium">Pushups</h4>
                    <span className="text-xs text-neutral-500">3 × 10–15</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {state.workout.pushups.map((d, i) => (
                      <SetButton
                        key={i}
                        done={d}
                        n={i + 1}
                        onClick={() => togSet('pushups', i)}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
                  <div className="flex items-baseline justify-between mb-3">
                    <h4 className="text-neutral-100 font-medium">
                      Bodyweight Squats
                    </h4>
                    <span className="text-xs text-neutral-500">3 × 15–20</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {state.workout.squats.map((d, i) => (
                      <SetButton
                        key={i}
                        done={d}
                        n={i + 1}
                        onClick={() => togSet('squats', i)}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
                  <div className="flex items-baseline justify-between mb-3">
                    <h4 className="text-neutral-100 font-medium">Plank</h4>
                    <span className="text-xs text-neutral-500">3 × 30 sec</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {state.workout.plank.map((d, i) => (
                      <SetButton
                        key={i}
                        done={d}
                        n={i + 1}
                        onClick={() => togSet('plank', i)}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
                  <div className="flex items-baseline justify-between mb-3">
                    <h4 className="text-neutral-100 font-medium">
                      Jumping Jacks
                    </h4>
                    <span className="text-xs text-neutral-500">2 × 20–30</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {state.workout.jacks.map((d, i) => (
                      <SetButton
                        key={i}
                        done={d}
                        n={i + 1}
                        onClick={() => togSet('jacks', i)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-rose-300/[0.04] border border-rose-300/15 p-3 text-xs text-rose-100/70 leading-relaxed">
                <strong className="text-rose-200">Form over reps.</strong> Slow,
                controlled movements build muscle. Rushed sets just burn
                calories — and you have lifting to do for years, not days.
              </div>
            </Card>
          </div>

          <Card icon={Moon} title="Dinner" accent="orange" delay={500}>
            <CheckItem
              checked={state.dinner.protein}
              onToggle={() => tog('dinner.protein')}
              label="Protein-focused dinner"
              sub="Eggs, fish, lean meat, beans, tofu"
            />
            <CheckItem
              checked={state.dinner.avoid}
              onToggle={() => tog('dinner.avoid')}
              label="Avoid bread / fried food / soda"
              sub="The recomp killers"
            />
            <CheckItem
              checked={state.dinner.water}
              onToggle={() => tog('dinner.water')}
              label="Drink water with dinner"
            />
          </Card>

          <Card
            icon={Droplet}
            title="Water · 8 glasses"
            accent="sky"
            delay={560}
            right={
              <div className="font-mono-d text-sky-300 text-sm tabular-nums">
                {state.water}/8
              </div>
            }
          >
            <div className="grid grid-cols-8 gap-1.5 mb-3">
              {Array.from({ length: 8 }).map((_, i) => {
                const filled = i < state.water;
                return (
                  <button
                    key={i}
                    onClick={() => setWater(i + 1)}
                    className={`relative aspect-[3/4] rounded-md border transition-all duration-300 active:scale-90 overflow-hidden ${
                      filled
                        ? 'border-sky-300/40 bg-sky-300/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                    }`}
                  >
                    <span
                      className={`absolute left-0 right-0 bottom-0 bg-gradient-to-t from-sky-400 to-sky-300 transition-all duration-500 ${
                        filled ? 'h-full' : 'h-0'
                      }`}
                    />
                    <Droplet
                      className={`relative w-3.5 h-3.5 mx-auto mt-1 transition-colors ${
                        filled ? 'text-white' : 'text-neutral-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-neutral-500">
              Tap to fill. Tap a filled glass to drain it.
            </div>
          </Card>

          <div className="md:col-span-2">
            <Card
              icon={NotebookPen}
              title="Daily Check-in"
              accent="amber"
              delay={620}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    key: 'energy',
                    label: 'Energy',
                    placeholder: 'Sluggish? Sharp? Why?',
                  },
                  {
                    key: 'hunger',
                    label: 'Hunger',
                    placeholder: 'When did it hit hardest?',
                  },
                  {
                    key: 'weight',
                    label: 'Weight',
                    placeholder: 'lb — log only weekly trends',
                  },
                  {
                    key: 'mood',
                    label: 'Mood',
                    placeholder: 'One word is fine.',
                  },
                ].map((f) => (
                  <label key={f.key} className="block">
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1.5">
                      {f.label}
                    </span>
                    <input
                      type="text"
                      value={state.notes[f.key]}
                      onChange={(e) => setNote(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full h-11 px-3.5 rounded-lg bg-white/[0.02] border border-white/[0.07] text-neutral-100 placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-300/40 focus:bg-white/[0.04] transition"
                    />
                  </label>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <section
          className="mt-10 sm:mt-14 animate-[fadeUp_0.6s_ease-out_both]"
          style={{ animationDelay: '700ms' }}
        >
          <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent p-6 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-amber-300/80 mb-2">
                  01 · Recomposition
                </div>
                <h4 className="font-display text-2xl text-white mb-2">
                  Not weight loss. Body change.
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  The scale is a liar at your stage. You want to lose fat{' '}
                  <em>and</em> build muscle — both can happen at once for
                  beginners. Track the mirror, not the number.
                </p>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-amber-300/80 mb-2">
                  02 · Protein first
                </div>
                <h4 className="font-display text-2xl text-white mb-2">
                  Eat your bodyweight in protein.
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Aim for ~150–170g of protein daily. Chicken, eggs, shake,
                  beans. Skinny fat exists because protein was missing — not
                  because food existed.
                </p>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-amber-300/80 mb-2">
                  03 · Consistency
                </div>
                <h4 className="font-display text-2xl text-white mb-2">
                  80% beats perfect.
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  A B+ day done daily for 6 months destroys an A+ week followed
                  by a quit. This dashboard exists because showing up every day
                  is the entire game.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 mb-4 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-neutral-600">
          <div>Built for one person, on one mission. Day {state.date}.</div>
          <button
            onClick={resetDay}
            className="sm:hidden flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 text-neutral-400"
          >
            <RotateCcw className="w-3 h-3" /> Reset day
          </button>
        </footer>
      </div>
    </div>
  );
}
