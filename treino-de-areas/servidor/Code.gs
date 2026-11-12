/**
 * Áreas do Tio Danilo — servidor do progresso dos alunos e do quadro de honra.
 *
 * Projeto do Apps Script ligado à planilha "Treino de Áreas — alunos" (ID abaixo), publicado como
 * "App da Web": Executar como = Eu; Quem pode acessar = Qualquer pessoa.
 * Cada aluno ocupa uma linha da aba "jogadores". Para tirar alguém do quadro, apague a linha.
 */
const PLANILHA_ID = '1JouLmAOOjlO9q5mhMLXhL27FFCfLMStuOi104A01rtU';
const ABA = 'jogadores';
const COLS = ['id', 'nome', 'publico', 'ano', 'senha', 'xp', 'moedas', 'nivel', 'm2', 'avatar', 'dados', 'atualizado', 'curtidas', 'presentes'];
const ABA_CURTIDAS = 'curtidas';
const PRESENTE = 5; // moedas para quem curte e para quem é curtido
const C = Object.fromEntries(COLS.map((c, i) => [c, i]));

function aba_() {
  const ss = SpreadsheetApp.openById(PLANILHA_ID);
  let s = ss.getSheetByName(ABA);
  if (!s) {
    s = ss.insertSheet(ABA);
    s.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight('bold');
    s.setFrozenRows(1);
  } else if (s.getLastColumn() < COLS.length) {
    s.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight('bold'); // planilha antiga: acrescenta as colunas novas
  }
  return s;
}

function preparar() { aba_(); abaCurtidas_(); }

function abaCurtidas_() {
  const ss = SpreadsheetApp.openById(PLANILHA_ID);
  let s = ss.getSheetByName(ABA_CURTIDAS);
  if (!s) {
    s = ss.insertSheet(ABA_CURTIDAS);
    s.getRange(1, 1, 1, 3).setValues([['dia', 'de', 'para']]).setFontWeight('bold');
    s.setFrozenRows(1);
  }
  return s;
}

// código público de visita: não revela o nome completo
function vid_(id) {
  return hash_(id, 'visita').replace(/[^A-Za-z0-9]/g, '').slice(0, 12);
}

function hoje_() {
  return Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd');
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function chave_(nome, ano) {
  return String(nome || '').trim().toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ') + '|' + Number(ano);
}

function publico_(nome) {
  const p = String(nome).trim().split(/\s+/).filter(Boolean);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  return p.length > 1 ? cap(p[0]) + ' ' + p[p.length - 1].charAt(0).toUpperCase() + '.' : cap(p[0] || '');
}

function hash_(id, senha) {
  const d = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, id + '#' + senha + '#tiodanilo');
  return Utilities.base64Encode(d);
}

function nivel_(xp) {
  let l = 1, a = 0, n = 60;
  while (xp >= a + n) { a += n; l++; n = 60 + (l - 1) * 35; }
  return l;
}

function m2_(perfil) {
  try {
    return (perfil.world.items || []).reduce((s, i) => s + (Number(i.w) || 0) * (Number(i.h) || 0), 0);
  } catch (e) { return 0; }
}

function linha_(s, id) {
  const n = s.getLastRow() - 1;
  if (n < 1) return 0;
  const v = s.getRange(2, 1, n, 1).getValues();
  for (let i = 0; i < v.length; i++) if (v[i][0] === id) return i + 2;
  return 0;
}

