<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>E.T. J.R.G.S — Panel de Administración</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.11.0/dist/tabler-icons.min.css">
<style>
/* ───── RESET & TOKENS ───── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* ── Fondos y superficies (app: #F7F9FC base, #FFFFFF cards) ── */
  --bg:        #F7F9FC;
  --surface:   #FFFFFF;
  --surface2:  #F0F4F8;
  --surface3:  #E8EDF2;
  --border:    #E0E6ED;
  --border2:   #B8C8D8;

  /* ── Textos (app: #1A1A2E títulos, #8A9BB0 secundario) ── */
  --text:      #1A1A2E;
  --text2:     #2D3A4A;
  --text3:     #5A7080;
  --text4:     #8A9BB0;

  /* ── Acento principal: Azul Movistar #009EF7 ── */
  --sky:       #009EF7;
  --sky-dim:   #EAF6FF;
  --sky-glow:  rgba(0,158,247,.25);

  /* ── Estados (app: green #10B981, red #EF4444/#FF3B30, amber #F59E0B/#FF9500) ── */
  --green:     #10B981;
  --green-dim: rgba(16,185,129,.12);
  --red:       #FF3B30;
  --red-dim:   rgba(255,59,48,.10);
  --amber:     #FF9500;
  --amber-dim: rgba(255,149,0,.12);
  --indigo:    #818CF8;
  --indigo-dim:rgba(129,140,248,.12);

  /* ── Accent = Azul Movistar (reemplaza el viejo ámbar como primario) ── */
  --accent:        #009EF7;
  --accent-dark:   #0070B0;
  --accent-light:  #EAF6FF;

  /* ── Card legacy ── */
  --card-bg:    #FFFFFF;
  --card-border:#E0E6ED;

  --side:      240px;
  --radius-sm: 10px;
  --radius:    16px;
  --radius-lg: 22px;
  --font: 'Inter', 'Segoe UI', system-ui, sans-serif;
  --mono: 'Fira Code', 'Consolas', 'Courier New', monospace;
}

html, body { height: 100%; }
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

/* ───── LAYOUT ───── */
.layout { display: flex; min-height: 100vh; }

/* ───── SIDEBAR ───── */
.sidebar {
  width: var(--side);
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.logo {
  padding: 24px 20px 20px;
  border-bottom: 1px solid var(--border);
}
.logo-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--sky-dim);
  border: 1px solid var(--sky-glow);
  border-radius: 10px;
  padding: 6px 12px;
  margin-bottom: 10px;
}
.logo-badge span { color: var(--accent); font-size: 13px; font-weight: 800; letter-spacing: .5px; }
.logo-name { font-size: 15px; font-weight: 800; color: var(--text); line-height: 1.3; }
.logo-sub  { font-size: 11px; color: var(--text3); margin-top: 2px; font-weight: 500; }

.nav { padding: 14px 0; flex: 1; }
.nav-section {
  font-size: 9px; font-weight: 800; letter-spacing: 1.8px;
  color: var(--text4); padding: 10px 20px 6px; text-transform: uppercase;
}
.nav-item {
  display: flex; align-items: center; gap: 11px;
  padding: 11px 20px; cursor: pointer; font-size: 14px; font-weight: 600;
  color: var(--text3); border-left: 3px solid transparent;
  transition: all .18s ease; position: relative;
}
.nav-item i { font-size: 18px; width: 20px; text-align: center; flex-shrink: 0; }
.nav-item:hover { background: var(--surface2); color: var(--text2); }
.nav-item.active {
  background: var(--sky-dim);
  color: var(--accent);
  border-left-color: var(--accent);
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
}
.api-dot {
  display: flex; align-items: center; gap: 8px;
  background: var(--green-dim); border: 1px solid rgba(16,185,129,.25);
  border-radius: 10px; padding: 8px 12px;
}
.api-dot-circle {
  width: 7px; height: 7px; border-radius: 50%; background: var(--green);
  animation: pulse 2s infinite;
  flex-shrink: 0;
}
.api-dot span { font-size: 11px; color: var(--green); font-family: var(--mono); font-weight: 500; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }

/* ───── MAIN ───── */
.main { flex: 1; overflow: auto; min-width: 0; }

.topbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 16px 28px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 10;
}
.topbar-left { display: flex; flex-direction: column; }
.topbar-label { font-size: 10px; font-weight: 700; color: var(--text4); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 2px; }
.topbar-title { font-size: 20px; font-weight: 900; color: var(--text); }
.topbar-right { display: flex; align-items: center; gap: 10px; }

/* ───── PAGES ───── */
.page { display: none; padding: 28px; animation: fadein .22s ease; }
.page.active { display: block; }
@keyframes fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

/* ───── METRIC GRID ───── */
.metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 24px; }

.metric {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: border-color .18s;
  position: relative; overflow: hidden;
}
.metric::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: var(--radius);
  opacity: 0;
  transition: opacity .18s;
}
.metric:hover { border-color: var(--border2); }
.metric-icon {
  width: 40px; height: 40px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; margin-bottom: 14px; flex-shrink: 0;
}
.metric-label { font-size: 11px; font-weight: 700; color: var(--text3); letter-spacing: .5px; margin-bottom: 6px; text-transform: uppercase; }
.metric-val { font-size: 32px; font-weight: 900; color: var(--text); line-height: 1; }
.metric-sub { font-size: 12px; color: var(--text3); margin-top: 5px; font-weight: 500; }

/* ───── CARDS ───── */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px 24px;
  margin-bottom: 18px;
}

.section-title {
  font-size: 14px; font-weight: 800; color: var(--text); margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
}
.section-title i { color: var(--accent); font-size: 17px; }

.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }

/* ───── CHART ───── */
.chart-wrap { position: relative; width: 100%; height: 230px; }

/* ───── TABLES ───── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
thead { }
th {
  font-size: 10px; font-weight: 800; color: var(--text4);
  text-align: left; padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  white-space: nowrap; text-transform: uppercase; letter-spacing: 1px;
}
td {
  padding: 13px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text); font-size: 14px; font-weight: 500;
}
tr:last-child td { border-bottom: none; }
tbody tr { transition: background .12s; }
tbody tr:hover td { background: var(--surface2); }

/* ───── BADGES / PILLS ───── */
.pill {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 800; padding: 4px 10px;
  border-radius: 20px; letter-spacing: .3px;
}
.pill-green  { background: var(--green-dim); color: var(--green); border: 1px solid rgba(16,185,129,.25); }
.pill-red    { background: var(--red-dim);   color: var(--red);   border: 1px solid rgba(239,68,68,.25); }
.pill-amber  { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(245,158,11,.25); }
.pill-sky    { background: var(--sky-dim);   color: var(--sky);   border: 1px solid var(--sky-glow); }
.pill-gray   { background: var(--surface2);  color: var(--text3); border: 1px solid var(--border2); }
.pill-indigo { background: var(--indigo-dim);color: var(--indigo);border: 1px solid rgba(129,140,248,.25); }

/* ───── FILTERS ───── */
.filter-bar {
  display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: wrap;
}
.filter-bar select, .filter-bar input {
  font-family: var(--font);
  font-size: 13px; font-weight: 600;
  padding: 9px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text2);
  outline: none;
  transition: border-color .15s;
}
.filter-bar select:focus, .filter-bar input:focus { border-color: var(--accent); }
.filter-bar input::placeholder { color: var(--text4); }

