import { useApp } from '../app';
import { Globe } from '../icons';

export function LangToggle({ variant = 'outline' }: { variant?: 'outline' | 'on-image' }) {
  const { t, toggleLang } = useApp();
  return (
    <button type="button" class={`lang-toggle ${variant}`} onClick={toggleLang} aria-label={t.langAria}>
      {variant === 'on-image' && <Globe size={16} />}
      <span>{t.langSwitch}</span>
    </button>
  );
}
