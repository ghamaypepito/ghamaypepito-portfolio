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
  { label: 'Services', href: '/services/' },
  { label: 'Work', href: '/work/' },
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

/**
 * True when the given href points at the page currently being viewed.
 * Trailing slashes are normalised, since the site serves '/services/' while a
 * link may be written either way.
 */
export function isActive(href: string, pathname: string): boolean {
  if (href.startsWith('/#')) return false;
  const norm = (s: string) => (s !== '/' && s.endsWith('/') ? s.slice(0, -1) : s);
  const h = norm(href);
  const p = norm(pathname);
  if (h === '/') return p === '/';
  return p === h || p.startsWith(`${h}/`);
}
