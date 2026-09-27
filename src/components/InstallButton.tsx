import { useEffect, useRef, useState } from 'preact/hooks';
import { useApp } from '../app';
import { useInstall } from '../install';
import { detectPlatform } from '../maps';
import { Download } from '../icons';

/** Compact install action for the tablet/desktop top bar; the phone layout uses InstallCard. */
export function InstallButton() {
  const { t } = useApp();
  const { canPrompt, installed, prompt } = useInstall();
  const [helpOpen, setHelpOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  // iPadOS Safari has no install prompt; explain the Share-sheet route instead.
  const ios = detectPlatform() === 'ios';

  useEffect(() => {
    if (!helpOpen) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !wrap.current?.contains(e.target as Node)) setHelpOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [helpOpen]);

  if (installed || (!canPrompt && !ios)) return null;

  return (
    <div class="install-btn-wrap" ref={wrap}>
      <button
        type="button"
        class="install-btn"
        aria-expanded={ios ? helpOpen : undefined}
        onClick={() => (canPrompt ? prompt() : setHelpOpen(!helpOpen))}
      >
        <Download size={16} />
        <span>{t.installTitle}</span>
      </button>
      {helpOpen && (
        <div class="install-pop" role="dialog" aria-label={t.installTitle}>
          <div class="t-14 bold">{t.installTitle}</div>
          <div class="t-13 muted lh-14">{t.installBody}</div>
          <div class="t-13 lh-14">{t.iosInstall}</div>
        </div>
      )}
    </div>
  );
}
