import type { JSX } from 'preact';

type P = { size?: number; stroke?: string; width?: number; style?: JSX.CSSProperties };

function Svg({ size = 18, stroke = 'currentColor', width = 1.8, style, children }: P & { children: JSX.Element | JSX.Element[] }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} stroke-width={width}
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style={style}>
      {children}
    </svg>
  );
}

export const Globe = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></Svg>;
export const Pin = (p: P) => <Svg {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></Svg>;
export const Nav = (p: P) => <Svg width={2} {...p}><path d="M3 11 21 3l-8 18-2-8z" /></Svg>;
export const Chevron = (p: P) => <Svg width={2} {...p}><path d="m9 6 6 6-6 6" /></Svg>;
export const Back = (p: P) => <Svg width={2} {...p}><path d="m15 6-6 6 6 6" /></Svg>;
export const Calendar = (p: P) => <Svg {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /></Svg>;
export const Clock = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>;
export const Copy = (p: P) => <Svg {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></Svg>;
export const Bus = (p: P) => <Svg {...p}><rect x="6" y="3" width="12" height="14" rx="3" /><path d="M6 11h12M9 21l1.5-4M15 21l-1.5-4" /></Svg>;
export const Bell = (p: P) => <Svg {...p}><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></Svg>;
export const Home = (p: P) => <Svg {...p}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" /></Svg>;
export const Info = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Svg>;
export const Download = (p: P) => <Svg width={2} {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></Svg>;
