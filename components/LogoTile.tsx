'use client';
import { LogoItem } from '@/lib/logoData';
import { useTableStore } from '@/store/tableStore';

interface Props {
  logo: LogoItem;
}

export default function LogoTile({ logo }: Props) {
  const addItem = useTableStore(s => s.addItem);

  return (
    <button
      className="logo-card flex flex-col items-center justify-center gap-1 rounded-xl p-2 border border-white/10 bg-white/5 hover:bg-white/10 select-none w-full"
      onClick={() => addItem(logo)}
      title={logo.name}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-md"
        style={{ background: logo.bg }}
      >
        {logo.emoji}
      </div>
      <span className="text-xs text-gray-300 text-center leading-tight truncate w-full px-1">
        {logo.name}
      </span>
    </button>
  );
}
