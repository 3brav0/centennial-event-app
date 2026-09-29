"""Builds the bilingual volunteer guide as HTML (one letter page per language)."""
import html, pathlib

HERE = pathlib.Path(__file__).parent

ICON = {
    'pin': '<path d="M9 4h6l-1 6 3 3H7l3-3z"/><path d="M12 13v7"/>',
    'hide': '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3 3.9M6.6 6.6A17 17 0 0 0 2.5 12S6 19 12 19a9.6 9.6 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    'edit': '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    'line': '<path d="M20 5v6a3 3 0 0 1-3 3H5"/><path d="m9 10-4 4 4 4"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
}

def icon(name, size=20):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{ICON[name]}</svg>')

L = {
    'es': dict(
        lang='ESPAÑOL', title='Cómo publicar avisos', sub='Guía para voluntarios',
        lead='Los avisos se escriben en la hoja de Google de avisos, pestaña <b>Avisos</b>. '
             'Aparecen en la app en aproximadamente <b>1 minuto</b>.',
        steps_h='PUBLICAR UN AVISO',
        steps=[
            ('Ve a la primera fila vacía', 'de la pestaña <b>Avisos</b>.'),
            ('Elige el Tipo', '<b>Importante</b> o <b>Logística</b>.'),
            ('Escribe el título y el texto en español', 'columnas <b>Título (ES)</b> y <b>Texto (ES)</b>.'),
            ('Inglés: opcional', 'si dejas <b>Title (EN)</b> y <b>Text (EN)</b> vacíos, se muestra el español.'),
            ('¡Listo!', 'la columna <b>Publicado</b> se llena sola con la hora.'),
        ],
        sheet_h='ASÍ SE VE UNA FILA',
        required='Obligatorio', optional='Opcional', auto='Automático',
        ex=('Importante', 'Puertas abiertas', 'Entrada por Willoughby Way.', 'Doors open', 'Enter from Willoughby Way.', 'vie 2 oct, 1:30 pm'),
        app_h='Y ASÍ APARECE EN LA APP', app_note='En aproximadamente 1 minuto, para todos.',
        app_pill='Importante', app_time='hace 1 min', app_title='Puertas abiertas', app_body='Entrada por Willoughby Way.',
        actions_h='OTRAS ACCIONES',
        actions=[
            ('pin', 'Fijar arriba', 'Marca <b>Fijar / Pin</b>. El aviso se queda al inicio de la lista.'),
            ('hide', 'Quitar un aviso', 'Marca <b>Ocultar / Hide</b>, o borra la fila.'),
            ('edit', 'Corregir un error', 'Edita el texto. No se envía una notificación nueva.'),
            ('line', 'Nueva línea en el texto', '<b>Alt + Enter</b> (Windows) u <b>Option + Enter</b> (Mac).'),
        ],
        tips_h='CONSEJOS',
        tips=['Títulos cortos y claros: “Puertas abiertas”, “Cambio de horario”.',
              'Usa <b>Importante</b> solo para lo urgente: horarios, accesos, seguridad.',
              'No cambies el nombre de la pestaña <b>Avisos</b> ni muevas sus columnas.'],
        foot='Los avisos aparecen en la sección <b>Avisos</b> de la app',
    ),
    'en': dict(
        lang='ENGLISH', title='How to post announcements', sub='Volunteer guide',
        lead='Announcements are written in the announcements Google Sheet, on the <b>Avisos</b> tab. '
             'They appear in the app in about <b>1 minute</b>.',
        steps_h='POST AN ANNOUNCEMENT',
        steps=[
            ('Go to the first empty row', 'on the <b>Avisos</b> tab.'),
            ('Pick the Type', '<b>Importante</b> (important) or <b>Logística</b> (logistics).'),
            ('Type the Spanish title and text', 'columns <b>Título (ES)</b> and <b>Texto (ES)</b>.'),
            ('English is optional', 'if <b>Title (EN)</b> and <b>Text (EN)</b> are blank, the Spanish is shown.'),
            ('Done!', 'the <b>Posted</b> column fills in the time by itself.'),
        ],
        sheet_h='WHAT A ROW LOOKS LIKE',
        required='Required', optional='Optional', auto='Automatic',
        ex=('Importante', 'Puertas abiertas', 'Entrada por Willoughby Way.', 'Doors open', 'Enter from Willoughby Way.', 'Fri 2 Oct, 1:30 pm'),
        app_h='AND HOW IT APPEARS IN THE APP', app_note='In about 1 minute, for everyone.',
        app_pill='Important', app_time='1 min ago', app_title='Doors open', app_body='Enter from Willoughby Way.',
        actions_h='OTHER ACTIONS',
        actions=[
            ('pin', 'Keep it at the top', 'Tick <b>Fijar / Pin</b>. It stays first in the list.'),
            ('hide', 'Remove it', 'Tick <b>Ocultar / Hide</b>, or delete the row.'),
            ('edit', 'Fix a typo', 'Just edit the text. No new notification is sent.'),
            ('line', 'New line in the text', '<b>Alt + Enter</b> (Windows) or <b>Option + Enter</b> (Mac).'),
        ],
        tips_h='TIPS',
        tips=['Short, clear titles: “Gates open”, “Schedule change”.',
              'Use <b>Importante</b> only for urgent things: times, entrances, safety.',
              "Don't rename the <b>Avisos</b> tab or move its columns."],
        foot='Announcements appear in the app’s <b>Announcements</b> section',
    ),
}

