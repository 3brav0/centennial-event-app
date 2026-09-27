import type { ComponentChildren } from 'preact';

/** External link that leaves app-scheme URIs (geo:) in the same tab so the OS can hand them off. */
export function MapLink({ url, class: cls, label, children }: { url: string; class?: string; label?: string; children: ComponentChildren }) {
  const external = url.startsWith('http');
  return (
    <a href={url} class={cls} aria-label={label} target={external ? '_blank' : undefined} rel={external ? 'noopener' : undefined}>
      {children}
    </a>
  );
}
