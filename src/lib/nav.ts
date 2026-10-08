/**
 * Site navigation. With more than one page, a nav entry is either a route or
 * an anchor on the homepage, and the active state is decided differently for
 * each — a route matches on pathname, an anchor on scroll position.
 */
export type NavLink = {
  label: string;
  /** Route, or homepage anchor written as '/#id'. */
  href: string;
  /** Section id for scroll-spy. Present only on homepage anchors. */
  anchor?: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/#about', anchor: 'about' },
  { label: 'Contact', href: '/#contact', anchor: 'contact' },
];

/** Homepage section ids the scroll-spy and command palette can reach. */
export const HOME_SECTIONS = [
  { id: 'work', label: 'Featured work' },
  { id: 'services', label: 'Services' },
  { id: 'ghl', label: 'GoHighLevel' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const;

/** True when the given href points at the page currently being viewed. */
export function isActive(href: string, pathname: string): boolean {
  if (href.startsWith('/#')) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
