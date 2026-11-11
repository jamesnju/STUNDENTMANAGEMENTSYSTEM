// src/app/page.tsx
import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  BarChart3,
  Building2,
  FileText,
  Bus,
  Library,
  Monitor,
} from "lucide-react";

const stats = [
  { label: "Enrolled students", value: "1,248", change: "+8.2%", icon: Users },
  { label: "Teaching staff", value: "86", change: "+3 this term", icon: GraduationCap },
  { label: "Attendance today", value: "96.4%", change: "+2.4%", icon: ClipboardCheck },
  { label: "Active classes", value: "42", change: "Across 8 grades", icon: BookOpen },
];

const modules = [
  {
    icon: Users,
    title: "People & admissions",
    description: "Manage student records, guardians, staff profiles, admissions and enrolment history.",
    tag: "Administration",
  },
  {
    icon: BookOpen,
    title: "Academics & classes",
    description: "Organise subjects, class streams, timetables, lesson plans and learning resources.",
    tag: "Learning",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance tracking",
    description: "Record daily attendance, review trends and notify families when a learner is absent.",
    tag: "Daily operations",
  },
  {
    icon: BarChart3,
    title: "Exams & performance",
    description: "Capture assessments, calculate grades and share progress reports securely.",
    tag: "Learning",
  },
  {
    icon: Wallet,
    title: "Fees & payments",
    description: "Track fee balances, invoices, receipts and payment history in one place.",
    tag: "Finance",
  },
  {
    icon: MessageCircle,
    title: "Communication",
    description: "Keep parents, teachers and school leaders connected with announcements and messages.",
    tag: "Community",
  },
];

const roleCards = [
  {
    icon: ShieldCheck,
    name: "School administrators",
    intro: "A clear view of the whole school, with the controls to keep everything running.",
    items: ["Manage users, roles and permissions", "Configure terms, classes and departments", "Monitor fees, reports and school activity"],
    tone: "blue",
  },
  {
    icon: GraduationCap,
    name: "Teachers",
    intro: "Spend less time on administration and more time helping learners succeed.",
    items: ["View assigned classes and class lists", "Record attendance and assessment marks", "Share assignments and learner feedback"],
    tone: "violet",
  },
  {
    icon: BookOpen,
    name: "Students",
    intro: "Everything a learner needs to stay organised and take ownership of progress.",
    items: ["View timetable, subjects and assignments", "Check grades and attendance history", "Read school notices and updates"],
    tone: "cyan",
  },
  {
    icon: HeartHandshake,
    name: "Parents & guardians",
    intro: "Stay involved and informed about the things that matter most.",
    items: ["Follow linked children from one account", "See attendance and academic progress", "Review fee statements and school notices"],
    tone: "amber",
  },
];

const activity = [
  { initials: "AM", name: "Attendance submitted", detail: "Grade 8 East · 32 learners", time: "2 min ago", color: "blue" },
  { initials: "MK", name: "Assessment published", detail: "Mathematics · Grade 7", time: "18 min ago", color: "violet" },
  { initials: "JO", name: "Parent account linked", detail: "2 learners connected", time: "41 min ago", color: "cyan" },
];

