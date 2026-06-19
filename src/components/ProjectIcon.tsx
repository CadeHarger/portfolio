import { Crown } from 'lucide-react';

type Props = {
  icon?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: { wrapper: 'w-9 h-9', img: 'w-9 h-9', icon: 16 },
  md: { wrapper: 'w-12 h-12', img: 'w-12 h-12', icon: 22 },
  lg: { wrapper: 'w-16 h-16', img: 'w-16 h-16', icon: 30 },
};

export default function ProjectIcon({ icon, name, size = 'md' }: Props) {
  const s = sizes[size];

  if (!icon) return null;

  if (icon === 'crown') {
    return (
      <div
        className={`${s.wrapper} rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm`}
      >
        <Crown size={s.icon} className="text-blue-600" strokeWidth={2} />
      </div>
    );
  }

  return (
    <img
      src={icon}
      alt={`${name} icon`}
      className={`${s.img} rounded-xl object-cover shrink-0 shadow-sm`}
    />
  );
}