function valida_(b) {
  const nome = String(b.nome || '').trim();
  const ano = Number(b.ano);
  if (nome.length < 2 || nome.length > 24 || !/^[\p{L} '.-]+$/u.test(nome)) return 'nome';
  if (!(ano >= 4 && ano <= 9)) return 'ano';
  if (b.senha !== undefined && !/^[qctleh]{4}$/.test(String(b.senha))) return 'senha';
  return '';
}

function limpa_(p) {
  p = p && typeof p === 'object' ? p : {};
  p.xp = Math.max(0, Math.floor(Number(p.xp) || 0));
  p.coins = Math.max(0, Math.min(Math.floor(Number(p.coins) || 0), p.xp)); // nunca mais moedas do que já ganhou
  return p;
}

function grava_(s, row, id, b, perfil) {
  const vals = [
    id, String(b.nome).trim(), publico_(b.nome), Number(b.ano),
    row ? s.getRange(row, C.senha + 1).getValue() : hash_(id, b.senha),
    perfil.xp, perfil.coins, nivel_(perfil.xp), m2_(perfil),
    JSON.stringify({ eq: perfil.eq || {}, look: perfil.look || {} }),
    JSON.stringify(perfil).slice(0, 45000), new Date(),
    row ? Number(s.getRange(row, C.curtidas + 1).getValue()) || 0 : 0,
    row ? Number(s.getRange(row, C.presentes + 1).getValue()) || 0 : 0
  ];
  if (row) s.getRange(row, 1, 1, COLS.length).setValues([vals]);
  else s.appendRow(vals);
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.acao === 'existe') {
    const er = valida_(p);
    if (er) return json_({ ok: false, erro: er });
    return json_({ ok: true, existe: !!linha_(aba_(), chave_(p.nome, p.ano)) });
  }
  if (p.acao === 'ranking') return json_(ranking_(p.ano));
  if (p.acao === 'visitar') return json_(visitar_(String(p.vid || '')));
  return json_({ ok: true, app: 'Áreas do Tio Danilo' });
}

function doPost(e) {
  let b;
  try { b = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, erro: 'json' }); }
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    if (b.acao === 'entrar') return json_(entrar_(b));
    if (b.acao === 'salvar') return json_(salvar_(b));
    if (b.acao === 'curtir') return json_(curtir_(b));
    return json_({ ok: false, erro: 'acao' });
  } finally {
    lock.releaseLock();
  }
}

function entrar_(b) {
  const er = valida_(b);
  if (er) return { ok: false, erro: er };
  const s = aba_();
  const id = chave_(b.nome, b.ano);
  const row = linha_(s, id);
  if (row) {
    const r = s.getRange(row, 1, 1, COLS.length).getValues()[0];
    if (r[C.senha] !== hash_(id, b.senha)) return { ok: false, erro: 'senha' };
    let perfil = {};
    try { perfil = JSON.parse(r[C.dados] || '{}'); } catch (e) {}
    return { ok: true, novo: false, perfil: perfil };
  }
  const perfil = limpa_(b.perfil);
  if (perfil.xp > 20000) { perfil.xp = 0; perfil.coins = 0; }
  grava_(s, 0, id, b, perfil);
  CacheService.getScriptCache().removeAll(['rk_all', 'rk_' + Number(b.ano)]);
  return { ok: true, novo: true, perfil: perfil };
}

function salvar_(b) {
  const er = valida_(b);
  if (er) return { ok: false, erro: er };
  const s = aba_();
  const id = chave_(b.nome, b.ano);
  const row = linha_(s, id);
  if (!row) return { ok: false, erro: 'naoexiste' };
  const r = s.getRange(row, 1, 1, COLS.length).getValues()[0];
  if (r[C.senha] !== hash_(id, b.senha)) return { ok: false, erro: 'senha' };
  const novo = limpa_(b.perfil);
  const xpAntes = Number(r[C.xp]) || 0;
  if (novo.xp < xpAntes) { // aba antiga tentando salvar: devolve o progresso mais novo
    let atual = {};
    try { atual = JSON.parse(r[C.dados] || '{}'); } catch (e) {}
    return { ok: false, erro: 'antigo', perfil: atual };
  }
  if (novo.xp - xpAntes > 3000) return { ok: false, erro: 'suspeito' };
  grava_(s, row, id, b, novo);
  const presentes = Number(s.getRange(row, C.presentes + 1).getValue()) || 0;
  if (presentes > 0) s.getRange(row, C.presentes + 1).setValue(0); // o jogo do aluno soma as moedas dos presentes
  return { ok: true, presentes: presentes };
}

