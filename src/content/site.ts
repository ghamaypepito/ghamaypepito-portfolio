/**
 * Single source of truth for every piece of copy on the site.
 * Ported from the Claude Design handoff (`project/data.js`) and typed so a
 * missing field breaks the build rather than the page.
 */

export type Social = { label: string; short: string; href: string };
export type Stat = { value: number; suffix: string; label: [string, string] };
export type IconName =
  | 'code' | 'spark' | 'pen' | 'bolt' | 'arrow' | 'arrowUpRight'
  | 'mail' | 'phone' | 'pin' | 'quote' | 'cap' | 'plus' | 'search' | 'close'
  | 'window' | 'layers' | 'flow' | 'calendar' | 'users' | 'funnel'
  | 'chart' | 'wand' | 'target' | 'rocket';

export type Service = {
  key: string;
  icon: IconName;
  img: string;
  title: [string, string];
  count: string;
  blurb: string;
  tools: string[];
};

export type Job = {
  company: string;
  role: string;
  meta: string;
  period: string;
  blurb: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  /**
   * True once the quote is attributed to a named individual at a named
   * company. Sourced from ghl.southsidestudio.ph.
   */
  verified: boolean;
};

export type Capability = { icon: IconName; title: string; blurb: string };

export type ProcessStep = { step: string; title: string; blurb: string };

/** One of the AI models in the toolkit. `mark` is a text monogram, not a logo. */
export type Model = { name: string; mark: string; role: string; blurb: string };

export type ProjectCategory =
  | 'Web Design' | 'Development' | 'E-Commerce' | 'Branding' | 'SEO';

export type Project = {
  name: string;
  url: string;
  cat: ProjectCategory;
  tag: string;
};

