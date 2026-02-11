import React from 'react';

const brandFeatures = [
  {
    title: 'Master Name Index',
    description:
      'Normalize aliases, identity numbers, phones, emails, and addresses into a continuous identity history.',
  },
  {
    title: 'Person of Interest Search',
    description: 'Search open-source, litigation, and reputational datasets with risk-scored insights.',
  },
  {
    title: 'Document Intelligence',
    description:
      'OCR court records and police reports to extract entities, surface charges, and auto-link associated files.',
  },
  {
    title: 'Social Signal Monitoring',
    description:
      'Track social media exposure, sentiment shifts, and emerging risk narratives across platforms.',
  },
  {
    title: 'Link Analysis Graph',
    description: 'Reveal relationships between people, entities, and incidents with correlation scoring.',
  },
  {
    title: 'Corporate Security Briefings',
    description:
      'Deliver executive-grade dossiers with OPSEC findings, threat indicators, and compliance-ready exhibits.',
  },
];

const workflowSteps = [
  {
    title: 'Intake & Scoping',
    description: 'Define investigative goals, collection parameters, and legal boundaries.',
  },
  {
    title: 'Collection & OCR',
    description: 'Ingest court records, police reports, and open-source data with automated extraction.',
  },
  {
    title: 'Entity Correlation',
    description: 'Link individuals, aliases, vehicles, and addresses across incidents and sources.',
  },
  {
    title: 'Analyst Review',
    description: 'Analyst validation, threat scoring, and OPSEC exposure assessment.',
  },
  {
    title: 'Client Reporting',
    description: 'Generate executive summaries, exhibits, and case-ready intelligence packs.',
  },
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100">
      <header className="border-b border-white/5 bg-[#07090c]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 opacity-90 blur-sm" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/60 bg-[#0d1118]">
                <svg viewBox="0 0 48 48" className="h-7 w-7 text-amber-300">
                  <path
                    fill="currentColor"
                    d="M24 8 8 18v12l16 10 16-10V18L24 8Zm0 5.3 10.2 6.2L24 25.7 13.8 19.5 24 13.3Zm0 22.3-10.2-6.2V21l10.2 6.2L34.2 21v8.1L24 35.6Z"
                  />
                  <circle cx="24" cy="23" r="5" fill="#0d1118" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Veilstone</p>
              <p className="text-lg font-semibold text-white">Analytics</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a className="hover:text-white" href="#capabilities">
              Capabilities
            </a>
            <a className="hover:text-white" href="#workflow">
              Workflow
            </a>
            <a className="hover:text-white" href="#portal">
              Client Portal
            </a>
            <button className="rounded-full border border-amber-400/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 hover:bg-amber-400/10">
              Request Briefing
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-amber-300/90">
              Open Source Intelligence Organization
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Veilstone Analytics delivers decisive, defensible intelligence.
            </h1>
            <p className="text-lg text-slate-300">
              We specialize in skip tracing, OSINT collection, social media monitoring, OPSEC analysis, and detailed
              background checks. Our analysts connect identity history, criminal records, and corporate security
              signals into precise dossiers and investigative narratives.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Identity history investigations and alias tracking.',
                'Criminal history reviews and civil litigation context.',
                'Corporate security risk assessments and partner screening.',
                'Dossiers with evidentiary timelines and source validation.',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300">
                Start an Intake Call
              </button>
              <button className="rounded-full border border-white/15 px-5 py-2 text-sm text-slate-200 hover:border-white/30">
                Download Capability Deck
              </button>
            </div>
          </div>

          <div id="portal" className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-amber-200/70">Client Portal</p>
              <h2 className="text-2xl font-semibold text-white">Secure Analyst Access</h2>
              <p className="mt-2 text-sm text-slate-400">
                Authenticate into investigations, master name indices, and entity correlation dashboards.
              </p>
            </div>
            <form className="space-y-4">
              <label className="block text-sm text-slate-300">
                Email
                <input
                  type="email"
                  placeholder="analyst@veilstone.com"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0f15] px-4 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-amber-300 focus:outline-none"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Password
                <input
                  type="password"
                  placeholder="••••••••••"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#0b0f15] px-4 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-amber-300 focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-[#0b0f15] text-amber-400" />
                Remember this device for 12 hours
              </label>
              <button className="w-full rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300">
                Sign In to Portal
              </button>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Need MFA reset?</span>
                <a className="text-amber-200 hover:text-amber-100" href="#">
                  Contact support
                </a>
              </div>
            </form>
            <div className="rounded-xl border border-white/10 bg-[#0b0f15] p-4 text-xs text-slate-400">
              Portal features: case assignment, audit logs, secure messaging, and exportable intelligence briefs.
            </div>
          </div>
        </section>

        <section id="capabilities" className="mt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-amber-200/70">Investigative Capabilities</p>
              <h2 className="text-3xl font-semibold text-white">OSINT products built for high-stakes decisions.</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-400">
              Our platform unifies multi-source intelligence, automated extraction, and analyst verification to
              deliver operational clarity across investigations.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {brandFeatures.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="mt-16 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/70">Workflow</p>
            <h2 className="text-3xl font-semibold text-white">Document intelligence with automated entity linking.</h2>
            <p className="text-sm text-slate-300">
              The document management system ingests court records, police reports, and investigative notes, applying
              OCR extraction to build entity profiles that remain linked across related reports, incidents, and
              jurisdictions.
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                'Entity extraction for names, dates, aliases, charges, and locations.',
                'Profile enrichment with identity history and cross-report associations.',
                'Chain-of-custody metadata and document provenance tracking.',
                'Automated alerts when new filings connect to existing investigations.',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Investigative Timeline
            </h3>
            <div className="mt-6 space-y-5">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="rounded-xl border border-white/10 bg-[#0b0f15] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <span className="text-xs text-amber-200/70">0{index + 1}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-amber-200/70">Security & Compliance</p>
              <h3 className="text-2xl font-semibold text-white">OPSEC analysis aligned to your risk posture.</h3>
              <p className="mt-2 text-sm text-slate-300">
                Ensure every investigation respects legal boundaries, privacy constraints, and internal security
                requirements with audit-ready reporting.
              </p>
            </div>
            <button className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-white">
              Start a Confidential Inquiry
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-[#07090c] px-6 py-10 text-sm text-slate-500">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Veilstone Analytics. All rights reserved.</span>
          <span>OSINT • Skip Tracing • Background Checks • Corporate Security</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
