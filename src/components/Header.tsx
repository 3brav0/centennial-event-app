import type { ComponentChildren } from 'preact';
import { useApp } from '../app';
import { LangToggle } from './LangToggle';

/** Green title band. `aside` sits beside the title on wide screens and below it on phones. */
export function ScreenHeader({ title, children, aside }: { title: string; children?: ComponentChildren; aside?: ComponentChildren }) {
  const { t } = useApp();
  return (
    <header class="screen-header">
      <div class="container header-inner">
        <div class="header-main">
          <div class="row between start">
            <div class="stack-4">
              <div class="eyebrow gold">{t.brand}</div>
              <h1 class="display-38">{title}</h1>
            </div>
            <LangToggle />
          </div>
          {children}
        </div>
        {aside && <div class="header-aside">{aside}</div>}
      </div>
    </header>
  );
}