export const SITE = {
  name: 'Ghamay Pepito',
  fullName: 'Emeterio Ando Pepito III',
  roles: [
    'Digital Marketing Manager',
    'Website Designer & Developer',
    'SEO Specialist',
  ],
  taglineLead: 'Website Designer, Developer &',
  taglineEmph: 'Digital Marketing Manager,',
  taglineTail: 'based in Cebu City.',
  intro:
    'I craft and execute strategic digital campaigns that drive brand growth and engagement — blending design, development, and data to deliver results that matter.',
  // Confirmed inbox for enquiries. The contact Worker forwards here, and
  // CONTACT_TO in wrangler.toml must match.
  email: 'ghamaypepito@gmail.com',
  phone: '+63 908 897 8792',
  location: 'One Oasis, Kasambagan, Cebu City, Philippines',
  locality: 'Cebu City',
  region: 'Central Visayas',
  country: 'PH',
  socials: [
    { label: 'Instagram', short: 'IG', href: 'https://instagram.com/ghamaypepito' },
    { label: 'LinkedIn', short: 'IN', href: 'https://www.linkedin.com/in/emeteriopepito/' },
    { label: 'Website', short: 'WB', href: 'https://ghamaypepito.com' },
  ] satisfies Social[],

  stats: [
    { value: 12, suffix: '+', label: ['Years of', 'Experience'] },
    // Derived below from `projects.length` so the stat can never drift from
    // what the grid actually shows.
    { value: 0, suffix: '', label: ['Projects', 'Delivered'] },
    { value: 40, suffix: '+', label: ['Brands &', 'Partners'] },
  ] satisfies Stat[],

  manifesto: {
    kicker: 'Philosophy',
    title: "You can't use up creativity.",
    body: 'The more you use, the more you have. Every brand, every line of code, every campaign is a chance to make something people actually remember.',
  },

  services: [
    {
      key: 'web',
      icon: 'code',
      img: 'svc-web',
      title: ['Web Design', '& Development'],
      count: '30+ Sites',
      blurb:
        'Responsive, SEO-ready websites built on WordPress, Shopify and custom HTML/CSS/JS.',
      tools: ['WordPress', 'Shopify', 'HTML5', 'CSS3', 'JavaScript', 'PHP', 'Bootstrap'],
    },
    {
      key: 'marketing',
      icon: 'spark',
      img: 'svc-marketing',
      title: ['Digital Marketing', '& SEO'],
      count: '12 Years',
      blurb:
        'Strategic campaigns across social, email and search — driven by analytics and built to convert.',
      tools: ['Google Analytics', 'SEO / SEM', 'HubSpot', 'Email / EDM', 'Social Strategy'],
    },
    {
      key: 'brand',
      icon: 'pen',
      img: 'svc-brand',
      title: ['Branding &', 'Graphics Design'],
      count: 'Adobe CC',
      blurb:
        'Brand identities, content and visual systems crafted across the Adobe Creative Cloud.',
      tools: ['Photoshop', 'Illustrator', 'Figma', 'Brand Systems', 'Content Design'],
    },
    {
      key: 'automation',
      icon: 'bolt',
      img: 'svc-automation',
      title: ['Business Automation', '& Lead Gen'],
      count: 'PXLCODE',
      blurb:
        'Data-driven automation and lead-generation pipelines that turn traffic into growth.',
      tools: ['Lead Gen', 'CRM Flows', 'Automation', 'Consulting', 'CMS / CPanel'],
    },
  ] satisfies Service[],


  /* ---------------------------------------------------------------------
     Web application development.
     TODO(ghamay): `bookingUrl` is a placeholder pointing at the GoHighLevel
     portal root. Replace it with the exact calendar URL once you have it —
     it is the only place the discovery-call CTA is defined.
     ------------------------------------------------------------------- */
  webapp: {
    bookingUrl: 'https://ghl.southsidestudio.ph',
    bookingLabel: 'Book a discovery call',
    title: ['Beyond the', 'brochure site.'],
    lead: 'Some problems do not fit a page and a contact form. When a business needs something that logs in, calculates, schedules or syncs, I build the application for it.',
    capabilities: [
      {
        icon: 'users',
        title: 'Client portals & dashboards',
        blurb: 'Somewhere your customers log in, see their own data, and stop emailing you for it.',
      },
      {
        icon: 'calendar',
        title: 'Booking & scheduling',
        blurb: 'Availability, reminders and payment collection that run without anyone chasing them.',
      },
      {
        icon: 'flow',
        title: 'Internal tools',
        blurb: 'The spreadsheet that runs your business, rebuilt as something that will not break.',
      },
      {
        icon: 'layers',
        title: 'APIs & integrations',
        blurb: 'Getting the systems you already pay for to talk to each other properly.',
      },
    ] satisfies Capability[],
    process: [
      {
        step: 'Discover',
        title: 'A call and a real scope',
        blurb: 'We work out what the thing actually has to do, and what it does not. You get a scope you can price.',
      },
      {
        step: 'Prototype',
        title: 'Something clickable, fast',
        blurb: 'A working prototype in days, so the discussion is about the real product rather than a wireframe.',
      },
      {
        step: 'Build',
        title: 'Typed, tested, deployed',
        blurb: 'Built in the open with the staging URL shared from day one. No month-long silences.',
      },
      {
        step: 'Iterate',
        title: 'Measured, then improved',
        blurb: 'Analytics from launch, then changes driven by what people actually do rather than opinion.',
      },
    ] satisfies ProcessStep[],
    stack: ['React', 'TypeScript', 'Astro', 'Node.js', 'REST APIs', 'Cloudflare', 'WordPress', 'Shopify'],
  },

  /* ---------------------------------------------------------------------
     AI practice. Framed around delivered outcomes rather than claims about
     any particular model, so it stays accurate as the tooling moves.
     ------------------------------------------------------------------- */
  ai: {
    title: ['AI that ships work,', 'not demos.'],
    lead: 'The interesting part was never the chatbot. It is what happens when research, copy, and follow-up stop being the bottleneck — and a two-person team starts shipping like a ten-person one.',
    outcomes: [
      {
        icon: 'wand',
        title: 'Content systems',
        blurb: 'Briefs, drafts and on-brand copy produced at volume — then edited by a human before anything goes live.',
      },
      {
        icon: 'bolt',
        title: 'Automation pipelines',
        blurb: 'Capture, enrichment, routing and follow-up wired together so the busywork runs itself overnight.',
      },
      {
        icon: 'target',
        title: 'Research & analysis',
        blurb: 'Market, competitor and keyword research synthesised into something you can act on the same day.',
      },
      {
        icon: 'spark',
        title: 'AI inside your product',
        blurb: 'Assistants, smarter search and structured extraction built into the sites and apps I deliver.',
      },
    ] satisfies Capability[],
    /* TODO(ghamay): sanity-check these one-liners against how you actually
       split the work — they are the only opinionated copy on the page. */
    models: [
      {
        name: 'Claude',
        mark: 'C',
        role: 'Reasoning & build',
        blurb: 'Long documents, code and anything where being careful matters more than being quick.',
      },
      {
        name: 'ChatGPT',
        mark: 'G',
        role: 'Drafting & production',
        blurb: 'Fast ideation, first drafts and the everyday volume that keeps campaigns fed.',
      },
      {
        name: 'Grok',
        mark: 'X',
        role: 'Signals & timing',
        blurb: 'What is moving right now — useful when a campaign has to land this week, not next quarter.',
      },
    ] satisfies Model[],
    footnote: 'A person reviews everything before a client ever sees it. AI sets the pace; it does not sign off on the work.',
  },

  /* ---------------------------------------------------------------------
     GoHighLevel — the white-label portal is a live client-facing product.
     ------------------------------------------------------------------- */
  ghl: {
    portalUrl: 'https://ghl.southsidestudio.ph',
    portalLabel: 'ghl.southsidestudio.ph',
    title: ['GoHighLevel,', 'run properly.'],
    lead: 'Most agencies sell you a GoHighLevel licence and leave. I set the account up, migrate what you already have, build the automations, and stay on to keep them working.',
    features: [
      { icon: 'users', title: 'CRM & pipelines', blurb: 'Every lead in one place, with stages that match how you actually sell.' },
      { icon: 'funnel', title: 'Funnels & pages', blurb: 'Landing pages and funnels built to convert, not just to exist.' },
      { icon: 'calendar', title: 'Calendars & booking', blurb: 'Round-robin scheduling, reminders and no-show follow-up.' },
      { icon: 'flow', title: 'Email & SMS automation', blurb: 'Nurture and reactivation sequences that run on their own.' },
      { icon: 'spark', title: 'Reviews & reputation', blurb: 'Review requests triggered automatically at the right moment.' },
      { icon: 'chart', title: 'Reporting', blurb: 'Dashboards that answer where the leads came from and what they cost.' },
    ] satisfies Capability[],
  },

  experience: [
    {
      company: 'TWD',
      role: 'Digital Operations Specialist',
      meta: 'Digital Business Development · Digital Marketing',
      period: 'Jan 2023 — Present',
      blurb:
        'Oversee and optimize the full digital operation — website management, SEO & analytics, EDM campaigns, database segmentation and Google services reporting.',
    },
    {
      company: 'PXLCODE',
      role: 'Co-Founder',
      meta: 'Digital Business Automation · Lead Generation',
      period: 'Jan 2021 — Present',
      blurb:
        'Co-founded an agency delivering tailored marketing strategy, data-driven lead generation and continuous performance optimization for growing brands.',
    },
    {
      company: 'Thumb AI',
      role: 'Digital Business Dev Consultant',
      meta: 'Alternative Innovations',
      period: 'Nov 2016 — Present',
      blurb:
        'Run market research and build digital business plans aligned to client goals, executing strategies across marketing, e-commerce and web development.',
    },
    {
      company: 'Servi-Tek Inc.',
      role: 'Webmaster · SEO Specialist',
      meta: 'Corporate Web & Server Administration',
      period: 'Oct 2019 — Jan 2023',
      blurb:
        'Designed, built and maintained the company website, monitored analytics, ran backups & disaster recovery, and managed secure server administration.',
    },
    {
      company: 'CaptainPanel Inc.',
      role: 'Website Designer & Developer',
      meta: 'Web Design · WordPress',
      period: 'Nov 2017 — Oct 2019',
      blurb:
        'Designed and developed responsive, SEO-optimized, mobile-friendly websites and custom themes using HTML, CSS, JavaScript and WordPress.',
    },
    {
      company: 'Ablaze Communications',
      role: 'Digital Marketing Specialist',
      meta: 'Campaigns · Content · Advertising',
      period: 'Jan 2014 — Nov 2017',
      blurb:
        'Built and ran multi-channel digital marketing campaigns — social, email and paid — optimizing performance and ROI through ongoing analysis.',
    },
  ] satisfies Job[],

  education: [
    { school: 'San Carlos Seminary', degree: 'Masters in Systematic Theology', year: '2014' },
    { school: 'University of Cebu', degree: 'BS Computer Engineering', year: '2006' },
  ],

  skills: [
    'Website Design & Development', 'Adobe Creative Cloud', 'SEO & Google Analytics',
    'Social Media Strategy', 'Marketing & Branding', 'Web Content Development',
    'Project Management', 'Market Research', 'WordPress · Shopify · CMS',
    'Backend & CPanel', 'HTML5 · CSS3 · JavaScript', 'PHP · Bootstrap · Figma · HubSpot',
  ],

  testimonials: [
    {
      quote: 'The follow-up happens whether I remember it or not.',
      name: 'Randall Peña',
      title: 'REMAX South & Main',
      verified: true,
    },
    {
      quote: 'System workflow works smooth from website to checkout.',
      name: 'Dominic Reyes',
      title: 'CEO, Zero Pest PH',
      verified: true,
    },
    {
      quote: 'Email Campaigns, SMS and Bookings in Automation.',
      name: 'Karren DiLeva',
      title: 'Internal Benefit Advisors',
      verified: true,
    },
  ] satisfies Testimonial[],

  projects: [
    { name: 'Outremer Catamaran', url: 'catamaran-outremer.com', cat: 'Web Design', tag: 'Marine · Web' },
    { name: 'AFSA Industries', url: 'afsaindustries.com', cat: 'Web Design', tag: 'Industrial · Corporate' },
    { name: 'Auxesis Review', url: 'auxesisreview.com', cat: 'Web Design', tag: 'Education · Review' },
    { name: 'Cebu Car Rentals', url: 'cebucarrentals.com', cat: 'SEO', tag: 'Travel · SEO' },
    { name: 'Dialed In Web', url: 'dialedinweb.com', cat: 'Branding', tag: 'Agency · Brand' },
    { name: 'Milestone Magazine', url: 'milestonemagazine.com', cat: 'Web Design', tag: 'Publishing · Editorial' },
    { name: 'SpeechMed', url: 'speechmed.com', cat: 'Web Design', tag: 'Healthcare · Web' },
    { name: 'Thumb AI', url: 'thumbai.com', cat: 'Branding', tag: 'Tech · Brand + Web' },
    { name: 'Crystha Shayne', url: 'crysthashayne.com', cat: 'Web Design', tag: 'Personal · Portfolio' },
    { name: 'Gold Fortune Textile', url: 'goldfortunetextile.com', cat: 'E-Commerce', tag: 'Textile · Shop' },
    { name: 'Southside Studio', url: 'southsidestudio.ph', cat: 'Branding', tag: 'Creative · Studio' },
    { name: 'ProShade PH', url: 'proshadeph.com', cat: 'E-Commerce', tag: 'Retail · Shop' },
    { name: 'Lily Moms', url: 'lilymoms.com', cat: 'E-Commerce', tag: 'Lifestyle · Shop' },
    { name: 'Servi-Tek', url: 'servi-tek.net', cat: 'SEO', tag: 'Corporate · SEO' },
    { name: 'Ranyan', url: 'ranyan.com', cat: 'Web Design', tag: 'Business · Web' },
    { name: 'ANCOP Canada', url: 'ancopcanada.org', cat: 'Web Design', tag: 'Nonprofit · Web' },
    { name: 'Tibbs Law', url: 'tibbslaw.com', cat: 'Web Design', tag: 'Legal · Web' },
    { name: 'Blend Academy', url: 'blendacademy.ph', cat: 'Web Design', tag: 'Education · LMS' },
    { name: 'Philiear', url: 'philiear.ph', cat: 'Web Design', tag: 'Healthcare · Web' },
    { name: 'SEA Audiology Academy', url: 'seaaudiologyacademy.com', cat: 'Web Design', tag: 'Education · Academy' },
    { name: 'Datum', url: 'datum.ph', cat: 'Development', tag: 'Tech · Data' },
    { name: 'Zero Pest PH', url: 'zeropestph.com', cat: 'SEO', tag: 'Services · SEO' },
    { name: 'Stitched by Mia', url: 'stitchedbymia.com', cat: 'E-Commerce', tag: 'Fashion · Shop' },
    { name: 'D-Tec', url: 'd-tec.asia', cat: 'Development', tag: 'Tech · Web' },
    { name: 'MAC', url: 'mac.ph', cat: 'Web Design', tag: 'Corporate · Web' },
    { name: 'Archon', url: 'archon.ph', cat: 'Branding', tag: 'Architecture · Brand' },
    { name: 'Gee Air Security', url: 'geeairsecurity.com', cat: 'Web Design', tag: 'Security · Web' },
    { name: 'Go Solar Philippines', url: 'gosolarphilippines.com', cat: 'SEO', tag: 'Energy · SEO' },
    { name: 'Storij Modules', url: 'storijmodules.com', cat: 'Development', tag: 'Tech · Modular' },
  ] satisfies Project[],
} as const;

/* The "Projects Delivered" stat mirrors the portfolio rather than repeating a
   number that has to be remembered. */
(SITE.stats[1] as { value: number }).value = SITE.projects.length;

export type SiteData = typeof SITE;

/** Category list for the portfolio filter, in the order the grid first meets them. */
export const CATEGORIES = ['All', ...new Set(SITE.projects.map((p) => p.cat))] as const;

export function countFor(cat: string): number {
  return cat === 'All'
    ? SITE.projects.length
    : SITE.projects.filter((p) => p.cat === cat).length;
}

/** Stable slug used for screenshot filenames. */
export function slugFor(url: string): string {
  return url.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}
