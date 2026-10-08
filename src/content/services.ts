/**
 * The seven service offerings, each with its own page at /services/<slug>.
 *
 * Copy here is the sales surface of the site, so it is written to be specific
 * about what the client receives rather than impressive about the technology.
 *
 * TODO(ghamay): the three `isNew` offerings — AI Agents, AI Dashboard and
 * Mobile Apps — are newer lines of work. Read their copy and correct anything
 * that overstates what you want to commit to.
 */
import type { IconName } from '@/lib/icons';

export type Outcome = { icon: IconName; title: string; blurb: string };
export type Faq = { q: string; a: string };

export type Service = {
  /** URL segment: /services/<slug> */
  slug: string;
  /** Short label for nav and cards. */
  nav: string;
  /** Card and page heading, split across two lines. */
  title: [string, string];
  /** One-line positioning used on cards and as the meta description seed. */
  tagline: string;
  /** Opening paragraph on the service page. */
  lead: string;
  icon: IconName;
  /** Image in public/services/. */
  img: string;
  /** Badged on cards so the newer lines of work read as current. */
  isNew?: boolean;
  /** Short proof line on the card — years, volume, or platform. */
  count: string;
  /** What the client actually gets. */
  outcomes: Outcome[];
  /** Concrete deliverables, listed plainly. */
  deliverables: string[];
  /** Tools and platforms, shown as chips. */
  stack: string[];
  /** Honest answers to what prospects actually ask. */
  faq: Faq[];
  /** Who this is and is not for. Prevents bad-fit enquiries. */
  bestFor: string;
};

