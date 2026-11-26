import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  ChevronRight,
  CircleCheck,
  Clock3,
  FileCheck2,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Landmark,
  LoaderCircle,
  MapPin,
  Network,
  ShieldCheck,
  Sparkles,
  UserRound,
  UserRoundPlus,
  UsersRound,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  calculatePayout,
  cities,
  filterTalent,
  initialTalent,
  locations,
  SALARY_MAX,
  SALARY_MIN,
  tracks,
  TRIAL_WEEKS,
  type Country,
  type Talent,
} from "@/lib/talent";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BorderlessBridge — Talent Without Borders" },
      {
        name: "description",
        content:
          "Discover skills-verified global talent, explore talent passports, and simulate compliant international hiring.",
      },
      { property: "og:title", content: "BorderlessBridge — Talent Without Borders" },
      {
        property: "og:description",
        content: "Verified skills. Compliant hiring. Opportunity without borders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});
type View = "directory" | "verify" | "calculator";
function Avatar({ person }: { person: Talent }) {
  return person.image ? (
    <img className="avatar" src={person.image} alt={person.name} />
  ) : (
    <div className="avatar avatar-fallback">
      {person.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")}
    </div>
  );
}
function TalentCard({
  person,
  onInspect,
  requested,
}: {
  person: Talent;
  onInspect: () => void;
  requested: boolean;
}) {
  return (
    <article className="talent-card">
      <div className="flex items-start gap-3">
        <Avatar person={person} />
        <div className="min-w-0 flex-1">
          <div className="candidate-name">{person.name}</div>
          <div className="candidate-role">{person.role}</div>
          <div className="location">
            <MapPin />
            {person.city}, {person.country}
          </div>
        </div>
        <span className="ready-badge">
          <BadgeCheck className="size-3" />
          Verified
        </span>
      </div>
      <div className="skills">
        {person.skills.map((skill) => (
          <span className="skill-chip" key={skill}>
            {skill}
          </span>
        ))}
      </div>
      <div className="border-t border-border pt-1">
        <div className="track-row">
          <span className="track-icon">
            <Award />
          </span>
          <div>
            <div className="track-title">
              {person.assessment}: <span className="text-primary">{person.score}/100</span>
            </div>
            <div className="track-detail">
              EQPR / Skills Passport Verified{" "}
              <span className="text-primary">· Competency proven</span>
            </div>
          </div>
        </div>
        <div className="track-row">
          <span className="track-icon">
            <ShieldCheck />
          </span>
          <div>
            <div className="track-title">
              EoR Compliant <span className="text-primary">· Legal & payment ready</span>
            </div>
            <div className="track-detail">
              {person.idType} verified · {person.payout} active
            </div>
          </div>
        </div>
        <div className="track-row">
          <span className="track-icon clay">
            <HeartHandshake />
          </span>
          <div>
            <div className="track-title">Available for a {TRIAL_WEEKS}-Week Paid Trial</div>
            <div className="track-detail">
              Mentored by a Senior EU {person.track === "UI/UX Design" ? "Design" : "Tech"} Lead
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <span>
          <span className="status-dot" />
          {requested ? "Trial requested" : "Ready for your next chapter"}
        </span>
        <Button variant="passport" onClick={onInspect}>
          Inspect Talent Passport
          <ArrowRight />
        </Button>
      </div>
    </article>
  );
}
function Index() {
  const [view, setView] = useState<View>("directory");
  const [role, setRole] = useState<"employer" | "talent">("employer");
  const [talent, setTalent] = useState(initialTalent);
  const [roleFilter, setRoleFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [readyOnly, setReadyOnly] = useState(false);
  const [selected, setSelected] = useState<Talent | null>(null);
  const [checkStep, setCheckStep] = useState(0);
  const [checking, setChecking] = useState(false);
  const [requested, setRequested] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [salary, setSalary] = useState(2000);
  const [country, setCountry] = useState<Country>("Kenya");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  const filtered = filterTalent(talent, roleFilter, cityFilter, readyOnly);
  const payout = calculatePayout(salary, country);
  function inspect(person: Talent) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSelected(person);
    setCheckStep(0);
    setChecking(false);
  }
  function simulate() {
    setChecking(true);
    setCheckStep(0);
    [1, 2, 3].forEach((step) => {
      timers.current.push(
        setTimeout(() => {
          setCheckStep(step);
          if (step === 3) setChecking(false);
        }, step * 350),
      );
    });
  }
  function onboard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    if (!name) return;
    const city = String(data.get("city"));
    const track = String(data.get("track"));
    const idType = String(data.get("id"));
    const portfolio = String(data.get("portfolio"));
    const loc = city === "Amman" ? "Jordan" : city === "Kampala" ? "Uganda" : "Kenya";
    setVerifying(true);
    timers.current.push(
      setTimeout(() => {
        setTalent((prev) => [
          ...prev,
          {
            id: Date.now(),
            name,
            role:
              track === "Software Engineering"
                ? "Software Engineer"
                : track === "UI/UX Design"
                  ? "Product Designer"
                  : "Data Analyst",
            track,
            city,
            country: loc,
            skills:
              track === "Software Engineering"
                ? ["React", "TypeScript", "Node.js"]
                : track === "UI/UX Design"
                  ? ["Figma", "UX Research", "Design Systems"]
                  : ["Python", "SQL", "Power BI"],
            score: 91,
            assessment:
              track === "Software Engineering"
                ? "Practical Code Audit"
                : track === "UI/UX Design"
                  ? "Practical Design Review"
                  : "Practical Data Assessment",
            bio: "A new chapter in a borderless career.",
            ready: true,
            idType,
            payout: loc === "Jordan" ? "Payoneer" : "Wise",
            mentor: "Sophie Laurent · Senior EU Tech Lead",
            portfolio,
            scores: [
              { name: "Core competency", value: 93 },
              { name: "Practical assessment", value: 91 },
              { name: "Problem solving", value: 90 },
              { name: "Communication", value: 92 },
            ],
          },
        ]);
        setRoleFilter("All");
        setCityFilter("All");
        setView("directory");
        setVerifying(false);
        setToast(`${name} is verified and now in the Talent Directory.`);
      }, 1000),
    );
  }
  const headings = {
    directory: {
      title:
        role === "employer"
          ? "Exceptional talent. No borders."
          : "Your skills. A world of opportunity.",
      copy:
        role === "employer"
          ? "Meet skilled professionals, verified for what they can do. Ready to join your team."
          : "A verified passport to international teams, meaningful work, and a new chapter.",
    },
    verify: {
      title: "Skills tell the real story.",
      copy: "Give talent a passport built on proven ability, not a paper trail.",
    },
    calculator: {
      title: "Global hiring. Local peace of mind.",
      copy: "Explore a clear path from your offer to their first paycheck.",
    },
  };
  return (
    <>
      <header className="page-shell">
        <div className="topbar">
          <div className="flex items-center gap-3">
            <div className="brand-mark">
              <Network className="size-6" strokeWidth={1.5} />
            </div>
            <div>
              <div className="brand-name">
                Borderless<span className="text-primary">Bridge</span>
              </div>
              <div className="tagline">
                Skills-Verified Global Talent. Zero Compliance Friction.
              </div>
            </div>
          </div>
          <div className="role-switch" aria-label="Viewing role">
            <Button
              variant="role"
              data-active={role === "employer"}
              onClick={() => {
                setRole("employer");
                setView("directory");
              }}
            >
              <BriefcaseBusiness />
              View as Employer
            </Button>
            <Button
              variant="role"
              data-active={role === "talent"}
              onClick={() => {
                setRole("talent");
                setView("verify");
              }}
            >
              <UserRound />
              View as Talent
            </Button>
          </div>
        </div>
      </header>
      <section className="impact-strip">
        <div className="page-shell impact-inner">
          <div className="impact-item">
            <UsersRound />
            <div>
              <strong>420+</strong>Skills-Verified Talent
            </div>
          </div>
          <div className="impact-item">
            <ShieldCheck />
            <div>
              <strong>100% Legal</strong>EoR & Payment Ready
            </div>
          </div>
          <div className="impact-item">
            <HeartHandshake />
            <div>
              <strong>2-Week Risk-Free</strong>Trial Placements
            </div>
          </div>
        </div>
      </section>
      <main className="page-shell">
        <div className="intro">
          <div>
            <div className="eyebrow">
              <span className="status-dot" />
              Opportunity, reimagined
            </div>
            <h1>{headings[view].title}</h1>
            <p>{headings[view].copy}</p>
          </div>
          <div className="intro-note">
            <Globe2 className="size-5" strokeWidth={1.5} />
            <span>Great work knows no borders.</span>
          </div>
        </div>
        <nav className="tabs" aria-label="Main views">
          <Button
            variant="tab"
            data-active={view === "directory"}
            onClick={() => setView("directory")}
          >
            <UsersRound />
            Talent Directory<span className="tab-count">{talent.length}</span>
          </Button>
          <Button variant="tab" data-active={view === "verify"} onClick={() => setView("verify")}>
            <UserRoundPlus />
            Add / Verify Talent
          </Button>
          <Button
            variant="tab"
            data-active={view === "calculator"}
            onClick={() => setView("calculator")}
          >
            <Globe2 />
            Compliance & Payouts
          </Button>
        </nav>
        {view === "directory" && (
          <>
            <div className="filter-bar">
              <label className="filter-select">
                <BriefcaseBusiness />
                <select
                  aria-label="Filter by Role"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="All">All roles</option>
                  {tracks.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="filter-select">
                <MapPin />
                <select
                  aria-label="Host Hub"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                >
                  <option value="All">All host hubs</option>
                  {cities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="filter-toggle ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
                <Switch
                  aria-label="Compliance Ready Only"
                  checked={readyOnly}
                  onCheckedChange={setReadyOnly}
                />
                Compliance ready only
              </label>
            </div>
            <div className="result-line">
              <span>
                Showing{" "}
                <strong className="text-foreground">
                  {filtered.length} verified professionals
                </strong>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3" />
                Skills proven. Identity verified.
              </span>
            </div>
            <div className="talent-grid">
              {filtered.map((person) => (
                <TalentCard
                  person={person}
                  key={person.id}
                  requested={requested.includes(person.id)}
                  onInspect={() => inspect(person)}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <UsersRound className="mx-auto mb-4 size-8 text-primary" />
                <h2 className="section-heading">No matches just yet</h2>
                <p className="body-copy">Try another role or host hub.</p>
                <Button
                  variant="passport"
                  className="mt-4"
                  onClick={() => {
                    setRoleFilter("All");
                    setCityFilter("All");
                    setReadyOnly(false);
                  }}
                >
                  Clear filters
                  <X />
                </Button>
              </div>
            )}
          </>
        )}
        {view === "verify" && (
          <div className="form-layout">
            <form onSubmit={onboard}>
              <h2 className="section-heading">Create a verified talent passport</h2>
              <p className="body-copy mb-7">
                Every skill deserves to be seen. Every professional deserves a chance.
              </p>
              <label className="field">
                Full name
                <input name="name" placeholder="e.g. Leila Ahmed" required maxLength={70} />
              </label>
              <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                <label className="field">
                  Host city
                  <select name="city">
                    {cities.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Primary skill track
                  <select name="track">
                    {tracks.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="field">
                Available ID type
                <select name="id">
                  <option>UNHCR Refugee ID</option>
                  <option>Convention Travel Document</option>
                  <option>National Alien Card</option>
                </select>
              </label>
              <label className="field">
                GitHub / portfolio link
                <input
                  type="url"
                  name="portfolio"
                  placeholder="https://github.com/your-profile"
                  required
                />
              </label>
              <Button type="submit" disabled={verifying} className="h-12 w-full">
                {verifying ? <LoaderCircle className="animate-spin" /> : <ShieldCheck />}
                {verifying
                  ? "Verifying skills & compliance…"
                  : "Run Skills & Compliance Verification"}
              </Button>
              <p className="mt-3 text-[10px] text-muted-foreground">
                Demo verification only · No documents or personal data are uploaded.
              </p>
            </form>
            <aside className="pt-2">
              <span className="ready-badge">
                <Sparkles className="size-3" />A passport to possibility
              </span>
              <h3 className="section-heading mt-5">Potential, not paperwork.</h3>
              <p className="body-copy">A missing degree should never mean a missing opportunity.</p>
              {[
                {
                  title: "Prove practical skills",
                  copy: "A live competency assessment builds a Skills Passport that stands in place of a paper degree.",
                },
                {
                  title: "Clear the path to employment",
                  copy: "Identity, local work rights, and cross-border payment readiness — brought together.",
                },
                {
                  title: "Start with a supported trial",
                  copy: "A two-week paid placement, with a senior mentor and room to grow.",
                },
              ].map((s, i) => (
                <div className="process-step" key={s.title}>
                  <span className="step-number">0{i + 1}</span>
                  <div>
                    <h4 className="text-sm font-semibold">{s.title}</h4>
                    <p className="body-copy mt-2">{s.copy}</p>
                  </div>
                </div>
              ))}
            </aside>
          </div>
        )}
        {view === "calculator" && (
          <>
            <div className="calculator-layout">
              <section>
                <span className="ready-badge">
                  <ShieldCheck className="size-3" />
                  No local entity needed
                </span>
                <h2 className="section-heading mt-5">One offer. Everything covered.</h2>
                <p className="body-copy">
                  An Employer of Record handles the local contract, tax, and payment arrangements.
                </p>
                <label className="field mt-7">
                  Candidate location
                  <select
                    aria-label="Candidate Location"
                    value={country}
                    onChange={(e) => setCountry(e.target.value as Country)}
                  >
                    {Object.keys(locations).map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="text-[11px] font-semibold" htmlFor="salary">
                  Monthly gross salary
                </label>
                <div className="salary-value">
                  ${salary.toLocaleString("en-US")}{" "}
                  <span className="text-xs font-normal text-muted-foreground">USD / month</span>
                </div>
                <input
                  id="salary"
                  className="salary-slider"
                  type="range"
                  min={SALARY_MIN}
                  max={SALARY_MAX}
                  step={100}
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                />
                <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                  <span>$1,000</span>
                  <span>$5,000</span>
                </div>
                <div className="mt-7 flex justify-between border-t border-border pt-5 text-xs">
                  <span>Total monthly employer cost</span>
                  <strong className="text-primary">
                    ${payout.total.toLocaleString("en-US")} USD
                  </strong>
                </div>
              </section>
              <div className="output-grid">
                <div className="output-card">
                  <Landmark />
                  <div className="output-label">Employer EoR flat fee</div>
                  <div className="output-value">
                    ${payout.fee}
                    <span className="text-xs font-normal"> / month</span>
                  </div>
                  <div className="output-detail">Local contracts & compliance included</div>
                </div>
                <div className="output-card">
                  <Wallet />
                  <div className="output-label">Estimated net take-home pay</div>
                  <div className="output-value">{payout.net.toLocaleString("en-US")}</div>
                  <div className="output-detail">
                    {payout.currency} / month · after illustrative deductions
                  </div>
                </div>
                <div className="output-card">
                  <CheckCheck />
                  <div className="output-label">Accepted local payout rail</div>
                  <div className="text-base font-semibold text-primary">{payout.rail}</div>
                  <div className="output-detail">{payout.bridge}</div>
                </div>
                <div className="output-card">
                  <Clock3 />
                  <div className="output-label">Estimated onboarding time</div>
                  <div className="output-value">48 Hours</div>
                  <div className="output-detail">Zero Visa Delay · Work from {payout.city}</div>
                </div>
              </div>
            </div>
            <p className="mb-6 border-t border-border pt-5 text-[10px] leading-6 text-muted-foreground">
              Illustrative demo only. EoR fee, tax deductions, exchange rates, payout availability,
              and onboarding timelines are mock estimates, not legal or financial advice. No real
              contracts or transfers are initiated.
            </p>
          </>
        )}
        <footer className="footer">
          <span className="footer-brand">
            <Network className="size-3 text-primary" />
            BorderlessBridge <span>· Talent is universal. Opportunity should be, too.</span>
          </span>
          <span className="flex items-center gap-1.5">
            <HeartHandshake className="size-3 text-clay" />
            Built for people. Designed for possibility.
            <span className="ml-2 rounded border border-border px-1.5 py-0.5">DEMO</span>
          </span>
        </footer>
      </main>
      <Sheet
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            timers.current.forEach(clearTimeout);
            setChecking(false);
          }
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-[490px] bg-card p-7">
          {selected && (
            <>
              <div className="eyebrow mb-6">
                <ShieldCheck className="size-4" />
                Verified Talent Passport
              </div>
              <div className="flex items-center gap-4">
                <Avatar person={selected} />
                <div>
                  <SheetTitle>{selected.name}</SheetTitle>
                  <SheetDescription className="mt-1">
                    {selected.role} · {selected.city}, {selected.country}
                  </SheetDescription>
                </div>
              </div>
              <p className="body-copy mt-5">{selected.bio}</p>
              <div className="skills">
                {selected.skills.map((s) => (
                  <span className="skill-chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
              <section className="passport-section">
                <h3 className="text-sm font-semibold">Competency, independently proven</h3>
                <p className="body-copy mt-2">
                  EQPR / Skills Passport Verified — live practical evidence replaces a paper degree.
                </p>
                {selected.scores.map((s) => (
                  <div className="score-row" key={s.name}>
                    <div className="score-label">
                      <span>{s.name}</span>
                      <strong className="text-primary">{s.value}/100</strong>
                    </div>
                    <progress max={100} value={s.value} aria-label={s.name} />
                  </div>
                ))}
                <span className="ready-badge">
                  <BadgeCheck className="size-3" />
                  Overall assessment: {selected.score}/100
                </span>
              </section>
              <section className="passport-section">
                <h3 className="text-sm font-semibold">Legal & payment readiness</h3>
                <div className="check-item complete">
                  <CircleCheck className="size-4" />
                  {selected.idType} verified
                </div>
                <div className="check-item complete">
                  <CircleCheck className="size-4" />
                  EoR compliant · {selected.payout} payout active
                </div>
                <h3 className="mt-6 text-sm font-semibold">A supported first step</h3>
                <p className="body-copy mt-2">Available for a {TRIAL_WEEKS}-week paid trial</p>
                <p className="mt-2 text-[11px] text-muted-foreground">{selected.mentor}</p>
                <p className="mt-3 break-all text-[10px] text-muted-foreground">
                  Portfolio (demo): {selected.portfolio}
                </p>
              </section>
              <section className="passport-section">
                <h3 className="text-sm font-semibold mb-4">Your hiring readiness check</h3>
                <Button
                  disabled={checking || checkStep === 3}
                  onClick={simulate}
                  className="w-full h-11 text-xs"
                >
                  {checking ? <LoaderCircle className="animate-spin" /> : <ShieldCheck />}
                  {checking
                    ? "Checking compliance…"
                    : checkStep === 3
                      ? "All checks cleared"
                      : "Simulate Hiring & Compliance Check"}
                </Button>
                {checkStep > 0 || checking ? (
                  <div>
                    {[
                      "Contract generated via Employer of Record (EoR)",
                      "Tax & local work-right cleared",
                      "Cross-border payout rail locked in",
                    ].map((text, i) => (
                      <div key={text} className={`check-item ${checkStep > i ? "complete" : ""}`}>
                        {checkStep > i ? (
                          <CircleCheck className="size-4 shrink-0" />
                        ) : (
                          <LoaderCircle className="size-4 shrink-0 animate-spin" />
                        )}
                        {text}
                      </div>
                    ))}
                  </div>
                ) : null}
                {checkStep === 3 && (
                  <Button
                    variant="passport"
                    className="w-full h-11 text-xs"
                    disabled={requested.includes(selected.id)}
                    onClick={() => {
                      setRequested((prev) => [...prev, selected.id]);
                      setToast(`2-week paid trial requested for ${selected.name}.`);
                    }}
                  >
                    {requested.includes(selected.id) ? <Check /> : <ArrowRight />}
                    {requested.includes(selected.id)
                      ? "Trial request confirmed"
                      : "Request 2-Week Paid Trial"}
                  </Button>
                )}
                <p className="mt-4 text-[9px] leading-5 text-muted-foreground">
                  Simulation only. No actual identity checks, contracts, or trial placements are
                  processed.
                </p>
              </section>
            </>
          )}
        </SheetContent>
      </Sheet>
      {toast && (
        <div className="toast-message" role="status">
          <CircleCheck className="size-4 shrink-0" />
          {toast}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
            className="size-6 text-primary-foreground"
          >
            <X />
          </Button>
        </div>
      )}
    </>
  );
}
