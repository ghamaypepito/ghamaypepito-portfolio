/**
 * Icon geometry, shared by the Astro and React renderers so a shape is only
 * ever defined once. All icons are 24x24 on a stroke grid.
 */
export const ICON_PATHS = {
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  spark:
    '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="M12 8.5a3.5 3.5 0 0 0 0 7 3.5 3.5 0 0 0 0-7Z"/>',
  pen: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>',
  bolt: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  arrowUpRight: '<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  quote:
    '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h2.5c0 2.5-2.5 4-3.5 4z"/><path d="M14 21c3 0 7-1 7-8V5c0-1.25-.757-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h2.5c0 2.5-2.5 4-3.5 4z"/>',
  cap: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-5"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  corner: '<polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>',
  window: '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 8h20"/><circle cx="5.5" cy="5.5" r=".6" fill="currentColor"/><circle cx="8" cy="5.5" r=".6" fill="currentColor"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  flow: '<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7.4 7.2 10.6 16M16.6 7.2 13.4 16M7.5 6h9"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  users: '<path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3.2"/><path d="M22 20v-2a4 4 0 0 0-3-3.87"/><path d="M16.5 3.6a4 4 0 0 1 0 6.8"/>',
  funnel: '<path d="M3 4h18l-7 8v7l-4 2v-9L3 4Z"/>',
  chart: '<path d="M3 3v18h18"/><polyline points="7 15 11 10 15 13 20 6"/>',
  wand: '<path d="M15 4V2M15 10V8M12.5 6h-2M19.5 6h-2M17 4.5 15.6 5.9M17 7.5l-1.4-1.4M13 4.5l1.4 1.4M13 7.5l1.4-1.4"/><path d="M4 20 14 10l1.6 1.6L5.6 21.6 4 20Z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.74-.83.73-2.1-.07-2.9a2.05 2.05 0 0 0-2.93-.1Z"/><path d="M12 15 9 12a12 12 0 0 1 7-9 12 12 0 0 1 5 5 12 12 0 0 1-9 7Z"/><circle cx="15" cy="9" r="1.6"/>',
} as const;

export type IconName = keyof typeof ICON_PATHS;

/** The brand monogram — a G built from a single stroked path. */
export const BRAND_MARK =
  '<path d="M5 29V9a5 5 0 0 1 5-5h9a10 10 0 0 1 0 20h-9" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" fill="none"/>' +
  '<circle cx="13.5" cy="14" r="2.1" fill="currentColor"/>';
