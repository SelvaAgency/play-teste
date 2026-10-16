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

  const pad = n => String(n).padStart(2, "0");
  const slug = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

  // Painel "console" do hero: lista as 9 competências com entrada escalonada
  $(".console__list").innerHTML = QUESTIONS.map((q, i) => `
    <li style="animation-delay:${120 + i * 90}ms">
      <span class="c-code">${q.cod}</span>
      <span class="c-name">${slug(q.competencia)}</span>
      <span class="c-status">[ -- ]</span>
    </li>`).join("");

  const state = { index: 0, answers: new Array(QUESTIONS.length).fill(null) };

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

    $(".quiz__count").textContent = `[ ${pad(state.index + 1)} / ${pad(QUESTIONS.length)} ]`;
    $(".quiz__comp").textContent = `${q.modulo} · ${q.competencia}`;
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
  }

  function choose(letter) {
    state.answers[state.index] = letter;
    const input = $(`.options input[value="${letter}"]`);
    if (input) input.checked = true;
    $('[data-action="next"]').disabled = false;
  }

  function next() {
    if (!state.answers[state.index]) return;
    if (state.index < QUESTIONS.length - 1) {
      state.index++;
      renderQuestion();
      window.scrollTo(0, 0);
    } else {
      renderResult();
      show("result");
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

    $(".map").innerHTML = results.map(({ q, ok }) => `
      <li class="map__item ${ok ? "is-ok" : "is-miss"}">
        <div class="map__top">
          <span class="map__mod">${q.modulo}</span>
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
            <span class="rv__comp">${i + 1}. ${q.modulo} · ${esc(q.competencia)}</span>
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
