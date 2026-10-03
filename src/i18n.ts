export type Lang = 'es' | 'en';
export type Localized = Record<Lang, string>;

const es = {
  langSwitch: 'EN', langAria: 'Switch to English',
  tagline: '100 años de esperanza y salvación',
  dates: 'Atlanta, Georgia · 2 – 4 de octubre, 2026',
  nextUp: 'PRÓXIMO EVENTO', happeningNow: 'EN CURSO', finished: 'GRACIAS POR ACOMPAÑARNOS',
  days: 'días', hours: 'horas', mins: 'min',
  directions: 'Cómo llegar', details: 'Ver detalles',
  liveNow: 'EN VIVO', allNotices: 'Ver todos los avisos',
  theProgram: 'EL PROGRAMA',
  installTitle: 'Instala la app', installBody: 'Acceso sin conexión y avisos al instante en tu teléfono.', install: 'Instalar',
  iosInstall: 'En Safari, toca Compartir y luego “Agregar a pantalla de inicio”.',
  program: 'Programa', parkingNearby: 'Estacionamiento', howToGet: 'Detalles',
  subjectToChange: 'Los horarios pueden cambiar. Revisa la sección de Avisos durante el evento.',
  date: 'Fecha', time: 'Hora', location: 'UBICACIÓN', copy: 'Copiar dirección', copied: 'Dirección copiada',
  openIn: 'Abrir indicaciones en', myMapsApp: 'Abrir en mi app de mapas',
  info: 'INFORMACIÓN',
  parking: 'ESTACIONAMIENTO CERCANO', go: 'Ir',
  parkingDisclaimer: 'Tarifas y disponibilidad pueden variar el día del evento. Confirma en el lugar.',
  transit: 'TRANSPORTE PÚBLICO',
  notices: 'Avisos', liveUpdated: 'En vivo · se actualiza automáticamente',
  offline: 'Sin conexión · mostrando los últimos avisos guardados',
  notifBody: 'Recibe los avisos importantes al instante.', notifOn: 'Activadas', notifOff: 'Activar',
  notifDenied: 'Las notificaciones están bloqueadas en la configuración del navegador.',
  notifIos: 'Para recibir notificaciones en iPhone, primero instala la app en tu pantalla de inicio.',
  all: 'Todos', important: 'Importante', logistics: 'Logística', pinned: 'FIJADO',
  emptyTitle: 'No hay indicaciones nuevas en este momento', emptyBody: 'Te avisaremos cuando haya novedades.',
  home: 'Inicio', navAria: 'Navegación principal',
  eventsOne: 'evento', eventsMany: 'eventos', places: 'opciones', place: 'opción',
  kind: { deck: 'Garaje', lot: 'Lote', street: 'Calle' } as Record<string, string>,
  cost: { paid: 'De pago', free: 'Gratis', signs: 'Según señalización' } as Record<string, string>,
  justNow: 'ahora mismo',
  brand: 'CENTENARIO 2026',
  officialSite: 'Sitio oficial de La Luz del Mundo',
  events: 'Eventos', topics: 'Temas', doctrinalTopics: 'Temas doctrinales', topicsSede: 'Sede: Atlanta, GA',
  topicsHeading: 'TEMAS DOCTRINALES', eventProgram: 'PROGRAMA DEL EVENTO', topicLabel: 'TEMA', ceremony: 'CEREMONIA',
  viewEvent: 'Ver evento', programViews: 'Vista del programa',
  weather: 'CLIMA', feelsLike: 'Sensación', rain: 'Lluvia', wind: 'Viento',
  forecastFor: 'Pronóstico', forecastIn: (n: number) => `El pronóstico estará disponible en ${n} ${n === 1 ? 'día' : 'días'}.`,
  niceOutdoor: 'Buen clima para el evento. ¡Disfrútalo!', niceIndoor: 'Sin inconvenientes por el clima para llegar.',
  weatherUpdated: 'Actualizado', weatherSource: 'Datos del clima: Open-Meteo',
  cond: { clear: 'Despejado', partly: 'Parcialmente nublado', cloudy: 'Nublado', fog: 'Neblina', drizzle: 'Llovizna', rain: 'Lluvia', storm: 'Tormentas', snow: 'Nieve' } as Record<string, string>,
  loadError: 'No se pudo cargar el programa. Revisa tu conexión.'
};