HEADERS = ['Ocultar / Hide', 'Fijar / Pin', 'Tipo / Type', 'Título (ES)', 'Texto (ES)', 'Title (EN)', 'Text (EN)', 'Publicado / Posted']
KIND = ['opt', 'opt', 'req', 'req', 'req', 'opt', 'opt', 'auto']

def page(c):
    tag = {'req': c['required'], 'opt': c['optional'], 'auto': c['auto']}
    ex = c['ex']
    cells = [
        '<span class="cb"></span>', '<span class="cb"></span>',
        f'<span class="dd">{ex[0]} ▾</span>', html.escape(ex[1]), html.escape(ex[2]),
        html.escape(ex[3]), html.escape(ex[4]), f'<span class="auto">{ex[5]}</span>',
    ]
    sheet = ''.join(f'<div class="h {k}">{h}</div>' for h, k in zip(HEADERS, KIND))
    sheet += ''.join(f'<div class="c {k}">{v}</div>' for v, k in zip(cells, KIND))
    sheet += ''.join(f'<div class="t {k}">{tag[k]}</div>' for k in KIND)
    steps = ''.join(f'<li><span class="n">{i}</span><div><b>{a}</b> — {b}</div></li>' for i, (a, b) in enumerate(c['steps'], 1))
    actions = ''.join(f'<div class="act"><span class="ic">{icon(k)}</span><div><div class="at">{t}</div><div class="ad">{d}</div></div></div>'
                      for k, t, d in c['actions'])
    tips = ''.join(f'<li>{t}</li>' for t in c['tips'])
    return f'''
<section class="page">
  <header class="band">
    <img src="../../public/img/crest.png" alt="" class="crest">
    <div class="band-text">
      <div class="eyebrow">CENTENARIO 2026 · ATLANTA, GA</div>
      <h1>{c['title']}</h1>
      <div class="sub">{c['sub']}</div>
    </div>
    <div class="chip">{c['lang']}</div>
  </header>
  <main>
    <p class="lead">{c['lead']}</p>
    <div class="cols">
      <div>
        <h2>{c['steps_h']}</h2>
        <ol class="steps">{steps}</ol>
      </div>
      <div>
        <h2>{c['tips_h']}</h2>
        <ul class="tips">{tips}</ul>
      </div>
    </div>
    <h2>{c['sheet_h']}</h2>
    <div class="sheet">{sheet}</div>
    <h2>{c['app_h']}</h2>
    <div class="app-row">
      <div class="phone">
        <div class="phone-bar"><span class="dot"></span>{'AVISOS' if c['lang']=='ESPAÑOL' else 'ANNOUNCEMENTS'}</div>
        <div class="notice">
          <div class="notice-top"><span class="pill">{c['app_pill']}</span><span class="time">{c['app_time']}</span></div>
          <div class="nt">{c['app_title']}</div>
          <div class="nb">{c['app_body']}</div>
        </div>
      </div>
      <div class="app-note"><span class="ic">{icon('clock')}</span><span>{c['app_note']}</span></div>
    </div>
    <h2>{c['actions_h']}</h2>
    <div class="acts">{actions}</div>
  </main>
  <footer><span>{c['foot']}</span><span class="url">event.atl.cotlgfb.org</span></footer>
</section>'''

