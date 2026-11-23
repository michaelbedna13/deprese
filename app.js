(() => {
  "use strict";

  const G = window.GALLERY;
  const $ = (s) => document.querySelector(s);
  const scene = $("#scene");
  const viewport = $("#viewport");

  // Dvě 3D vrstvy: místnost (stěny, podlaha, strop) a předměty na stěnách.
  // Oddělení zabrání chybám v řazení 3D ploch v prohlížeči.
  const room = document.createElement("div");
  const wallItems = document.createElement("div");
  room.className = wallItems.className = "group";
  scene.append(room, wallItems);
  const groups = [room, wallItems];
  const setCamera = (t) => groups.forEach((g) => (g.style.transform = t));

  /* ---------- Rozměry (px v 3D prostoru; oko je v y = 0, y míří dolů) ---------- */
  const R = 1000;
  const CEIL = -950;
  const FLOOR = 560;
  const SEGMENTS = 40;
  const PITCH_MIN = -55;
  let PITCH_MAX = 70;          // přepočítá se podle zorného pole, aby se nedívalo „za záda“
  let LIGHT_PITCH = 46;        // od tohoto úhlu nahoru se díváš do světla
  const DOME_R = 430;          // poloměr otvoru v kopuli
  const PETALS = 13;           // počet dílů kopule

  /* ---------- Stav ---------- */
  let P = 700;
  let yaw = 180, pitch = 4, tYaw = 180, tPitch = 4;
  let travelled = 0, doorReady = false, moved = false;
  let away = false, started = false;
  const targets = [];          // na co se dá zamířit
  const petals = [];           // díly kopule {el, angle, open}
  const seen = new Set();      // otevřené plakáty
  let current = null;

  /* ---------- Pomocníci ---------- */
  function el(tag, cls, parent = wallItems) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    parent.appendChild(e);
    return e;
  }
  function size(e, w, h) {
    e.style.width = w + "px";
    e.style.height = h + "px";
    e.style.marginLeft = -w / 2 + "px";
    e.style.marginTop = -h / 2 + "px";
  }
  const standing = (e, a, r, y) =>
    (e.style.transform = `rotateY(${-a}deg) translateZ(${-r}px) translateY(${y}px)`);
  const flat = (e, y, up = true) =>
    (e.style.transform = `translateY(${y}px) rotateX(${up ? 90 : -90}deg)`);
  const angDiff = (a, b) => ((a - b) % 360 + 540) % 360 - 180;

  // Světelná skvrna na zdi + kužel shora pro předmět
  function addLight(angle, w, h, cy) {
    const pool = el("div", "pool", room);
    const ph = Math.min(h * 1.7, (FLOOR - cy) * 2 - 20);
    size(pool, w * 2.3, ph);
    standing(pool, angle, R - 2, cy);
    const top = CEIL + 60, bottom = cy - h / 2;
    const beam = el("div", "beam");
    size(beam, w * 1.5, bottom - top);
    standing(beam, angle, R - 90, (top + bottom) / 2);
    return [pool, beam];
  }

  /* ---------- Stavba ---------- */
  function build() {
    const segW = 2 * R * Math.tan(Math.PI / SEGMENTS) + 1;
    for (let i = 0; i < SEGMENTS; i++) {
      const w = el("div", "wall", room);
      size(w, segW, FLOOR - CEIL);
      w.style.backgroundPosition = `0 0, ${i * 97}px 0, ${i * 173}px 0, 0 0`;
      standing(w, (i * 360) / SEGMENTS, R, (FLOOR + CEIL) / 2);
    }
    const floor = el("div", "floor", room);
    size(floor, 2 * R, 2 * R);
    flat(floor, FLOOR);
    const ceil = el("div", "ceiling", room);
    ceil.id = "ceiling";
    size(ceil, 2 * R, 2 * R);
    flat(ceil, CEIL, false);
    buildDome();

    // Plakáty
    G.posters.forEach((p) => {
      const main = p.type === "main";
      const w = p.aboveDoor ? 330 : main ? 400 : 250;
      const h = Math.round(w * 1.4);
      const cy = p.aboveDoor ? -250 : main ? -110 : -70;
      const b = el("button", `poster ${main ? "main" : "triplet"}`);
      b.type = "button";
      size(b, w, h);
      standing(b, p.angle, R - 45, cy);
      b.innerHTML = p.image
        ? `<img src="${p.image}" alt="">`
        : `<span class="inner"><span class="num">${String(p.number).padStart(2, "0")}</span>` +
          `<span class="slot">obraz</span><h3>${p.title}</h3><p>${p.line || ""}</p></span>`;
      b.insertAdjacentHTML("beforeend", '<span class="shade"></span>');
      if (p.aboveDoor && b.querySelector("h3")) b.querySelector("h3").style.fontSize = "50px";
      b.setAttribute("aria-label", `${p.number}. ${p.title}`);
      const lights = addLight(p.angle, w, h, cy);
      const t = {
        kind: "poster", data: p, el: b, lights, angle: p.angle,
        half: main ? 11 : 7.5,
        pitch: p.aboveDoor ? [-2, LIGHT_PITCH] : null,
        label: [String(p.number).padStart(2, "0") + (p.group ? " · " + p.group : ""), p.title]
      };
      targets.push(t);
      b.addEventListener("click", (e) => { e.stopPropagation(); if (!wasDrag()) openPoster(p); });
      b.addEventListener("focus", () => lookAt(p.angle, p.aboveDoor ? 14 : 6));
    });

    // Dveře
    const door = el("button", "door");
    door.id = "door";
    door.type = "button";
    size(door, 250, 470);
    standing(door, 0, R - 30, FLOOR - 235);
    door.innerHTML = '<span class="crack"></span><span class="shade"></span>';
    door.setAttribute("aria-label", "Dveře");
    targets.push({
      kind: "door", el: door, lights: addLight(0, 250, 470, FLOOR - 235), angle: 0, half: 9,
      pitch: [PITCH_MIN, -2], label: ["", "Dveře"]
    });
    door.addEventListener("click", (e) => { e.stopPropagation(); if (!wasDrag()) useDoor(); });
    door.addEventListener("focus", () => lookAt(0, -16));

    // Nástěnka
    const B = G.board;
    const board = el("button", "board");
    board.type = "button";
    size(board, 540, 380);
    standing(board, B.angle, R - 70, -60);
    board.innerHTML = `<h4>${B.title}</h4>`;
    const spots = [[40, 70, -4], [205, 60, 3], [365, 80, -2], [90, 215, 2], [270, 225, -3], [420, 230, 4]];
    B.cards.slice(0, spots.length).forEach((c, i) => {
      const k = document.createElement("span");
      k.className = "card-pin";
      const [x, y, r] = spots[i];
      k.style.left = x + "px";
      k.style.top = y + "px";
      k.style.transform = `rotate(${r}deg)`;
      k.textContent = c.title;
      board.appendChild(k);
    });
    board.insertAdjacentHTML("beforeend", '<span class="shade"></span>');
    board.setAttribute("aria-label", B.title);
    targets.push({
      kind: "board", el: board, lights: addLight(B.angle, 540, 380, -60), angle: B.angle, half: 15,
      label: ["", B.title]
    });
    board.addEventListener("click", (e) => { e.stopPropagation(); if (!wasDrag()) openBoard(); });
    board.addEventListener("focus", () => lookAt(B.angle, 4));
  }

  /* ---------- Kopule ---------- */
  function buildDome() {
    // světlo nad kopulí
    const sky = el("div", "sky", room);
    size(sky, DOME_R * 4, DOME_R * 4);
    flat(sky, CEIL - 380, false);
    // mosazný prstenec kolem otvoru
    const rim = el("div", "rim", room);
    size(rim, DOME_R * 2 + 90, DOME_R * 2 + 90);
    flat(rim, CEIL + 1, false);
    // světlo na podlaze
    const fl = el("div", "floorlight", room);
    size(fl, 1100, 1100);
    flat(fl, FLOOR - 2);
    // 13 dílů: každý visí na pantu na vnějším okraji otvoru
    const w = 2 * DOME_R * Math.sin(Math.PI / PETALS) * 0.985;
    for (let i = 0; i < PETALS; i++) {
      const angle = (i * 360) / PETALS;
      const hinge = el("div", "hinge", room);
      hinge.style.transform =
        `translateY(${CEIL + 3}px) rotateY(${-angle}deg) translateZ(${-DOME_R}px) rotateX(-90deg)`;
      const p = document.createElement("div");
      p.className = "petal";
      p.style.width = w + "px";
      p.style.height = DOME_R + "px";
      p.style.left = -w / 2 + "px";
      p.style.top = -DOME_R + "px";
      hinge.appendChild(p);
      petals.push({ el: p, angle, open: false });
    }
    renderDomeHud();
  }
  function openPetalNear(angle) {
    let best = null, bestD = Infinity;
    for (const pt of petals) {
      if (pt.open) continue;
      const d = Math.abs(angDiff(pt.angle, angle));
      if (d < bestD) { best = pt; bestD = d; }
    }
    if (!best) return;
    best.open = true;
    setTimeout(() => { best.el.classList.add("open"); sound.mech(); }, 700);
  }
  function domeOpen() { return petals.filter((p) => p.open).length; }
  function updateDomeLight() {
    const n = domeOpen();
    document.documentElement.style.setProperty("--open", (n / PETALS).toFixed(3));
    document.body.classList.toggle("dome-full", n === PETALS);
    renderDomeHud();
  }
  function renderDomeHud() {
    const n = domeOpen();
    const hud = $("#domeHud");
    let dots = "";
    for (let i = 0; i < PETALS; i++) {
      const a = (i / PETALS) * Math.PI * 2 - Math.PI / 2;
      const x = 20 + Math.cos(a) * 14, y = 20 + Math.sin(a) * 14;
      dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" class="${i < n ? "on" : ""}"/>`;
    }
    hud.innerHTML = `<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><circle cx="20" cy="20" r="6" class="core"/>${dots}</svg>`;
    hud.setAttribute("aria-label", `Otevřeno ${n} ze ${PETALS} dílů kopule`);
  }
  function markSeen(p) {
    if (seen.has(p.id)) return;
    seen.add(p.id);
    openPetalNear(p.angle);
    setTimeout(() => {
      updateDomeLight();
      const n = domeOpen();
      if (n === 1) whisper(G.dome.first);
      else if (n === 7) whisper(G.dome.half);
      else if (n === PETALS) whisper(G.dome.full);
    }, 900);
  }

  /* ---------- Kamera ---------- */
  function fitPerspective() {
    P = Math.round(Math.max(innerWidth * 0.5, innerHeight * 0.55));
    scene.style.perspective = P + "px";
    const halfV = Math.atan(innerHeight / 2 / P) * 180 / Math.PI;
    PITCH_MAX = Math.max(40, 88 - halfV);
    LIGHT_PITCH = Math.min(46, PITCH_MAX - 6);
    tPitch = Math.min(tPitch, PITCH_MAX);
  }
  const cam = (z, p, y) => `translateZ(${z}px) rotateX(${p}deg) rotateY(${y}deg)`;

  function render() {
    if (!away) {
      const k = 0.12;
      const dy = (tYaw - yaw) * k;
      yaw += dy;
      pitch += (tPitch - pitch) * k;
      if (started) countTravel(dy);
      setCamera(cam(P, pitch, yaw));
      if (moved) updateTarget();
    }
    requestAnimationFrame(render);
  }
  function lookAt(angle, p) {
    tYaw += angDiff(angle, tYaw);
    if (p !== undefined) tPitch = p;
    moved = true;
  }

  /* ---------- Míření a rozsvěcení ---------- */
  function updateTarget() {
    let best = null;
    if (pitch > LIGHT_PITCH) {
      best = { kind: "light", label: ["", G.light.title] };
    } else {
      let bestD = Infinity;
      for (const t of targets) {
        const d = Math.abs(angDiff(t.angle, yaw));
        if (d > t.half || d >= bestD) continue;
        if (t.pitch && (pitch < t.pitch[0] || pitch > t.pitch[1])) continue;
        best = t; bestD = d;
      }
    }
    if (best === current || (best && current && best.kind === "light" && current.kind === "light")) return;
    if (current && current.el) {
      current.el.classList.remove("lit");
      current.lights.forEach((l) => l.classList.remove("lit-pool", "lit-beam"));
    }
    current = best;
    viewport.classList.toggle("has-target", !!best);
    const box = $("#target");
    if (!best) { box.classList.remove("show"); return; }
    if (best.el) {
      best.el.classList.add("lit");
      best.lights[0].classList.add("lit-pool");
      best.lights[1].classList.add("lit-beam");
      sound.chime();
    }
    $("#targetNum").textContent = best.label[0];
    $("#targetTitle").textContent = best.label[1];
    $("#targetHint").textContent =
      best.kind === "door" && !doorReady ? G.door.closedText
        : (matchMedia("(pointer: coarse)").matches ? "ťukni pro detail" : "klikni pro detail");
    box.classList.add("show");
  }
  function activate() {
    if (!current) return;
    if (current.kind === "poster") openPoster(current.data);
    else if (current.kind === "door") useDoor();
    else if (current.kind === "board") openBoard();
    else if (current.kind === "light") openLight();
  }

  /* ---------- Kolečka v kruhu ---------- */
  function countTravel(d) {
    travelled += Math.abs(d);
    if (!doorReady && travelled >= 360) {
      doorReady = true;
      $("#door").classList.add("ready");
      whisper(G.door.loopText);
      current = null; // přepočítat popisek
    }
  }

  /* ---------- Ovládání ---------- */
  let drag = null, dragged = false;
  const wasDrag = () => { const d = dragged; dragged = false; return d; };
  viewport.addEventListener("pointerdown", (e) => {
    if (away) return;
    drag = { x: e.clientX, y: e.clientY, yaw: tYaw, pitch: tPitch, id: e.pointerId };
    dragged = false;
  });
  addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!dragged && Math.hypot(dx, dy) > 6) { dragged = true; viewport.classList.add("dragging"); }
    if (dragged) {
      const s = 90 / P;
      tYaw = drag.yaw - dx * s;
      tPitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, drag.pitch + dy * s));
      moved = true;
    }
  });
  const endDrag = () => { drag = null; viewport.classList.remove("dragging"); };
  addEventListener("pointerup", endDrag);
  addEventListener("pointercancel", endDrag);
  viewport.addEventListener("click", () => {
    if (away || wasDrag()) return;
    activate();
  });

  addEventListener("keydown", (e) => {
    if (e.key === "Escape") return closeAll();
    if (away || document.querySelector(".overlay.show")) return;
    const step = e.shiftKey ? 45 : 15;
    const keys = {
      ArrowLeft: () => (tYaw -= step), ArrowRight: () => (tYaw += step),
      ArrowUp: () => (tPitch = Math.min(PITCH_MAX, tPitch + 12)),
      ArrowDown: () => (tPitch = Math.max(PITCH_MIN, tPitch - 12))
    };
    if (keys[e.key]) { keys[e.key](); moved = true; e.preventDefault(); }
    if (e.key === "Enter" && document.activeElement === document.body) activate();
  });
  viewport.addEventListener("wheel", (e) => {
    if (away) return;
    tYaw += (e.deltaY + e.deltaX) * 0.15;
    moved = true;
    e.preventDefault();
  }, { passive: false });

  /* ---------- Detaily ---------- */
  function openOverlay(id) {
    $(id).classList.add("show");
    const btn = $(id).querySelector(".close, .primary");
    if (btn) btn.focus();
  }
  function closeAll() {
    document.querySelectorAll(".overlay.show").forEach((o) => { if (o.id !== "intro") o.classList.remove("show"); });
  }
  document.querySelectorAll(".overlay .close").forEach((b) => b.addEventListener("click", closeAll));
  document.querySelectorAll(".overlay").forEach((o) =>
    o.addEventListener("click", (e) => { if (e.target === o && o.id !== "intro") closeAll(); }));

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function openPoster(p) {
    markSeen(p);
    $("#modalBody").innerHTML =
      `<p class="kicker">${String(p.number).padStart(2, "0")}${p.group ? " · " + esc(p.group) : ""}</p>` +
      (p.image ? `<img src="${p.image}" alt="">` : "") +
      `<h2 id="modalTitle">${esc(p.title)}</h2>` +
      `<p class="lead">${esc(p.line || "")}</p>` +
      (p.text || []).map((t) => `<p>${esc(t)}</p>`).join("") +
      (p.help ? `<p class="crisis">Pokud tyhle myšlenky máš, nejsi v tom sám. Linka první psychické pomoci <a href="tel:116123">116 123</a>, nonstop.</p>` : "") +
      (p.text ? "" : `<p class="todo">Obraz a text připravuje autor.</p>`);
    openOverlay("#modal");
  }
  function openBoard() {
    const B = G.board;
    $("#modalBody").innerHTML =
      `<h2 id="modalTitle">${esc(B.title)}</h2>` +
      `<div class="cards">${B.cards.map((c) => `<button type="button">${esc(c.title)}<span>${esc(c.text)}</span></button>`).join("")}</div>`;
    openOverlay("#modal");
  }
  function openLight() {
    const L = G.light;
    const n = domeOpen();
    if (n < PETALS) {
      $("#modalBody").innerHTML =
        `<p class="kicker">Otevřeno ${n} ze ${PETALS}</p><h2 id="modalTitle">${esc(L.closedTitle)}</h2>` +
        L.closedLines.map((t, i) => `<p class="${i ? "" : "lead"}">${esc(t)}</p>`).join("");
      openOverlay("#modal");
      return;
    }
    $("#modalBody").innerHTML =
      `<h2 id="modalTitle">${esc(L.title)}</h2>` + L.lines.map((t, i) => `<p class="${i ? "" : "lead"}">${esc(t)}</p>`).join("");
    openOverlay("#modal");
  }

  let whisperTimer;
  function whisper(text) {
    if (!text) return;
    const w = $("#whisper");
    w.textContent = text;
    w.classList.add("show");
    clearTimeout(whisperTimer);
    whisperTimer = setTimeout(() => w.classList.remove("show"), 4200);
  }

  /* ---------- Dveře → nadhled ---------- */
  function useDoor() {
    if (away) return;
    if (!doorReady) { whisper(G.door.closedText); return; }
    away = true;
    document.body.classList.add("away");
    $("#target").classList.remove("show");
    yaw = tYaw; pitch = tPitch;
    groups.forEach((g) => g.classList.add("flying"));
    $("#ceiling").style.opacity = 0;
    void scene.offsetWidth;
    setCamera(cam(P - 3200, -90, yaw + 90));

    const box = $("#beyondText");
    box.innerHTML = "";
    $("#beyond").classList.add("show");
    G.door.beyond.forEach((t, i) => {
      const p = document.createElement("p");
      p.textContent = t;
      box.appendChild(p);
      setTimeout(() => p.classList.add("on"), 3000 + i * 3200);
    });
    setTimeout(() => { $("#returnBtn").classList.add("on"); $("#returnBtn").focus(); },
      3000 + G.door.beyond.length * 3200);
  }
  $("#returnBtn").addEventListener("click", () => {
    $("#returnBtn").classList.remove("on");
    $("#beyond").classList.remove("show");
    setCamera(cam(P, pitch, yaw));
    setTimeout(() => {
      $("#ceiling").style.opacity = 1;
      groups.forEach((g) => g.classList.remove("flying"));
      away = false;
      document.body.classList.remove("away");
      current = null;
      whisper(G.door.back);
    }, 4600);
  });

  /* ---------- Prach ve světle ---------- */
  (function dust() {
    const c = $("#dust"), x = c.getContext("2d");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let W, H, parts = [];
    const resize = () => {
      W = c.width = innerWidth * devicePixelRatio;
      H = c.height = innerHeight * devicePixelRatio;
      parts = Array.from({ length: 70 }, () => ({
        x: W / 2 + (Math.random() - .5) * W * .5, y: Math.random() * H,
        r: (Math.random() * 1.6 + .4) * devicePixelRatio, v: Math.random() * .25 + .05,
        d: Math.random() * Math.PI * 2, a: Math.random() * .5 + .15
      }));
    };
    resize();
    addEventListener("resize", resize);
    (function tick(t) {
      x.clearRect(0, 0, W, H);
      const lit = current && current.el ? 1 : current ? 1.4 : .35;
      for (const p of parts) {
        p.y -= p.v * devicePixelRatio;
        p.x += Math.sin(t / 2400 + p.d) * .25 * devicePixelRatio;
        if (p.y < -10) { p.y = H + 10; p.x = W / 2 + (Math.random() - .5) * W * .5; }
        const fall = 1 - Math.min(1, Math.abs(p.x - W / 2) / (W * .28));
        x.globalAlpha = p.a * fall * lit * (.6 + .4 * Math.sin(t / 700 + p.d));
        x.fillStyle = "#ffe2b0";
        x.beginPath();
        x.arc(p.x, p.y, p.r, 0, 7);
        x.fill();
      }
      requestAnimationFrame(tick);
    })(0);
  })();

  /* ---------- Zvuk ---------- */
  const sound = (() => {
    let ctx, master, filter, on = false;
    function init() {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0;
      filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 380;
      filter.connect(master);
      master.connect(ctx.destination);
      [55, 55.3, 82.4, 110.2].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = i < 2 ? "sawtooth" : "sine";
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = i < 2 ? 0.022 : 0.04;
        o.connect(g).connect(filter);
        o.start();
      });
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 0.06;
      lg.gain.value = 110;
      lfo.connect(lg).connect(filter.frequency);
      lfo.start();
    }
    return {
      toggle() {
        if (!ctx) init();
        on = !on;
        ctx.resume();
        master.gain.linearRampToValueAtTime(on ? 0.9 : 0, ctx.currentTime + 1.5);
        return on;
      },
      mech() {
        if (!on) return;
        const t = ctx.currentTime;
        [180, 240, 120].forEach((f, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = "triangle";
          o.frequency.setValueAtTime(f, t + i * 0.12);
          g.gain.setValueAtTime(0.0001, t + i * 0.12);
          g.gain.exponentialRampToValueAtTime(0.03, t + i * 0.12 + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 0.18);
          o.connect(g).connect(ctx.destination);
          o.start(t + i * 0.12);
          o.stop(t + i * 0.12 + 0.2);
        });
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 523;
        g.gain.setValueAtTime(0.0001, t + 0.5);
        g.gain.exponentialRampToValueAtTime(0.03, t + 0.6);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
        o.connect(g).connect(ctx.destination);
        o.start(t + 0.5);
        o.stop(t + 3.1);
      },
      chime() {
        if (!on) return;
        const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 660;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.025, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
        o.connect(g).connect(ctx.destination);
        o.start(t);
        o.stop(t + 1.7);
      }
    };
  })();
  $("#soundBtn").addEventListener("click", (e) => {
    const on = sound.toggle();
    e.currentTarget.textContent = on ? "zvuk: zap." : "zvuk: vyp.";
    e.currentTarget.setAttribute("aria-pressed", on);
  });

  /* ---------- Úvod a pomoc ---------- */
  $("#introTitle").textContent = G.intro.title;
  $("#introText").innerHTML = G.intro.lines.map((l) => `<p>${l}</p>`).join("");
  $("#enterBtn").textContent = G.intro.enter;
  $("#enterBtn").addEventListener("click", () => {
    $("#intro").classList.remove("show");
    started = true;
  });
  $("#helpTitle").textContent = G.help.title;
  $("#helpText").innerHTML = G.help.lines.map((l) => `<p>${l}</p>`).join("");
  $("#helpBtn").addEventListener("click", () => openOverlay("#help"));

  /* ---------- Start ---------- */
  fitPerspective();
  addEventListener("resize", fitPerspective);
  build();
  setCamera(cam(P, pitch, yaw));
  updateDomeLight();
  requestAnimationFrame(render);
  $("#enterBtn").focus();
})();
