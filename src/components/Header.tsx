import type { ComponentChildren } from 'preact';
import { LangToggle } from './LangToggle';

export function ScreenHeader({ title, children }: { title: string; children?: ComponentChildren }) {
  return (
    <header class="screen-header">
      <div class="row between start">
        <div class="stack-4">
          <div class="eyebrow gold">CENTENARIO 2026</div>
          <h1 class="display-38">{title}</h1>
        </div>
        <LangToggle />
      </div>
      {children}
    </header>
  );
}