const events = [
  { day: "12", month: "NOV", title: "Mid-term assessments", detail: "All grades · 8:00 AM" },
  { day: "15", month: "NOV", title: "Parents' consultation day", detail: "Main hall · 9:00 AM" },
  { day: "21", month: "NOV", title: "Inter-house sports", detail: "School field · 10:00 AM" },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand)]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--fg-base)] sm:text-4xl">{title}</h2>
      <p className="mt-4 leading-7 text-[var(--fg-muted)]">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--bg-base)] text-[var(--fg-base)]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-color)]/80 bg-[var(--bg-base)]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/20 transition-transform group-hover:rotate-[-5deg]">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-base font-extrabold tracking-tight">School<span className="text-[var(--brand)]">Flow</span></span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">School management</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--fg-muted)] lg:flex">
            <a className="transition-colors hover:text-[var(--fg-base)]" href="#platform">Platform</a>
            <a className="transition-colors hover:text-[var(--fg-base)]" href="#roles">Who it's for</a>
            <a className="transition-colors hover:text-[var(--fg-base)]" href="#insights">Insights</a>
            <a className="transition-colors hover:text-[var(--fg-base)]" href="#about">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--fg-muted)] transition hover:bg-[var(--bg-muted)] hover:text-[var(--fg-base)] sm:inline-flex">
              Sign in
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--brand)]/20 transition hover:-translate-y-0.5 hover:bg-[var(--brand-hover)]">
              Access portal <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate">
        <div className="pointer-events-none absolute -left-40 top-10 -z-10 h-96 w-96 rounded-full bg-[var(--primary-300)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-[var(--accent-300)]/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:pb-28">
          <div className="animate-[fadeUp_.7s_ease-out_both]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)]/80 px-3.5 py-2 text-xs font-semibold text-[var(--fg-muted)] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              A connected school community
              <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" />
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-black leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[4.15rem]">
              Better school days
              <span className="block bg-gradient-to-r from-[var(--brand)] to-[var(--accent-500)] bg-clip-text text-transparent">start with</span>
              everything in sync.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--fg-muted)] sm:text-lg">
              One simple, secure space for school leaders, teachers, students and parents to manage learning, follow progress and stay connected.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-[var(--brand)]/20 transition duration-300 hover:-translate-y-1 hover:bg-[var(--brand-hover)]">
                Open your school portal <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#platform" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-3.5 text-sm font-bold transition hover:-translate-y-1 hover:bg-[var(--bg-muted)]">
                Explore the platform <ArrowDownRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-[var(--fg-muted)]">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--brand)]" /> Role-based access</span>
              <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-[var(--brand)]" /> Secure records</span>
              <span className="inline-flex items-center gap-2"><Activity className="h-4 w-4 text-[var(--brand)]" /> Live-ready data</span>
            </div>
          </div>

          {/* Mock dashboard preview: replace this sample data with API responses later */}
          <div className="relative animate-[fadeUp_.9s_.12s_ease-out_both]">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[var(--primary-300)]/25 via-transparent to-[var(--accent-300)]/25 blur-2xl" />
            <div className="relative rounded-[1.7rem] border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 shadow-2xl shadow-black/10 sm:p-5">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] px-2 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary-100)] text-[var(--brand)]"><LayoutDashboard className="h-4 w-4" /></div>
                  <div><p className="text-sm font-bold">School overview</p><p className="text-[11px] text-[var(--fg-muted)]">Dashboard preview · Sample data</p></div>
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">● SYSTEM ONLINE</span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-4">
                {stats.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center justify-between"><Icon className="h-4 w-4 text-[var(--brand)]" /><ArrowUpRight className="h-3 w-3 text-emerald-500" /></div>
                      <p className="mt-3 text-xl font-black tracking-tight">{item.value}</p>
                      <p className="mt-1 text-[10px] leading-4 text-[var(--fg-muted)]">{item.label}</p>
                      <p className="mt-2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{item.change}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-3 sm:grid-cols-[1.15fr_.85fr]">
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] p-4">
                  <div className="flex items-center justify-between"><div><p className="text-xs font-bold">Attendance overview</p><p className="mt-1 text-[10px] text-[var(--fg-muted)]">Weekly school average</p></div><span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">96.4%</span></div>
                  <div className="mt-5 flex h-24 items-end gap-2">
                    {[58, 76, 68, 88, 72, 96, 82].map((height, i) => <div key={i} className="group relative flex-1 rounded-t-md bg-[var(--primary-200)] transition-all duration-500 hover:bg-[var(--brand)]" style={{ height: `${height}%` }}><div className="absolute inset-x-0 bottom-0 rounded-t-md bg-[var(--brand)]/75" style={{ height: `${height * 0.72}%` }} /></div>)}
                  </div>
                  <div className="mt-2 flex justify-between text-[9px] text-[var(--fg-muted)]"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
                </div>
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] p-4">
                  <p className="text-xs font-bold">Quick access</p><p className="mt-1 text-[10px] text-[var(--fg-muted)]">Common school tasks</p>
                  <div className="mt-3 space-y-2">
                    {[
                      { icon: Users, label: "Student records" },
                      { icon: CalendarDays, label: "School timetable" },
                      { icon: FileText, label: "Academic reports" },
                    ].map(({ icon: Icon, label }) => <div key={label} className="flex items-center gap-2 rounded-lg bg-[var(--bg-muted)]/70 p-2 text-[10px] font-semibold"><Icon className="h-3.5 w-3.5 text-[var(--brand)]" />{label}<ChevronRight className="ml-auto h-3 w-3 text-[var(--fg-muted)]" /></div>)}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--primary-100)]/70 px-4 py-3 dark:bg-[var(--primary-900)]">
                <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-[var(--brand)]" /><span className="text-[10px] font-semibold">Next: Mid-term assessments · 12 Nov</span></div>
                <span className="text-[10px] font-bold text-[var(--brand)]">View calendar →</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-5 hidden items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 shadow-xl sm:flex">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="h-5 w-5" /></div>
              <div><p className="text-xs font-bold">Everything connected</p><p className="text-[10px] text-[var(--fg-muted)]">One trusted school workspace</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[var(--border-color)] bg-[var(--bg-surface)]/70">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-7 text-center sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Privacy by role", text: "The right access for each person" },
            { icon: Clock3, title: "Less busywork", text: "Fewer repetitive admin tasks" },
            { icon: MessageCircle, title: "Clear communication", text: "A connected school community" },
            { icon: BarChart3, title: "Useful insights", text: "Information to guide decisions" },
          ].map(({ icon: Icon, title, text }) => <div key={title} className="flex items-center justify-center gap-3 text-left"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--primary-100)] text-[var(--brand)]"><Icon className="h-5 w-5" /></div><div><p className="text-sm font-bold">{title}</p><p className="mt-0.5 text-xs text-[var(--fg-muted)]">{text}</p></div></div>)}
        </div>
      </section>

      {/* Platform modules */}
      <section id="platform" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow="One connected platform" title="The everyday work of school, made simpler." description="Bring the essential parts of school administration and learning together. Each module shares a consistent experience and can be connected to your school's API as the system grows." />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map(({ icon: Icon, title, description, tag }, index) => (
              <article key={title} className="group rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-[var(--brand)]/50 hover:shadow-xl hover:shadow-[var(--brand)]/5" style={{ animationDelay: `${index * 80}ms` }}>
                <div className="flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary-100)] text-[var(--brand)] transition duration-300 group-hover:scale-110 group-hover:bg-[var(--brand)] group-hover:text-white"><Icon className="h-5 w-5" /></div><span className="rounded-full bg-[var(--bg-muted)] px-3 py-1 text-[10px] font-semibold text-[var(--fg-muted)]">{tag}</span></div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--fg-muted)]">{description}</p>
                <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[var(--brand)] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">Explore module <ArrowRight className="h-3.5 w-3.5" /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="border-y border-[var(--border-color)] bg-[var(--bg-surface)] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow="Designed around people" title="A better experience for every role." description="Different people need different tools. SchoolFlow keeps each portal focused, with access shaped around responsibilities and permissions." />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {roleCards.map(({ icon: Icon, name, intro, items, tone }) => (
              <article key={name} className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-base)] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`absolute right-0 top-0 h-24 w-24 rounded-full blur-2xl ${tone === "blue" ? "bg-blue-400/15" : tone === "violet" ? "bg-violet-400/15" : tone === "cyan" ? "bg-cyan-400/15" : "bg-amber-400/15"}`} />
                <div className="relative"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary-100)] text-[var(--brand)]"><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-lg font-bold">{name}</h3><p className="mt-2 min-h-[72px] text-sm leading-6 text-[var(--fg-muted)]">{intro}</p>
                  <ul className="mt-5 space-y-3 border-t border-[var(--border-color)] pt-5">{items.map(item => <li key={item} className="flex gap-2 text-xs leading-5 text-[var(--fg-base)]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />{item}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Insights / mock data */}
      <section id="insights" className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand)]">A clearer picture</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Know what's happening across your school.</h2>
            <p className="mt-5 leading-7 text-[var(--fg-muted)]">Bring everyday activity into one view. From attendance and academic progress to upcoming events, give every authorised user useful information without overwhelming them.</p>
            <div className="mt-8 space-y-5">
              {[
                { icon: Activity, title: "A live view of school activity", body: "Keep track of important updates as they happen." },
                { icon: LockKeyhole, title: "Private by design", body: "Protect personal and academic records with role-based permissions." },
                { icon: Monitor, title: "Ready for connected services", body: "Replace sample data with API responses when your backend is ready." },
              ].map(({ icon: Icon, title, body }) => <div key={title} className="flex gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--primary-100)] text-[var(--brand)]"><Icon className="h-5 w-5" /></div><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-[var(--fg-muted)]">{body}</p></div></div>)}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 shadow-xl shadow-black/5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-5">
              <div><p className="text-lg font-bold">School activity</p><p className="mt-1 text-xs text-[var(--fg-muted)]">A sample of recent updates</p></div>
              <span className="rounded-full bg-[var(--primary-100)] px-3 py-1.5 text-[10px] font-bold text-[var(--brand)]">DEMO DATA</span>
            </div>
            <div className="space-y-1 py-3">
              {activity.map((item) => <div key={item.name} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-[var(--bg-muted)]"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--primary-100)] text-xs font-bold text-[var(--brand)]">{item.initials}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{item.name}</p><p className="mt-0.5 truncate text-xs text-[var(--fg-muted)]">{item.detail}</p></div><span className="whitespace-nowrap text-[10px] text-[var(--fg-muted)]">{item.time}</span></div>)}
            </div>
            <div className="mt-3 rounded-2xl bg-[var(--bg-base)] p-4">
              <div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-bold">Upcoming events</p><p className="text-[10px] text-[var(--fg-muted)]">Your school calendar</p></div><CalendarDays className="h-5 w-5 text-[var(--brand)]" /></div>
              <div className="space-y-3">{events.map(event => <div key={event.title} className="flex items-center gap-3"><div className="w-12 shrink-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] py-1.5 text-center"><p className="text-base font-black">{event.day}</p><p className="text-[9px] font-bold tracking-wider text-[var(--brand)]">{event.month}</p></div><div><p className="text-xs font-bold">{event.title}</p><p className="mt-0.5 text-[10px] text-[var(--fg-muted)]">{event.detail}</p></div><ChevronRight className="ml-auto h-4 w-4 text-[var(--fg-muted)]" /></div>)}</div>
            </div>
            <p className="mt-4 text-center text-[10px] text-[var(--fg-muted)]">Illustrative content only · Not connected to a live school database</p>
          </div>
        </div>
      </section>

      {/* API-ready callout */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--primary-900)] px-7 py-12 text-white sm:px-12 sm:py-16 dark:bg-[var(--background-900)]">
          <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full border-[50px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-[var(--brand)]/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary-300)]">Built to grow with you</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">One school. One source of truth.</h2><p className="mt-4 leading-7 text-white/65">This page currently uses clearly labelled mock data. Connect your Next.js frontend to your backend endpoints when they are ready, while keeping the same experience for every school community member.</p></div>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[var(--primary-900)] transition hover:-translate-y-1 hover:bg-white/90">Enter the portal <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand)] text-white"><GraduationCap className="h-5 w-5" /></span><div><p className="font-extrabold">School<span className="text-[var(--brand)]">Flow</span></p><p className="text-xs text-[var(--fg-muted)]">A connected school community</p></div></div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-[var(--fg-muted)]"><a href="#platform" className="hover:text-[var(--fg-base)]">Platform</a><a href="#roles" className="hover:text-[var(--fg-base)]">Portals</a><a href="#insights" className="hover:text-[var(--fg-base)]">Insights</a><Link href="/login" className="hover:text-[var(--fg-base)]">Sign in</Link></div>
<p className="text-xs text-[var(--fg-muted)]">© 2026 SchoolFlow. All rights reserved.</p>        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </main>
  );
}