const en: typeof es = {
  langSwitch: 'ES', langAria: 'Cambiar a español',
  tagline: '100 years of hope and salvation',
  dates: 'Atlanta, Georgia · October 2 – 4, 2026',
  nextUp: 'NEXT UP', happeningNow: 'HAPPENING NOW', finished: 'THANK YOU FOR JOINING US',
  days: 'days', hours: 'hours', mins: 'min',
  directions: 'Directions', details: 'Details',
  liveNow: 'LIVE', allNotices: 'See all announcements',
  theProgram: 'THE PROGRAM',
  installTitle: 'Install the app', installBody: 'Offline access and instant announcements on your phone.', install: 'Install',
  iosInstall: 'In Safari, tap Share, then “Add to Home Screen”.',
  program: 'Program', parkingNearby: 'Parking', howToGet: 'Details',
  subjectToChange: 'Times may change. Check Announcements during the event.',
  date: 'Date', time: 'Time', location: 'LOCATION', copy: 'Copy address', copied: 'Address copied',
  openIn: 'Open directions in', myMapsApp: 'Open in my maps app',
  info: 'INFORMATION',
  parking: 'NEARBY PARKING', go: 'Go',
  parkingDisclaimer: 'Rates and availability may change on event day. Confirm on site.',
  transit: 'PUBLIC TRANSIT',
  notices: 'Announcements', liveUpdated: 'Live · updates automatically',
  offline: 'Offline · showing the last saved announcements',
  notifBody: 'Get important announcements instantly.', notifOn: 'On', notifOff: 'Turn on',
  notifDenied: 'Notifications are blocked in your browser settings.',
  notifIos: 'To get notifications on iPhone, first add the app to your Home Screen.',
  all: 'All', important: 'Important', logistics: 'Logistics', pinned: 'PINNED',
  emptyTitle: 'No new announcements right now', emptyBody: 'We will let you know when there is news.',
  home: 'Home', navAria: 'Main navigation',
  eventsOne: 'event', eventsMany: 'events', places: 'options', place: 'option',
  kind: { deck: 'Deck', lot: 'Lot', street: 'Street' },
  cost: { paid: 'Paid', free: 'Free', signs: 'Per posted signs' },
  justNow: 'just now',
  brand: 'CENTENNIAL 2026',
  officialSite: 'Official site of The Light of the World',
  events: 'Events', topics: 'Topics', doctrinalTopics: 'Doctrinal topics', topicsSede: 'Host city: Atlanta, GA',
  topicsHeading: 'DOCTRINAL TOPICS', eventProgram: 'EVENT PROGRAM', topicLabel: 'TOPIC', ceremony: 'CEREMONY',
  viewEvent: 'View event', programViews: 'Program view',
  weather: 'WEATHER', feelsLike: 'Feels like', rain: 'Rain', wind: 'Wind',
  forecastFor: 'Forecast', forecastIn: (n: number) => `The forecast will be available in ${n} ${n === 1 ? 'day' : 'days'}.`,
  niceOutdoor: 'Nice weather for the event. Enjoy!', niceIndoor: 'No weather concerns for getting there.',
  weatherUpdated: 'Updated', weatherSource: 'Weather data: Open-Meteo',
  cond: { clear: 'Clear', partly: 'Partly cloudy', cloudy: 'Cloudy', fog: 'Fog', drizzle: 'Drizzle', rain: 'Rain', storm: 'Storms', snow: 'Snow' },
  loadError: 'Could not load the program. Check your connection.'
};

export type Strings = typeof es;
export const strings: Record<Lang, Strings> = { es, en };

export function relativeTime(iso: string, lang: Lang, now: number): string {
  const mins = Math.round((now - new Date(iso).getTime()) / 60000);
  if (mins < 1) return strings[lang].justNow;
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto', style: 'short' });
  if (mins < 60) return rtf.format(-mins, 'minute');
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return rtf.format(-hrs, 'hour');
  return rtf.format(-Math.round(hrs / 24), 'day');
}

export function formatTime(iso: string): { hm: string; ampm: string } {
  // Event times are shown in Atlanta local time regardless of the viewer's zone.
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York'
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return { hm: `${get('hour')}:${get('minute')}`, ampm: get('dayPeriod').toUpperCase() };
}
