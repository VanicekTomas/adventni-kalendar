const year = 2026;
const logoUrl = 'https://img.geocaching.com:443/ef71c548-22cf-4746-b453-a1d710d75905.png';
const ids = ['day','start','duration','owner','place','theme','description','bring','extra'];
const fields = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
const titleEl = document.getElementById('event-title');
const previewEl = document.getElementById('preview');
const outputEl = document.getElementById('html-output');
const statusEl = document.getElementById('status');
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
    .map(p => `<p style="margin:0 0 12px;line-height:1.6;">${escapeHtml(p.trim()).replace(/\n/g,'<br>')}</p>`).join('\n');
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
  return `<tr><td valign="top" width="125" style="padding:9px 12px;border-bottom:1px solid #d7e4da;color:#52726a;"><b>${label}</b></td><td valign="top" style="padding:9px 12px;border-bottom:1px solid #d7e4da;color:#28463f;">${escapeHtml(text)}</td></tr>`;
}
function listing(v) {
  const day = Number(v.day);
  const padded = String(day).padStart(2,'0');
  const title = `Adventní kalendář ${padded}: ${v.theme || 'Téma eventu'}`;
  const image = `<p align="center" style="margin:0 0 16px;"><img src="${logoUrl}" alt="Logo Adventního kalendáře" width="88" height="88" style="max-width:88px;height:auto;"></p>`;
  return `<!-- Adventní kalendář ${padded} / vložte do zdrojového kódu popisu eventu -->
<table align="center" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:700px;font-family:Arial,sans-serif;color:#28463f;background:#ffffff;">
<tr><td bgcolor="#385f59" align="center" style="padding:28px 20px;color:#ffffff;">
<p style="margin:0 0 8px;color:#f6dfb2;font-size:14px;letter-spacing:2px;"><b>PROSTĚJOV A OKOLÍ · ${year}</b></p>
<p style="margin:0 0 7px;font-size:26px;line-height:1.25;color:#ffffff;"><b>ADVENTNÍ KALENDÁŘ</b></p>
<p style="margin:0;color:#f8e6c5;font-size:17px;">Okénko ${padded} / 24</p>
</td></tr>
<tr><td style="padding:25px 24px 29px;">
${image}
<h2 align="center" style="margin:0 0 7px;color:#985057;font-size:23px;line-height:1.3;">${escapeHtml(title)}</h2>
<p align="center" style="margin:0 0 25px;color:#496960;font-size:16px;">${escapeHtml(dateText(day))}</p>
<p style="margin:0 0 13px;line-height:1.6;">Adventní kalendář nás letos provede 24 prosincovými dny prostřednictvím setkání geocacherů v Prostějově a okolí. Každý den otevřeme další pomyslné okénko: příležitost potkat se, popovídat si, sdílet zážitky z geocachingu a společně si užít předvánoční čas.</p>
<p style="margin:0 0 24px;line-height:1.6;">Jednotlivá setkání připravují různí owneři, proto má každé z nich vlastní téma a atmosféru. Toto okénko pro vás připravuje <b>${escapeHtml(v.owner || 'owner eventu')}</b>.</p>
<h3 style="color:#985057;margin:0 0 12px;font-size:19px;">Co nás čeká</h3>
${paragraphs(v.description || 'Zde bude popis tématu a průběhu setkání.')}
<h3 style="color:#985057;margin:25px 0 10px;font-size:19px;">Kdy a kde</h3>
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eef3ec" style="background:#eef3ec;font-size:15px;line-height:1.5;">
${detail('Datum', dateText(day))}
${detail('Čas', timeRange(v.start, v.duration))}
${detail('Místo', v.place || 'Místo setkání')}
${detail('Pořádá', v.owner || 'Owner eventu')}
${v.bring ? detail('S sebou', v.bring) : ''}
</table>
${v.extra ? `<h3 style="color:#985057;margin:25px 0 10px;font-size:19px;">Další informace</h3>\n${paragraphs(v.extra)}` : ''}
<p align="center" style="margin:28px 0 0;padding-top:18px;border-top:1px solid #d7e4da;line-height:1.6;color:#385f59;"><b>Těšíme se na společné adventní setkání!</b></p>
</td></tr>
<tr><td bgcolor="#385f59" align="center" style="padding:14px;color:#f8e6c5;font-size:13px;">ADVENTNÍ KALENDÁŘ · ${padded} / 24</td></tr>
</table>`;
}
function setStatus(message, error = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', error);
}
function update() {
  const v = values();
  const missing = ['owner','place','theme','description'].filter(key => !v[key]);
  const title = `Adventní kalendář ${String(v.day).padStart(2,'0')}: ${v.theme || 'Téma eventu'}`;
  titleEl.textContent = title;
  const html = listing(v);
  outputEl.value = html;
  const previewHtml = html;
  previewEl.srcdoc = `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="${escapeHtml(document.baseURI)}"><style>body{margin:18px;background:#fff}table{overflow-wrap:anywhere}@media(max-width:480px){body{margin:8px}}</style></head><body>${previewHtml}</body></html>`;
  copyHtml.disabled = !!missing.length;
  copyTitle.disabled = !v.theme;
  if (missing.length) setStatus(`Pro kopírování doplň: ${missing.map(x => ({owner:'ownera',place:'místo setkání',theme:'téma',description:'popis tématu'}[x])).join(', ')}.`, true);
  else setStatus('Listing je připravený ke zkopírování.');
}
async function copy(value, success) {
  try {
    await navigator.clipboard.writeText(value);
    setStatus(success);
  } catch {
    outputEl.focus(); outputEl.select();
    setStatus('Automatické kopírování není dostupné. Označený text zkopíruj pomocí Ctrl+C.', true);
  }
}
copyHtml.addEventListener('click', () => copy(outputEl.value, 'HTML bylo zkopírováno. Vlož jej do zdrojového kódu popisu eventu.'));
copyTitle.addEventListener('click', () => copy(titleEl.textContent, 'Název eventu byl zkopírován.'));
document.getElementById('event-form').addEventListener('input', update);
document.getElementById('event-form').addEventListener('change', update);
update();