/* ───── BUTTONS ───── */
.btn {
  font-family: var(--font);
  font-size: 13px; font-weight: 700;
  padding: 9px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text2);
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px;
  transition: all .15s;
}
.btn:hover { background: var(--surface2); color: var(--text); border-color: var(--border2); }
.btn-primary {
  background: var(--accent); color: var(--accent-dark); border-color: var(--accent); font-weight: 800;
}
.btn-primary:hover { background: #0085D1; }
.btn-danger {
  background: var(--red-dim); color: var(--red); border-color: rgba(239,68,68,.25); font-weight: 800;
}

/* ───── MISC ───── */
.empty {
  padding: 50px 20px; text-align: center; color: var(--text4);
  font-size: 14px; font-weight: 600;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.empty i { font-size: 32px; color: var(--border2); }

.flex-row { display: flex; align-items: center; gap: 10px; }

.avatar {
  width: 34px; height: 34px; border-radius: 10px;
  background: var(--amber-dim); border: 1px solid rgba(245,168,0,.25);
  color: var(--accent-dark);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; flex-shrink: 0;
}

.spinner {
  display: flex; justify-content: center; align-items: center;
  gap: 10px; padding: 40px; color: var(--text3);
  font-size: 14px; font-weight: 600;
}
.spinner i { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.progress-bg { height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; margin-top: 6px; }
.progress-fill { height: 100%; border-radius: 3px; transition: width .4s ease; }

.warn-box {
  background: var(--red-dim); border: 1px solid rgba(239,68,68,.25);
  border-radius: var(--radius); padding: 14px 18px;
  font-size: 13px; font-weight: 600; color: var(--red);
  margin-bottom: 18px; display: flex; align-items: center; gap: 10px;
}
.warn-box i { font-size: 20px; }

/* ───── ENCABEZADO DE MENCIÓN (historial) ───── */
.mencion-header {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent);
  border-radius: var(--radius);
  padding: 14px 18px; margin-bottom: 8px; margin-top: 10px;
  display: flex; align-items: center; justify-content: space-between;
}
.mencion-header-name { font-size: 16px; font-weight: 900; color: var(--text); }
.mencion-header-ano  { font-size: 12px; font-weight: 700; color: var(--indigo); margin-top: 2px; }

/* ───── COLOR ACCENTS PER MENCIÓN ───── */
.acc-tele    { color: var(--sky);    background: var(--sky-dim);    border-color: var(--sky-glow); }
.acc-tur     { color: var(--green);  background: var(--green-dim);  border-color: rgba(16,185,129,.25); }
.acc-adm     { color: var(--amber);  background: var(--amber-dim);  border-color: rgba(245,158,11,.25); }
.acc-cont    { color: var(--indigo); background: var(--indigo-dim); border-color: rgba(129,140,248,.25); }

/* ───── STAT CARD (para estadísticas) ───── */
.stat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 16px;
  margin-bottom: 12px;
}
.stat-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.stat-card-name   { font-size: 15px; font-weight: 800; color: var(--text); flex: 1; padding-right: 10px; }
.stat-pct         { font-size: 20px; font-weight: 900; }
.stat-row         { display: flex; justify-content: space-around; margin-bottom: 12px; }
.stat-box         { text-align: center; }
.stat-num         { font-size: 18px; font-weight: 900; color: var(--text); }
.stat-label       { font-size: 11px; font-weight: 700; color: var(--text3); margin-top: 2px; }

/* ───── MODAL PERFIL ESTUDIANTE ───── */
#modal-estudiante {
  position: fixed; inset: 0; z-index: 500;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  background: rgba(26,26,46,.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  opacity: 0; pointer-events: none;
  transition: opacity .2s ease;
}
#modal-estudiante.open {
  opacity: 1; pointer-events: all;
}
.modal-card {
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: 24px;
  width: 100%; max-width: 420px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 0 1px rgba(0,158,247,.15), 0 32px 80px rgba(26,26,46,.12);
  transform: translateY(20px) scale(.97);
  transition: transform .22s cubic-bezier(.16,1,.3,1);
}
#modal-estudiante.open .modal-card {
  transform: translateY(0) scale(1);
}
.modal-header {
  padding: 22px 22px 0;
  display: flex; justify-content: flex-end;
}
.modal-close {
  width: 32px; height: 32px; border-radius: 10px;
  background: var(--surface2); border: 1px solid var(--border2);
  color: var(--text3); font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .15s;
}
.modal-close:hover { background: var(--surface3); color: var(--text); }
.modal-avatar-section {
  display: flex; flex-direction: column; align-items: center;
  padding: 4px 24px 20px; text-align: center;
}
.modal-avatar {
  width: 72px; height: 72px; border-radius: 22px;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: 900;
  margin-bottom: 14px;
  border: 2px solid transparent;
  position: relative;
}
.modal-nombre {
  font-size: 20px; font-weight: 900; color: var(--text);
  margin-bottom: 3px;
}
.modal-sub {
  font-size: 13px; color: var(--text3); font-weight: 600;
  margin-bottom: 12px;
}
.modal-pills {
  display: flex; gap: 7px; flex-wrap: wrap; justify-content: center;
}
.modal-body {
  padding: 0 20px 22px;
  display: flex; flex-direction: column; gap: 8px;
}
.modal-info-row {
  display: flex; align-items: center; gap: 12px;
  background: var(--surface2); border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border);
}
.modal-info-icon {
  width: 34px; height: 34px; border-radius: 9px;
  background: var(--surface3);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.modal-info-label {
  font-size: 10px; font-weight: 800; color: var(--text4);
  letter-spacing: .7px; text-transform: uppercase; margin-bottom: 2px;
}
.modal-info-val {
  font-size: 14px; font-weight: 700; color: var(--text);
}
.modal-footer {
  border-top: 1px solid var(--border);
  padding: 14px 20px;
  background: var(--surface);
}
.modal-asist-row {
  display: flex; gap: 8px;
}
.modal-asist-box {
  flex: 1; background: var(--surface2); border-radius: 12px;
  padding: 12px 10px; text-align: center;
  border: 1px solid var(--border);
}
.modal-asist-num { font-size: 22px; font-weight: 900; color: var(--text); }
.modal-asist-label { font-size: 10px; font-weight: 800; color: var(--text4); text-transform: uppercase; letter-spacing: .6px; margin-top: 2px; }
.modal-pct-bar { height: 5px; background: var(--border); border-radius: 3px; overflow: hidden; margin-top: 10px; }
.modal-pct-fill { height: 100%; border-radius: 3px; transition: width .5s ease .1s; }

/* Nombre clickeable en tablas */
.est-link {
  cursor: pointer;
  transition: color .15s;
}
.est-link:hover { color: var(--accent-dark) !important; text-decoration: underline; text-underline-offset: 3px; }
.est-link-inv { cursor: default; }  /* invitado: sin interacción */
.nav-item.nav-locked {
  opacity: .35;
  cursor: not-allowed;
  pointer-events: none;
}
.nav-item.nav-locked::after {
  content: '\eb79'; /* ti-lock */
  font-family: 'tabler-icons';
  font-size: 12px;
  margin-left: auto;
  color: var(--text4);
}
.rol-banner {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 18px; border-radius: var(--radius);
  margin-bottom: 20px; font-size: 13px; font-weight: 700;
}
.rol-banner-info  { background: var(--sky-dim);    border: 1px solid var(--sky-glow);               color: var(--sky);    }
.rol-banner-warn  { background: var(--amber-dim);  border: 1px solid rgba(245,158,11,.25);           color: var(--amber);  }
.rol-banner-block { background: var(--red-dim);    border: 1px solid rgba(239,68,68,.25);            color: var(--red);    }
.rol-banner i { font-size: 19px; flex-shrink: 0; }

.page-locked {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 30px; text-align: center;
  color: var(--text4);
}
.page-locked i { font-size: 48px; margin-bottom: 16px; color: var(--border2); }
.page-locked h3 { font-size: 17px; font-weight: 800; color: var(--text3); margin-bottom: 8px; }
.page-locked p  { font-size: 13px; font-weight: 500; max-width: 320px; }

/* filter options hidden by role */
.role-hidden { display: none !important; }

/* ───── SCROLLBAR ───── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; opacity: .6; }

/* ───── REGISTRO ASISTENCIA DOCENTE ───── */
.doc-reg-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 5px solid var(--border2);
  border-radius: var(--radius-lg);
  padding: 20px 22px;
  margin-bottom: 14px;
  transition: border-left-color .2s;
}
.doc-reg-card.estado-Presente { border-left-color: var(--green); }
.doc-reg-card.estado-Ausente  { border-left-color: var(--red);   }
.doc-reg-card.estado-Tardanza { border-left-color: var(--amber); }
.doc-reg-top { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.doc-reg-avatar {
  width: 46px; height: 46px; border-radius: 14px; flex-shrink: 0;
  background: var(--amber-dim); border: 1px solid rgba(245,168,0,.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 900; color: var(--accent-dark);
}
.doc-reg-nombre { font-size: 16px; font-weight: 800; color: var(--text); }
.doc-reg-materia { font-size: 12px; font-weight: 600; color: var(--text4); margin-top: 2px; }
.doc-reg-btns { display: flex; gap: 8px; margin-bottom: 14px; }
.doc-reg-btn {
  flex: 1; padding: 10px 6px; border-radius: 11px;
  font-family: var(--font); font-size: 12px; font-weight: 800;
  cursor: pointer; border: 1px solid var(--border2);
  background: var(--surface2); color: var(--text4); transition: all .15s;
}
.doc-reg-btn:hover { background: var(--surface3); color: var(--text2); }
.doc-reg-btn.active-Presente { background: var(--green); color: #fff; border-color: var(--green); }
.doc-reg-btn.active-Ausente  { background: var(--red);   color: #fff;    border-color: var(--red);   }
.doc-reg-btn.active-Tardanza { background: var(--amber); color: #1A1A2E; border-color: var(--amber); }
.bloque-grid { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.bloque-btn {
  flex: 1; min-width: 100px; padding: 10px 8px; border-radius: 11px;
  font-family: var(--font); font-size: 11px; font-weight: 800;
  cursor: pointer; border: 1px solid var(--border2);
  background: var(--surface2); color: var(--text4); transition: all .15s; text-align: center;
}
.bloque-btn:hover { background: var(--surface3); }
.bloque-btn.active { background: var(--indigo-dim); color: var(--indigo); border-color: rgba(129,140,248,.4); }
.bloque-btn-horas { font-size: 10px; font-weight: 500; color: var(--text4); margin-top: 3px; }
.bloque-btn.active .bloque-btn-horas { color: var(--indigo); }
.doc-reg-obs {
  width: 100%; font-family: var(--font); font-size: 13px; font-weight: 500;
  padding: 10px 14px; background: var(--bg);
  border: 1px solid var(--border2); border-radius: 11px; color: var(--text);
  resize: vertical; min-height: 48px; margin-bottom: 14px; box-sizing: border-box;
}
.doc-reg-obs:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(245,168,0,.15); }
.doc-reg-obs::placeholder { color: var(--text4); }
.doc-reg-save {
  width: 100%; padding: 11px; background: var(--accent); color: var(--accent-dark);
  border: none; border-radius: 11px; font-family: var(--font);
  font-size: 13px; font-weight: 800; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px; transition: all .15s;
}
.doc-reg-save:hover { background: #0085D1; }
.doc-reg-save:disabled { opacity: .5; cursor: not-allowed; }
.doc-resumen-bar { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.doc-resumen-chip {
  flex: 1; min-width: 100px; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; text-align: center;
}
.doc-resumen-num { font-size: 28px; font-weight: 900; }
.doc-resumen-label { font-size: 10px; font-weight: 800; color: var(--text4); text-transform: uppercase; letter-spacing: .8px; margin-top: 4px; }
.bloques-ref { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
.bloque-ref-item {
  flex: 1; min-width: 120px; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; text-align: center;
}
.bloque-ref-label { font-size: 12px; font-weight: 800; color: var(--text); }
.bloque-ref-h { font-size: 11px; font-weight: 500; color: var(--text4); margin-top: 3px; }

/* ───── RESPONSIVE ───── */
@media (max-width: 768px) {
  .sidebar { display: none; }
  .grid2 { grid-template-columns: 1fr; }
  .page { padding: 16px; }
}

/* ───── SEPARATOR ───── */
.sep { display: flex; align-items: center; gap: 10px; margin: 12px 0; }
.sep-line { flex: 1; height: 1px; background: var(--border); }
.sep-text { font-size: 9px; font-weight: 800; letter-spacing: 1.8px; color: var(--text4); text-transform: uppercase; }

/* year color strips */
.ano-strip-1 { border-left-color: #38BDF8; }
.ano-strip-2 { border-left-color: #10B981; }
.ano-strip-3 { border-left-color: #F59E0B; }
.ano-strip-4 { border-left-color: #818CF8; }
.ano-strip-5 { border-left-color: #F472B6; }

/* ───── LOGIN OVERLAY ───── */
#login-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
#login-overlay.hidden { display: none; }

.login-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 0%, rgba(90,159,222,.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 100%, rgba(245,168,0,.08) 0%, transparent 60%);
  pointer-events: none;
}
.login-grid-lines {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden; opacity: .04;
  background-image:
    linear-gradient(var(--border2) 1px, transparent 1px),
    linear-gradient(90deg, var(--border2) 1px, transparent 1px);
  background-size: 60px 60px;
}

.login-card {
  position: relative; z-index: 1;
  width: 100%; max-width: 420px;
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: 24px;
  padding: 40px 40px 36px;
  box-shadow: 0 0 0 1px rgba(0,158,247,.15), 0 24px 60px rgba(26,26,46,.10);
  animation: loginSlideIn .35s cubic-bezier(.16,1,.3,1) both;
}
@keyframes loginSlideIn {
  from { opacity:0; transform: translateY(28px) scale(.97); }
  to   { opacity:1; transform: translateY(0)    scale(1);   }
}

.login-logo {
  text-align: center; margin-bottom: 32px;
}
.login-logo-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent-light); border: 1px solid var(--accent);
  border-radius: 12px; padding: 8px 16px; margin-bottom: 14px;
}
.login-logo-badge i { color: var(--accent); font-size: 18px; }
.login-logo-badge span { color: var(--accent); font-size: 14px; font-weight: 800; letter-spacing: .5px; }
.login-title { font-size: 22px; font-weight: 900; color: var(--text); margin-bottom: 4px; }
.login-sub   { font-size: 13px; color: var(--text3); font-weight: 500; }

.login-field { margin-bottom: 16px; }
.login-field label {
  display: block; font-size: 11px; font-weight: 800; color: var(--text3);
  letter-spacing: .8px; text-transform: uppercase; margin-bottom: 7px;
}
.login-input-wrap { position: relative; }
.login-input-wrap i {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  font-size: 17px; color: var(--text4); pointer-events: none;
  transition: color .15s;
}
.login-input {
  width: 100%; font-family: var(--font); font-size: 14px; font-weight: 600;
  padding: 12px 14px 12px 42px;
  background: var(--surface2);
  border: 1px solid var(--border2);
  border-radius: 12px; color: var(--text);
  outline: none; transition: border-color .15s, box-shadow .15s;
}
.login-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(245,168,0,.15); }
.login-input:focus + i, .login-input-wrap:focus-within i { color: var(--accent); }
.login-input::placeholder { color: var(--text4); }

/* eye toggle inside password */
.login-eye {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  cursor: pointer; font-size: 17px; color: var(--text4);
  background: none; border: none; padding: 0;
  transition: color .15s; left: unset;
  pointer-events: all;
}
.login-eye:hover { color: var(--text2); }

.login-error {
  font-size: 12px; font-weight: 700; color: var(--red);
  margin-top: 6px; display: none; align-items: center; gap: 5px;
}
.login-error.show { display: flex; }

.btn-login {
  width: 100%; padding: 13px;
  background: var(--accent); color: var(--accent-dark);
  border: none; border-radius: 12px;
  font-family: var(--font); font-size: 15px; font-weight: 800;
  cursor: pointer; transition: all .15s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-top: 8px;
}
.btn-login:hover { background: var(--accent-dark); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,168,0,.30); }
.btn-login:active { transform: translateY(0); }
.btn-login:disabled { opacity: .6; cursor: not-allowed; transform: none; }
.btn-login .spinner-btn { display: none; }
.btn-login.loading .spinner-btn { display: inline-block; animation: spin 1s linear infinite; }
.btn-login.loading .btn-login-text { display: none; }

.login-divider {
  display: flex; align-items: center; gap: 12px; margin: 18px 0;
}
.login-divider span { font-size: 10px; font-weight: 800; color: var(--text4); letter-spacing: 1.5px; text-transform: uppercase; white-space: nowrap; }
.login-divider::before, .login-divider::after {
  content: ''; flex: 1; height: 1px; background: var(--border2);
}

.btn-guest {
  width: 100%; padding: 11px;
  background: transparent; color: var(--text3);
  border: 1px solid var(--border2); border-radius: 12px;
  font-family: var(--font); font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all .15s;
  display: flex; align-items: center; justify-content: center; gap: 7px;
}
.btn-guest:hover { background: var(--surface2); color: var(--text2); border-color: var(--border2); }

.login-footer {
  text-align: center; margin-top: 24px; font-size: 11px; color: var(--text4); font-weight: 500;
}

/* ───── USER CHIP IN TOPBAR ───── */
.user-chip {
  display: flex; align-items: center; gap: 9px;
  background: var(--surface2); border: 1px solid var(--border2);
  border-radius: 12px; padding: 6px 12px 6px 8px;
  cursor: pointer; transition: all .15s; position: relative;
}
.user-chip:hover { border-color: var(--border2); background: var(--surface3); }
.user-chip-avatar {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; flex-shrink: 0;
}
.user-chip-info { display: flex; flex-direction: column; line-height: 1.2; }
.user-chip-name { font-size: 12px; font-weight: 700; color: var(--text); }
.user-chip-role { font-size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: .5px; }

.user-menu {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: 14px; padding: 8px;
  min-width: 180px; box-shadow: 0 16px 48px rgba(26,26,46,.12);
  display: none; z-index: 100;
  animation: menuIn .15s ease;
}
@keyframes menuIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
.user-menu.open { display: block; }
.user-menu-item {
  display: flex; align-items: center; gap: 9px;
  padding: 9px 12px; border-radius: 9px; cursor: pointer;
  font-size: 13px; font-weight: 600; color: var(--text3);
  transition: all .12s;
}
.user-menu-item:hover { background: var(--surface2); color: var(--text); }
.user-menu-item.danger { color: var(--red); }
.user-menu-item.danger:hover { background: var(--red-dim); }

/* role badges */
.role-admin   { background: var(--amber-dim);  color: var(--accent-dark); }
.role-docente { background: var(--green-dim);  color: var(--green);  }
.role-invitado{ background: var(--surface3);   color: var(--text3);  }

/* ───── MATRÍCULA ADMIN ───── */
.mat-input {
  width: 100%;
  font-family: var(--font);
  font-size: 14px; font-weight: 600;
  padding: 12px 16px;
  background: var(--surface2);
  border: 1.5px solid transparent;
  border-radius: 12px;
  color: var(--text);
  outline: none;
  transition: border-color .15s, box-shadow .15s;
  margin-bottom: 4px;
  box-sizing: border-box;
}
.mat-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(245,168,0,.15); }
.mat-input::placeholder { color: var(--text4); }
.mat-input.mat-err { border-color: var(--red); background: rgba(239,68,68,.06); }
textarea.mat-input { resize: vertical; }
.mat-field-err {
  font-size: 12px; font-weight: 700; color: var(--red);
  display: flex; align-items: center; gap: 5px;
  min-height: 18px; margin-bottom: 8px; margin-left: 2px;
}
.mat-toggle-btn {
  font-family: var(--font);
  padding: 0; margin: 0;
  border-radius: 11px;
  background: var(--surface2);
  border: 1.5px solid var(--border);
  color: var(--text3); font-weight: 800;
  cursor: pointer; transition: all .15s;
}
.mat-toggle-btn:hover { background: var(--surface3); color: var(--text); }
.mat-toggle-btn.active { background: var(--accent); color: var(--accent-dark); border-color: var(--accent); }
.mat-banner {
  display: none; flex-direction: row; align-items: center;
  border-radius: 12px; padding: 12px 18px;
  margin-bottom: 16px; gap: 10px;
}
.mat-banner.err  { background: var(--red-dim);   border: 1px solid rgba(239,68,68,.25); }
.mat-banner.ok   { background: var(--green-dim); border: 1px solid rgba(16,185,129,.25); }
.mat-banner i    { font-size: 18px; }
.mat-banner span { font-size: 13px; font-weight: 700; }
.mat-banner.err  i, .mat-banner.err  span { color: var(--red); }
.mat-banner.ok   i, .mat-banner.ok   span { color: var(--green); }

</style>
</head>
<body>

<!-- ─── LOGIN OVERLAY ─── -->
<div id="login-overlay">
  <div class="login-bg"></div>
  <div class="login-grid-lines"></div>
  <div class="login-card">

    <div class="login-logo">
      <div style="display:flex;justify-content:center;margin-bottom:14px">
        <img src="data:image/jpeg;base64,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" alt="Escuela Técnica J.R.G.S"
          style="width:100px;height:100px;border-radius:50%;object-fit:cover;
                 border:3px solid var(--accent);
                 box-shadow:0 0 0 6px var(--sky-dim),0 8px 24px rgba(0,158,247,.20)">
      </div>
      <div class="login-logo-badge">
        <i class="ti ti-school"></i>
        <span>E.T. J.R.G.S</span>
      </div>
      <div class="login-title">Panel de Administración</div>
      <div class="login-sub">Prof. José Ricardo Guillén Suárez</div>
    </div>

    <div class="login-field">
      <label>Usuario</label>
      <div class="login-input-wrap">
        <input type="text" id="login-user" class="login-input" placeholder="Ingresa tu usuario" autocomplete="username" />
        <i class="ti ti-user"></i>
      </div>
      <div class="login-error" id="err-usuario"><i class="ti ti-alert-circle"></i><span id="err-usuario-msg"></span></div>
    </div>

    <div class="login-field">
      <label>Contraseña</label>
      <div class="login-input-wrap">
        <i class="ti ti-lock" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:17px;color:var(--text4);pointer-events:none;z-index:1"></i>
        <input type="password" id="login-pass" class="login-input" placeholder="Ingresa tu contraseña" autocomplete="current-password" style="padding-right:44px" />
        <button type="button" class="login-eye" id="toggle-pass" tabindex="-1" style="z-index:2">
          <i class="ti ti-eye" id="eye-icon"></i>
        </button>
      </div>
      <div class="login-error" id="err-contrasena"><i class="ti ti-alert-circle"></i><span id="err-contrasena-msg"></span></div>
    </div>

    <div class="login-error" id="err-general" style="margin-bottom:10px"><i class="ti ti-alert-triangle"></i><span id="err-general-msg"></span></div>

    <button class="btn-login" id="btn-ingresar" onclick="intentarLogin()">
      <i class="ti ti-login spinner-btn" id="btn-spinner"></i>
      <span class="btn-login-text"><i class="ti ti-login"></i> Ingresar</span>
    </button>

    <div class="login-divider"><span>o</span></div>

    <button class="btn-guest" onclick="entrarComoInvitado()">
      <i class="ti ti-eye"></i> Ingresar como invitado
    </button>

    <div class="login-footer">Solo lectura · Todos los datos son de la institución</div>
  </div>
</div>

<div class="layout" id="main-layout" style="display:none">

  <!-- ─── SIDEBAR ─── -->
  <aside class="sidebar">
    <div class="logo">
      <div class="logo-badge">
        <i class="ti ti-school" style="color:var(--accent-dark);font-size:14px"></i>
        <span>E.T. J.R.G.S</span>
      </div>
      <div class="logo-name" id="sidebar-nombre">Prof. José Ricardo<br>Guillén Suárez</div>
      <div class="logo-sub" id="sidebar-rol">Panel de Administración</div>
    </div>

    <nav class="nav">
      <div class="nav-section">General</div>
      <div class="nav-item active" data-page="resumen">
        <i class="ti ti-layout-dashboard"></i>Resumen
      </div>
      <div class="nav-item" data-page="historial">
        <i class="ti ti-calendar-event"></i>Historial
      </div>

      <div class="nav-section">Estudiantes</div>
      <div class="nav-item" data-page="estudiantes">
        <i class="ti ti-users"></i>Estudiantes
      </div>
      <div class="nav-item" data-page="inasistencias">
        <i class="ti ti-alert-triangle"></i>Inasistencias
      </div>
      <div class="nav-item" data-page="estadisticas">
        <i class="ti ti-chart-bar"></i>Estadísticas
      </div>

      <div class="nav-section" id="nav-sec-personal">Personal</div>
      <div class="nav-item" data-page="docentes" id="nav-docentes">
        <i class="ti ti-id-badge-2"></i>Docentes
      </div>

      <div class="nav-section" id="nav-sec-admin" style="display:none">Administración</div>
      <div class="nav-item" data-page="matricula" id="nav-matricula" style="display:none">
        <i class="ti ti-user-plus"></i>Matrícula
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="api-dot">
        <div class="api-dot-circle"></div>
        <span>192.168.101.8:3000</span>
      </div>
    </div>
  </aside>

  <!-- ─── MAIN ─── -->
  <div class="main">

    <!-- TOPBAR -->
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-label" id="topbar-label">Panel Administrativo</div>
        <div class="topbar-title" id="page-title">Resumen general</div>
      </div>
      <div class="topbar-right">
        <span id="top-date" style="font-size:12px;font-weight:600;color:var(--text3)"></span>
        <!-- User chip (shown after login) -->
        <div class="user-chip" id="user-chip" onclick="toggleUserMenu()" style="display:none">
          <div class="user-chip-avatar" id="chip-avatar"></div>
          <div class="user-chip-info">
            <span class="user-chip-name" id="chip-name"></span>
            <span class="user-chip-role" id="chip-role"></span>
          </div>
          <i class="ti ti-chevron-down" style="font-size:13px;color:var(--text4);margin-left:2px"></i>
          <div class="user-menu" id="user-menu">
            <div class="user-menu-item danger" onclick="cerrarSesion(event)">
              <i class="ti ti-logout"></i> Cerrar sesión
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── RESUMEN ── -->
    <div class="page active" id="page-resumen">
      <div id="resumen-content">
        <div class="spinner"><i class="ti ti-loader-2"></i> Cargando datos…</div>
      </div>
    </div>

    <!-- ── HISTORIAL ── -->
    <div class="page" id="page-historial">
      <div id="historial-rol-banner"></div>
      <div class="filter-bar">
        <input type="date" id="hist-fecha" />
        <select id="hist-mencion">
          <option value="">Todas las menciones</option>
          <option>Telemática</option><option>Turismo</option>
          <option>Administración</option><option>Contabilidad</option>
        </select>
        <select id="hist-ano">
          <option value="">Todos los años</option>
          <option value="1" class="ano-opt-1">1er Año</option><option value="2" class="ano-opt-2">2do Año</option>
          <option value="3" class="ano-opt-3">3er Año</option><option value="4" class="ano-opt-4">4to Año</option>
          <option value="5" class="ano-opt-5">5to Año</option>
        </select>
        <button class="btn btn-primary" onclick="cargarHistorial()">
          <i class="ti ti-search"></i> Buscar
        </button>
        <button class="btn" id="btn-export-historial" onclick="exportarHistorialExcel()" style="display:none;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.25);color:#10B981;font-weight:700;gap:6px">
          <i class="ti ti-file-spreadsheet"></i> Excel
        </button>
      </div>
      <div class="card">
        <div class="table-wrap" id="hist-tabla">
          <div class="empty"><i class="ti ti-calendar-search"></i>Selecciona una fecha y presiona Buscar</div>
        </div>
      </div>
    </div>

    <!-- ── ESTUDIANTES ── -->
    <div class="page" id="page-estudiantes">
      <div id="estudiantes-rol-banner"></div>
      <div class="filter-bar">
        <input type="text" id="est-buscar" placeholder="Buscar por nombre o cédula…" style="flex:1;max-width:300px">
        <select id="est-mencion">
          <option value="">Todas las menciones</option>
          <option>Telemática</option><option>Turismo</option>
          <option>Administración</option><option>Contabilidad</option>
        </select>
        <select id="est-ano">
          <option value="">Todos los años</option>
          <option value="1" class="ano-opt-1">1°</option><option value="2" class="ano-opt-2">2°</option>
          <option value="3" class="ano-opt-3">3°</option><option value="4" class="ano-opt-4">4°</option><option value="5" class="ano-opt-5">5°</option>
        </select>
        <button class="btn" onclick="filtrarEstudiantes()">
          <i class="ti ti-filter"></i> Filtrar
        </button>
      </div>
      <div class="card">
        <div class="table-wrap" id="est-tabla">
          <div class="spinner"><i class="ti ti-loader-2"></i> Cargando…</div>
        </div>
      </div>
    </div>

    <!-- ── INASISTENCIAS ── -->
    <div class="page" id="page-inasistencias">
      <div class="filter-bar">
        <select id="ina-mencion">
          <option value="">Todas las menciones</option>
          <option>Telemática</option><option>Turismo</option>
          <option>Administración</option><option>Contabilidad</option>
        </select>
        <select id="ina-ano">
          <option value="">Todos los años</option>
          <option value="1" class="ano-opt-1">1°</option><option value="2" class="ano-opt-2">2°</option>
          <option value="3" class="ano-opt-3">3°</option><option value="4" class="ano-opt-4">4°</option><option value="5" class="ano-opt-5">5°</option>
        </select>
        <button class="btn btn-primary" onclick="cargarInasistencias()">
          <i class="ti ti-search"></i> Buscar
        </button>
        <button class="btn" id="btn-export-inasistencias" onclick="exportarInasistenciasExcel()" style="display:none;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.25);color:#10B981;font-weight:700;gap:6px">
          <i class="ti ti-file-spreadsheet"></i> Excel
        </button>
      </div>
      <div class="card">
        <div class="table-wrap" id="ina-tabla">
          <div class="empty"><i class="ti ti-alert-circle"></i>Selecciona los filtros y presiona Buscar</div>
        </div>
      </div>
    </div>

    <!-- ── ESTADÍSTICAS ── -->
    <div class="page" id="page-estadisticas">
      <div id="estadisticas-rol-banner"></div>
      <div class="filter-bar" style="margin-bottom:20px">
        <select id="stat-mencion" onchange="cargarEstadisticas()" style="font-size:14px;font-weight:700;">
          <option value="Telemática">Telemática</option>
          <option value="Turismo">Turismo</option>
          <option value="Administración">Administración</option>
          <option value="Contabilidad">Contabilidad</option>
        </select>
        <button class="btn" id="btn-export-estadisticas" onclick="exportarEstadisticasExcel()" style="display:none;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.25);color:#10B981;font-weight:700;gap:6px">
          <i class="ti ti-file-spreadsheet"></i> Excel
        </button>
      </div>
      <div id="stat-content">
        <div class="empty"><i class="ti ti-chart-bar"></i>Selecciona una mención</div>
      </div>
    </div>

    <!-- ── DOCENTES ── -->
    <div class="page" id="page-docentes">

      <!-- Tabs (solo admin ve "Registrar asistencia") -->
      <div id="doc-tabs" style="display:flex;gap:8px;margin-bottom:22px">
        <button class="btn btn-primary" id="doc-tab-registro"  onclick="docTab('registro')" style="display:none">
          <i class="ti ti-pencil-check"></i> Registrar asistencia
        </button>
        <button class="btn" id="doc-tab-personal" onclick="docTab('personal')">
          <i class="ti ti-users"></i> Personal
        </button>
        <button class="btn" id="doc-tab-historial" onclick="docTab('historial')">
          <i class="ti ti-history"></i> Historial
        </button>
      </div>

      <!-- ── PANEL: REGISTRAR ASISTENCIA (solo admin) ── -->
      <div id="doc-panel-registro" style="display:none">

        <!-- Referencia de bloques horarios -->
        <div class="card" style="margin-bottom:18px">
          <div class="section-title" style="margin-bottom:12px">
            <i class="ti ti-clock"></i>Bloques del turno tarde
          </div>
          <div class="bloques-ref">
            <div class="bloque-ref-item">
              <div class="bloque-ref-label">1ra Clase</div>
              <div class="bloque-ref-h">12:45 – 1:25 · 1:25 – 2:05</div>
            </div>
            <div class="bloque-ref-item">
              <div class="bloque-ref-label">2da Clase</div>
              <div class="bloque-ref-h">2:05 – 2:45 · 2:45 – 3:25</div>
            </div>
            <div class="bloque-ref-item" style="border-color:rgba(245,158,11,.3)">
              <div class="bloque-ref-label" style="color:var(--amber)">Receso</div>
              <div class="bloque-ref-h">3:25 – 3:35</div>
            </div>
            <div class="bloque-ref-item">
              <div class="bloque-ref-label">3ra Clase</div>
              <div class="bloque-ref-h">3:35 – 4:15 · 4:15 – 4:55</div>
            </div>
            <div class="bloque-ref-item">
              <div class="bloque-ref-label">4ta Clase</div>
              <div class="bloque-ref-h">4:55 – 5:35 · 5:35 – 6:15</div>
            </div>
          </div>
        </div>

        <!-- Resumen del día -->
        <div class="doc-resumen-bar" id="doc-reg-resumen">
          <div class="doc-resumen-chip">
            <div class="doc-resumen-num" id="drr-presentes" style="color:var(--green)">0</div>
            <div class="doc-resumen-label">Presentes</div>
          </div>
          <div class="doc-resumen-chip">
            <div class="doc-resumen-num" id="drr-ausentes" style="color:var(--red)">0</div>
            <div class="doc-resumen-label">Ausentes</div>
          </div>
          <div class="doc-resumen-chip">
            <div class="doc-resumen-num" id="drr-tardanza" style="color:var(--amber)">0</div>
            <div class="doc-resumen-label">Tardanza</div>
          </div>
          <div class="doc-resumen-chip">
            <div class="doc-resumen-num" id="drr-sinmarcar" style="color:var(--text4)">0</div>
            <div class="doc-resumen-label">Sin marcar</div>
          </div>
        </div>

        <!-- Cards de docentes para registrar -->
        <div id="doc-reg-lista">
          <div class="spinner"><i class="ti ti-loader-2"></i> Cargando docentes…</div>
        </div>
      </div>

      <!-- ── PANEL: PERSONAL ── -->
      <div id="doc-panel-personal">
        <div class="grid2">
          <div class="card">
            <div class="section-title"><i class="ti ti-users"></i>Personal docente</div>
            <div id="doc-tabla">
              <div class="spinner"><i class="ti ti-loader-2"></i> Cargando…</div>
            </div>
          </div>
          <div class="card">
            <div class="section-title">
              <i class="ti ti-calendar-check"></i>
              Asistencia hoy — <span id="doc-fecha-hoy" style="color:var(--accent-dark);font-size:13px;margin-left:4px"></span>
            </div>
            <div id="doc-hoy-tabla">
              <div class="spinner"><i class="ti ti-loader-2"></i> Cargando…</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── PANEL: HISTORIAL ── -->
      <div id="doc-panel-historial" style="display:none">
        <div class="card">
          <div class="section-title"><i class="ti ti-history"></i>Historial de asistencia docente</div>
          <div class="filter-bar" style="margin-bottom:14px">
            <label style="font-size:12px;color:var(--text3);font-weight:700">Desde</label>
            <input type="date" id="doc-desde" max="">
            <label style="font-size:12px;color:var(--text3);font-weight:700">Hasta</label>
            <input type="date" id="doc-hasta" max="">
            <button class="btn btn-primary" onclick="cargarHistorialDocentes()">
              <i class="ti ti-search"></i> Buscar
            </button>
          </div>
          <div class="table-wrap" id="doc-hist-tabla">
            <div class="empty"><i class="ti ti-calendar-search"></i>Selecciona un rango de fechas</div>
          </div>
        </div>
      </div>

    </div>


    <!-- ── MATRÍCULA (solo admin) ── -->
    <div class="page" id="page-matricula">

      <!-- Inscripción -->
      <div class="card" style="margin-bottom:18px">
        <div class="section-title"><i class="ti ti-user-plus"></i>Inscripción de Alumnos</div>

        <div class="mat-banner" id="mat-banner">
          <i class="ti ti-alert-circle" id="mat-banner-icon"></i>
          <span id="mat-banner-msg"></span>
        </div>

        <!-- Año -->
        <div style="margin-bottom:14px">
          <div style="font-size:11px;font-weight:800;color:var(--text3);letter-spacing:.8px;text-transform:uppercase;margin-bottom:8px">Año de Estudio</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="mat-toggle-btn active" style="width:44px;height:44px" data-group="ano" data-val="1" onclick="matToggle(this,'ano')">1°</button>
            <button class="mat-toggle-btn"        style="width:44px;height:44px" data-group="ano" data-val="2" onclick="matToggle(this,'ano')">2°</button>
            <button class="mat-toggle-btn"        style="width:44px;height:44px" data-group="ano" data-val="3" onclick="matToggle(this,'ano')">3°</button>
            <button class="mat-toggle-btn"        style="width:44px;height:44px" data-group="ano" data-val="4" onclick="matToggle(this,'ano')">4°</button>
            <button class="mat-toggle-btn"        style="width:44px;height:44px" data-group="ano" data-val="5" onclick="matToggle(this,'ano')">5°</button>
            <button class="mat-toggle-btn"        style="width:44px;height:44px" data-group="ano" data-val="6" onclick="matToggle(this,'ano')">6°</button>
          </div>
        </div>

        <!-- Mención -->
        <div style="margin-bottom:18px">
          <div style="font-size:11px;font-weight:800;color:var(--text3);letter-spacing:.8px;text-transform:uppercase;margin-bottom:8px">Mención</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="mat-toggle-btn active" style="padding:10px 16px" data-group="mencion" data-val="Telemática"     onclick="matToggle(this,'mencion')">Telemática</button>
            <button class="mat-toggle-btn"        style="padding:10px 16px" data-group="mencion" data-val="Turismo"        onclick="matToggle(this,'mencion')">Turismo</button>
            <button class="mat-toggle-btn"        style="padding:10px 16px" data-group="mencion" data-val="Administración" onclick="matToggle(this,'mencion')">Administración</button>
            <button class="mat-toggle-btn"        style="padding:10px 16px" data-group="mencion" data-val="Contabilidad"   onclick="matToggle(this,'mencion')">Contabilidad</button>
          </div>
        </div>

        <!-- Datos estudiante -->
        <div style="font-size:9px;font-weight:800;letter-spacing:1.8px;color:var(--text4);text-transform:uppercase;margin-bottom:10px">Datos del Estudiante</div>
        <div class="grid2" style="gap:10px;margin-bottom:0">
          <div>
            <input id="m-nombre"   class="mat-input" placeholder="Nombre">
            <div id="me-nombre"   class="mat-field-err"></div>
          </div>
          <div>
            <input id="m-apellido" class="mat-input" placeholder="Apellido">
            <div id="me-apellido" class="mat-field-err"></div>
          </div>
        </div>
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <div style="font-size:11px;font-weight:800;color:var(--text3);letter-spacing:.8px;text-transform:uppercase">Tipo de cédula</div>
            <button class="mat-toggle-btn active" style="padding:6px 14px;font-size:13px" id="m-cedula-tipo-V" data-tipo="V" onclick="cedulaTipo('est','V')">V</button>
            <button class="mat-toggle-btn"        style="padding:6px 14px;font-size:13px" id="m-cedula-tipo-E" data-tipo="E" onclick="cedulaTipo('est','E')">E</button>
          </div>
          <div style="display:flex;align-items:center;gap:0;max-width:300px">
            <span id="m-cedula-prefix" style="padding:0 10px;height:46px;display:flex;align-items:center;background:var(--surface3);border:1.5px solid transparent;border-right:none;border-radius:12px 0 0 12px;font-weight:800;font-size:15px;color:var(--accent-dark);user-select:none">V-</span>
            <input id="m-cedula" class="mat-input" placeholder="Solo números" maxlength="8" style="border-radius:0 12px 12px 0;margin-bottom:0;flex:1">
          </div>
          <div id="me-cedula" class="mat-field-err"></div>
        </div>

        <!-- Datos representante -->
        <div style="font-size:9px;font-weight:800;letter-spacing:1.8px;color:var(--text4);text-transform:uppercase;margin:14px 0 10px">Datos del Representante</div>
        <div class="grid2" style="gap:10px;margin-bottom:0">
          <div>
            <input id="m-rep_nombre"   class="mat-input" placeholder="Nombre del Representante">
            <div id="me-rep_nombre"   class="mat-field-err"></div>
          </div>
          <div>
            <input id="m-rep_apellido" class="mat-input" placeholder="Apellido del Representante">
            <div id="me-rep_apellido" class="mat-field-err"></div>
          </div>
        </div>
        <div class="grid2" style="gap:10px;margin-bottom:0">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <div style="font-size:11px;font-weight:800;color:var(--text3);letter-spacing:.8px;text-transform:uppercase">Tipo cédula rep.</div>
              <button class="mat-toggle-btn active" style="padding:6px 14px;font-size:13px" id="m-rep-cedula-tipo-V" data-tipo="V" onclick="cedulaTipo('rep','V')">V</button>
              <button class="mat-toggle-btn"        style="padding:6px 14px;font-size:13px" id="m-rep-cedula-tipo-E" data-tipo="E" onclick="cedulaTipo('rep','E')">E</button>
            </div>
            <div style="display:flex;align-items:center;gap:0">
              <span id="m-rep-cedula-prefix" style="padding:0 10px;height:46px;display:flex;align-items:center;background:var(--surface3);border:1.5px solid transparent;border-right:none;border-radius:12px 0 0 12px;font-weight:800;font-size:15px;color:var(--accent-dark);user-select:none">V-</span>
              <input id="m-rep_cedula" class="mat-input" placeholder="Solo números" maxlength="8" style="border-radius:0 12px 12px 0;margin-bottom:0;flex:1">
            </div>
            <div id="me-rep_cedula" class="mat-field-err"></div>
          </div>
          <div>
            <input id="m-rep_telefono" class="mat-input" placeholder="Teléfono del Representante">
            <div id="me-rep_telefono" class="mat-field-err"></div>
          </div>
        </div>
        <div>
          <textarea id="m-direccion" class="mat-input" placeholder="Dirección de Vivienda" rows="3"></textarea>
          <div id="me-direccion" class="mat-field-err"></div>
        </div>

        <button class="btn btn-primary" style="padding:13px 28px;font-size:14px;font-weight:800;margin-top:6px" onclick="matGuardar()">
          <i class="ti ti-device-floppy"></i> GUARDAR ESTUDIANTE
        </button>
      </div>

      <!-- Baja -->
      <div class="card" style="border-color:rgba(239,68,68,.3)">
        <div class="section-title">
          <i class="ti ti-user-minus" style="color:var(--red)"></i>
          <span style="color:var(--red)">Baja de Estudiante</span>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-start">
          <div style="flex:1;min-width:200px">
            <input id="m-baja-ced" class="mat-input" placeholder="Cédula a buscar" style="margin-bottom:0">
          </div>
          <button class="btn btn-danger" style="font-weight:800;padding:12px 20px;white-space:nowrap" onclick="matBuscar()">
            <i class="ti ti-search"></i> BUSCAR Y ELIMINAR
          </button>
        </div>
        <div id="m-baja-result" style="margin-top:14px"></div>
      </div>

    </div><!-- /#page-matricula -->
  </div><!-- /.main -->
</div><!-- /.layout #main-layout -->

<!-- ─── MODAL PERFIL ESTUDIANTE ─── -->
<div id="modal-estudiante" onclick="cerrarModalEst(event)">
  <div class="modal-card" id="modal-card-inner">
    <div class="modal-header">
      <button class="modal-close" onclick="cerrarModalEstBtn()"><i class="ti ti-x"></i></button>
    </div>
    <div class="modal-avatar-section">
      <div class="modal-avatar" id="modal-av"></div>
      <div class="modal-nombre" id="modal-nombre"></div>
      <div class="modal-sub"   id="modal-sub"></div>
      <div class="modal-pills" id="modal-pills"></div>
    </div>
    <div class="modal-body" id="modal-body"></div>
    <div class="modal-footer" id="modal-footer" style="display:none">
      <div style="font-size:10px;font-weight:800;color:var(--text4);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px">Asistencia acumulada</div>
      <div class="modal-asist-row" id="modal-asist-row"></div>
      <div class="modal-pct-bar"><div class="modal-pct-fill" id="modal-pct-fill"></div></div>
    </div>
    <div id="modal-edit-btn-wrap" style="display:none;padding:0 22px 22px">
      <button onclick="abrirEditarEstudiante()" style="width:100%;padding:12px;background:var(--accent-light);color:var(--accent-dark);border:1px solid var(--accent);border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px" onmouseover="this.style.background='#FDE68A'" onmouseout="this.style.background='var(--accent-light)'">
        <i class="ti ti-pencil"></i> Editar estudiante
      </button>
    </div>
  </div>
</div>

<!-- ─── MODAL EDITAR ESTUDIANTE ─── -->
<div id="modal-editar" style="display:none;position:fixed;inset:0;z-index:600;background:rgba(26,26,46,.85);backdrop-filter:blur(6px);align-items:center;justify-content:center;padding:20px">
  <div style="background:var(--surface);border:1px solid var(--border2);border-radius:20px;width:100%;max-width:460px;max-height:90vh;overflow-y:auto;padding:24px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <div style="font-size:16px;font-weight:800;color:var(--text)"><i class="ti ti-pencil" style="color:var(--accent);margin-right:8px"></i>Editar Estudiante</div>
      <button onclick="cerrarEditarEstudiante()" style="background:var(--surface2);border:1px solid var(--border2);color:var(--text3);width:32px;height:32px;border-radius:10px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center"><i class="ti ti-x"></i></button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
      <div>
        <label style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;display:block;margin-bottom:6px">NOMBRE</label>
        <input id="edit-nombre" class="mat-input" style="margin-bottom:0" placeholder="Nombre">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;display:block;margin-bottom:6px">APELLIDO</label>
        <input id="edit-apellido" class="mat-input" style="margin-bottom:0" placeholder="Apellido">
      </div>
    </div>
    <div style="margin-bottom:12px">
      <label style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;display:block;margin-bottom:6px">CÉDULA</label>
      <input id="edit-cedula" class="mat-input" style="margin-bottom:0" placeholder="Cédula">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
      <div>
        <label style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;display:block;margin-bottom:6px">MENCIÓN</label>
        <select id="edit-mencion_id" class="mat-input" style="margin-bottom:0"></select>
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;display:block;margin-bottom:6px">AÑO</label>
        <select id="edit-grado_id" class="mat-input" style="margin-bottom:0"></select>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
      <div>
        <label style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;display:block;margin-bottom:6px">SECCIÓN</label>
        <input id="edit-seccion" class="mat-input" style="margin-bottom:0" placeholder="A / B / C">
      </div>
      <div>
        <label style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;display:block;margin-bottom:6px">GÉNERO</label>
        <select id="edit-genero_id" class="mat-input" style="margin-bottom:0">
          <option value="">— seleccionar —</option>
          <option value="1">Masculino</option>
          <option value="2">Femenino</option>
        </select>
      </div>
    </div>
    <div id="edit-error" style="display:none;background:var(--red-dim);border:1px solid rgba(239,68,68,.3);color:var(--red);border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:12px"></div>
    <div style="display:flex;gap:10px">
      <button onclick="cerrarEditarEstudiante()" style="flex:1;padding:12px;background:var(--surface2);color:var(--text2);border:1px solid var(--border2);border-radius:12px;font-size:14px;font-weight:700;cursor:pointer">Cancelar</button>
      <button onclick="guardarEdicionEstudiante()" id="btn-guardar-edit" style="flex:2;padding:12px;background:var(--accent);color:var(--accent-dark);border:none;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px"><i class="ti ti-device-floppy"></i> Guardar cambios</button>
    </div>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script>
/* ── Fallback si Chart.js no cargó (sin internet) ── */
if (typeof Chart === 'undefined') {
  window.Chart = function(canvas, cfg) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#B0CFFA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#99C4EF';
    ctx.font = '13px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Gráfico no disponible sin conexión', canvas.width/2, canvas.height/2 - 8);
    ctx.fillStyle = '#5A80A8';
    ctx.font = '11px Segoe UI, sans-serif';
    ctx.fillText('(descarga Chart.js para uso offline)', canvas.width/2, canvas.height/2 + 12);
    return { destroy: function(){} };
  };
}
</script>
<script>
/* ─── CONFIG ─── */
const API = '__API_URL__'; // ← inyectado automáticamente por el servidor Node
const MENCIONES = ['Telemática','Turismo','Administración','Contabilidad'];
const ANO_LABEL = {1:'1er Año',2:'2do Año',3:'3er Año',4:'4to Año',5:'5to Año'};

const MENCION_COLORS = {
  'Telemática':    { color:'#009EF7', dim:'rgba(0,158,247,.12)',   cls:'acc-tele'  },
  'Turismo':       { color:'#10B981', dim:'rgba(16,185,129,.12)',   cls:'acc-tur'   },
  'Administración':{ color:'#F59E0B', dim:'rgba(245,158,11,.12)',   cls:'acc-adm'   },
  'Contabilidad':  { color:'#818CF8', dim:'rgba(129,140,248,.12)',  cls:'acc-cont'  },
};
const ANO_COLORS = ['#A8DFFE','#A7EDD8','#FDDEA0','#C9CBFA','#FAB8D8'];

/* ════════════════════════════════════════════════
   MODAL PERFIL ESTUDIANTE
   ════════════════════════════════════════════════ */
let _modalCache = {}; // cache de estadísticas por estudiante id

function puedeVerPerfil() {
  const rol = SESSION?.rol || 'invitado';
  return rol !== 'invitado';
}

async function abrirModalEst(datos) {
  /* datos puede ser objeto completo de estudiante
     o solo {id, nombre, apellido, cedula, mencion, ano, nro_lista, ...} */
  if (!puedeVerPerfil()) return;

  const modal = document.getElementById('modal-estudiante');
  const mc    = MENCION_COLORS[datos.mencion] || { color:'#009EF7', dim:'rgba(0,158,247,.12)' };
  const ANO_COL = ANO_COLORS[(Number(datos.ano)||1)-1];

  /* Avatar */
  const av = document.getElementById('modal-av');
  av.style.background = mc.dim;
  av.style.color = mc.color;
  av.style.borderColor = mc.color + '55';
  av.textContent = (datos.nombre||'?')[0].toUpperCase();

  /* Nombre y sub */
  document.getElementById('modal-nombre').textContent = `${datos.nombre} ${datos.apellido}`;
  document.getElementById('modal-sub').textContent = datos.usuario ? datos.usuario : `N° ${datos.nro_lista||'—'} de lista`;

  /* Pills */
  document.getElementById('modal-pills').innerHTML = `
    <span class="pill" style="background:${mc.dim};color:${mc.color};border:1px solid ${mc.color}40">
      <i class="ti ti-school" style="font-size:11px"></i>${datos.mencion||'—'}
    </span>
    <span class="pill" style="background:${ANO_COL}18;color:${ANO_COL};border:1px solid ${ANO_COL}40">
      ${ANO_LABEL[datos.ano]||(datos.ano ? datos.ano+'° Año' : 'Sin año')}
    </span>`;

  /* Body: datos personales */
  const cedulaFmt = datos.cedula
    ? (/^[VE]-/i.test(datos.cedula) ? datos.cedula : 'V-' + datos.cedula)
    : '—';
  const repNombre = datos.rep_nombre
    ? `${datos.rep_nombre} ${datos.rep_apellido||''}`.trim()
    : '—';
  const repTel = datos.rep_telefono || '—';
  const direccion = datos.direccion || '—';

  document.getElementById('modal-body').innerHTML = `
    <div class="modal-info-row">
      <div class="modal-info-icon" style="color:${mc.color}"><i class="ti ti-id-badge-2"></i></div>
      <div>
        <div class="modal-info-label">Cédula</div>
        <div class="modal-info-val" style="font-family:var(--mono)">${cedulaFmt}</div>
      </div>
    </div>
    <div class="modal-info-row">
      <div class="modal-info-icon" style="color:var(--indigo)"><i class="ti ti-user-circle"></i></div>
      <div>
        <div class="modal-info-label">Representante</div>
        <div class="modal-info-val">${repNombre}</div>
      </div>
    </div>
    <div class="modal-info-row">
      <div class="modal-info-icon" style="color:var(--green)"><i class="ti ti-phone"></i></div>
      <div>
        <div class="modal-info-label">Teléfono representante</div>
        <div class="modal-info-val" style="font-family:var(--mono)">${repTel}</div>
      </div>
    </div>
    <div class="modal-info-row">
      <div class="modal-info-icon" style="color:var(--amber)"><i class="ti ti-map-pin"></i></div>
      <div>
        <div class="modal-info-label">Dirección</div>
        <div class="modal-info-val" style="font-size:13px;font-weight:600;color:var(--text2)">${direccion}</div>
      </div>
    </div>`;

  /* Footer asistencia: intentar cargar estadísticas */
  const footer = document.getElementById('modal-footer');
  const asistRow = document.getElementById('modal-asist-row');
  const pctFill  = document.getElementById('modal-pct-fill');
  footer.style.display = 'none';
  asistRow.innerHTML = '';

  if (datos.mencion && datos.ano) {
    const cacheKey = `${datos.mencion}-${datos.ano}`;
    let statData = _modalCache[cacheKey];
    if (!statData) {
      statData = await get(`/estadisticas/${encodeURIComponent(datos.mencion)}?ano=${datos.ano}`);
      if (statData) _modalCache[cacheKey] = statData;
    }
    if (statData) {
      /* Buscar el estudiante por id o por nombre+apellido */
      const est = statData.find(e =>
        (datos.id && e.id === datos.id) ||
        (e.nombre === datos.nombre && e.apellido === datos.apellido)
      );
      if (est) {
        const totalClases = est.total_clases || 0;
        const pct = totalClases > 0 ? Math.round(est.totales_p / totalClases * 100) : 0;
        const barColor = pct < 75 ? 'var(--red)' : 'var(--green)';
        const pctColor = pct < 75 ? 'var(--red)' : 'var(--green)';
        footer.style.display = '';
        asistRow.innerHTML = `
          <div class="modal-asist-box">
            <div class="modal-asist-num" style="color:var(--green)">${est.totales_p}</div>
            <div class="modal-asist-label">Presentes</div>
          </div>
          <div class="modal-asist-box">
            <div class="modal-asist-num" style="color:var(--red)">${est.totales_a}</div>
            <div class="modal-asist-label">Inasist.</div>
          </div>
          <div class="modal-asist-box">
            <div class="modal-asist-num" style="color:var(--amber)">${est.totales_r}</div>
            <div class="modal-asist-label">Retirados</div>
          </div>
          <div class="modal-asist-box" style="border-color:${barColor}40">
            <div class="modal-asist-num" style="color:${pctColor}">${pct}%</div>
            <div class="modal-asist-label">Asistencia</div>
          </div>`;
        pctFill.style.width = '0%';
        pctFill.style.background = barColor;
        setTimeout(() => { pctFill.style.width = pct + '%'; }, 50);
      }
    }
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* Botón editar: solo admin */
  const editWrap = document.getElementById('modal-edit-btn-wrap');
  if (SESSION?.rol === 'admin') {
    editWrap.style.display = 'block';
    modal._datosActuales = datos;
  } else {
    editWrap.style.display = 'none';
  }
}

function cerrarModalEst(e) {
  if (e && e.target !== document.getElementById('modal-estudiante')) return;
  _cerrarModal();
}
function cerrarModalEstBtn() { _cerrarModal(); }
function _cerrarModal() {
  document.getElementById('modal-estudiante').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') _cerrarModal(); });

/* Helper: construir objeto estudiante desde los datos de una fila de historial */
function datosDesdeHistorial(r) {
  /* En historial, r tiene: nombre, apellido, cedula, mencion, ano, nro_lista, observaciones */
  /* Buscar el estudiante completo en todosEstudiantes si está cargado */
  const full = todosEstudiantes.find(e =>
    e.nombre === r.nombre && e.apellido === r.apellido
  );
  return full || r;
}

/* Helper: construir nombre clickeable según rol */
function nombreLink(obj, textoDisplay) {
  const texto = textoDisplay || `${obj.nombre} ${obj.apellido}`;
  if (!puedeVerPerfil()) {
    /* Invitado: solo iniciales o nombre sin apellido completo */
    const inicialAp = (obj.apellido||'')[0] ? (obj.apellido[0] + '.') : '';
    return `<span class="est-link-inv" style="color:var(--text2)">${obj.nombre} ${inicialAp}</span>`;
  }
  const safe = encodeURIComponent(JSON.stringify(obj));
  return `<span class="est-link" style="font-weight:700;color:var(--text)"
    onclick='abrirModalEstDesde(${JSON.stringify(obj)})'>${texto}</span>`;
}

function abrirModalEstDesde(datos) {
  abrirModalEst(datos);
}

/* ─── INIT ─── */
let todosEstudiantes = [];
let chartMenciones = null, chartEstados = null;

// Date in topbar
document.getElementById('top-date').textContent =
  new Date().toLocaleDateString('es-ES',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
document.getElementById('hist-fecha').value = new Date().toISOString().split('T')[0];

/* ── Fechas historial docentes: predeterminado = inicio de mes hasta hoy, max = hoy ── */
(function initDocFechas() {
  const hoy = new Date().toISOString().split('T')[0];
  const ahora = new Date();
  const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString().split('T')[0];
  const desde = document.getElementById('doc-desde');
  const hasta = document.getElementById('doc-hasta');
  if (desde) { desde.value = primerDia; desde.max = hoy; }
  if (hasta) { hasta.value = hoy;       hasta.max = hoy; }
  /* Cuando cambia "Desde", asegurarse que "Hasta" no quede antes */
  if (desde && hasta) {
    desde.addEventListener('change', () => {
      if (hasta.value && hasta.value < desde.value) hasta.value = desde.value;
      hasta.min = desde.value;
    });
    /* Cuando cambia "Hasta", asegurarse que "Desde" no quede después */
    hasta.addEventListener('change', () => {
      if (desde.value && desde.value > hasta.value) desde.value = hasta.value;
    });
  }
})();

/* sesión: restaurada al final del script */

/* ─── API HELPER ─── */
async function get(path){
  try{
    const r = await fetch(API+path);
    if(!r.ok){
      let msg = '';
      try{ const body = await r.json(); msg = body.error || body.message || ''; }catch(_){}
      return { __error: true, status: r.status, message: msg };
    }
    return await r.json();
  }catch(e){
    return { __error: true, status: 0, message: 'Sin conexión con el servidor' };
  }
}

/* Helpers para interpretar respuestas de get() */
function esError(data){ return data && data.__error === true; }
function mensajeError(data, statusTexts){
  if(!data || !data.__error) return '';
  const st = statusTexts || {};
  if(data.status === 404) return st[404] || 'El recurso solicitado no existe (404)';
  if(data.status === 403) return st[403] || 'No tienes permiso para ver esto (403)';
  if(data.status === 500) return st[500] || 'Error interno del servidor (500)';
  if(data.status === 0)   return st[0]   || 'No se pudo conectar con el servidor';
  return data.message || `Error del servidor (${data.status})`;
}
function htmlError(data, statusTexts){
  return `<div class="warn-box"><i class="ti ti-alert-triangle"></i>${mensajeError(data, statusTexts)}</div>`;
}
function htmlVacio(icon, texto){
  return `<div class="empty"><i class="ti ${icon}"></i>${texto}</div>`;
}

/* ── Formato de fecha: DD/MM/AAAA HH:MM ── */
function fmtFecha(raw) {
  if (!raw) return '—';
  /* Soporta: ISO string, "YYYY-MM-DD", "YYYY-MM-DD HH:MM:SS", timestamp */
  const d = new Date(raw);
  if (isNaN(d.getTime())) {
    /* Intento con formato YYYY-MM-DD sin hora (se interpreta en UTC) */
    const parts = String(raw).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (parts) {
      const [,y,m,day] = parts;
      return `${day}/${m}/${y}`;
    }
    return String(raw);
  }
  const dd  = String(d.getDate()).padStart(2,'0');
  const mm  = String(d.getMonth()+1).padStart(2,'0');
  const yy  = d.getFullYear();
  const hh  = String(d.getHours()).padStart(2,'0');
  const min = String(d.getMinutes()).padStart(2,'0');
  return `${dd}/${mm}/${yy} ${hh}:${min}`;
}
/* Variante solo fecha sin hora (para topbar y encabezados) */
function fmtFechaSolo(raw) {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return String(raw);
  const dd  = String(d.getDate()).padStart(2,'0');
  const mm  = String(d.getMonth()+1).padStart(2,'0');
  const yy  = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

/* ─── NAV ─── */
const TITLES = {
  resumen:'Resumen general', historial:'Historial de asistencias',
  estudiantes:'Gestión de estudiantes', inasistencias:'Control de inasistencias',
  estadisticas:'Estadísticas por mención', docentes:'Asistencia docente',
  matricula:'Administrar Matrícula'
};
function navTo(page){
  /* Bloquear páginas según rol */
  const rol = SESSION?.rol || 'invitado';
  const esAdmin    = rol === 'admin';
  const esInvitado = rol === 'invitado';

  if (page === 'matricula' && !esAdmin)  return;
  if (page === 'docentes'  && esInvitado) return;

  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');
  document.getElementById('page-'+page).classList.add('active');
  document.getElementById('page-title').textContent = TITLES[page]||page;
  if(page==='resumen') cargarResumen();
  if(page==='estudiantes'&&todosEstudiantes.length===0) cargarEstudiantes();
  if(page==='docentes') {
    const esAdmin = (SESSION?.rol || '') === 'admin';
    if (esAdmin) {
      docTab('registro');
      cargarRegistroDocentes();
    } else {
      docTab('personal'); // docTab ya llama cargarDocentes internamente
    }
  }
  if(page==='estadisticas') cargarEstadisticas();
}
document.querySelectorAll('.nav-item').forEach(n=>n.addEventListener('click',()=>navTo(n.dataset.page)));

/* ─── PILL ─── */
function pill(estado){
  const map={
    'Asistido':'pill-green','Presente':'pill-green',
    'Inasistente':'pill-red','Ausente':'pill-red',
    'Retirado':'pill-amber','Tardanza':'pill-amber',
  };
  const icons={
    'Asistido':'ti-circle-check','Presente':'ti-circle-check',
    'Inasistente':'ti-circle-x','Ausente':'ti-circle-x',
    'Retirado':'ti-circle-minus','Tardanza':'ti-clock',
  };
  const cls = map[estado]||'pill-gray';
  const ico = icons[estado]||'ti-circle';
  return `<span class="pill ${cls}"><i class="ti ${ico}" style="font-size:12px"></i>${estado}</span>`;
}

/* ─── RESUMEN ─── */
async function cargarResumen(){
  const el = document.getElementById('resumen-content');
  const rol = SESSION?.rol || 'invitado';
  const esAdmin    = rol === 'admin';
  const esInvitado = rol === 'invitado';

  const promesas = [get('/estudiantes')];
  if (esAdmin) promesas.push(get('/admin/docentes'), get('/asistencia-docentes/hoy'));
  else         promesas.push(Promise.resolve(null), Promise.resolve(null));

  const [estudiantes, docentesData, asisHoy] = await Promise.all(promesas);

  if(!estudiantes || esError(estudiantes)){
    const motivo = esError(estudiantes)
      ? mensajeError(estudiantes, { 0: `No se pudo conectar con la API en <strong>${API}</strong>. Verifica que el servidor esté activo.` })
      : `No se pudo conectar con la API en <strong>${API}</strong>. Verifica que el servidor esté activo.`;
    el.innerHTML=`<div class="warn-box"><i class="ti ti-wifi-off"></i>${motivo}</div>`;
    return;
  }

  /* Filtrar estudiantes según rol */
  const mpStr = String(SESSION?.menciones_permitidas ?? '').trim();
  const tieneMenciones = mpStr !== '' && mpStr !== 'null' && mpStr !== 'undefined';
  const ANOS_POR_ROL = {
    admin:'12345', docente_manana:'123', docente_tarde:'45', invitado:'12345',
  };
  const anosStr = ANOS_POR_ROL[rol] || '12345';
  const anosBase = anosStr.split('').map(String);

  let anosPermitidos = anosBase;
  let mencionesPermitidas = MENCIONES;
  if (tieneMenciones) {
    const anosEnM = [...new Set(mpStr.split(',').map(p=>p.trim().split(':')[1]).filter(Boolean))];
    anosPermitidos = anosBase.filter(a=>anosEnM.includes(a));
    const mm = [...new Set(mpStr.split(',').map(p=>p.trim().split(':')[0]).filter(Boolean))].filter(m=>MENCIONES.includes(m));
    if (mm.length) mencionesPermitidas = mm;
  }

  const estudiantesFiltrados = estudiantes.filter(e =>
    anosPermitidos.includes(String(e.ano)) &&
    mencionesPermitidas.includes(e.mencion)
  );

  const totalEst    = estudiantesFiltrados.length;
  const docData   = (!docentesData || esError(docentesData)) ? null : docentesData;
  const asisData  = (!asisHoy || esError(asisHoy)) ? null : asisHoy;

  const totalDoc    = docData ? docData.length : 0;
  const docPresentes= asisData ? asisData.filter(a=>a.estado==='Presente').length : 0;
  const docAusentes = asisData ? asisData.filter(a=>a.estado==='Ausente').length : 0;

  const por_mencion = {};
  MENCIONES.forEach(m=>{ por_mencion[m]=0; });
  estudiantesFiltrados.forEach(e=>{ if(por_mencion[e.mencion]!==undefined) por_mencion[e.mencion]++; });

  const por_ano = {};
  for(let i=1;i<=5;i++) por_ano[i]=0;
  estudiantesFiltrados.forEach(e=>{ const a=Number(e.ano); if(a>=1&&a<=5) por_ano[a]++; });

  /* Banner de contexto para docentes */
  const turnoLabel = rol==='docente_manana' ? 'Turno Mañana · 1°, 2° y 3° Año'
                   : rol==='docente_tarde'   ? 'Turno Tarde · 4° y 5° Año' : null;
  const bannerCtx = turnoLabel ? `
    <div class="rol-banner rol-banner-info" style="margin-bottom:20px">
      <i class="ti ti-sun"></i>
      Viendo datos de tu turno: <strong>${turnoLabel}</strong>
      ${tieneMenciones ? `· Menciones: <strong>${mencionesPermitidas.join(', ')}</strong>` : ''}
    </div>` : '';

  /* Métricas de docentes — solo admin */
  const metricasDocentes = esAdmin ? `
      <div class="metric">
        <div class="metric-icon" style="background:var(--green-dim);color:var(--green)"><i class="ti ti-id-badge-2"></i></div>
        <div class="metric-label">Docentes</div>
        <div class="metric-val">${totalDoc}</div>
        <div class="metric-sub">${docPresentes} presentes hoy</div>
      </div>
      <div class="metric">
        <div class="metric-icon" style="background:var(--red-dim);color:var(--red)"><i class="ti ti-user-x"></i></div>
        <div class="metric-label">Ausentes Hoy</div>
        <div class="metric-val" style="color:var(--red)">${docAusentes}</div>
        <div class="metric-sub">docentes sin asistir</div>
      </div>` : '';

  el.innerHTML=`
    ${bannerCtx}
    <div class="metric-grid">
      <div class="metric">
        <div class="metric-icon" style="background:var(--amber-dim);color:var(--accent-dark)"><i class="ti ti-users"></i></div>
        <div class="metric-label">Total Estudiantes</div>
        <div class="metric-val">${totalEst}</div>
        <div class="metric-sub">${turnoLabel ? 'en tu turno' : 'matriculados actualmente'}</div>
      </div>
      ${metricasDocentes}
      <div class="metric">
        <div class="metric-icon" style="background:var(--indigo-dim);color:var(--indigo)"><i class="ti ti-building-school"></i></div>
        <div class="metric-label">Menciones</div>
        <div class="metric-val">${mencionesPermitidas.length}</div>
        <div class="metric-sub">${mencionesPermitidas.length < MENCIONES.length ? 'asignadas a tu cuenta' : 'especialidades activas'}</div>
      </div>
    </div>

    <div class="grid2">
      <div class="card">
        <div class="section-title"><i class="ti ti-chart-donut"></i>Estudiantes por Mención</div>
        <div class="chart-wrap"><canvas id="chart-menciones"></canvas></div>
      </div>
      <div class="card">
        <div class="section-title"><i class="ti ti-chart-bar"></i>Estudiantes por Año</div>
        <div class="chart-wrap"><canvas id="chart-anos"></canvas></div>
      </div>
    </div>

    <div class="card">
      <div class="section-title"><i class="ti ti-table"></i>Distribución por Mención y Año</div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Mención</th>
            ${anosPermitidos.map(a=>`<th>${ANO_LABEL[a]}</th>`).join('')}
            <th>Total</th>
          </tr></thead>
          <tbody>
            ${mencionesPermitidas.map(m=>{
              const mc = MENCION_COLORS[m];
              const filaAnos = anosPermitidos.map(a=>{
                const c = estudiantesFiltrados.filter(e=>e.mencion===m&&e.ano==a).length;
                return `<td style="font-weight:700">${c||'—'}</td>`;
              });
              const tot = estudiantesFiltrados.filter(e=>e.mencion===m).length;
              return `<tr>
                <td>
                  <span style="display:inline-flex;align-items:center;gap:8px">
                    <span style="width:10px;height:10px;border-radius:3px;background:${mc.color};flex-shrink:0;display:inline-block"></span>
                    <strong>${m}</strong>
                  </span>
                </td>
                ${filaAnos.join('')}
                <td><span class="pill" style="background:${mc.dim};color:${mc.color};border:1px solid ${mc.color}40">${tot}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const chartDefaults = {
    plugins: { legend: { labels: { color:'#2B5280', font:{ family:'Inter', size:12 }, boxWidth:14 } } }
  };

  if(chartMenciones) chartMenciones.destroy();
  chartMenciones = new Chart(document.getElementById('chart-menciones'),{
    type:'doughnut',
    data:{
      labels: mencionesPermitidas,
      datasets:[{ data: mencionesPermitidas.map(m=>por_mencion[m]),
        backgroundColor: mencionesPermitidas.map(m=>MENCION_COLORS[m].color),
        borderColor: '#E4EFFF', borderWidth: 2, hoverBorderWidth: 3 }]
    },
    options:{
      responsive:true, maintainAspectRatio:false, cutout:'68%',
      plugins:{ legend:{ position:'bottom', labels:{ color:'#2B5280', font:{family:'Inter',size:12}, boxWidth:14, padding:16 } } }
    }
  });

  if(chartEstados) chartEstados.destroy();
  chartEstados = new Chart(document.getElementById('chart-anos'),{
    type:'bar',
    data:{
      labels: anosPermitidos.map(a=>ANO_LABEL[a]),
      datasets:[{
        label:'Estudiantes',
        data: anosPermitidos.map(a=>por_ano[a]),
        backgroundColor: anosPermitidos.map(a=>ANO_COLORS[Number(a)-1]),
        borderRadius:8, borderSkipped:false,
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false } },
      scales:{
        y:{ beginAtZero:true, ticks:{ precision:0, color:'#5A80A8', font:{family:'Inter'} }, grid:{ color:'#C8DFFF' } },
        x:{ ticks:{ color:'#5A80A8', font:{family:'Inter'} }, grid:{ display:false } }
      }
    }
  });
}

/* ─── HISTORIAL ─── */
/* cache para exportaciones */
let _historialData = [];
let _inasistenciasData = [];
let _estadisticasData = { mencion: '', data: [] };

function puedeExportar() {
  const rol = SESSION?.rol || 'invitado';
  return rol === 'admin' || rol === 'docente_manana' || rol === 'docente_tarde';
}

async function cargarHistorial(){
  const fecha   = document.getElementById('hist-fecha').value;
  const mencion = document.getElementById('hist-mencion').value;
  const ano     = document.getElementById('hist-ano').value;
  const el      = document.getElementById('hist-tabla');
  const btnExp  = document.getElementById('btn-export-historial');
  if(!fecha){ el.innerHTML='<div class="empty"><i class="ti ti-calendar"></i>Selecciona una fecha</div>'; if(btnExp) btnExp.style.display='none'; return; }
  el.innerHTML='<div class="spinner"><i class="ti ti-loader-2"></i> Cargando…</div>';
  let url=`/historial?fecha=${fecha}`;
  if(mencion) url+=`&mencion=${encodeURIComponent(mencion)}`;
  if(ano)     url+=`&ano=${ano}`;
  const data = await get(url);
  _historialData = (!data || esError(data)) ? [] : data;
  if(btnExp) btnExp.style.display='none';
  if(esError(data)){
    el.innerHTML = htmlError(data, { 404:'No se encontraron registros para los filtros indicados' });
    return;
  }
  if(!data||data.length===0){ el.innerHTML=htmlVacio('ti-calendar-off','No hay registros para esta fecha'); return; }
  if(btnExp && puedeExportar()) btnExp.style.display='';
  el.innerHTML=`<table>
    <thead><tr><th>#</th><th>Estudiante</th><th>Mención</th><th>Año</th><th>Estado</th><th>Materia</th><th>Observaciones</th></tr></thead>
    <tbody>${data.map((r,i)=>`<tr>
      <td style="color:var(--text4);font-family:var(--mono)">${r.nro_lista||i+1}</td>
      <td><div class="flex-row">
        <div class="avatar">${(r.nombre||'?')[0].toUpperCase()}</div>
        ${nombreLink(r)}
      </div></td>
      <td><span style="font-size:12px;font-weight:700;color:${MENCION_COLORS[r.mencion]?.color||'#5A80A8'}">${r.mencion}</span></td>
      <td style="font-weight:600">${ANO_LABEL[Number(r.ano)]||(r.ano ? r.ano : '—')}</td>
      <td>${pill(r.estado)}</td>
      <td style="color:var(--text3);font-size:13px">${r.materia||'General'}</td>
      <td style="color:var(--text3);font-size:12px">${r.observaciones||'—'}</td>
    </tr>`).join('')}
    </tbody></table>`;
}

function exportarHistorialExcel() {
  if (!_historialData || _historialData.length === 0) return;
  const fecha   = document.getElementById('hist-fecha').value || '';
  const mencion = document.getElementById('hist-mencion').value || 'Todas';
  const ano     = document.getElementById('hist-ano').value;
  const anoLabel = ano ? (ANO_LABEL[Number(ano)] || `${ano}° Año`) : 'Todos los años';
  const hoy = new Date().toLocaleDateString('es-ES', { day:'2-digit', month:'2-digit', year:'numeric' });

  const encabezado = [
    ['Institución:', 'E.T. J.R.G.S'],
    ['Mención:', mencion],
    ['Año:', anoLabel],
    ['Fecha consultada:', fecha],
    ['Exportado:', hoy],
    [],
    ['#', 'Nombre', 'Apellido', 'Mención', 'Año', 'Estado', 'Materia', 'Observaciones'],
  ];

  const filas = _historialData.map((r, i) => [
    r.nro_lista || i + 1,
    r.nombre || '',
    r.apellido || '',
    r.mencion || '',
    ANO_LABEL[Number(r.ano)] || (r.ano || '—'),
    r.estado || '',
    r.materia || 'General',
    r.observaciones || '',
  ]);

  const presentes  = _historialData.filter(r => r.estado === 'Asistido').length;
  const ausentes   = _historialData.filter(r => r.estado === 'Inasistente').length;
  const retirados  = _historialData.filter(r => r.estado === 'Retirado').length;
  const resumen = [
    [],
    ['', 'RESUMEN'],
    ['', 'Presentes:', presentes],
    ['', 'Inasistentes:', ausentes],
    ['', 'Retirados:', retirados],
    ['', 'Total registros:', _historialData.length],
  ];

  const datos = [...encabezado, ...filas, ...resumen];
  const ws = XLSX.utils.aoa_to_sheet(datos);
  ws['!cols'] = [{ wch:5 },{ wch:20 },{ wch:20 },{ wch:16 },{ wch:12 },{ wch:14 },{ wch:20 },{ wch:30 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Historial');
  XLSX.writeFile(wb, `historial_${fecha}_${mencion.replace(/\s/g,'_')}.xlsx`);
}

/* ─── ESTUDIANTES ─── */
async function cargarEstudiantes(){
  const data = await get('/estudiantes');
  if(esError(data)){
    document.getElementById('est-tabla').innerHTML = htmlError(data, { 404:'No se encontraron estudiantes en la base de datos' });
    todosEstudiantes = [];
    return;
  }
  todosEstudiantes = data||[];
  renderEstudiantes(todosEstudiantes);
}
function filtrarEstudiantes(){
  const q = document.getElementById('est-buscar').value.toLowerCase();
  const m = document.getElementById('est-mencion').value;
  const a = document.getElementById('est-ano').value;
  const filtered = todosEstudiantes.filter(e=>{
    const matchQ=!q||(e.nombre+' '+e.apellido+' '+e.cedula).toLowerCase().includes(q);
    const matchM=!m||e.mencion===m;
    const matchA=!a||String(e.ano)===a;
    return matchQ&&matchM&&matchA;
  });
  renderEstudiantes(filtered);
}
function renderEstudiantes(lista){
  const el = document.getElementById('est-tabla');
  const esInvitado = (SESSION?.rol || 'invitado') === 'invitado';
  if(!lista||lista.length===0){
    el.innerHTML='<div class="empty"><i class="ti ti-users-group"></i>No hay estudiantes que coincidan</div>'; return;
  }
  el.innerHTML=`
    <div style="margin-bottom:12px;font-size:12px;font-weight:700;color:var(--text3)">
      <i class="ti ti-filter" style="margin-right:5px"></i>${lista.length} estudiante${lista.length!==1?'s':''} encontrado${lista.length!==1?'s':''}
    </div>
    <table>
      <thead><tr>
        <th>#</th><th>Nombre</th>
        ${esInvitado ? '' : '<th>Cédula</th>'}
        <th>Mención</th><th>Año</th>
        ${esInvitado ? '' : '<th>Representante</th><th>Teléfono</th>'}
      </tr></thead>
      <tbody>${lista.map(e=>{
        const mc = MENCION_COLORS[e.mencion];
        return `<tr>
          <td style="color:var(--text4);font-family:var(--mono)">${e.nro_lista||'—'}</td>
          <td><div class="flex-row">
            <div class="avatar">${(e.nombre||'?')[0].toUpperCase()}</div>
            ${nombreLink(e)}
          </div></td>
          ${esInvitado ? '' : `<td style="font-family:var(--mono);font-size:13px;color:var(--text3)">${e.cedula||'—'}</td>`}
          <td>
            <span style="font-size:12px;font-weight:800;color:${mc?.color||'#5A80A8'}">${e.mencion||'—'}</span>
          </td>
          <td>
            <span class="pill" style="background:${ANO_COLORS[(Number(e.ano)||1)-1]}22;color:${ANO_COLORS[(Number(e.ano)||1)-1]};border:1px solid ${ANO_COLORS[(Number(e.ano)||1)-1]}40">
              ${ANO_LABEL[Number(e.ano)]||(e.ano ? e.ano : '—')}
            </span>
          </td>
          ${esInvitado ? '' : `
          <td style="font-size:13px;color:var(--text3)">${e.rep_nombre?e.rep_nombre+' '+(e.rep_apellido||''):'—'}</td>
          <td style="font-size:13px;color:var(--text3);font-family:var(--mono)">${e.rep_telefono||'—'}</td>`}
        </tr>`;
      }).join('')}
      </tbody>
    </table>`;
}
document.getElementById('est-buscar').addEventListener('keyup',filtrarEstudiantes);

/* ─── INASISTENCIAS ─── */
async function cargarInasistencias(){
  const mencion = document.getElementById('ina-mencion').value;
  const ano     = document.getElementById('ina-ano').value;
  const el      = document.getElementById('ina-tabla');
  const btnExp  = document.getElementById('btn-export-inasistencias');
  el.innerHTML='<div class="spinner"><i class="ti ti-loader-2"></i> Cargando…</div>';
  let url='/inasistencias-acumuladas';
  const params=[];
  if(mencion) params.push(`mencion=${encodeURIComponent(mencion)}`);
  if(ano)     params.push(`ano=${ano}`);
  if(params.length) url+='?'+params.join('&');
  const data = await get(url);
  _inasistenciasData = (!data || esError(data)) ? [] : data;
  if(btnExp) btnExp.style.display='none';
  if(esError(data)){
    el.innerHTML = htmlError(data, { 404:'No se encontraron datos para los filtros indicados' });
    return;
  }
  if(!data||data.length===0){ el.innerHTML=htmlVacio('ti-check','No hay inasistencias registradas'); return; }
  if(btnExp && puedeExportar()) btnExp.style.display='';
  el.innerHTML=`<table>
    <thead><tr><th>#</th><th>Estudiante</th><th>Mención</th><th>Año</th><th>Inasist.</th><th>Retirados</th><th>Total</th></tr></thead>
    <tbody>${data.map(e=>{
      const total=e.totalInasistencias+e.totalRetirados;
      const pct=Math.min(100,total*5);
      const barColor=pct>50?'var(--red)':'var(--amber)';
      return `<tr>
        <td style="color:var(--text4);font-family:var(--mono)">${e.nro_lista||'—'}</td>
        <td style="font-weight:700">${nombreLink(e)}</td>
        <td><span style="font-size:12px;font-weight:800;color:${MENCION_COLORS[e.mencion]?.color||'#5A80A8'}">${e.mencion}</span></td>
        <td style="font-weight:600">${ANO_LABEL[Number(e.ano)]||(e.ano ? e.ano : '—')}</td>
        <td><span style="color:var(--red);font-weight:800;font-size:16px">${e.totalInasistencias}</span></td>
        <td><span style="color:var(--amber);font-weight:800;font-size:16px">${e.totalRetirados}</span></td>
        <td>
          <span style="font-weight:900;font-size:16px">${total}</span>
          <div class="progress-bg"><div class="progress-fill" style="width:${pct}%;background:${barColor}"></div></div>
        </td>
      </tr>`;
    }).join('')}
    </tbody></table>`;
}

function exportarInasistenciasExcel() {
  if (!_inasistenciasData || _inasistenciasData.length === 0) return;
  const mencion = document.getElementById('ina-mencion').value || 'Todas';
  const ano     = document.getElementById('ina-ano').value;
  const anoLabel = ano ? (ANO_LABEL[Number(ano)] || `${ano}° Año`) : 'Todos los años';
  const hoy = new Date().toLocaleDateString('es-ES', { day:'2-digit', month:'2-digit', year:'numeric' });

  const encabezado = [
    ['Institución:', 'E.T. J.R.G.S'],
    ['Mención:', mencion],
    ['Año:', anoLabel],
    ['Exportado:', hoy],
    [],
    ['#', 'Nombre', 'Apellido', 'Cédula', 'Mención', 'Año', 'Inasistencias', 'Retirados', 'Total'],
  ];

  const filas = _inasistenciasData.map(e => {
    const total = e.totalInasistencias + e.totalRetirados;
    return [
      e.nro_lista || '—',
      e.nombre || '',
      e.apellido || '',
      e.cedula || '',
      e.mencion || '',
      ANO_LABEL[Number(e.ano)] || (e.ano || '—'),
      e.totalInasistencias,
      e.totalRetirados,
      total,
    ];
  });

  const totalInas = _inasistenciasData.reduce((s,e) => s + e.totalInasistencias, 0);
  const totalRet  = _inasistenciasData.reduce((s,e) => s + e.totalRetirados, 0);
  const resumen = [
    [],
    ['', 'RESUMEN'],
    ['', 'Total Inasistencias:', totalInas],
    ['', 'Total Retirados:', totalRet],
    ['', 'Total acumulado:', totalInas + totalRet],
    ['', 'Estudiantes con ausencias:', _inasistenciasData.length],
  ];

  const datos = [...encabezado, ...filas, ...resumen];
  const ws = XLSX.utils.aoa_to_sheet(datos);
  ws['!cols'] = [{ wch:5 },{ wch:20 },{ wch:20 },{ wch:14 },{ wch:16 },{ wch:12 },{ wch:14 },{ wch:12 },{ wch:10 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inasistencias');
  XLSX.writeFile(wb, `inasistencias_${mencion.replace(/\s/g,'_')}_${anoLabel.replace(/\s/g,'_')}.xlsx`);
}

/* ─── ESTADÍSTICAS ─── */
async function cargarEstadisticas(){
  const mencion = document.getElementById('stat-mencion').value;
  const el      = document.getElementById('stat-content');
  const btnExp  = document.getElementById('btn-export-estadisticas');
  el.innerHTML='<div class="spinner"><i class="ti ti-loader-2"></i> Cargando…</div>';
  const data = await get(`/estadisticas/${encodeURIComponent(mencion)}`);
  _estadisticasData = { mencion, data: (!data || esError(data)) ? [] : data };
  if(btnExp) btnExp.style.display='none';
  if(esError(data)){
    el.innerHTML = htmlError(data, { 404:'No se encontraron estadísticas para esta mención' });
    return;
  }
  if(!data||data.length===0){ el.innerHTML=htmlVacio('ti-chart-off','No hay datos para esta mención'); return; }
  if(btnExp && puedeExportar()) btnExp.style.display='';
  const totalClases = data[0]?.total_clases||0;
  const pctProm = totalClases>0 ? Math.round(data.reduce((s,e)=>s+(e.totales_p/totalClases*100),0)/data.length) : 0;
  const mc = MENCION_COLORS[mencion]||{color:'#009EF7',dim:'rgba(0,158,247,.12)'};

  el.innerHTML=`
    <div class="metric-grid" style="margin-bottom:20px">
      <div class="metric">
        <div class="metric-icon" style="background:${mc.dim};color:${mc.color}"><i class="ti ti-users"></i></div>
        <div class="metric-label">Estudiantes</div>
        <div class="metric-val">${data.length}</div>
        <div class="metric-sub">en esta mención</div>
      </div>
      <div class="metric">
        <div class="metric-icon" style="background:var(--sky-dim);color:var(--sky)"><i class="ti ti-book"></i></div>
        <div class="metric-label">Clases Dictadas</div>
        <div class="metric-val">${totalClases}</div>
        <div class="metric-sub">hasta la fecha</div>
      </div>
      <div class="metric">
        <div class="metric-icon" style="background:var(--green-dim);color:var(--green)"><i class="ti ti-trending-up"></i></div>
        <div class="metric-label">Asistencia Promedio</div>
        <div class="metric-val" style="color:${pctProm<75?'var(--red)':'var(--green)'}">${pctProm}%</div>
        <div class="metric-sub">del grupo</div>
      </div>
    </div>

    <div class="card">
      <div class="section-title"><i class="ti ti-list-details"></i>Rendimiento individual</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Estudiante</th><th>Presentes</th><th>Inasistentes</th><th>Retirados</th><th>% Asistencia</th></tr></thead>
          <tbody>${data.map(e=>{
            const pct=totalClases>0?Math.round(e.totales_p/totalClases*100):0;
            const barColor=pct<75?'var(--red)':'var(--sky)';
            return `<tr>
              <td style="color:var(--text4);font-family:var(--mono)">${e.nro_lista||'—'}</td>
              <td style="font-weight:700">${nombreLink({...e, mencion}, `${e.nombre} ${e.apellido}`)}</td>
              <td><span style="color:var(--green);font-weight:800;font-size:16px">${e.totales_p}</span></td>
              <td><span style="color:var(--red);font-weight:800;font-size:16px">${e.totales_a}</span></td>
              <td><span style="color:var(--amber);font-weight:800;font-size:16px">${e.totales_r}</span></td>
              <td style="min-width:130px">
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-weight:900;font-size:16px;color:${pct<75?'var(--red)':'var(--green)'};min-width:40px">${pct}%</span>
                  <div class="progress-bg" style="flex:1"><div class="progress-fill" style="width:${pct}%;background:${barColor}"></div></div>
                </div>
              </td>
            </tr>`;
          }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function exportarEstadisticasExcel() {
  const { mencion, data } = _estadisticasData;
  if (!data || data.length === 0) return;
  const hoy = new Date().toLocaleDateString('es-ES', { day:'2-digit', month:'2-digit', year:'numeric' });
  const totalClases = data[0]?.total_clases || 0;

  const encabezado = [
    ['Institución:', 'E.T. J.R.G.S'],
    ['Mención:', mencion],
    ['Total de clases dictadas:', totalClases],
    ['Exportado:', hoy],
    [],
    ['#', 'Nombre', 'Apellido', 'Cédula', 'Año', 'Presentes', 'Inasistentes', 'Retirados', '% Asistencia'],
  ];

  const filas = data.map((e, i) => {
    const pct = totalClases > 0 ? Math.round((e.totales_p / totalClases) * 100) : 0;
    return [
      e.nro_lista || i + 1,
      e.nombre || '',
      e.apellido || '',
      e.cedula || '',
      ANO_LABEL[Number(e.ano)] || (e.ano || '—'),
      e.totales_p || 0,
      e.totales_i || 0,
      e.totales_r || 0,
      pct + '%',
    ];
  });

  const pctProm = totalClases > 0
    ? Math.round(data.reduce((s, e) => s + (e.totales_p / totalClases * 100), 0) / data.length)
    : 0;
  const resumen = [
    [],
    ['', 'RESUMEN'],
    ['', 'Estudiantes:', data.length],
    ['', 'Clases dictadas:', totalClases],
    ['', '% Asistencia promedio:', pctProm + '%'],
  ];

  const datos = [...encabezado, ...filas, ...resumen];
  const ws = XLSX.utils.aoa_to_sheet(datos);
  ws['!cols'] = [{ wch:5 },{ wch:20 },{ wch:20 },{ wch:14 },{ wch:12 },{ wch:12 },{ wch:14 },{ wch:12 },{ wch:14 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Estadísticas');
  XLSX.writeFile(wb, `estadisticas_${mencion.replace(/\s/g,'_')}.xlsx`);
}

/* ─── DOCENTES ─── */
async function cargarDocentes(){
  const hoy = new Date();
  document.getElementById('doc-fecha-hoy').textContent =
    fmtFecha(hoy);
  const [docList, hoyData] = await Promise.all([
    get('/admin/docentes'), get('/asistencia-docentes/hoy')
  ]);

  const docEl = document.getElementById('doc-tabla');
  if(esError(docList)){ docEl.innerHTML = htmlError(docList, { 404:'No se encontraron docentes registrados' }); }
  else if(!docList||docList.length===0){ docEl.innerHTML=htmlVacio('ti-users','Sin datos de docentes'); }
  else{
    docEl.innerHTML=`<table>
      <thead><tr><th>Docente</th><th>Materia</th><th>Rol</th></tr></thead>
      <tbody>${docList.map(d=>`<tr>
        <td><div class="flex-row">
          <div class="avatar">${(d.nombre||'?')[0].toUpperCase()}</div>
          <span style="font-weight:700">${d.nombre} ${d.apellido||''}</span>
        </div></td>
        <td style="font-size:13px;color:var(--text3)">${d.materia||'—'}</td>
        <td><span class="pill ${d.rol==='admin'?'pill-sky':'pill-gray'}">${d.rol}</span></td>
      </tr>`).join('')}
      </tbody></table>`;
  }

  const hoyEl = document.getElementById('doc-hoy-tabla');
  if(esError(hoyData)){ hoyEl.innerHTML = htmlError(hoyData, { 404:'No hay registros de asistencia para hoy' }); }
  else if(!hoyData||hoyData.length===0){ hoyEl.innerHTML=htmlVacio('ti-calendar-x','No hay registros para hoy'); }
  else{
    const mapaDoc = {};
    if(docList) docList.forEach(d=>{ mapaDoc[d.id]=d; });
    hoyEl.innerHTML=`<table>
      <thead><tr><th>Docente</th><th>Estado</th><th>Bloque</th><th>Observaciones</th></tr></thead>
      <tbody>${hoyData.map(a=>{
        const d=mapaDoc[a.docente_id]||{};
        const bloqueLabel = a.bloque_clase ? (BLOQUES_DOC.find(b=>b.id===a.bloque_clase)?.label || 'Clase '+a.bloque_clase) : '—';
        return `<tr>
          <td style="font-weight:700">${d.nombre||'ID '+a.docente_id} ${d.apellido||''}</td>
          <td>${pill(a.estado)}</td>
          <td style="font-size:13px;color:var(--text3)">${bloqueLabel}</td>
          <td style="font-size:12px;color:var(--text3)">${a.observaciones||'—'}</td>
        </tr>`;
      }).join('')}
      </tbody></table>`;
  }
}

async function cargarHistorialDocentes(){
  const desde = document.getElementById('doc-desde').value;
  const hasta = document.getElementById('doc-hasta').value;
  const el    = document.getElementById('doc-hist-tabla');
  el.innerHTML='<div class="spinner"><i class="ti ti-loader-2"></i> Cargando…</div>';
  let url='/asistencia-docentes/historial';
  const p=[];
  if(desde) p.push(`desde=${desde}`);
  if(hasta) p.push(`hasta=${hasta}`);
  if(p.length) url+='?'+p.join('&');
  const data = await get(url);
  if(esError(data)){ el.innerHTML = htmlError(data, { 404:'No se encontraron registros para el período indicado' }); return; }
  if(!data||data.length===0){ el.innerHTML=htmlVacio('ti-calendar-off','No hay registros'); return; }
  el.innerHTML=`<table>
    <thead><tr><th>Fecha</th><th>Docente</th><th>Materia</th><th>Estado</th><th>Observaciones</th></tr></thead>
    <tbody>${data.map(r=>`<tr>
      <td style="font-family:var(--mono);font-size:13px;color:var(--text3)">${fmtFecha(r.fecha)}</td>
      <td style="font-weight:700">${r.nombre} ${r.apellido}</td>
      <td style="font-size:13px;color:var(--text3)">${r.materia||'—'}</td>
      <td>${pill(r.estado)}</td>
      <td style="font-size:12px;color:var(--text3)">${r.observaciones||'—'}</td>
    </tr>`).join('')}
    </tbody></table>`;
}

/* ─── DOCENTES: TABS ─── */
const BLOQUES_DOC = [
  { id:1, label:'1ra Clase', horas:'12:45 – 2:05'  },
  { id:2, label:'2da Clase', horas:'2:05 – 3:25'   },
  { id:3, label:'3ra Clase', horas:'3:35 – 4:55'   },
  { id:4, label:'4ta Clase', horas:'4:55 – 6:15'   },
];

/* Estado de registros en memoria: { [docente_id]: { estado, bloque_clase, observaciones } } */
let _docRegistros = {};
let _docList = [];

function docTab(tab) {
  /* Mostrar/ocultar paneles */
  document.getElementById('doc-panel-registro').style.display  = tab==='registro'  ? '' : 'none';
  document.getElementById('doc-panel-personal').style.display  = tab==='personal'  ? '' : 'none';
  document.getElementById('doc-panel-historial').style.display = tab==='historial' ? '' : 'none';

  /* Resaltar botón activo */
  ['registro','personal','historial'].forEach(t => {
    const btn = document.getElementById('doc-tab-'+t);
    if (!btn || btn.style.display === 'none') return;
    btn.className = t === tab ? 'btn btn-primary' : 'btn';
  });

  /* Cargar datos del panel si aún no se cargaron */
  if (tab === 'registro' && document.getElementById('doc-reg-lista').children.length === 0) {
    cargarRegistroDocentes();
  }
  if (tab === 'personal') {
    /* Recargar siempre al entrar a Personal para tener datos frescos */
    cargarDocentes();
  }
}

function _docActualizarResumen() {
  const vals = Object.values(_docRegistros);
  document.getElementById('drr-presentes').textContent = vals.filter(r=>r.estado==='Presente').length;
  document.getElementById('drr-ausentes').textContent  = vals.filter(r=>r.estado==='Ausente').length;
  document.getElementById('drr-tardanza').textContent  = vals.filter(r=>r.estado==='Tardanza').length;
  document.getElementById('drr-sinmarcar').textContent = _docList.length - vals.filter(r=>r.estado).length;
}

function _docSetEstado(docenteId, estado) {
  if (!_docRegistros[docenteId]) _docRegistros[docenteId] = { estado:null, bloque_clase:null, observaciones:'' };
  _docRegistros[docenteId].estado = estado;

  /* Actualizar estilos de la card */
  const card = document.getElementById('drcard-'+docenteId);
  if (card) {
    card.className = 'doc-reg-card' + (estado ? ' estado-'+estado : '');
  }
  /* Actualizar botones estado */
  ['Presente','Ausente','Tardanza'].forEach(e => {
    const btn = document.getElementById('drbtn-'+docenteId+'-'+e);
    if (btn) btn.className = 'doc-reg-btn' + (e===estado ? ' active-'+e : '');
  });
  _docActualizarResumen();
}

function _docSetBloque(docenteId, bloqueId) {
  if (!_docRegistros[docenteId]) _docRegistros[docenteId] = { estado:null, bloque_clase:null, observaciones:'' };
  const actual = _docRegistros[docenteId].bloque_clase;
  const nuevo  = actual === bloqueId ? null : bloqueId;
  _docRegistros[docenteId].bloque_clase = nuevo;

  BLOQUES_DOC.forEach(b => {
    const btn = document.getElementById('drbloque-'+docenteId+'-'+b.id);
    if (btn) btn.className = 'bloque-btn' + (b.id===nuevo ? ' active' : '');
  });
}

function _docSetObs(docenteId, texto) {
  if (!_docRegistros[docenteId]) _docRegistros[docenteId] = { estado:null, bloque_clase:null, observaciones:'' };
  _docRegistros[docenteId].observaciones = texto;
}

async function _docGuardar(docenteId) {
  const reg = _docRegistros[docenteId];
  if (!reg?.estado) { mostrarToast('Selecciona el estado del docente primero', 'red'); return; }

  const btn = document.getElementById('drsave-'+docenteId);
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Guardando…';

  try {
    const res = await fetch(API + '/asistencia-docentes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docente_id:    docenteId,
        estado:        reg.estado,
        bloque_clase:  reg.bloque_clase ?? null,
        observaciones: reg.observaciones || null,
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Error');
    mostrarToast('Asistencia guardada ✓', 'green');
    /* Actualizar también el panel "Personal" si está cargado */
    if (document.getElementById('doc-panel-personal').style.display !== 'none') {
      cargarDocentes();
    }
  } catch(e) {
    mostrarToast('Error al guardar: ' + e.message, 'red');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-device-floppy"></i> Guardar';
  }
}

async function cargarRegistroDocentes() {
  const el = document.getElementById('doc-reg-lista');
  el.innerHTML = '<div class="spinner"><i class="ti ti-loader-2"></i> Cargando docentes…</div>';

  const [docList, hoyData] = await Promise.all([
    get('/admin/docentes'), get('/asistencia-docentes/hoy')
  ]);

  if (!docList || docList.length === 0) {
    el.innerHTML = '<div class="empty"><i class="ti ti-users"></i>No hay docentes registrados</div>';
    return;
  }

  _docList = docList;

  /* Precargar registros de hoy si ya existen */
  _docRegistros = {};
  if (hoyData) {
    hoyData.forEach(r => {
      _docRegistros[r.docente_id] = {
        estado:        r.estado,
        bloque_clase:  r.bloque_clase ?? null,
        observaciones: r.observaciones || '',
      };
    });
  }

  /* Renderizar cards */
  el.innerHTML = docList.map(d => {
    const reg    = _docRegistros[d.id] || {};
    const estado = reg.estado || null;
    const bloque = reg.bloque_clase || null;

    return `
    <div class="doc-reg-card${estado ? ' estado-'+estado : ''}" id="drcard-${d.id}">
      <div class="doc-reg-top">
        <div class="doc-reg-avatar">${(d.nombre||'?')[0].toUpperCase()}${(d.apellido||'')[0]?.toUpperCase()||''}</div>
        <div style="flex:1">
          <div class="doc-reg-nombre">${d.nombre} ${d.apellido||''}</div>
          <div class="doc-reg-materia">${d.materia||'Sin materia asignada'} · <span class="pill ${d.rol==='admin'?'pill-sky':'pill-gray'}" style="font-size:10px;padding:2px 8px">${d.rol}</span></div>
        </div>
        ${estado ? `<span class="pill ${estado==='Presente'?'pill-green':estado==='Ausente'?'pill-red':'pill-amber'}">${estado}</span>` : ''}
      </div>

      <div style="font-size:10px;font-weight:800;color:var(--text4);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:8px">Estado de asistencia</div>
      <div class="doc-reg-btns">
        ${['Presente','Ausente','Tardanza'].map(e => `
          <button class="doc-reg-btn${e===estado?' active-'+e:''}" id="drbtn-${d.id}-${e}"
            onclick="_docSetEstado(${d.id},'${e}')">
            <i class="ti ${e==='Presente'?'ti-circle-check':e==='Ausente'?'ti-circle-x':'ti-clock'}"></i> ${e}
          </button>`).join('')}
      </div>

      <div style="font-size:10px;font-weight:800;color:var(--text4);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:8px">Pase de salida — dio clases hasta</div>
      <div class="bloque-grid">
        ${BLOQUES_DOC.map(b => `
          <button class="bloque-btn${b.id===bloque?' active':''}" id="drbloque-${d.id}-${b.id}"
            onclick="_docSetBloque(${d.id},${b.id})">
            <div>${b.label}</div>
            <div class="bloque-btn-horas">${b.horas}</div>
          </button>`).join('')}
      </div>

      <textarea class="doc-reg-obs" id="drobs-${d.id}" placeholder="Observaciones (opcional)…"
        oninput="_docSetObs(${d.id},this.value)">${reg.observaciones||''}</textarea>

      <button class="doc-reg-save" id="drsave-${d.id}" onclick="_docGuardar(${d.id})">
        <i class="ti ti-device-floppy"></i> Guardar
      </button>
    </div>`;
  }).join('');

  _docActualizarResumen();
}

/* ─── MATRÍCULA ADMIN ─── */
const MAT = { ano: '1', mencion: 'Telemática', cedula_tipo: 'V', rep_cedula_tipo: 'V' };

function cedulaTipo(quien, tipo) {
  if (quien === 'est') {
    MAT.cedula_tipo = tipo;
    document.getElementById('m-cedula-tipo-V').classList.toggle('active', tipo === 'V');
    document.getElementById('m-cedula-tipo-E').classList.toggle('active', tipo === 'E');
    document.getElementById('m-cedula-prefix').textContent = tipo + '-';
  } else {
    MAT.rep_cedula_tipo = tipo;
    document.getElementById('m-rep-cedula-tipo-V').classList.toggle('active', tipo === 'V');
    document.getElementById('m-rep-cedula-tipo-E').classList.toggle('active', tipo === 'E');
    document.getElementById('m-rep-cedula-prefix').textContent = tipo + '-';
  }
}

const MAT_CAMPOS = [
  { id:'m-nombre',      label:'Nombre del estudiante'      },
  { id:'m-apellido',    label:'Apellido del estudiante'    },
  { id:'m-cedula',      label:'Cédula del estudiante'      },
  { id:'m-rep_nombre',  label:'Nombre del representante'   },
  { id:'m-rep_apellido',label:'Apellido del representante' },
  { id:'m-rep_cedula',  label:'Cédula del representante'   },
  { id:'m-rep_telefono',label:'Teléfono del representante' },
  { id:'m-direccion',   label:'Dirección de vivienda'      },
];

function matToggle(btn, group) {
  document.querySelectorAll(`[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  MAT[group] = btn.dataset.val;
}

/* ══════════════════════════════════════════════
   REGLAS DE INPUT: solo letras / solo números /
   mayúsculas automáticas / sin caracteres especiales
   ══════════════════════════════════════════════ */
function soloLetras(e) {
  const permitidos = /^[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ\s\-]$/;
  if (!permitidos.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'].includes(e.key)) {
    e.preventDefault();
  }
}
function soloNumeros(e) {
  const nav = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
  if (nav.includes(e.key)) return;
  if (!/^\d$/.test(e.key)) { e.preventDefault(); return; }
  /* Bloquear 0 como primer dígito */
  const el = e.target;
  const val = el.value;
  const cursor = el.selectionStart;
  if (e.key === '0' && (val === '' || (cursor === 0 && el.selectionEnd === val.length) || cursor === 0)) {
    e.preventDefault();
  }
}
function soloTelefono(e) {
  if (!/^[\d\-]$/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'].includes(e.key)) {
    e.preventDefault();
  }
}
function autoMayus(el) {
  el.addEventListener('input', () => {
    const pos = el.selectionStart;
    el.value = el.value.toUpperCase();
    el.setSelectionRange(pos, pos);
  });
}
function attachInputRules() {
  ['m-nombre','m-apellido','m-rep_nombre','m-rep_apellido'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('keydown', soloLetras);
    autoMayus(el);
  });
  ['m-cedula','m-rep_cedula'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('keydown', soloNumeros);
  });
  const tel = document.getElementById('m-rep_telefono');
  if (tel) tel.addEventListener('keydown', soloTelefono);
  ['edit-nombre','edit-apellido'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('keydown', soloLetras);
    autoMayus(el);
  });
  const editCed = document.getElementById('edit-cedula');
  if (editCed) editCed.addEventListener('keydown', soloNumeros);
}
attachInputRules();

function matBanner(type, msg) {
  const b  = document.getElementById('mat-banner');
  const ic = document.getElementById('mat-banner-icon');
  const sp = document.getElementById('mat-banner-msg');
  b.className = 'mat-banner ' + type;
  b.style.display = 'flex';
  ic.className = type === 'ok' ? 'ti ti-circle-check' : 'ti ti-alert-circle';
  sp.textContent = msg;
}
function matHideBanner() {
  document.getElementById('mat-banner').style.display = 'none';
}

function matClearErrors() {
  MAT_CAMPOS.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('mat-err');
    const er = document.getElementById('me-' + id.slice(2));
    if (er) er.textContent = '';
  });
  matHideBanner();
}

function validarRangoCedula(val, campo, tipo) {
  /* Solo aplica el rango a venezolanos (V); extranjeros pueden tener otros rangos */
  if (tipo !== 'V') return null;
  const n = parseInt(val, 10);
  if (n < 1000000)  return 'La cédula venezolana debe ser mayor a 1.000.000';
  if (n > 80000000) return 'La cédula venezolana no puede superar 80.000.000';
  return null;
}
function matValidate() {
  const errs = {};
  MAT_CAMPOS.forEach(({ id, label }) => {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) errs[id] = label + ' es obligatorio';
  });
  const cedVal = document.getElementById('m-cedula').value.trim();
  const rcdVal = document.getElementById('m-rep_cedula').value.trim();
  if (cedVal && !/^\d+$/.test(cedVal)) {
    errs['m-cedula'] = 'La cédula debe contener solo números';
  } else if (cedVal && cedVal.length !== 8) {
    errs['m-cedula'] = 'La cédula debe tener exactamente 8 dígitos';
  } else if (cedVal) {
    const rango = validarRangoCedula(cedVal, 'm-cedula', MAT.cedula_tipo);
    if (rango) errs['m-cedula'] = rango;
  }
  if (rcdVal && !/^\d+$/.test(rcdVal)) {
    errs['m-rep_cedula'] = 'La cédula debe contener solo números';
  } else if (rcdVal && rcdVal.length !== 8) {
    errs['m-rep_cedula'] = 'La cédula debe tener exactamente 8 dígitos';
  } else if (rcdVal) {
    const rango = validarRangoCedula(rcdVal, 'm-rep_cedula', MAT.rep_cedula_tipo);
    if (rango) errs['m-rep_cedula'] = rango;
  }
  /* Validar duplicado: solo si mismo tipo de cédula */
  if (cedVal && rcdVal && !errs['m-cedula'] && !errs['m-rep_cedula']) {
    if (MAT.cedula_tipo === MAT.rep_cedula_tipo && cedVal === rcdVal) {
      errs['m-rep_cedula'] = `La cédula del representante (${MAT.rep_cedula_tipo}-${rcdVal}) no puede ser igual a la del estudiante`;
    }
  }
  return errs;
}

async function matGuardar() {
  matClearErrors();
  const errs = matValidate();
  if (Object.keys(errs).length > 0) {
    Object.entries(errs).forEach(([id, msg]) => {
      const el = document.getElementById(id);
      if (el) el.classList.add('mat-err');
      const er = document.getElementById('me-' + id.slice(2));
      if (er) er.innerHTML = '<i class="ti ti-alert-circle" style="font-size:12px"></i>' + msg;
    });
    const n = Object.keys(errs).length;
    matBanner('err', n === 1 ? '1 campo obligatorio sin completar' : n + ' campos obligatorios sin completar');
    return;
  }
  const gradoMap = {'1':'1er Año','2':'2do Año','3':'3er Año','4':'4to Año','5':'5to Año','6':'6to Año'};
  const body = {
    nombre:           document.getElementById('m-nombre').value.trim().toUpperCase(),
    apellido:         document.getElementById('m-apellido').value.trim().toUpperCase(),
    cedula:           MAT.cedula_tipo + '-' + document.getElementById('m-cedula').value.trim(),
    mencion:          MAT.mencion,
    ano:              gradoMap[MAT.ano] || MAT.ano,
    rep_nombre:       document.getElementById('m-rep_nombre').value.trim().toUpperCase(),
    rep_apellido:     document.getElementById('m-rep_apellido').value.trim().toUpperCase(),
    rep_cedula:         document.getElementById('m-rep_cedula').value.trim(),
    rep_nacionalidad_id: MAT.rep_cedula_tipo === 'V' ? 1 : 2,
    rep_telefono:       document.getElementById('m-rep_telefono').value.trim(),
    direccion:        document.getElementById('m-direccion').value.trim(),
  };
  try {
    const res  = await fetch(API + '/admin/estudiantes', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      matBanner('ok', '✅ Estudiante guardado — N° ' + data.nro_lista);
      MAT_CAMPOS.forEach(({ id }) => { const el = document.getElementById(id); if (el) el.value = ''; });
      // reset toggles
      document.querySelectorAll('[data-group="ano"]').forEach(b => b.classList.toggle('active', b.dataset.val==='1'));
      document.querySelectorAll('[data-group="mencion"]').forEach(b => b.classList.toggle('active', b.dataset.val==='Telemática'));
      MAT.ano = '1'; MAT.mencion = 'Telemática';
      // reset cedula tipos
      cedulaTipo('est', 'V'); cedulaTipo('rep', 'V');
      todosEstudiantes = []; // forzar recarga si se navega a Estudiantes
    } else {
      matBanner('err', data.error || 'No se pudo guardar el estudiante.');
    }
  } catch(e) {
    matBanner('err', 'Error de red al guardar el estudiante.');
  }
}

async function matBuscar() {
  const cedula = document.getElementById('m-baja-ced').value.trim();
  const el = document.getElementById('m-baja-result');
  if (!cedula) { el.innerHTML='<div class="warn-box"><i class="ti ti-alert-circle"></i>Ingresa una cédula.</div>'; return; }
  el.innerHTML = '<div class="spinner"><i class="ti ti-loader-2"></i> Buscando…</div>';
  const data = await get('/admin/estudiantes/' + cedula);
  if (!data || !data.success) {
    el.innerHTML = '<div class="warn-box"><i class="ti ti-user-x"></i>Esa cédula no existe en el sistema.</div>';
    document.getElementById('m-baja-ced').value = '';
    return;
  }
  const e = data.estudiante;
  const cedulaFmt = /^[VE]-/i.test(cedula) ? cedula : 'V-' + cedula;
  const repNombre   = (e.rep_nombre && e.rep_apellido) ? `${e.rep_nombre} ${e.rep_apellido}` : '—';
  const repCedula   = e.rep_cedula   || '—';
  const repTelefono = e.rep_telefono || '—';
  const repDir      = e.direccion    || '—';

  el.innerHTML = `
    <div class="card" style="border-color:rgba(239,68,68,.4);margin-bottom:0;padding:20px">

      <!-- Encabezado advertencia -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--border)">
        <div style="width:38px;height:38px;border-radius:10px;background:rgba(239,68,68,.12);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <i class="ti ti-alert-triangle" style="color:#EF4444;font-size:18px"></i>
        </div>
        <div>
          <div style="font-size:14px;font-weight:900;color:#EF4444">¿Eliminar este estudiante?</div>
          <div style="font-size:12px;color:var(--text3);margin-top:2px">Verifica que sea el correcto antes de continuar</div>
        </div>
      </div>

      <!-- Datos del estudiante -->
      <div style="margin-bottom:14px">
        <div style="font-size:10px;font-weight:800;color:var(--text4);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">
          <i class="ti ti-user" style="margin-right:4px"></i>Estudiante
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:var(--surface2);border-radius:8px;padding:10px">
            <div style="font-size:10px;color:var(--text4);font-weight:600;margin-bottom:3px">Nombre completo</div>
            <div style="font-size:14px;font-weight:800;color:var(--text)">${e.nombre} ${e.apellido}</div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:10px">
            <div style="font-size:10px;color:var(--text4);font-weight:600;margin-bottom:3px">Cédula</div>
            <div style="font-size:14px;font-weight:800;color:var(--text)">${cedulaFmt}</div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:10px">
            <div style="font-size:10px;color:var(--text4);font-weight:600;margin-bottom:3px">Año</div>
            <div style="font-size:14px;font-weight:800;color:var(--text)">${e.ano}°</div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:10px">
            <div style="font-size:10px;color:var(--text4);font-weight:600;margin-bottom:3px">Mención</div>
            <div style="font-size:14px;font-weight:800;color:var(--text)">${e.mencion}</div>
          </div>
        </div>
      </div>

      <!-- Datos del representante -->
      <div style="margin-bottom:18px">
        <div style="font-size:10px;font-weight:800;color:var(--text4);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">
          <i class="ti ti-users" style="margin-right:4px"></i>Representante
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:var(--surface2);border-radius:8px;padding:10px;grid-column:span 2">
            <div style="font-size:10px;color:var(--text4);font-weight:600;margin-bottom:3px">Nombre completo</div>
            <div style="font-size:14px;font-weight:800;color:var(--text)">${repNombre}</div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:10px">
            <div style="font-size:10px;color:var(--text4);font-weight:600;margin-bottom:3px">Cédula</div>
            <div style="font-size:14px;font-weight:700;color:var(--text)">${repCedula}</div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:10px">
            <div style="font-size:10px;color:var(--text4);font-weight:600;margin-bottom:3px">Teléfono</div>
            <div style="font-size:14px;font-weight:700;color:var(--text)">${repTelefono}</div>
          </div>
          <div style="background:var(--surface2);border-radius:8px;padding:10px;grid-column:span 2">
            <div style="font-size:10px;color:var(--text4);font-weight:600;margin-bottom:3px">Dirección</div>
            <div style="font-size:13px;font-weight:600;color:var(--text)">${repDir}</div>
          </div>
        </div>
      </div>

      <!-- Advertencia + botones -->
      <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#EF4444;font-weight:600">
        <i class="ti ti-alert-triangle" style="margin-right:6px"></i>Esta acción eliminará al estudiante y sus registros de asistencia. No se puede deshacer fácilmente.
      </div>

      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button class="btn" onclick="document.getElementById('m-baja-result').innerHTML='';document.getElementById('m-baja-ced').value=''">
          <i class="ti ti-x"></i> Cancelar
        </button>
        <button class="btn btn-danger" style="font-weight:800" onclick="matEliminar('${cedula}')">
          <i class="ti ti-trash"></i> SÍ, ELIMINAR
        </button>
      </div>

    </div>`;
}

async function matEliminar(cedula) {
  const el = document.getElementById('m-baja-result');
  el.innerHTML = '<div class="spinner"><i class="ti ti-loader-2"></i> Eliminando…</div>';
  try {
    const res  = await fetch(API + '/admin/estudiantes/' + cedula, { method:'DELETE' });
    const data = await res.json();
    if (data.success) {
      el.innerHTML = `<div class="api-dot" style="background:var(--green-dim);border-color:rgba(16,185,129,.25)">
        <i class="ti ti-circle-check" style="color:var(--green);font-size:18px"></i>
        <span style="color:var(--green);font-size:13px;font-weight:700">Estudiante eliminado correctamente.</span>
      </div>`;
      document.getElementById('m-baja-ced').value = '';
      todosEstudiantes = [];
    } else {
      el.innerHTML = '<div class="warn-box"><i class="ti ti-x"></i>No se pudo eliminar.</div>';
    }
  } catch {
    el.innerHTML = '<div class="warn-box"><i class="ti ti-wifi-off"></i>Error de red.</div>';
  }
}

/* ─── BOOT ─── */
// cargarResumen se llama al iniciar sesión via navTo('resumen')
</script>

<script>
/* ════════════════════════════════════════════════════════
   AUTH SYSTEM — Login, roles, sesión
   Roles: admin | docente | invitado
   ════════════════════════════════════════════════════════ */

let SESSION = null;

const ROL_LABEL = {
  admin:          'Administrador',
  docente_manana: 'Docente — Mañana',
  docente_tarde:  'Docente — Tarde',
  docente:        'Docente',
  invitado:       'Invitado'
};
const ROL_COLOR = {
  admin:          'role-admin',
  docente_manana: 'role-docente',
  docente_tarde:  'role-docente',
  docente:        'role-docente',
  invitado:       'role-invitado'
};

/* toggle-pass: movido al final del script */

/* ── Enter en campos ── */
['login-user','login-pass'].forEach(id =>
  document.getElementById(id).addEventListener('keydown', e => { if (e.key==='Enter') intentarLogin(); })
);

/* ── Limpiar errores al escribir ── */
document.getElementById('login-user').addEventListener('input', () => limpiarError('usuario'));
document.getElementById('login-pass').addEventListener('input', () => limpiarError('contrasena'));

function limpiarError(campo) {
  document.getElementById('err-'+campo).classList.remove('show');
  document.getElementById('err-general').classList.remove('show');
}
function mostrarError(campo, msg) {
  document.getElementById('err-'+campo+'-msg').textContent = msg;
  document.getElementById('err-'+campo).classList.add('show');
}

/* ── Login ── */
async function intentarLogin() {
  const usuario    = document.getElementById('login-user').value.trim();
  const contrasena = document.getElementById('login-pass').value;
  ['usuario','contrasena','general'].forEach(c => document.getElementById('err-'+c).classList.remove('show'));

  if (!usuario)    { mostrarError('usuario', 'Ingresa tu usuario');     return; }
  if (!contrasena) { mostrarError('contrasena', 'Ingresa tu contraseña'); return; }

  const btn = document.getElementById('btn-ingresar');
  btn.classList.add('loading'); btn.disabled = true;

  try {
    const res  = await fetch(API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, contrasena })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    if (!data.success) {
      const campo = data.campo || 'general';
      mostrarError(campo, data.message || 'Credenciales incorrectas');
      return;
    }

    iniciarSesion({
      nombre: data.nombre, apellido: data.apellido,
      rol: data.rol, usuario: data.usuario,
      menciones_permitidas: data.menciones_permitidas,
      materia: data.materia,
    });
  } catch (err) {
    mostrarError('general', 'No se pudo conectar con el servidor. Verifica la red.');
  } finally {
    btn.classList.remove('loading'); btn.disabled = false;
  }
}

/* ── Invitado ── */
function entrarComoInvitado() {
  iniciarSesion({ nombre:'Invitado', apellido:'', rol:'invitado', usuario:'invitado' });
}

/* ── Iniciar sesión ── */
function iniciarSesion(sesion) {
  SESSION = sesion;
  /* Persistir sesión (no invitado) */
  if (sesion.rol !== 'invitado') {
    try { localStorage.setItem('et_jrgs_session', JSON.stringify(sesion)); } catch(_) {}
  }
  const { nombre, apellido, rol } = sesion;
  const nombreCompleto = apellido ? nombre+' '+apellido : nombre;

  document.getElementById('login-overlay').classList.add('hidden');
  document.getElementById('main-layout').style.display = 'flex';

  /* Chip topbar */
  const chip = document.getElementById('user-chip');
  chip.style.display = 'flex';
  const av = document.getElementById('chip-avatar');
  av.textContent = nombre[0].toUpperCase();
  av.className = 'user-chip-avatar ' + (ROL_COLOR[rol]||'role-invitado');
  document.getElementById('chip-name').textContent = nombreCompleto;
  document.getElementById('chip-role').textContent = ROL_LABEL[rol]||rol;

  /* Sidebar */
  document.getElementById('sidebar-nombre').textContent = nombreCompleto;
  document.getElementById('sidebar-rol').textContent    = ROL_LABEL[rol]||rol;

  /* Topbar label */
  const labels = { admin:'Panel Administrativo', docente_manana:'Portal Docente — Turno Mañana', docente_tarde:'Portal Docente — Turno Tarde', invitado:'Modo Lectura' };
  document.getElementById('topbar-label').textContent = labels[rol] || (rol.startsWith('docente')?'Portal Docente':'Panel');

  /* Permisos por rol */
  aplicarPermisosPorRol(rol, sesion);

  /* Iniciar en resumen */
  navTo('resumen');
}

/* ════════════════════════════════════════════════
   SISTEMA DE PERMISOS POR ROL
   ────────────────────────────────────────────────
   admin          → todo + matrícula + docentes completo
   docente_manana → años 1-3 ∩ menciones_permitidas
   docente_tarde  → años 4-5 ∩ menciones_permitidas
   invitado       → solo lectura (resumen, historial, estudiantes, estadísticas)
                    sin matrícula, sin docentes
   ════════════════════════════════════════════════ */
function aplicarPermisosPorRol(rol, sesion) {
  const mpStr = String(sesion.menciones_permitidas ?? '').trim();
  const tieneMenciones = mpStr !== '' && mpStr !== 'null' && mpStr !== 'undefined';

  /* ── 1. Años permitidos según rol ── */
  const ANOS_POR_ROL = {
    admin:          ['1','2','3','4','5'],
    docente_manana: ['1','2','3'],
    docente_tarde:  ['4','5'],
    invitado:       ['1','2','3','4','5'],
  };
  const anosBase = ANOS_POR_ROL[rol] || ['1','2','3','4','5'];

  /* Si tiene menciones_permitidas, intersectar años */
  let anosPermitidos = anosBase;
  if (tieneMenciones) {
    const anosEnMenciones = [...new Set(
      mpStr.split(',').map(p => p.trim().split(':')[1]).filter(Boolean)
    )];
    anosPermitidos = anosBase.filter(a => anosEnMenciones.includes(a));
  }

  /* ── 2. Menciones permitidas ── */
  const todasMenciones = ['Telemática','Turismo','Administración','Contabilidad'];
  let mencionesPermitidas = todasMenciones;
  if (tieneMenciones) {
    mencionesPermitidas = [...new Set(
      mpStr.split(',').map(p => p.trim().split(':')[0]).filter(Boolean)
    )].filter(m => todasMenciones.includes(m));
    if (mencionesPermitidas.length === 0) mencionesPermitidas = todasMenciones;
  }

  /* ── 3. Aplicar restricciones a selects de AÑO ── */
  ['hist-ano','est-ano','ina-ano'].forEach(selId => {
    const sel = document.getElementById(selId);
    if (!sel) return;
    Array.from(sel.options).forEach(opt => {
      if (!opt.value) return; // "Todos" siempre visible
      opt.hidden = !anosPermitidos.includes(opt.value);
    });
    /* Si el valor actual quedó fuera, resetear */
    if (sel.value && !anosPermitidos.includes(sel.value)) sel.value = '';
  });

  /* ── 4. Aplicar restricciones a selects de MENCIÓN ── */
  ['hist-mencion','est-mencion','ina-mencion','stat-mencion'].forEach(selId => {
    const sel = document.getElementById(selId);
    if (!sel) return;
    Array.from(sel.options).forEach(opt => {
      if (!opt.value) return;
      opt.hidden = !mencionesPermitidas.includes(opt.value);
    });
    if (sel.value && !mencionesPermitidas.includes(sel.value)) sel.value = '';
    /* En estadísticas, setear la primera mención permitida */
    if (selId === 'stat-mencion' && !sel.value) {
      const primerOpt = Array.from(sel.options).find(o => !o.hidden && o.value);
      if (primerOpt) sel.value = primerOpt.value;
    }
  });

  /* ── 5. Sidebar — mostrar/ocultar secciones ── */
  const esAdmin    = rol === 'admin';
  const esDocente  = rol === 'docente_manana' || rol === 'docente_tarde';
  const esInvitado = rol === 'invitado';

  /* Matrícula: solo admin */
  document.getElementById('nav-sec-admin').style.display  = esAdmin ? '' : 'none';
  document.getElementById('nav-matricula').style.display  = esAdmin ? '' : 'none';

  /* Tab "Registrar asistencia" en la página de docentes: solo admin */
  const tabReg = document.getElementById('doc-tab-registro');
  if (tabReg) tabReg.style.display = esAdmin ? '' : 'none';

  /* Docentes: admin y docentes pueden ver, invitado no */
  const navDocentes = document.getElementById('nav-docentes');
  if (esInvitado) {
    navDocentes.classList.add('nav-locked');
  } else {
    navDocentes.classList.remove('nav-locked');
  }

  /* ── 6. Banners informativos en páginas ── */
  const turno = rol === 'docente_manana' ? 'Turno Mañana (1°–3°)'
              : rol === 'docente_tarde'   ? 'Turno Tarde (4°–5°)'
              : null;

  /* Banner para historial/estudiantes/inasistencias si es docente con filtro */
  const bannerDocenteHtml = turno ? `
    <div class="rol-banner rol-banner-info">
      <i class="ti ti-info-circle"></i>
      Mostrando datos de tu turno: <strong>${turno}</strong>${tieneMenciones ? ` · Menciones: <strong>${mencionesPermitidas.join(', ')}</strong>` : ''}
    </div>` : '';

  ['historial','estudiantes','estadisticas'].forEach(pid => {
    const el = document.getElementById(pid+'-rol-banner');
    if (el) el.innerHTML = bannerDocenteHtml;
  });

  /* ── 7. Página de matrícula — bloquear si no es admin ── */
  if (!esAdmin) {
    const pageMat = document.getElementById('page-matricula');
    pageMat.innerHTML = `
      <div class="page-locked">
        <i class="ti ti-lock"></i>
        <h3>Acceso restringido</h3>
        <p>La sección de matrícula es exclusiva para administradores del sistema.</p>
      </div>`;
  }

  /* ── 8. Página de docentes — bloquear solo para invitado ── */
  if (esInvitado) {
    const pageDoc = document.getElementById('page-docentes');
    pageDoc.innerHTML = `
      <div class="page-locked">
        <i class="ti ti-lock"></i>
        <h3>Acceso restringido</h3>
        <p>Debes iniciar sesión con una cuenta docente o de administrador para ver el personal.</p>
      </div>`;
  }

  /* ── 9. Resumen — si es invitado, ocultar métricas sensibles ── */
  if (esInvitado) {
    /* Se maneja al renderizar cargarResumen con flag SESSION.rol */
  }

  /* ── 10. Bloquear acciones de escritura para no-admin ── */
  /* Botones de matrícula ya bloqueados por el HTML replacement arriba */
  /* Para invitado: marcar todas las páginas de escritura como solo-lectura */
  if (esInvitado) {
    ['btn-ingresar'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }
}

/* ── Cerrar sesión ── */
function cerrarSesion(e) {
  if (e) e.stopPropagation();
  SESSION = null;
  try { localStorage.removeItem('et_jrgs_session'); } catch(_) {}
  document.getElementById('user-menu').classList.remove('open');
  document.getElementById('main-layout').style.display = 'none';
  document.getElementById('login-overlay').classList.remove('hidden');
  document.getElementById('login-user').value  = '';
  document.getElementById('login-pass').value  = '';
  ['usuario','contrasena','general'].forEach(c => document.getElementById('err-'+c).classList.remove('show'));
  /* Re-trigger animation */
  const card = document.querySelector('.login-card');
  card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';
}

/* ── Menú usuario ── */
/* ════════════════════════════════════════════════
   EDITAR ESTUDIANTE (solo admin)
   ════════════════════════════════════════════════ */
let _catalogosCache = null;
let _editEstudianteId = null;

async function abrirEditarEstudiante() {
  const modal = document.getElementById('modal-estudiante');
  const datos = modal._datosActuales;
  if (!datos) return;
  _editEstudianteId = datos.id;

  /* Cargar catálogos si no están en cache */
  if (!_catalogosCache) {
    _catalogosCache = await (await fetch(API + '/catalogos')).json();
  }
  const { menciones, grados } = _catalogosCache;

  /* Poblar selects */
  const selMencion = document.getElementById('edit-mencion_id');
  const selGrado   = document.getElementById('edit-grado_id');
  selMencion.innerHTML = '<option value="">— seleccionar —</option>' +
    menciones.map(m => `<option value="${m.id}" ${m.nombre===datos.mencion?'selected':''}>${m.nombre}</option>`).join('');
  selGrado.innerHTML = '<option value="">— seleccionar —</option>' +
    grados.map(g => `<option value="${g.id}" ${String(g.id)===String(datos.grado_id||datos.ano)?'selected':''}>${g.nombre}° Año</option>`).join('');

  /* Rellenar campos */
  document.getElementById('edit-nombre').value   = (datos.nombre   || '').toUpperCase();
  document.getElementById('edit-apellido').value = (datos.apellido || '').toUpperCase();
  document.getElementById('edit-cedula').value   = datos.cedula   || '';
  document.getElementById('edit-seccion').value  = datos.seccion  || '';
  document.getElementById('edit-genero_id').value = datos.genero === 'Masculino' ? '1' : datos.genero === 'Femenino' ? '2' : '';
  document.getElementById('edit-error').style.display = 'none';

  /* Mostrar modal editar */
  const me = document.getElementById('modal-editar');
  me.style.display = 'flex';
}

function cerrarEditarEstudiante() {
  document.getElementById('modal-editar').style.display = 'none';
}

async function guardarEdicionEstudiante() {
  const btn = document.getElementById('btn-guardar-edit');
  const errEl = document.getElementById('edit-error');
  errEl.style.display = 'none';

  const nombre     = document.getElementById('edit-nombre').value.trim().toUpperCase();
  const apellido   = document.getElementById('edit-apellido').value.trim().toUpperCase();
  const cedula     = document.getElementById('edit-cedula').value.trim();
  const mencion_id = document.getElementById('edit-mencion_id').value;
  const grado_id   = document.getElementById('edit-grado_id').value;
  const seccion    = document.getElementById('edit-seccion').value.trim();
  const genero_id  = document.getElementById('edit-genero_id').value;

  if (!nombre || !apellido || !cedula) {
    errEl.textContent = 'Nombre, apellido y cédula son obligatorios.';
    errEl.style.display = 'block'; return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Guardando…';

  try {
    const res = await fetch(API + '/admin/estudiantes/' + _editEstudianteId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, cedula, mencion_id, grado_id, seccion, genero_id, representante_id: null })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Error al guardar');

    cerrarEditarEstudiante();
    _cerrarModal();
    /* Recargar lista de estudiantes */
    todosEstudiantes = [];
    if (document.getElementById('page-estudiantes').classList.contains('active')) cargarEstudiantes();
    /* Mostrar confirmación */
    mostrarToast('Estudiante actualizado correctamente', 'green');
  } catch(err) {
    errEl.textContent = 'Error: ' + err.message;
    errEl.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-device-floppy"></i> Guardar cambios';
  }
}

function mostrarToast(msg, color='sky') {
  let toast = document.getElementById('toast-global');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-global';
    toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);z-index:9999;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:700;pointer-events:none;transition:opacity .3s';
    document.body.appendChild(toast);
  }
  const colors = { green:'background:#10B981;color:#fff', sky:'background:var(--accent);color:var(--accent-dark)', red:'background:#FF3B30;color:#fff' };
  toast.style.cssText += ';' + (colors[color]||colors.sky);
  toast.style.opacity = '1';
  toast.textContent = msg;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

function toggleUserMenu() {
  document.getElementById('user-menu').classList.toggle('open');
}
document.addEventListener('click', e => {
  const chip = document.getElementById('user-chip');
  if (chip && !chip.contains(e.target))
    document.getElementById('user-menu').classList.remove('open');
});

/* ── Toggle contraseña visible (registrado al final para garantizar que el DOM está listo) ── */
(function() {
  const btn = document.getElementById('toggle-pass');
  const inp = document.getElementById('login-pass');
  const ico = document.getElementById('eye-icon');
  if (btn && inp && ico) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (inp.type === 'password') {
        inp.type = 'text';
        ico.className = 'ti ti-eye-off';
      } else {
        inp.type = 'password';
        ico.className = 'ti ti-eye';
      }
      inp.focus();
    });
  }
})();

/* ── Restaurar sesión guardada (al final, cuando iniciarSesion ya está definida) ── */
(function restaurarSesion() {
  try {
    const raw = localStorage.getItem('et_jrgs_session');
    if (!raw) return;
    const sesion = JSON.parse(raw);
    if (sesion && sesion.rol && sesion.nombre) {
      iniciarSesion(sesion);
    }
  } catch(_) {
    localStorage.removeItem('et_jrgs_session');
  }
})();
</script>
</body>
</html>
