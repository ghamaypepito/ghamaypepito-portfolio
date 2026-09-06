import { ICON_PATHS, type IconName } from '@/lib/icons';

type Props = {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
};

export default function Icon({ name, size = 22, stroke = 1.6, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
    />
  );
}
