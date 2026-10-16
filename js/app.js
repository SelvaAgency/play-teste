(function () {
  "use strict";

  // TODO: apontar para a URL do diagnóstico completo (27 questões) quando estiver no ar.
  const FULL_TEST_URL = "https://scaffoldplay.com.br/";

  const QUESTIONS = window.QUESTIONS;
  const LETTERS = ["A", "B", "C", "D"];

  // Faixas de leitura da prévia (9 questões, nível intermediário).
  // Não diagnosticam nível: só orientam a chamada para o completo.
  const TIERS = [
    {
      min: 8,
      title: "Base sólida para avançar",
      lead: "Você acertou quase todas as situações de nível intermediário. O diagnóstico completo diz em quais módulos você já está no avançado e pode seguir em ritmo rápido."
    },
    {
      min: 5,
      title: "Boa base, com lacunas claras",
      lead: "Em boa parte das competências você já decide bem. As que ficaram em laranja no mapa abaixo são onde a trilha vai render mais para você."
    },
    {
      min: 0,
      title: "Seu ponto de partida está mapeado",
      lead: "Várias competências ainda pedem atenção, e é para isso que a trilha existe. O mapa abaixo mostra por onde começar, e a revisão explica cada resposta."
    }
  ];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = s => String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  const state = {
    index: 0,
    answers: new Array(QUESTIONS.length).fill(null),
    committed: new Array(QUESTIONS.length).fill(null) // peso aplicado no radar ao avançar
  };

  // ---------- Radar ----------
  // Cada alternativa tem um `peso` (questions.js) que define até onde o eixo da
  // competência avança. Clicar numa alternativa só dá o "pump"; o peso entra
  // no gráfico ao avançar para a próxima questão. Assim não dá para clicar nas
  // quatro e descobrir qual empurra mais. Para mover o eixo já no clique,
  // basta trocar RADAR_ON_CLICK para true.
  const RADAR_ON_CLICK = false;
  const SHORT = {
    C1: "Fundamentos", C2: "Priorização", C3: "Valor e KPIs",
    C4: "Abordagem", C5: "Prototipagem", C6: "Guardrails",
    C7: "Operação", C8: "Governança", C9: "Liderança"
  };
  const R_EMPTY = 0.12;
  const W = 340, H = 300, CX = W / 2, CY = H / 2 + 4, RAD = 96;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const angle = i => -Math.PI / 2 + (i * 2 * Math.PI) / QUESTIONS.length;
  const pt = (i, v) => [CX + Math.cos(angle(i)) * RAD * v, CY + Math.sin(angle(i)) * RAD * v];
  const poly = vals => vals.map((v, i) => pt(i, v).map(n => n.toFixed(1)).join(",")).join(" ");

  function buildRadar(el) {
    const rings = [0.25, 0.5, 0.75, 1].map(f =>
      `<polygon class="r-grid" points="${poly(QUESTIONS.map(() => f))}"/>`).join("");
    const axes = QUESTIONS.map((q, i) => {
      const [x, y] = pt(i, 1);
      return `<line class="r-axis" data-i="${i}" x1="${CX}" y1="${CY}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
    }).join("");
    const labels = QUESTIONS.map((q, i) => {
      const [x, y] = pt(i, 1.2);
      const anchor = Math.abs(x - CX) < 8 ? "middle" : (x > CX ? "start" : "end");
      return `<text class="r-label" data-i="${i}" x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anchor}">${SHORT[q.cod]}</text>`;
    }).join("");
    const points = QUESTIONS.map((q, i) =>
      `<g><title></title><circle class="r-pt" data-i="${i}" r="3.5"/><circle class="r-hit" data-i="${i}" r="14"/></g>`).join("");
    // Sem rótulos (radar compacto) o viewBox recorta só o círculo
    // Grupo externo respira (CSS); o interno recebe o pump (Web Animations).
    // As transformações se somam, então o pump nunca corta a respiração.
    const pad = RAD * 0.22;
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" data-full="0 0 ${W} ${H}" data-tight="${CX - RAD - pad} ${CY - RAD - pad} ${2 * (RAD + pad)} ${2 * (RAD + pad)}">${rings}${axes}<g class="r-breath" style="--cx:${CX}px;--cy:${CY}px"><g class="r-pump"><polygon class="r-shape"/>${points}</g></g>${labels}</svg>`;
    el._vals = QUESTIONS.map(() => R_EMPTY);
    drawRadar(el, el._vals);
  }

  function drawRadar(el, vals) {
    $(".r-shape", el).setAttribute("points", poly(vals));
    $$(".r-pt", el).forEach((r, i) => {
      const [x, y] = pt(i, vals[i]);
      r.setAttribute("cx", x.toFixed(1));
      r.setAttribute("cy", y.toFixed(1));
    });
    $$(".r-hit", el).forEach((c, i) => {
      const [x, y] = pt(i, vals[i]);
      c.setAttribute("cx", x.toFixed(1));
      c.setAttribute("cy", y.toFixed(1));
    });
  }

  function updateRadar(el, target, { current = -1, status = [], label = "" } = {}) {
    $$(".r-axis, .r-label", el).forEach(n => n.classList.toggle("is-current", +n.dataset.i === current));
    $$(".r-pt", el).forEach((r, i) => r.classList.toggle("is-miss", status[i] === "miss"));
    $$("title", el).forEach((t, i) => {
      const st = status[i] === "ok" ? "sinal positivo" : status[i] === "miss" ? "ponto de atenção"
        : status[i] === "answered" ? "respondida" : "ainda não respondida";
      t.textContent = `${QUESTIONS[i].competencia}: ${st}`;
    });
    $("svg", el).setAttribute("aria-label", label);

    const from = el._vals.slice();
    el._vals = target.slice();
    cancelAnimationFrame(el._raf);
    if (reduceMotion) return drawRadar(el, target);
    const t0 = performance.now(), dur = 650;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      drawRadar(el, from.map((f, i) => f + (target[i] - f) * e));
      if (k < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  function pumpRadar(el, strength = 1) {
    if (reduceMotion) return;
    const g = $(".r-pump", el);
    const up = 1 + 0.13 * strength;
    g.getAnimations().forEach(a => a.cancel());
    g.animate([
      { transform: "scale(1)" },
      { transform: `scale(${up})`, offset: 0.28 },
      { transform: "scale(0.975)", offset: 0.62 },
      { transform: "scale(1.008)", offset: 0.82 },
      { transform: "scale(1)" }
    ], { duration: 820, easing: "cubic-bezier(.25,.8,.3,1)" });
    el.classList.add("is-pumping");
    clearTimeout(el._pumpT);
    el._pumpT = setTimeout(() => el.classList.remove("is-pumping"), 380);
  }

  function fitRadar() {
    const svg = $("svg", radarQuiz);
    const compact = window.matchMedia("(max-width: 1079px)").matches;
    svg.setAttribute("viewBox", compact ? svg.dataset.tight : svg.dataset.full);
  }

  const radarQuiz = $('[data-radar="quiz"]');
  const radarResult = $('[data-radar="result"]');
  buildRadar(radarQuiz);
  buildRadar(radarResult);
  fitRadar();
  window.matchMedia("(max-width: 1079px)").addEventListener("change", fitRadar);

  // "M2" vira "Módulo 2"
  const moduloNome = q => `Módulo ${q.modulo.replace(/^M/, "")}`;

  const pesoDe = (i, letter) => QUESTIONS[i].alternativas[letter].peso;

  function refreshQuizRadar() {
    const vals = state.committed.map(c => c == null ? R_EMPTY : c);
    if (RADAR_ON_CLICK && state.answers[state.index]) vals[state.index] = pesoDe(state.index, state.answers[state.index]);
    const answered = vals.filter(v => v !== R_EMPTY).length;
    updateRadar(radarQuiz, vals, {
      current: state.index,
      status: vals.map(v => v !== R_EMPTY ? "answered" : ""),
      label: `Radar: ${answered} de ${QUESTIONS.length} competências respondidas`
    });
    $(".radar-card__count").textContent = `${answered} de ${QUESTIONS.length}`;
  }

  // ---------- Telas ----------
  function show(name) {
    $$("[data-screen]").forEach(s => { s.hidden = s.dataset.screen !== name; });
    window.scrollTo(0, 0);
  }

  // ---------- Quiz ----------
  const progress = $(".progress");
  progress.innerHTML = QUESTIONS.map(() => "<span></span>").join("");

  function renderQuestion() {
    const q = QUESTIONS[state.index];
    const chosen = state.answers[state.index];

    $$(".progress span").forEach((el, i) => {
      el.classList.toggle("is-done", i < state.index);
      el.classList.toggle("is-current", i === state.index);
    });

    $(".quiz__count").textContent = `${state.index + 1} de ${QUESTIONS.length}`;
    $(".quiz__comp").textContent = `${moduloNome(q)} · ${q.competencia}`;
    $(".quiz__question").textContent = q.pergunta;

    $(".options").innerHTML =
      '<legend class="sr-only">Alternativas</legend>' +
      LETTERS.map(L => `
        <label class="option">
          <input type="radio" name="opt" value="${L}" ${chosen === L ? "checked" : ""}>
          <span class="option__letter">${L}</span>
          <span class="option__text">${esc(q.alternativas[L].texto)}</span>
        </label>`).join("");

    const prev = $('[data-action="prev"]');
    const next = $('[data-action="next"]');
    prev.style.visibility = state.index === 0 ? "hidden" : "visible";
    next.disabled = !chosen;
    next.textContent = state.index === QUESTIONS.length - 1 ? "Ver resultado" : "Próxima";

    $(".quiz__question").focus({ preventScroll: true });
    refreshQuizRadar();
  }

  function choose(letter) {
    state.answers[state.index] = letter;
    const input = $(`.options input[value="${letter}"]`);
    if (input) input.checked = true;
    $('[data-action="next"]').disabled = false;
    if (RADAR_ON_CLICK) refreshQuizRadar();
    pumpRadar(radarQuiz);
  }

  function next() {
    if (!state.answers[state.index]) return;
    state.committed[state.index] = pesoDe(state.index, state.answers[state.index]);
    if (state.index < QUESTIONS.length - 1) {
      state.index++;
      renderQuestion();
      pumpRadar(radarQuiz, 0.6);
      window.scrollTo(0, 0);
    } else {
      renderResult();
      show("result");
      setTimeout(() => pumpRadar(radarResult), 450);
    }
  }

  function prev() {
    if (state.index === 0) return;
    state.index--;
    renderQuestion();
  }

  // ---------- Resultado ----------
  function renderResult() {
    const results = QUESTIONS.map((q, i) => ({ q, chosen: state.answers[i], ok: state.answers[i] === q.correta }));
    const score = results.filter(r => r.ok).length;
    const tier = TIERS.find(t => score >= t.min);

    $(".score__num").textContent = score;
    $(".result-hero__title").textContent = tier.title;
    $(".result-hero__lead").textContent = tier.lead;

    radarResult._vals = QUESTIONS.map(() => R_EMPTY);
    updateRadar(radarResult, results.map((r, i) => pesoDe(i, r.chosen)), {
      status: results.map(r => r.ok ? "ok" : "miss"),
      label: `Radar: ${score} de ${QUESTIONS.length} competências com sinal positivo`
    });

    $(".map").innerHTML = results.map(({ q, ok }) => `
      <li class="map__item ${ok ? "is-ok" : "is-miss"}">
        <div class="map__top">
          <span class="map__mod">${moduloNome(q)}</span>
          <span class="badge ${ok ? "badge--ok" : "badge--miss"}">${ok ? "✓ Sinal positivo" : "Ponto de atenção"}</span>
        </div>
        <span class="map__name">${esc(q.competencia)}</span>
        <span class="map__note">${ok
          ? "O completo confirma se você já está no avançado."
          : "Vale percorrer este módulo com atenção."}</span>
      </li>`).join("");

    $(".review").innerHTML = results.map(({ q, chosen, ok }, i) => `
      <details class="rv ${ok ? "is-ok" : "is-miss"}" ${!ok ? "open" : ""}>
        <summary>
          <span class="rv__icon" aria-label="${ok ? "Acertou" : "Errou"}">${ok ? "✓" : "✕"}</span>
          <span class="rv__head">
            <span class="rv__comp">${i + 1}. ${moduloNome(q)} · ${esc(q.competencia)}</span>
            <span class="rv__q">${esc(q.pergunta)}</span>
          </span>
          <svg class="rv__chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </summary>
        <div class="rv__body">
          ${LETTERS.map(L => {
            const a = q.alternativas[L];
            const isCorrect = L === q.correta;
            const isChosen = L === chosen;
            const cls = isCorrect ? "is-correct" : (isChosen ? "is-chosen-wrong" : "");
            const tags = [
              isChosen ? '<span class="tag tag--chosen">Sua resposta</span>' : "",
              isCorrect ? '<span class="tag tag--correct">Correta</span>' : ""
            ].join("");
            const aula = !isCorrect && a.url
              ? `<p class="rv__alt-aula">Aula recomendada: <a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.aula)}</a></p>`
              : "";
            return `
              <div class="rv__alt ${cls}">
                <span class="rv__alt-letter">${L}</span>
                <span class="rv__alt-text">${esc(a.texto)}</span>
                ${tags ? `<span class="rv__alt-tags">${tags}</span>` : ""}
                <p class="rv__alt-fb">${esc(a.feedback)}</p>
                ${aula}
              </div>`;
          }).join("")}
        </div>
      </details>`).join("");
  }

  function restart() {
    state.index = 0;
    state.answers.fill(null);
    state.committed.fill(null);
    renderQuestion();
    show("quiz");
  }

  // ---------- Eventos ----------
  $$('[data-cta="full"]').forEach(a => { a.href = FULL_TEST_URL; });

  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === "start") { renderQuestion(); show("quiz"); }
    if (action === "next") next();
    if (action === "prev") prev();
    if (action === "restart") restart();
  });

  $(".options").addEventListener("change", e => {
    if (e.target.name === "opt") choose(e.target.value);
  });

  document.addEventListener("keydown", e => {
    if ($('[data-screen="quiz"]').hidden) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.toUpperCase();
    if (LETTERS.includes(key)) { choose(key); e.preventDefault(); }
    else if (e.key === "Enter" && !e.target.closest("button")) { next(); e.preventDefault(); }
  });
})();
