(() => {
  "use strict";

  const G = window.GALLERY;
  const $ = (s) => document.querySelector(s);
  const scene = $("#scene");
  const viewport = $("#viewport");
  // Dvě samostatné 3D vrstvy: místnost (stěny, podlaha) a střed (stůl, židle, poznámky).
  // Stůl je vždy blíž než stěny, takže se kreslí navrch – předejde to chybám řazení v prohlížeči.
  const room = document.createElement("div");
  const center = document.createElement("div");
  room.className = center.className = "group";
  scene.append(room, center);
  const groups = [room, center];
  const setCamera = (t) => groups.forEach((g) => (g.style.transform = t));

  /* ---------- Rozměry místnosti (v px 3D prostoru) ---------- */
  const R = 1000;            // poloměr místnosti
  const WALL_TOP = -720;     // strop (y míří dolů)
  const FLOOR = 320;         // podlaha – oko je v y = 0 (sedíš)
  const TABLE_Y = 130;       // deska stolu
  const TABLE_R = 430;       // vnější poloměr kruhového stolu
  const SEGMENTS = 36;

  /* ---------- Stav ---------- */
  let P = 700;               // perspektiva
  let yaw = 0, pitch = -6;   // aktuální pohled (stupně)
  let tYaw = 0, tPitch = -6; // cílový pohled
  let travelled = 0;         // kolik stupňů se celkem otočilo
  let loops = 0;
  let doorVisits = 0;
  let gloom = 0.35;
  let away = false;          // jsme za dveřmi
  let started = false;
  const posterEls = [];

  /* ---------- Pomocníci ---------- */
  function el(tag, cls, parent = room) {
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
  // Předmět na stěně / stojící: úhel, vzdálenost od středu, svislá poloha středu
  function standing(e, angle, r, y) {
    e.style.transform = `rotateY(${-angle}deg) translateZ(${-r}px) translateY(${y}px)`;
  }
  // Předmět ležící naplocho (podlaha, stůl)
  function flat(e, angle, r, y, spin = 0) {
    e.style.transform =
      `translateY(${y}px) rotateY(${-angle}deg) translateZ(${-r}px) rotateX(90deg) rotateZ(${spin}deg)`;
  }

  /* ---------- Stavba místnosti ---------- */
  function build() {
    const segW = 2 * R * Math.tan(Math.PI / SEGMENTS) + 1;
    const wallH = FLOOR - WALL_TOP;
    for (let i = 0; i < SEGMENTS; i++) {
      const w = el("div", "wall" + (i % 2 ? " alt" : ""));
      size(w, segW, wallH);
      standing(w, (i * 360) / SEGMENTS, R, (FLOOR + WALL_TOP) / 2);
    }

    const floor = el("div", "floor");
    size(floor, 2 * R, 2 * R);
    flat(floor, 0, 0, FLOOR);

    const ceil = el("div", "ceiling");
    ceil.id = "ceiling";
    size(ceil, 2 * R, 2 * R);
    flat(ceil, 0, 0, WALL_TOP);

    const lamp = el("div", "lamp");
    size(lamp, 900, 900);
    flat(lamp, 0, 0, FLOOR - 2);

    const table = el("div", "table", center);
    size(table, TABLE_R * 2, TABLE_R * 2);
    flat(table, 0, 0, TABLE_Y);

    // Prázdné židle kolem stolu, všechny otočené k tobě
    const chairAngles = [30, 90, 150, 210, 270, 330];
    chairAngles.forEach((a) => {
      const c = el("div", "chair", center);
      size(c, 150, 260);
      standing(c, a, TABLE_R + 90, FLOOR - 130);
      c.innerHTML = chairSVG();
    });

    // Plakáty
    G.posters.forEach((p, i) => {
      const b = el("button", "poster");
      b.type = "button";
      size(b, 380, 540);
      standing(b, p.angle, R - 40, -150);
      if (p.image) {
        b.innerHTML = `<img src="${p.image}" alt="">`;
      } else {
        b.innerHTML =
          `<span class="inner"><span class="num">${String(i + 1).padStart(2, "0")}</span>` +
          `<h3>${p.title}</h3><p>${p.tagline || ""}</p></span>`;
      }
      b.setAttribute("aria-label", `Plakát: ${p.title}`);
      b.addEventListener("click", () => openPoster(p));
      b.addEventListener("focus", () => lookAt(p.angle, -8));
      posterEls.push({ data: p, el: b });
    });

    // Dveře
    const d = G.door;
    const door = el("button", "door");
    door.id = "door";
    door.type = "button";
    size(door, 280, 560);
    standing(door, d.angle, R - 30, FLOOR - 280);
    door.textContent = d.label;
    door.setAttribute("aria-label", `Dveře: ${d.label}`);
    door.addEventListener("click", goThroughDoor);
    door.addEventListener("focus", () => lookAt(d.angle, -4));

    // Poznámky na stole
    G.notes.forEach((n, i) => {
      const b = el("button", "note", center);
      b.type = "button";
      size(b, 80, 102);
      flat(b, n.angle, TABLE_R * 0.7, TABLE_Y - 1, (i % 3 - 1) * 9);
      b.textContent = n.text;
      b.setAttribute("aria-label", "Poznámka na stole");
      b.addEventListener("click", () => openNote(n));
      b.addEventListener("focus", () => lookAt(n.angle, -55));
    });

    // Skryté šepoty nízko na stěně
    (G.whispers || []).forEach((w) => {
      const b = el("button", "scrawl");
      b.type = "button";
      b.textContent = w.text;
      size(b, 320, 50);
      standing(b, w.angle, R - 25, FLOOR - 40);
      b.addEventListener("click", () => whisper(w.text));
    });
  }

  function chairSVG() {
    return `<svg viewBox="0 0 150 260" aria-hidden="true">
      <g fill="#2c2119" stroke="#120d09" stroke-width="3">
        <rect x="22" y="6" width="106" height="120" rx="6"/>
        <rect x="14" y="126" width="122" height="22" rx="4" fill="#3a2b20"/>
        <rect x="20" y="148" width="12" height="108"/>
        <rect x="118" y="148" width="12" height="108"/>
      </g>
      <g stroke="#120d09" stroke-width="3" fill="none" opacity=".6">
        <line x1="48" y1="20" x2="48" y2="112"/><line x1="75" y1="20" x2="75" y2="112"/><line x1="102" y1="20" x2="102" y2="112"/>
      </g>
    </svg>`;
  }

  /* ---------- Kamera ---------- */
  function fitPerspective() {
    const w = innerWidth, h = innerHeight;
    P = Math.round(Math.max(w * 0.5, h * 0.55));
    scene.style.perspective = P + "px";
  }
  function cameraTransform(z, p, y) {
    return `translateZ(${z}px) rotateX(${p}deg) rotateY(${y}deg)`;
  }
  function render() {
    if (!away) {
      const k = 0.12;
      const dy = (tYaw - yaw) * k;
      yaw += dy;
      pitch += (tPitch - pitch) * k;
      if (started) countTravel(dy);
      setCamera(cameraTransform(P, pitch, yaw));
    }
    requestAnimationFrame(render);
  }
  function lookAt(angle, p) {
    // nejkratší cestou k danému úhlu
    let diff = ((angle - tYaw) % 360 + 540) % 360 - 180;
    tYaw += diff;
    if (p !== undefined) tPitch = p;
  }

  /* ---------- Kolečka v kruhu ---------- */
  function countTravel(d) {
    travelled += Math.abs(d);
    const n = Math.floor(travelled / 360);
    if (n > loops) {
      loops = n;
      onLoop();
    }
  }
  function onLoop() {
    const msgs = G.loopMessages || [];
    whisper(msgs[Math.min(loops - 1, msgs.length - 1)]);
    setGloom(gloom + 0.08);
    posterEls.forEach(({ data, el }) => {
      if (!data.loops || data.image) return;
      const t = data.loops[Math.min(loops - 1, data.loops.length - 1)];
      const p = el.querySelector("p");
      p.style.opacity = 0;
      setTimeout(() => { p.textContent = t; p.style.opacity = 1; }, 1200);
    });
    sound.darken(loops);
  }
  function setGloom(v) {
    gloom = Math.max(0.15, Math.min(0.85, v));
    document.documentElement.style.setProperty("--gloom", gloom);
  }

  /* ---------- Ovládání ---------- */
  let drag = null, dragged = false;
  viewport.addEventListener("pointerdown", (e) => {
    if (away) return;
    drag = { x: e.clientX, y: e.clientY, yaw: tYaw, pitch: tPitch, id: e.pointerId };
    dragged = false;
  });
  addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!dragged && Math.hypot(dx, dy) > 6) {
      dragged = true;
      viewport.classList.add("dragging");
    }
    if (dragged) {
      const s = 90 / P; // citlivost podle zorného pole
      tYaw = drag.yaw - dx * s;
      tPitch = Math.max(-70, Math.min(30, drag.pitch + dy * s));
    }
  });
  const endDrag = () => { drag = null; viewport.classList.remove("dragging"); };
  addEventListener("pointerup", endDrag);
  addEventListener("pointercancel", endDrag);
  // Po tažení nespouštět kliknutí na plakát
  viewport.addEventListener("click", (e) => {
    if (dragged) { e.stopPropagation(); e.preventDefault(); dragged = false; }
  }, true);

  addEventListener("keydown", (e) => {
    if (e.key === "Escape") return closeAll();
    if (away || document.querySelector(".overlay.show")) return;
    const step = e.shiftKey ? 45 : 15;
    if (e.key === "ArrowLeft") { tYaw -= step; e.preventDefault(); }
    if (e.key === "ArrowRight") { tYaw += step; e.preventDefault(); }
    if (e.key === "ArrowUp") { tPitch = Math.min(30, tPitch + 10); e.preventDefault(); }
    if (e.key === "ArrowDown") { tPitch = Math.max(-70, tPitch - 10); e.preventDefault(); }
  });
  viewport.addEventListener("wheel", (e) => {
    if (away) return;
    tYaw += e.deltaY * 0.15 + e.deltaX * 0.15;
    e.preventDefault();
  }, { passive: false });

  /* ---------- Detail ---------- */
  function openOverlay(id) {
    $(id).classList.add("show");
    const btn = $(id).querySelector(".close, .primary");
    if (btn) btn.focus();
  }
  function closeAll() {
    document.querySelectorAll(".overlay.show").forEach((o) => {
      if (o.id !== "intro") o.classList.remove("show");
    });
  }
  document.querySelectorAll(".overlay .close").forEach((b) => b.addEventListener("click", closeAll));
  document.querySelectorAll(".overlay").forEach((o) =>
    o.addEventListener("click", (e) => { if (e.target === o && o.id !== "intro") closeAll(); })
  );

  function openPoster(p) {
    const card = $("#modal .card");
    card.classList.remove("paper");
    $("#modalBody").innerHTML =
      (p.image ? `<img src="${p.image}" alt="">` : "") +
      `<h2 id="modalTitle">${p.title}</h2>` +
      (p.text || []).map((t) => `<p>${t}</p>`).join("");
    openOverlay("#modal");
  }
  function openNote(n) {
    const card = $("#modal .card");
    card.classList.add("paper");
    $("#modalBody").innerHTML = `<span id="modalTitle" hidden>Poznámka</span>`;
    $("#modalBody").append(document.createTextNode(n.text));
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

  /* ---------- Dveře: únik a nadhled ---------- */
  function goThroughDoor() {
    if (away) return;
    const visits = G.door.visits;
    const v = visits[Math.min(doorVisits, visits.length - 1)];
    doorVisits++;
    away = true;
    document.body.classList.add("away");
    sound.door();

    // plynulý přelet nad místnost
    yaw = tYaw; pitch = tPitch;
    groups.forEach((g) => g.classList.add("flying"));
    $("#ceiling").style.opacity = 0;
    void scene.offsetWidth;
    setCamera(cameraTransform(P - 3000, -90, yaw + 90));
    setGloom(gloom - 0.25 * v.clarity);

    const fog = $("#fog");
    const blur = (1 - v.clarity) * 6;
    fog.style.opacity = 1 - v.clarity;
    fog.style.backdropFilter = fog.style.webkitBackdropFilter = `blur(${blur}px)`;

    // texty
    const box = $("#beyondText");
    box.innerHTML = "";
    $("#beyond").classList.add("show");
    const gap = (v.seconds * 1000) / (v.inside.length + 1);
    v.inside.forEach((t, i) => {
      const p = document.createElement("p");
      p.textContent = t;
      box.appendChild(p);
      setTimeout(() => p.classList.add("on"), 2500 + i * gap);
    });
    setTimeout(() => {
      const b = $("#returnBtn");
      b.classList.add("on");
      b.focus();
    }, 2500 + v.seconds * 1000 - gap * 0.5);

    $("#returnBtn").onclick = () => comeBack(v);
  }

  function comeBack(v) {
    $("#returnBtn").classList.remove("on");
    $("#beyond").classList.remove("show");
    $("#fog").style.opacity = 0;
    setCamera(cameraTransform(P, pitch, yaw));
    setTimeout(() => {
      $("#ceiling").style.opacity = 1;
      groups.forEach((g) => g.classList.remove("flying"));
      away = false;
      document.body.classList.remove("away");
      // první návštěva nechá světlo kolem dveří; další ztmaví místnost
      if (doorVisits === 1) {
        $("#door").classList.add("ajar");
        setGloom(gloom - 0.05);
      } else {
        setGloom(gloom + 0.12 + 0.25 * v.clarity);
      }
      whisper(v.back);
    }, 4600);
  }

  /* ---------- Zvuk (syntetizovaný, bez souborů) ---------- */
  const sound = (() => {
    let ctx, master, filter, on = false, tick;
    function init() {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0;
      filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 420;
      filter.connect(master);
      master.connect(ctx.destination);
      [55, 55.4, 82.4].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = i === 2 ? "sine" : "sawtooth";
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = i === 2 ? 0.05 : 0.025;
        o.connect(g).connect(filter);
        o.start();
      });
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.frequency.value = 0.07;
      lg.gain.value = 120;
      lfo.connect(lg).connect(filter.frequency);
      lfo.start();
    }
    function clock() {
      if (!on) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 1800;
      g.gain.setValueAtTime(0.03, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.05);
    }
    return {
      toggle() {
        if (!ctx) init();
        on = !on;
        ctx.resume();
        master.gain.linearRampToValueAtTime(on ? 0.9 : 0, ctx.currentTime + 1.5);
        clearInterval(tick);
        if (on) tick = setInterval(clock, 1000);
        return on;
      },
      darken(n) {
        if (ctx) filter.frequency.linearRampToValueAtTime(Math.max(160, 420 - n * 50), ctx.currentTime + 3);
      },
      door() {
        if (!ctx || !on) return;
        master.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 2);
        setTimeout(() => on && master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 3), 9000);
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
    viewport.focus();
  });
  $("#helpTitle").textContent = G.help.title;
  $("#helpText").innerHTML = G.help.lines.map((l) => `<p>${l}</p>`).join("");
  $("#helpBtn").addEventListener("click", () => openOverlay("#help"));

  /* ---------- Start ---------- */
  fitPerspective();
  addEventListener("resize", fitPerspective);
  build();
  setGloom(gloom);
  setCamera(cameraTransform(P, pitch, yaw));
  requestAnimationFrame(render);
  $("#enterBtn").focus();
})();