export const SERVICES: Service[] = [
  {
    slug: 'web-development',
    nav: 'Web Development',
    title: ['Websites that', 'earn their keep.'],
    tagline: 'Responsive, fast, SEO-ready websites on WordPress, Shopify or custom code.',
    lead: 'A website is not a brochure you tick off a list. It is the one asset that works while you sleep — and most of the ones I am asked to fix were slow, invisible to search, or impossible for the owner to update. I build the version that is none of those things.',
    icon: 'code',
    img: 'svc-web',
    count: '30+ sites shipped',
    outcomes: [
      {
        icon: 'rocket',
        title: 'Fast by default',
        blurb: 'Built to load in under two seconds on a phone on mobile data, because that is where most of your traffic actually is.',
      },
      {
        icon: 'target',
        title: 'Found in search',
        blurb: 'Clean structure, real metadata and schema markup from day one, rather than an SEO retrofit six months later.',
      },
      {
        icon: 'pen',
        title: 'Yours to edit',
        blurb: 'You get a CMS you can actually use and a walkthrough, so a price change does not need a developer.',
      },
      {
        icon: 'layers',
        title: 'Built to extend',
        blurb: 'Booking, payments, a members area or a shop can be added later without starting over.',
      },
    ],
    deliverables: [
      'Design mockups you sign off before a line of code',
      'Fully responsive build, phone through desktop',
      'CMS setup with your content loaded in',
      'On-page SEO, sitemap and structured data',
      'Analytics and Search Console connected',
      'Training walkthrough and a recording to keep',
      '30 days of post-launch support',
    ],
    stack: ['WordPress', 'Shopify', 'Astro', 'React', 'TypeScript', 'HTML5', 'CSS3', 'PHP'],
    bestFor:
      'Businesses replacing a site that is slow, dated or impossible to update. Less suited to one-page link-in-bio pages, which you can do yourself for free.',
    faq: [
      {
        q: 'How long does a site take?',
        a: 'A straightforward marketing site is two to four weeks from sign-off. Anything with a shop, booking or custom functionality runs four to eight. The honest answer depends on how fast content comes back from you — that is usually the long pole, not the build.',
      },
      {
        q: 'Do I have to move hosting?',
        a: 'No. I will work with what you have. If your current host is the reason the site is slow I will say so and show you the numbers, but the decision stays yours.',
      },
      {
        q: 'What happens after launch?',
        a: 'Thirty days of support is included for anything that breaks or confuses you. After that you can handle it yourself with the training, or keep me on a retainer.',
      },
    ],
  },

  {
    slug: 'digital-marketing-seo',
    nav: 'Digital Marketing & SEO',
    title: ['Found by the people', 'already looking.'],
    tagline: 'Search, social, email and paid campaigns driven by analytics rather than hope.',
    lead: 'Most marketing spend goes on reaching people who were never going to buy. Search is the opposite: it reaches people at the exact moment they are looking for what you sell. I build the systems that capture that demand and the campaigns that create more of it.',
    icon: 'spark',
    img: 'svc-marketing',
    count: '12 years in the field',
    outcomes: [
      {
        icon: 'target',
        title: 'Rank for what sells',
        blurb: 'Keyword research that targets buying intent, not vanity terms with big volumes and no customers behind them.',
      },
      {
        icon: 'chart',
        title: 'Reporting you can read',
        blurb: 'A monthly report in plain language: what moved, what it cost, and what I am changing next.',
      },
      {
        icon: 'flow',
        title: 'Campaigns that compound',
        blurb: 'Email and social that build an audience you own, instead of renting attention from an ad platform forever.',
      },
      {
        icon: 'users',
        title: 'Local visibility',
        blurb: 'Google Business Profile, local citations and review flow — the things that decide who gets the call in a given city.',
      },
    ],
    deliverables: [
      'Technical SEO audit with prioritised fixes',
      'Keyword and competitor research',
      'On-page optimisation across your key pages',
      'Google Analytics, Search Console and Tag Manager setup',
      'Content calendar and briefs',
      'Email and EDM campaign setup',
      'Monthly performance report with commentary',
    ],
    stack: ['Google Analytics', 'Search Console', 'Tag Manager', 'SEO / SEM', 'HubSpot', 'Email / EDM', 'Meta Ads', 'Google Ads'],
    bestFor:
      'Businesses with something people already search for, and the patience for a three to six month horizon. Not a fit if you need leads this week — that is a paid ads conversation, and a different one.',
    faq: [
      {
        q: 'How long before I see results?',
        a: 'Technical fixes can move things in weeks. Ranking for competitive terms takes three to six months, sometimes longer in a crowded market. Anyone promising page one in thirty days is either buying ads or lying.',
      },
      {
        q: 'Do you guarantee rankings?',
        a: 'No, and neither should anyone else — nobody controls Google. What I will commit to is the work, the reporting, and telling you early if a market is too competitive to be worth your money.',
      },
      {
        q: 'Can you work with my existing agency?',
        a: 'Yes. I have taken the technical side while an agency ran creative more than once. It works as long as everyone knows who owns what.',
      },
    ],
  },

  {
    slug: 'branding',
    nav: 'Branding & Design',
    title: ['A brand people', 'actually remember.'],
    tagline: 'Identity, visual systems and content design across the Adobe Creative Cloud.',
    lead: 'A logo is not a brand. A brand is what people recall when you are not in the room — a consistent voice, a palette they half-recognise, a way of showing up that makes you look like the obvious choice. That consistency is a system, and systems can be built.',
    icon: 'pen',
    img: 'svc-brand',
    count: 'Adobe CC + Figma',
    outcomes: [
      {
        icon: 'wand',
        title: 'Identity with reasoning',
        blurb: 'A mark, palette and type system chosen for how your market reads them — with the thinking written down, not just the files.',
      },
      {
        icon: 'layers',
        title: 'A system, not a logo',
        blurb: 'Rules for spacing, colour and hierarchy so everything you produce afterwards looks like it came from the same place.',
      },
      {
        icon: 'window',
        title: 'Ready for every surface',
        blurb: 'Assets exported for web, print, social and signage, in the formats each one actually needs.',
      },
      {
        icon: 'users',
        title: 'Usable by your team',
        blurb: 'Templates and a brand guide so staff can produce on-brand material without coming back to a designer each time.',
      },
    ],
    deliverables: [
      'Discovery session and positioning notes',
      'Primary logo plus responsive and mono variants',
      'Colour palette with accessibility-checked contrast',
      'Typography system and hierarchy',
      'Brand guidelines document',
      'Social and collateral templates',
      'Full source files — you own everything',
    ],
    stack: ['Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Brand Systems', 'Content Design'],
    bestFor:
      'Businesses outgrowing a logo someone made in Canva, or merging several inconsistent looks into one. Not a fit if you want a cheap logo in a week — that market is well served elsewhere.',
    faq: [
      {
        q: 'Do I own the files?',
        a: 'Yes, outright, including the editable sources. No licensing, no holding your own logo hostage.',
      },
      {
        q: 'How many concepts do I see?',
        a: 'Two or three genuinely different directions, not eight variations of the same idea. Then two rounds of refinement on whichever you pick.',
      },
      {
        q: 'Can you work with our existing brand?',
        a: 'Often the better move. An evolution keeps the recognition you have already paid for and fixes what is actually broken.',
      },
    ],
  },

  {
    slug: 'business-automation',
    nav: 'Business Automation',
    title: ['Stop doing work', 'a system should do.'],
    tagline: 'Lead capture, CRM pipelines and follow-up that run without anyone remembering.',
    lead: 'Most small businesses lose money in the gaps: the missed call nobody returned, the quote that went out four days late, the review never asked for. None of it is a people problem. It is a system problem, and systems do not forget.',
    icon: 'bolt',
    img: 'svc-automation',
    count: 'PXLCODE · GoHighLevel',
    outcomes: [
      {
        icon: 'flow',
        title: 'Follow-up that runs itself',
        blurb: 'Every enquiry gets a reply within seconds and a sequence behind it, whether or not anyone is at a desk.',
      },
      {
        icon: 'funnel',
        title: 'A pipeline you can see',
        blurb: 'Every lead in one place with stages that match how you actually sell, so nothing sits forgotten in an inbox.',
      },
      {
        icon: 'calendar',
        title: 'Booking without the back-and-forth',
        blurb: 'Real availability, reminders and a confirm step, which is most of what kills no-shows.',
      },
      {
        icon: 'spark',
        title: 'Reviews on autopilot',
        blurb: 'The ask goes out at the right moment after a job closes, which is the only time people actually leave one.',
      },
    ],
    deliverables: [
      'CRM and pipeline setup matched to your sales process',
      'Missed-call text-back and lead capture',
      'Calendar integration with reminders',
      'Email and SMS nurture sequences',
      'Review request automation',
      'Reporting dashboard',
      'Team training session and 30 days of support',
    ],
    stack: ['GoHighLevel', 'CRM Flows', 'Zapier', 'Make', 'Email / SMS', 'Webhooks', 'APIs'],
    bestFor:
      'Service businesses losing leads to slow follow-up — trades, clinics, agencies, anyone who sells by conversation. Less relevant if your sales happen entirely at a checkout.',
    faq: [
      {
        q: 'Do I need a GoHighLevel account already?',
        a: 'No. Either I set you up on your own, or you take a managed sub-account through Southside Studio and skip the platform admin entirely.',
      },
      {
        q: 'How long does setup take?',
        a: 'A working core system goes in inside a week. More involved automations get layered on after, once you have seen the basics running.',
      },
      {
        q: 'What if I need changes later?',
        a: 'Every build is designed to be extended. Small changes are quick; larger ones get quoted before anything is touched.',
      },
    ],
  },

  {
    slug: 'ai-agents',
    nav: 'AI Agents',
    title: ['AI that does the', 'work, not the demo.'],
    tagline: 'Custom AI agents that handle real tasks inside your business, with a human in the loop.',
    lead: 'The interesting part was never the chatbot. It is what happens when research, qualification, drafting and follow-up stop being the bottleneck — and a two-person team starts shipping like a ten-person one. I build agents that do a specific job properly, not ones that do everything badly.',
    icon: 'spark',
    img: 'svc-automation',
    isNew: true,
    count: 'New offering',
    outcomes: [
      {
        icon: 'users',
        title: 'Qualify before you call',
        blurb: 'An agent reads every inbound enquiry, enriches it, scores it against your criteria and routes it — so you spend time on the real ones.',
      },
      {
        icon: 'wand',
        title: 'Draft at volume',
        blurb: 'Proposals, replies and campaign copy drafted in your voice from your own material, then edited by a person before anything goes out.',
      },
      {
        icon: 'target',
        title: 'Research on demand',
        blurb: 'Market, competitor and prospect research synthesised into a brief you can act on the same day, not next week.',
      },
      {
        icon: 'flow',
        title: 'Wired into your stack',
        blurb: 'Agents that read and write to the systems you already run — CRM, inbox, calendar, sheets — rather than another tab to check.',
      },
    ],
    deliverables: [
      'Workshop to find the tasks genuinely worth automating',
      'Agent built and tuned against your real data',
      'Integration with your CRM, inbox or database',
      'Human review step on anything client-facing',
      'Guardrails, logging and a documented failure path',
      'Team training on supervising it',
      '30 days of tuning after go-live',
    ],
    stack: ['Claude', 'ChatGPT', 'Grok', 'APIs & Webhooks', 'CRM Integration', 'Workers', 'Automation'],
    bestFor:
      'Teams drowning in repeatable knowledge work — qualification, drafting, research, triage. Not a fit for anything where a wrong answer is unrecoverable and nobody will be checking the output.',
    faq: [
      {
        q: 'Will it make things up?',
        a: 'Any language model can. That is exactly why everything client-facing goes through a human review step, and why agents are built against your own material rather than left to improvise. AI sets the pace; it does not sign off on the work.',
      },
      {
        q: 'Is my data used to train models?',
        a: 'Not on the setups I build. Business API tiers do not train on your inputs by default, and I will show you the setting rather than ask you to take my word for it.',
      },
      {
        q: 'What does it cost to run?',
        a: 'Usage-based, and usually smaller than people expect — most agents cost a few dollars a month in tokens. I will estimate it from your actual volume before you commit.',
      },
    ],
  },

  {
    slug: 'ai-dashboard',
    nav: 'AI Dashboard',
    title: ['One screen for', 'the whole business.'],
    tagline: 'A control centre pulling your numbers into one place, with AI doing the explaining.',
    lead: 'Your numbers already exist — scattered across a CRM, an ad account, a till, a spreadsheet and three inboxes. The cost is not the data, it is the hour every week spent assembling it, and the decisions quietly made on a hunch because nobody had time. One screen fixes that.',
    icon: 'chart',
    img: 'svc-marketing',
    isNew: true,
    count: 'New offering',
    outcomes: [
      {
        icon: 'chart',
        title: 'Every number in one place',
        blurb: 'Leads, bookings, revenue, ad spend and site traffic on a single screen, refreshed automatically.',
      },
      {
        icon: 'wand',
        title: 'Plain-language answers',
        blurb: 'Ask why last month dropped and get a written answer from your own data, instead of squinting at a chart.',
      },
      {
        icon: 'bolt',
        title: 'Alerts that matter',
        blurb: 'Told when something moves meaningfully — cost per lead climbing, bookings stalling — not a daily digest you stop opening.',
      },
      {
        icon: 'users',
        title: 'A view for each role',
        blurb: 'What the owner needs is not what the sales lead needs. Separate views, one source of truth underneath.',
      },
    ],
    deliverables: [
      'Audit of where your numbers currently live',
      'Connectors into your CRM, ads, analytics and sheets',
      'Dashboard built around the decisions you actually make',
      'AI summary and natural-language querying',
      'Threshold alerts by email or SMS',
      'Scheduled reports to your inbox',
      'Training and 30 days of refinement',
    ],
    stack: ['GoHighLevel', 'Google Analytics', 'Meta Ads', 'Google Sheets', 'APIs', 'Cloudflare Workers', 'D1'],
    bestFor:
      'Owners making weekly decisions across several systems who want one honest view. Overkill if your business runs on one platform that already reports well.',
    faq: [
      {
        q: 'What can it connect to?',
        a: 'Anything with an API or an export — GoHighLevel, Google Analytics and Ads, Meta, Shopify, Sheets, most CRMs. If a system is genuinely closed I will say so up front rather than discover it mid-build.',
      },
      {
        q: 'Where does my data live?',
        a: 'In your own infrastructure, under your accounts. I build it; you own it. No dependency on me continuing to exist.',
      },
      {
        q: 'Can it replace my reporting?',
        a: 'Usually, for the day-to-day. Keep the platform-native reports for deep dives — this is for the decisions you make weekly.',
      },
    ],
  },

  {
    slug: 'mobile-apps',
    nav: 'Mobile Apps',
    title: ['On the home screen,', 'not just the browser.'],
    tagline: 'iOS and Android apps built once, for businesses that need to be in a pocket.',
    lead: 'Most businesses do not need an app. The ones that do know it: a loyalty programme nobody uses because it lives on a card, a field team typing into a phone browser, customers who book weekly and want it one tap away. When it is genuinely the right tool, a single build can serve both stores.',
    icon: 'window',
    img: 'svc-web',
    isNew: true,
    count: 'New offering',
    outcomes: [
      {
        icon: 'rocket',
        title: 'One build, both stores',
        blurb: 'A single codebase shipping to iOS and Android, instead of paying twice to build the same thing.',
      },
      {
        icon: 'bolt',
        title: 'Push that gets read',
        blurb: 'Notifications land on the home screen with a fraction of the noise of email — used sparingly, they work.',
      },
      {
        icon: 'flow',
        title: 'Works offline',
        blurb: 'Field teams and patchy signal are the same problem. The app keeps working and syncs when it reconnects.',
      },
      {
        icon: 'layers',
        title: 'Shares your backend',
        blurb: 'Built on the same data as your site and CRM, so the app is another window on one system, not a second one to maintain.',
      },
    ],
    deliverables: [
      'Scoping session on whether an app is genuinely the right call',
      'Clickable prototype before the build starts',
      'iOS and Android build from one codebase',
      'Push notification setup',
      'App Store and Play Store submission, including the review process',
      'Store listing copy and screenshots',
      'Over-the-air updates so fixes do not need a review cycle',
    ],
    stack: ['React Native', 'Expo', 'TypeScript', 'EAS Build', 'Push Notifications', 'App Store', 'Play Store'],
    bestFor:
      'Businesses with repeat users, a field team, or something genuinely better on a home screen. If a fast mobile website would do the same job, I will tell you — and build that instead.',
    faq: [
      {
        q: 'Do I actually need an app?',
        a: 'Often not, and I would rather say so in the first call than build something that gets installed once. The test is whether people will come back weekly, or need it to work offline. If neither is true, a good mobile site wins.',
      },
      {
        q: 'How long does store approval take?',
        a: 'Apple is typically one to three days, Google usually faster. Rejections mostly come from missing privacy details or unclear account deletion — I handle that paperwork as part of the build.',
      },
      {
        q: 'Who owns the developer accounts?',
        a: 'You do, in your company name. I will set them up with you, but the app belongs on your account — not mine.',
      },
    ],
  },
];

