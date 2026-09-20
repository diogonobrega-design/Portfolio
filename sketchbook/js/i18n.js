/* =====================================================================
   Folio — PT / EN toggle
   English strings are read from the DOM; only Portuguese is listed here.
   Elements opt in with data-i18n="key" (textContent) or
   data-i18n-html="key" (innerHTML). Choice is saved in localStorage.
   ===================================================================== */

(function () {
  "use strict";

  var toggle = document.querySelector("[data-lang-toggle]");
  if (!toggle) return;

  /* --- European Portuguese, keyed by the data-i18n* value --- */
  var PT = {
    "skip": "Ir para o trabalho",

    "nav.work": "Trabalho",
    "nav.about": "Sobre",
    "nav.contact": "Contacto",
    "cta.sayhi": "Fala comigo",

    "hero.tag": "Portfólio <span>’26</span>",
    "hero.l1": "Olá,",
    "hero.l2": "Sou o <em>Diogo</em>",
    "hero.do": "Faço",
    "hero.words": "Design Gráfico,3D,Motion,Ilustração,Branding,e muito mais",
    "hero.lede": "Designer multidisciplinar em Portugal — design gráfico, 3D, motion, ilustração, branding e mais. Crio marcas e imagens que ficam.",
    "hero.seework": "Ver o trabalho <span aria-hidden=\"true\">→</span>",
    "hero.drag": "arrasta-nos! →",

    "brands.note": "A trabalhar com algumas das maiores marcas do mundo",

    "work.title": "Trabalho <em>selecionado</em>",
    "filter.all": "Tudo",
    "filter.3d": "3D",
    "filter.illustration": "Ilustração",
    "filter.graphic": "Design gráfico",
    "cap.eo": "Campanha — 3D · Digital · Impressão",
    "cap.2": "Ilustração — Editorial",
    "cap.3": "Design gráfico — Identidade",
    "cap.5": "Ilustração — Produto",
    "cap.6": "Design gráfico — 32pp",
    "cap.8": "Ilustração — Capa de livro",
    "cap.9": "Design gráfico — Packaging",
    "board.hint": "psst — podes arrastar isto por aí ✋",
    "gallery.empty": "Ainda nada por aqui — experimenta outro filtro.",

    "feat.kicker": "Projeto em destaque",
    "feat.meta": "Kuikma × Decathlon — bola oficial do ATP 250 · 3D · Digital · Impressão",
    "feat.lede": "Campanha completa para a All Court Pro da Kuikma — a bola oficial do Millennium Estoril Open. Uma plataforma de marca, «Feita para deixar marca», levada ao 3D de retalho, ao e-commerce e CRM, à PLV em loja e ao outdoor.",

    "proj.skip": "Ir para o projeto",
    "proj.back": "← Voltar ao trabalho",
    "proj.cap.poster": "Key visual da campanha",
    "proj.lbl.instore": "Para loja",
    "proj.lbl.outstore": "Para exterior",
    "proj.cap.stand": "Stand de retalho — 3D e construído",
    "proj.cap.display": "Display central — 3D e construído",
    "proj.note.signed": "assinada por fãs de ténis ✎",
    "proj.cap.activation": "Ativação — Millennium Estoril Open",
    "proj.cap.store": "Em loja",
    "proj.cap.merch": "Merch",
    "proj.cap.outdoor": "Outdoor",
    "proj.cap.web": "decathlon.pt",
    "proj.cap.pos": "Balcão de ponto de venda",
    "proj.cap.box": "Caixa da bola",
    "proj.video.label": "Filme da campanha",
    "proj.video.cta": "Ver no LinkedIn ↗",

    "about.title": "Um pouco <em>sobre mim</em>",
    "about.lead": "Sou o Diogo — trabalho em 3D, ilustração e design gráfico, e gosto dos projetos que deixam os três aparecer ao mesmo tempo.",
    "about.p1": "Uma identidade que precisa de uma imagem 3D de destaque. Uma série de ilustração com um sistema tipográfico a sério por trás. Já trabalhei com estúdios e clientes independentes em campanhas, editorial, packaging e IP próprio.",
    "about.p2": "Craft, comunicação clara, prazos sem drama.",
    "about.make": "Faço",
    "about.use": "Uso",
    "chip.graphic": "Design Gráfico",
    "chip.motion": "Motion",
    "chip.illustration": "Ilustração",
    "chip.pos": "Ponto de Venda",
    "chip.events": "Eventos",
    "chip.print3d": "Impressão 3D",
    "chip.social": "Redes Sociais",
    "chip.more": "e muito mais",
    "chip.ai": "Ferramentas de IA",

    "contact.title": "Contacto",
    "contact.shout": "Vamos fazer<br><em>algo bom</em>",
    "contact.lede": "Disponível para freelance, aberto a full-time. O email é o mais rápido.",
    "check.1": "Identidade de marca & sistemas",
    "check.2": "Editorial & impressão",
    "check.3": "Cenas 3D & campanhas",
    "check.4": "Ilustração de personagens",

    "footer.copy": "Diogo Nóbrega. Feito de raiz.",
    "footer.top": "Voltar ao topo ↑"
  };

  /* --- capture the original English straight from the DOM --- */
  var EN = {};
  var textEls = document.querySelectorAll("[data-i18n]");
  var htmlEls = document.querySelectorAll("[data-i18n-html]");
  var cycler = document.querySelector(".cycler");

  textEls.forEach(function (el) { EN[el.getAttribute("data-i18n")] = el.textContent.trim().replace(/\s+/g, " "); });
  htmlEls.forEach(function (el) { EN[el.getAttribute("data-i18n-html")] = el.innerHTML.trim(); });
  if (cycler) EN["hero.words"] = cycler.dataset.words;

  function apply(lang) {
    var dict = lang === "pt" ? PT : EN;
    document.documentElement.lang = lang;

    textEls.forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var v = dict[key];
      if (v == null) v = EN[key];
      if (v != null) el.textContent = v;
    });
    htmlEls.forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var v = dict[key];
      if (v == null) v = EN[key];
      if (v != null) el.innerHTML = v;
    });

    if (cycler) {
      var w = (lang === "pt" ? PT["hero.words"] : EN["hero.words"]) || EN["hero.words"];
      cycler.dataset.words = w;                       // main.js re-reads this each tick
      cycler.textContent = w.split(",")[0].trim();
    }

    var label = toggle.querySelector("[data-lang-label]");
    if (label) label.textContent = lang === "en" ? "PT" : "EN";
    toggle.setAttribute("aria-label", lang === "en" ? "Mudar para português" : "Switch to English");

    try { localStorage.setItem("folio-lang", lang); } catch (e) {}
  }

  var current;
  try { current = localStorage.getItem("folio-lang"); } catch (e) {}
  if (current !== "en" && current !== "pt") {
    current = (navigator.language || "en").toLowerCase().indexOf("pt") === 0 ? "pt" : "en";
  }
  apply(current);

  toggle.addEventListener("click", function () {
    current = current === "en" ? "pt" : "en";
    apply(current);
  });
})();
