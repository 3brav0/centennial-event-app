/**
 * Centenario 2026 — live announcements from a Google Sheet.
 *
 * Paste this whole file into the sheet's Extensions → Apps Script editor, then:
 *   1. Run `setup` once (builds the "Avisos" tab: headers, checkboxes, dropdown, sample rows).
 *   2. Deploy → New deployment → Web app: Execute as "Me", Who has access "Anyone".
 *   3. Give the /exec URL to the app (GitHub repo variable ANNOUNCEMENTS_URL).
 *
 * The web app only READS visible rows. Editing still requires edit access to the sheet.
 * Full instructions: docs/google-sheet-setup.md in the app repository.
 */

var SHEET_NAME = 'Avisos';
var HEADERS = ['Ocultar / Hide', 'Fijar / Pin', 'Tipo / Type', 'Título (ES)', 'Texto (ES)', 'Title (EN)', 'Text (EN)', 'Publicado / Posted'];
var COL = { hide: 0, pin: 1, type: 2, titleEs: 3, bodyEs: 4, titleEn: 5, bodyEn: 6, posted: 7 };
var TYPES = ['Importante', 'Logística'];
var MAX_ROWS = 500;
var CACHE_KEY = 'announcements';
var CACHE_SECONDS = 20;

/** Web app endpoint: the announcements as JSON, in the format the app reads. */
function doGet() {
  var cache = CacheService.getScriptCache();
  var json = cache.get(CACHE_KEY);
  if (!json) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    var values = sheet ? sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), HEADERS.length).getValues() : [];
    json = JSON.stringify({ announcements: rowsToAnnouncements(values) });
    cache.put(CACHE_KEY, json, CACHE_SECONDS);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

/** Turns sheet rows into announcements. Skips hidden, untitled and unstamped rows. */
function rowsToAnnouncements(values) {
  var list = [];
  for (var i = 0; i < values.length; i++) {
    var r = values[i];
    var titleEs = String(r[COL.titleEs] || '').trim();
    var posted = r[COL.posted];
    if (r[COL.hide] === true || !titleEs || !(posted instanceof Date)) continue;
    var bodyEs = String(r[COL.bodyEs] || '').trim();
    var titleEn = String(r[COL.titleEn] || '').trim();
    var bodyEn = String(r[COL.bodyEn] || '').trim();
    list.push({
      // The posting time identifies the row, so fixing a typo doesn't re-notify anyone.
      id: 'sheet-' + posted.getTime(),
      pinned: r[COL.pin] === true,
      type: String(r[COL.type]).indexOf('Import') === 0 ? 'important' : 'logistics',
      postedAt: posted.toISOString(),
      // Blank English columns fall back to Spanish.
      title: { es: titleEs, en: titleEn || titleEs },
      body: { es: bodyEs, en: bodyEn || bodyEs }
    });
  }
  return list;
}

/** Stamps the posting time when a title is first typed, and refreshes the published feed. */
function onEdit(e) {
  var sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME) return;
  var first = Math.max(e.range.getRow(), 2);
  var last = e.range.getLastRow();
  for (var row = first; row <= last; row++) {
    var title = sheet.getRange(row, COL.titleEs + 1).getValue();
    var posted = sheet.getRange(row, COL.posted + 1);
    if (String(title).trim() && !posted.getValue()) posted.setValue(new Date());
  }
  CacheService.getScriptCache().remove(CACHE_KEY);
}

/** One-time setup: run from the Apps Script editor. Safe to re-run; it won't duplicate rows. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('America/New_York');
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME, 0);

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight('bold').setBackground('#0F3D2E').setFontColor('#FBF6EA').setVerticalAlignment('middle');
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 32);

  sheet.getRange(2, COL.hide + 1, MAX_ROWS, 2).insertCheckboxes();
  sheet.getRange(2, COL.type + 1, MAX_ROWS, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(TYPES, true).setAllowInvalid(false).build());
  sheet.getRange(2, COL.posted + 1, MAX_ROWS, 1).setNumberFormat('ddd d mmm, h:mm am/pm');
  sheet.getRange(2, COL.titleEs + 1, MAX_ROWS, 4).setWrap(true).setVerticalAlignment('top');

  var widths = [90, 80, 120, 240, 380, 240, 380, 170];
  widths.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });

  // Seed with the announcements the app shipped with, only if the sheet is empty.
  if (sheet.getLastRow() < 2 || !sheet.getRange(2, COL.titleEs + 1).getValue()) {
    var at = new Date('2026-09-26T12:00:00-04:00');
    sheet.getRange(2, 1, 3, HEADERS.length).setValues([
      [false, true, 'Importante', 'Bienvenidos al Centenario',
        'Aquí verás en tiempo real cambios de horario, accesos y avisos importantes durante los eventos.',
        'Welcome to the Centennial',
        'Schedule changes, entrances and important notices will appear here in real time during the events.',
        at],
      [false, false, 'Logística', 'Estacionamiento en Liberty Plaza',
        'Los lotes cerca del Capitolio se llenan rápido. Considera MARTA (estación Georgia State) o llega con tiempo.',
        'Parking at Liberty Plaza',
        'Lots near the Capitol fill quickly. Consider MARTA (Georgia State station) or arrive early.',
        new Date(at.getTime() + 1000)],
      [false, false, 'Logística', 'Trae agua y protector solar',
        'Los conciertos del viernes y sábado son al aire libre.',
        'Bring water and sunscreen',
        'Friday and Saturday concerts are outdoors.',
        new Date(at.getTime() + 2000)]
    ]);
  }

  // A default "Sheet1" left over from creating the spreadsheet only confuses volunteers.
  var stray = ss.getSheetByName('Sheet1') || ss.getSheetByName('Hoja 1');
  if (stray && stray.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(stray);

  CacheService.getScriptCache().remove(CACHE_KEY);
}