function ranking_(ano) {
  const key = 'rk_' + (ano ? Number(ano) : 'all');
  const cache = CacheService.getScriptCache();
  const hit = cache.get(key);
  if (hit) return JSON.parse(hit);
  const s = aba_();
  const n = s.getLastRow() - 1;
  let rows = [];
  if (n > 0) {
    rows = s.getRange(2, 1, n, COLS.length).getValues()
      .filter(r => r[C.id] && (!ano || Number(r[C.ano]) === Number(ano)))
      .sort((a, b) => (Number(b[C.xp]) || 0) - (Number(a[C.xp]) || 0))
      .slice(0, 50)
      .map(r => {
        let av = {};
        try { av = JSON.parse(r[C.avatar] || '{}'); } catch (e) {}
        return { publico: r[C.publico], ano: r[C.ano], xp: r[C.xp], moedas: r[C.moedas], nivel: r[C.nivel], m2: r[C.m2], avatar: av,
          vid: vid_(r[C.id]), curtidas: Number(r[C.curtidas]) || 0 };
      });
  }
  const o = { ok: true, rows: rows };
  cache.put(key, JSON.stringify(o), 30);
  return o;
}

function linhaVid_(s, vid) {
  const n = s.getLastRow() - 1;
  if (n < 1 || !/^[A-Za-z0-9]{12}$/.test(vid)) return 0;
  const v = s.getRange(2, 1, n, 1).getValues();
  for (let i = 0; i < v.length; i++) if (v[i][0] && vid_(v[i][0]) === vid) return i + 2;
  return 0;
}

// visita: só o que aparece na cidade (sem senha, sem nome completo)
function visitar_(vid) {
  const s = aba_();
  const row = linhaVid_(s, vid);
  if (!row) return { ok: false, erro: 'naoexiste' };
  const r = s.getRange(row, 1, 1, COLS.length).getValues()[0];
  let p = {};
  try { p = JSON.parse(r[C.dados] || '{}'); } catch (e) {}
  const w = p.world || {};
  return {
    ok: true, vid: vid, publico: r[C.publico], ano: r[C.ano], xp: Number(r[C.xp]) || 0, nivel: r[C.nivel], m2: r[C.m2],
    curtidas: Number(r[C.curtidas]) || 0, eq: p.eq || {}, look: p.look || {},
    world: { w: w.w, h: w.h, items: (w.items || []).slice(0, 300), probs: (w.probs || []).slice(0, 20) }
  };
}

// curtir a cidade de um colega: 1 vez por dia para cada cidade; os dois ganham moedas
function curtir_(b) {
  const er = valida_(b);
  if (er) return { ok: false, erro: er };
  const s = aba_();
  const id = chave_(b.nome, b.ano);
  const row = linha_(s, id);
  if (!row) return { ok: false, erro: 'naoexiste' };
  if (s.getRange(row, C.senha + 1).getValue() !== hash_(id, b.senha)) return { ok: false, erro: 'senha' };
  const vid = String(b.vid || '');
  if (vid === vid_(id)) return { ok: false, erro: 'propria' };
  const alvo = linhaVid_(s, vid);
  if (!alvo) return { ok: false, erro: 'naoexiste' };
  const c = abaCurtidas_();
  const dia = hoje_();
  const n = c.getLastRow() - 1;
  if (n > 0) {
    const ini = Math.max(2, c.getLastRow() - 3000);
    const v = c.getRange(ini, 1, c.getLastRow() - ini + 1, 3).getValues();
    for (let i = 0; i < v.length; i++) {
      const d = v[i][0] instanceof Date ? Utilities.formatDate(v[i][0], 'America/Sao_Paulo', 'yyyy-MM-dd') : String(v[i][0]);
      if (d === dia && v[i][1] === vid_(id) && v[i][2] === vid) return { ok: false, erro: 'hoje' };
    }
  }
  c.appendRow(["'" + dia, vid_(id), vid]);
  const cur = Number(s.getRange(alvo, C.curtidas + 1).getValue()) || 0;
  const pre = Number(s.getRange(alvo, C.presentes + 1).getValue()) || 0;
  s.getRange(alvo, C.curtidas + 1, 1, 2).setValues([[cur + 1, pre + 1]]);
  CacheService.getScriptCache().removeAll(['rk_all', 'rk_' + Number(s.getRange(alvo, C.ano + 1).getValue())]);
  return { ok: true, moedas: PRESENTE, curtidas: cur + 1 };
}
