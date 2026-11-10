const year = 2026;
const logoUrl = 'https://img.geocaching.com:443/ff1feb8b-afcd-4248-9d48-d64143f7b101.png';
const ids = ['day','start','duration','owner','place','theme','description','bring','extra'];
const fields = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
const titleEl = document.getElementById('event-title');
const previewEl = document.getElementById('preview');
const outputEl = document.getElementById('html-output');
const statusEl = document.getElementById('status');
const titleStatusEl = document.getElementById('title-status');
const copyHtml = document.getElementById('copy-html');
const copyTitle = document.getElementById('copy-title');

for (let day = 1; day <= 24; day++) {
  const option = new Option(`${day}. prosince ${year}`, String(day));
  fields.day.add(option);
}
for (let minutes = 0; minutes < 1440; minutes += 30) {
  const time = `${String(Math.floor(minutes / 60)).padStart(2,'0')}:${String(minutes % 60).padStart(2,'0')}`;
  fields.start.add(new Option(time, time));
}
fields.start.value = '17:00';

// Text entered by owners is always treated as text, never as HTML.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function paragraphs(value) {
  return value.trim().split(/\n\s*\n/).filter(Boolean)
    .map(p => `<p><font face="Verdana,Geneva,sans-serif" size="2" color="#ffffff" style="font-family:Verdana,Geneva,sans-serif;font-size:14px;">${escapeHtml(p.trim()).replace(/\n/g,'<br>')}</font></p>`).join('\n');
}
function values() {
  return Object.fromEntries(ids.map(id => [id, fields[id].value.trim()]));
}
function dateText(day) {
  const date = new Date(year, 11, day);
  const weekday = new Intl.DateTimeFormat('cs-CZ',{weekday:'long'}).format(date);
  return `${weekday} ${day}. prosince ${year}`;
}
function timeRange(start, duration) {
  const [h,m] = start.split(':').map(Number);
  const end = h * 60 + m + Number(duration);
  const clock = `${String(Math.floor((end % 1440)/60)).padStart(2,'0')}:${String(end % 60).padStart(2,'0')}`;
  return `${start}–${clock}${end >= 1440 ? ' (konec následující den)' : ''}`;
}
function detail(label, text) {
  return `<tr><td valign="top" width="105"><font face="Verdana,Geneva,sans-serif" size="2" color="#f6dfb2" style="font-family:Verdana,Geneva,sans-serif;font-size:14px;"><b>${label}:</b></font></td><td valign="top"><font face="Verdana,Geneva,sans-serif" size="2" color="#ffffff" style="font-family:Verdana,Geneva,sans-serif;font-size:14px;">${escapeHtml(text)}</font></td></tr>`;
}
function goldLine() {
  return '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#385f59"><tr><td bgcolor="#385f59" height="12"></td></tr><tr><td bgcolor="#d9bf93" height="1"></td></tr><tr><td bgcolor="#385f59" height="12"></td></tr></table>';
}
function listing(v) {
  const day = Number(v.day);
  const padded = String(day).padStart(2,'0');
  const title = `Adventní kalendář ${padded}: ${v.theme || 'Téma eventu'}`;
  const image = `<p align="center"><img src="${logoUrl}" alt="Logo Adventního kalendáře" width="80" height="80"></p>`;
  return `<!-- Adventní kalendář ${padded} / vložte do zdrojového kódu popisu eventu -->
<table align="center" width="100%" cellpadding="16" cellspacing="0" border="0" bgcolor="#385f59">
<tr><td bgcolor="#385f59">
${goldLine()}
<p align="center"><font face="Verdana,Geneva,sans-serif" size="2" color="#f6dfb2"><b>PROSTĚJOV A OKOLÍ · ${year}</b></font><br>
<font face="Verdana,Geneva,sans-serif" size="4" color="#ffffff" style="font-family:Verdana,Geneva,sans-serif;font-size:21px;"><b>ADVENTNÍ KALENDÁŘ</b></font><br>
<font face="Verdana,Geneva,sans-serif" size="2" color="#f8e6c5">Okénko ${padded} / 24</font></p>
${goldLine()}
${image}
<p align="center"><font face="Verdana,Geneva,sans-serif" size="4" color="#ffffff" style="font-family:Verdana,Geneva,sans-serif;font-size:21px;"><b>${escapeHtml(title)}</b></font></p>
<p align="center"><font face="Verdana,Geneva,sans-serif" size="2" color="#f6dfb2">${escapeHtml(dateText(day))}</font></p>
<p><font face="Verdana,Geneva,sans-serif" size="2" color="#ffffff" style="font-family:Verdana,Geneva,sans-serif;font-size:14px;">Adventní kalendář nás letos provede 24 prosincovými dny prostřednictvím setkání geocacherů v Prostějově a okolí. Každý den otevřeme další pomyslné okénko: příležitost potkat se, popovídat si, sdílet zážitky z geocachingu a společně si užít předvánoční čas.</font></p>
<p><font face="Verdana,Geneva,sans-serif" size="2" color="#ffffff" style="font-family:Verdana,Geneva,sans-serif;font-size:14px;">Jednotlivá setkání připravují různí owneři, proto má každé z nich vlastní téma a atmosféru. Toto okénko pro vás připravuje <b>${escapeHtml(v.owner || 'owner eventu')}</b>.</font></p>
${goldLine()}
<p><font face="Verdana,Geneva,sans-serif" size="3" color="#f6dfb2" style="font-family:Verdana,Geneva,sans-serif;font-size:17px;"><b>Co nás čeká</b></font></p>
${paragraphs(v.description || 'Zde bude popis tématu a průběhu setkání.')}
<p><font face="Verdana,Geneva,sans-serif" size="3" color="#f6dfb2" style="font-family:Verdana,Geneva,sans-serif;font-size:17px;"><b>Kdy a kde</b></font></p>
<table width="100%" cellpadding="8" cellspacing="0" border="0" bgcolor="#466d66">
${detail('Datum', dateText(day))}
${detail('Čas', timeRange(v.start, v.duration))}
${detail('Místo', v.place || 'Místo setkání')}
${detail('Pořádá', v.owner || 'Owner eventu')}
${v.bring ? detail('S sebou', v.bring) : ''}
</table>
${v.extra ? `<p>&nbsp;</p>
<p><font face="Verdana,Geneva,sans-serif" size="3" color="#f6dfb2" style="font-family:Verdana,Geneva,sans-serif;font-size:17px;"><b>Další informace</b></font></p>\n${paragraphs(v.extra)}` : ''}
${v.extra ? '' : '<br>'}
${goldLine()}
<p align="center"><font face="Verdana,Geneva,sans-serif" size="2" color="#ffffff" style="font-family:Verdana,Geneva,sans-serif;font-size:14px;"><b>Těšíme se na společné adventní setkání!</b></font></p>
<p align="center"><font face="Verdana,Geneva,sans-serif" size="2" color="#f8e6c5">ADVENTNÍ KALENDÁŘ · ${padded} / 24</font></p>
<p align="center"><font face="Verdana,Geneva,sans-serif" size="2" color="#f8e6c5">${escapeHtml(v.owner || 'owner eventu')}</font></p>
${goldLine()}
</td></tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"><tr><td bgcolor="#ffffff" height="26"><p>&nbsp;</p></td></tr></table>`;
}
// Updated copy handling (v4). Neither button is disabled: even a partial
// listing can be copied for testing or further manual editing.
const requiredLabels = {owner:'ownera',place:'místo setkání',theme:'téma',description:'popis tématu'};
function missingRequired() {
  const v = values();
  return Object.keys(requiredLabels).filter(key => !v[key]);
}
function setStatus(message, error = false, target = statusEl) {
  target.textContent = message;
  target.classList.toggle('error', error);
}
function update() {
  const v = values();
  const missing = missingRequired();
  const title = `Adventní kalendář ${String(v.day).padStart(2,'0')}: ${v.theme || 'Téma eventu'}`;
  titleEl.textContent = title;
  const html = listing(v);
  outputEl.value = html;
  previewEl.srcdoc = `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="${escapeHtml(document.baseURI)}"><style>body{margin:18px;background:#fff;font-family:Verdana,Geneva,sans-serif}table{overflow-wrap:anywhere}@media(max-width:480px){body{margin:8px}}</style></head><body>${html}</body></html>`;
  // Copy buttons remain active, even when required fields are incomplete.
  setStatus(missing.length ? `Před publikací doplň: ${missing.map(k => requiredLabels[k]).join(', ')}. Ukázkový HTML kód však můžeš kopírovat již teď.` : 'Listing je připravený ke zkopírování.', !!missing.length);
  setStatus('', false, titleStatusEl);
}