export function serviceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/* ---------------------------------------------------------------------------
   How working together actually goes. Shown on every service page so the
   process is the same promise regardless of which offering brought them in.
   --------------------------------------------------------------------------- */

export type WorkflowStep = {
  n: string;
  title: string;
  when: string;
  blurb: string;
  /** What the client walks away with at the end of this step. */
  output: string;
  icon: IconName;
};

export const WORKFLOW: WorkflowStep[] = [
  {
    n: '01',
    title: 'Discovery call',
    when: '20 minutes, free',
    blurb:
      'We work out what you are actually trying to fix, what you have already tried, and whether I am the right person for it. If I am not, I will say so and point you somewhere better.',
    output: 'A clear read on whether this is worth doing',
    icon: 'calendar',
  },
  {
    n: '02',
    title: 'Scope and proposal',
    when: 'Within 3 days',
    blurb:
      'You get a written scope: what is included, what is explicitly not, the timeline, and a fixed price. No hourly surprises, and nothing starts until you have agreed to it.',
    output: 'A fixed-price proposal you can say no to',
    icon: 'pen',
  },
  {
    n: '03',
    title: 'Build in the open',
    when: 'The bulk of the project',
    blurb:
      'A staging link is shared from the first week and updated as work lands. You see progress as it happens instead of waiting a month to find out we understood each other differently.',
    output: 'A live staging URL and weekly check-ins',
    icon: 'code',
  },
  {
    n: '04',
    title: 'Review and launch',
    when: 'Final week',
    blurb:
      'You go through it properly against the original scope, we fix what needs fixing, and then it goes live — with analytics connected from the first day, not bolted on later.',
    output: 'Live, measured, and handed over with training',
    icon: 'rocket',
  },
  {
    n: '05',
    title: 'Support and iterate',
    when: '30 days, then optional',
    blurb:
      'Thirty days of support is included for anything broken or confusing. After that you either run it yourself with the training, or keep me on for ongoing work. No lock-in either way.',
    output: 'A system you own and can actually run',
    icon: 'flow',
  },
];
