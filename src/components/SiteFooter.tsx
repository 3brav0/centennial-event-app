import { useApp } from '../app';

export function SiteFooter() {
  const { t } = useApp();
  return (
    <footer class="site-footer">
      <div class="container site-footer-inner">
        <img src={`${import.meta.env.BASE_URL}img/crest.png`} alt="" width={30} height={32} />
        <span class="grow">{t.officialSite}</span>
        <a href="https://tlotw.org" target="_blank" rel="noopener" class="footer-link">
          tlotw.org
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