// The legacy method is called inside the click event, without an await.
// For HTML, select the real, visible output field (also useful as a manual fallback).
function copyUsingSelection(value, kind) {
  const element = kind === 'html' ? outputEl : document.createElement('textarea');
  if (kind !== 'html') {
    element.value = value;
    element.setAttribute('readonly', '');
    element.style.cssText = 'position:fixed;top:0;left:0;width:2px;height:2px;opacity:0;pointer-events:none;';
    document.body.appendChild(element);
  }
  let copied = false;
  try {
    element.focus({preventScroll: true});
    element.select();
    element.setSelectionRange(0, element.value.length);
    copied = document.execCommand('copy') === true;
  } catch (_) {
    // Try the modern Clipboard API next.
  } finally {
    if (kind !== 'html') element.remove();
  }
  return copied;
}
function selectForManualCopy(kind) {
  if (kind === 'html') {
    outputEl.focus({preventScroll:true});
    outputEl.select();
    setStatus('Automatické kopírování bylo zablokováno. HTML kód je označený; stiskni Ctrl+C (Mac: Cmd+C).', true);
  } else {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(titleEl);
    selection.removeAllRanges();
    selection.addRange(range);
    setStatus('Automatické kopírování bylo zablokováno. Název je označený; stiskni Ctrl+C (Mac: Cmd+C).', true, titleStatusEl);
  }
}
function successMessage(kind) {
  const missing = missingRequired();
  const target = kind === 'title' ? titleStatusEl : statusEl;
  const label = kind === 'title' ? 'Název byl zkopírován.' : 'HTML bylo zkopírováno do schránky.';
  const warning = kind === 'title' ? (!values().theme ? ' Pozor, název zatím obsahuje zástupné téma.' : '') : (missing.length ? ` Pozor, před publikací doplň: ${missing.map(k => requiredLabels[k]).join(', ')}.` : '');
  setStatus(label + warning, !!warning, target);
}
async function copyText(kind) {
  const value = kind === 'html' ? outputEl.value : titleEl.textContent;
  if (copyUsingSelection(value, kind)) {
    successMessage(kind);
    return;
  }
  // The modern API also works on HTTPS GitHub Pages; older browsers and
  // restrictive privacy settings are handled by the explicit manual fallback.
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(value);
      successMessage(kind);
      return;
    } catch (_) {
      // No clipboard permission, or browser policy forbids this API.
    }
  }
  selectForManualCopy(kind);
}
copyHtml.addEventListener('click', () => { void copyText('html'); });
copyTitle.addEventListener('click', () => { void copyText('title'); });
document.getElementById('event-form').addEventListener('input', update);
document.getElementById('event-form').addEventListener('change', update);
update();
