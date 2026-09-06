/**
 * Single source of truth for every piece of copy on the site.
 * Ported from the Claude Design handoff (`project/data.js`) and typed so a
 * missing field breaks the build rather than the page.
 */

export type Social = { label: string; short: string; href: string };
export type Stat = { value: number; suffix: string; label: [string, string] };
export type IconName =
  | 'code' | 'spark' | 'pen' | 'bolt' | 'arrow' | 'arrowUpRight'
  | 'mail' | 'phone' | 'pin' | 'quote' | 'cap' | 'plus' | 'search' | 'close';

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
   * Attribution is by role + company, not by named individual. Set to true
   * only once a named, permission-granted quote replaces it — the UI reads
   * this flag to decide whether to show an avatar initial or a neutral mark.
   * TODO(ghamay): collect named testimonials and flip these to true.
   */
  verified: boolean;
};

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
  // NOTE(ghamay): confirm which inbox should receive enquiries. This address
  // came from the design handoff; the contact Worker forwards here.
  email: 'ghamaypepito@me.com',
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
    { value: 38, suffix: '', label: ['Projects', 'Delivered'] },
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
      quote:
        'Ghamay rebuilt our entire web presence and our inbound leads doubled within a quarter. He thinks like a marketer and builds like an engineer.',
      name: 'Operations Lead',
      title: 'Servi-Tek Inc.',
      verified: false,
    },
    {
      quote:
        'From branding to automation, he handled it all. Reliable, fast, and genuinely invested in the outcome — exactly who you want running your digital.',
      name: 'Founder',
      title: 'PXLCODE Partner',
      verified: false,
    },
    {
      quote:
        'Our online store finally feels premium. The design, the SEO, the speed — every detail was considered. Sales speak for themselves.',
      name: 'Store Owner',
      title: 'E-commerce Client',
      verified: false,
    },
  ] satisfies Testimonial[],

  /** The three projects that get double-height cards in the grid. */
  featured: ['thumbai.com', 'catamaran-outremer.com', 'proshadeph.com'],

  projects: [
    { name: 'Outremer Catamaran', url: 'catamaran-outremer.com', cat: 'Web Design', tag: 'Marine · Web' },
    { name: 'CaptainPanel', url: 'captainpanel.com', cat: 'Development', tag: 'SaaS · Platform' },
    { name: 'Live Loud Worship', url: 'liveloudworship.com', cat: 'Web Design', tag: 'Community · Web' },
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
    { name: 'Nathalie El Kouby', url: 'nathalieelkouby.com', cat: 'Web Design', tag: 'Personal · Web' },
    { name: 'Blend Academy', url: 'blendacademy.ph', cat: 'Web Design', tag: 'Education · LMS' },
    { name: 'Blend Consultancy', url: 'blendconsultancy.com', cat: 'Branding', tag: 'Consulting · Brand' },
    { name: 'Sureway Consultancy', url: 'surewayconsultancy.com', cat: 'Web Design', tag: 'Consulting · Web' },
    { name: 'Philiear', url: 'philiear.ph', cat: 'Web Design', tag: 'Healthcare · Web' },
    { name: 'SEA Audiology Academy', url: 'seaaudiologyacademy.com', cat: 'Web Design', tag: 'Education · Academy' },
    { name: 'YCloud', url: 'ycloud.ph', cat: 'Development', tag: 'Tech · Cloud' },
    { name: 'Cebu Travels', url: 'cebutravels.ph', cat: 'SEO', tag: 'Travel · SEO' },
    { name: 'Datum', url: 'datum.ph', cat: 'Development', tag: 'Tech · Data' },
    { name: 'Zero Pest PH', url: 'zeropestph.com', cat: 'SEO', tag: 'Services · SEO' },
    { name: 'Stitched by Mia', url: 'stitchedbymia.com', cat: 'E-Commerce', tag: 'Fashion · Shop' },
    { name: 'D-Tec', url: 'd-tec.asia', cat: 'Development', tag: 'Tech · Web' },
    { name: 'MAC', url: 'mac.ph', cat: 'Web Design', tag: 'Corporate · Web' },
    { name: 'DRCDC', url: 'drcdc.com', cat: 'Web Design', tag: 'Healthcare · Web' },
    { name: 'Archon', url: 'archon.ph', cat: 'Branding', tag: 'Architecture · Brand' },
    { name: 'BNI Manila CBD', url: 'bni-manilacbd.org', cat: 'Web Design', tag: 'Business · Network' },
    { name: 'Gee Air Security', url: 'geeairsecurity.com', cat: 'Web Design', tag: 'Security · Web' },
    { name: 'Go Solar Philippines', url: 'gosolarphilippines.com', cat: 'SEO', tag: 'Energy · SEO' },
    { name: 'Storij Modules', url: 'storijmodules.com', cat: 'Development', tag: 'Tech · Modular' },
  ] satisfies Project[],
} as const;

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