CSS = '''
@page { size: Letter; margin: 0; }
:root { --forest:#0F3D2E; --gold:#E8C872; --gold-ink:#7A5712; --ink:#1E2A22; --cream:#F6F0E1; --paper:#FFFDF7;
  --ivory:#FBF6EA; --line:#E6DCC3; --sand:#F1E7CC; --muted:#4A4D42; --mint:#CFDCD3; }
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Manrope', sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 8.5in; height: 11in; background: var(--cream); display: flex; flex-direction: column; page-break-after: always; overflow: hidden; }
.band { background: var(--forest); color: var(--ivory); padding: 0.34in 0.55in 0.3in; display: flex; align-items: center; gap: 22px; position: relative; }
.crest { width: 86px; height: auto; }
.band-text { flex: 1; }
.eyebrow { font-family: 'Cinzel', serif; font-size: 10.5px; font-weight: 600; letter-spacing: 0.22em; color: var(--gold); }
h1 { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 40px; line-height: 1; margin: 8px 0 6px; }
.sub { font-size: 13px; color: var(--mint); }
.chip { position: absolute; top: 0.28in; right: 0.55in; border: 1px solid rgba(232,200,114,.6); color: var(--gold); border-radius: 999px;
  padding: 4px 11px; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; }
main { flex: 1; padding: 0.24in 0.55in 0; display: flex; flex-direction: column; }
.lead { margin: 0 0 4px; font-size: 13.5px; line-height: 1.5; color: var(--muted); }
h2 { font-family: 'Cinzel', serif; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; color: var(--gold-ink); margin: 16px 0 8px; }
.cols { display: grid; grid-template-columns: 1.35fr 1fr; gap: 26px; }
.steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.steps li { display: flex; gap: 11px; align-items: flex-start; font-size: 12.5px; line-height: 1.45; }
.steps .n { flex: 0 0 24px; height: 24px; border-radius: 50%; background: var(--forest); color: var(--gold);
  font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 16px; display: flex; align-items: center; justify-content: center; }
.steps li div { padding-top: 3px; }
.tips { list-style: none; margin: 0; padding: 14px 16px; background: var(--sand); border-radius: 14px; display: flex; flex-direction: column; gap: 9px; }
.tips li { position: relative; padding-left: 16px; font-size: 12px; line-height: 1.45; color: #3F3A24; }
.tips li::before { content: ''; position: absolute; left: 0; top: 6px; width: 7px; height: 7px; border-radius: 50%; background: var(--gold-ink); }
.sheet { display: grid; grid-template-columns: 0.62fr 0.55fr 0.85fr 1.05fr 1.35fr 0.9fr 1.3fr 1fr; border: 1px solid #C9BD9B;
  border-radius: 10px; overflow: hidden; background: #fff; font-size: 9.5px; }
.sheet .h { background: var(--forest); color: var(--ivory); font-weight: 700; padding: 7px 6px; line-height: 1.25; border-right: 1px solid rgba(255,255,255,.12); }
.sheet .c { padding: 8px 6px; line-height: 1.35; border-right: 1px solid #E8E1CF; min-height: 44px; }
.sheet .t { padding: 5px 6px; font-size: 8.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; border-top: 1px solid #E8E1CF; border-right: 1px solid #E8E1CF; }
.sheet .t.req { background: #FFF3D6; color: var(--gold-ink); }
.sheet .t.opt { background: #F4F1E8; color: #77756A; }
.sheet .t.auto { background: #E3EDE6; color: var(--forest); }
.sheet .c.req { background: #FFFBEF; }
.cb { display: inline-block; width: 12px; height: 12px; border: 1.5px solid #8D8A7C; border-radius: 3px; }
.dd { display: inline-block; white-space: nowrap; background: #FBE6D7; color: #9A3412; font-weight: 700; border-radius: 999px; padding: 2px 7px; }
.auto { color: #6B6A5C; font-style: italic; }
.acts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.act { background: var(--paper); border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; display: flex; gap: 12px; align-items: flex-start; }
.ic { flex: 0 0 34px; height: 34px; border-radius: 10px; background: var(--forest); color: var(--gold); display: flex; align-items: center; justify-content: center; }
.at { font-weight: 700; font-size: 13px; margin-bottom: 2px; }
.ad { font-size: 11.5px; line-height: 1.45; color: var(--muted); }
.app-row { display: flex; align-items: center; gap: 22px; }
.phone { width: 3.7in; background: var(--forest); border-radius: 18px; padding: 12px; }
.phone-bar { display: flex; align-items: center; gap: 8px; color: var(--mint); font-size: 10px; font-weight: 700; letter-spacing: .14em; padding: 2px 4px 10px; }
.phone-bar .dot { width: 7px; height: 7px; border-radius: 50%; background: #FB923C; box-shadow: 0 0 0 3px rgba(251,146,60,.25); }
.notice { background: var(--paper); border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 5px; }
.notice-top { display: flex; justify-content: space-between; align-items: center; }
.pill { font-size: 9.5px; font-weight: 800; letter-spacing: .08em; color: #9A3412; background: #FBE6D7; border-radius: 999px; padding: 2px 8px; }
.time { font-size: 10px; color: #6B6A5C; }
.nt { font-size: 14px; font-weight: 700; }
.nb { font-size: 12px; color: var(--muted); }
.app-note { display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 700; color: var(--forest); max-width: 2.6in; }
footer { margin: auto 0.55in 0.34in; padding-top: 10px; border-top: 1px solid var(--line); display: flex; justify-content: space-between;
  font-size: 11px; color: #6B6A5C; }
footer .url { font-weight: 700; color: var(--forest); }
'''

doc = f'''<!doctype html><html><head><meta charset="utf-8"><title>Guía de avisos · Announcements guide</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Cormorant+Garamond:wght@700&family=Manrope:wght@400;700&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{page(L['es'])}{page(L['en'])}</body></html>'''
(HERE / 'guide.html').write_text(doc, encoding='utf-8')
print('ok')
