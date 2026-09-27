import { useState } from 'preact/hooks';
import { useApp } from '../app';
import { useInstall } from '../install';
import { detectPlatform } from '../maps';

export function InstallCard() {
  const { t } = useApp();
  const { canPrompt, installed, prompt } = useInstall();
  const [showIosHelp, setShowIosHelp] = useState(false);
  const ios = detectPlatform() === 'ios';

  // Nothing useful to offer: already installed, or a browser with no install path.
  if (installed || (!canPrompt && !ios)) return null;

  return (
    <div class="install-card">
      <img src={`${import.meta.env.BASE_URL}img/crest.png`} alt="" width={58} height={58} />
      <div class="grow stack-2">
        <div class="t-15 bold">{t.installTitle}</div>
        <div class="t-13 muted">{showIosHelp ? t.iosInstall : t.installBody}</div>
      </div>
      {!showIosHelp && (
        <button type="button" class="btn-solid" onClick={() => (canPrompt ? prompt() : setShowIosHelp(true))}>
          {t.install}
        </button>
      )}
    </div>
  );
}
