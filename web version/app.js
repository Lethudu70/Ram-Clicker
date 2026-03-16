(() => {
  const SAVE_KEY = "ram_clicker_save_v1";
  const SAVE_VERSION = 1;
  const LANG_KEY = "ram_clicker_lang_v1";
  const EPS = 1e-9;

  const I18N = {
    fr: {
      brandSubtitle: "Clique sur les barrettes, empile la puissance.",
      power: "Puissance",
      bits: "Bits",
      bps: "Bits/s",
      rebirth: "Rebirth",
      ramTitle: "Barrette RAM",
      perClick: "Puissance par clic",
      click: "Clique",
      auto: "Auto",
      powerPerSec: "Puissance/s",
      achievements: "Achievements",
      nextRebirth: "Prochain rebirth",
      reach: "Atteins",
      currentTotal: "total actuel",
      shop: "Boutique",
      shopSubtitle: "Dépense tes Bits pour booster tes gains.",
      achTitle: "Achievements",
      achSubtitle: "Chaque achievement donne +1% gains (cumulable).",
      options: "Options",
      saveHelp: "La sauvegarde se fait aussi automatiquement dans ton navigateur (localStorage).",
      save: "Sauvegarder",
      export: "Exporter",
      import: "Importer",
      reset: "Reset",
      close: "Fermer",
      copy: "Copier",
      confirm: "Confirmer",
      cancel: "Annuler",
      ok: "OK",
      buy1: "Acheter 1",
      buyMax: "Acheter max",
      levelCost: (lvl, cost) => `Niveau ${lvl} · Coût ${cost} Bits`,
      locked: "Verrouillé",
      unlockedBonus: "Débloqué (+1%)",
      saved: "Sauvegardé.",
      copied: "Copié.",
      importInvalid: "Import invalide.",
      importOk: "Import réussi.",
      notEnough: "Pas assez de Bits.",
      notEnoughPower: "Pas encore assez de Puissance.",
      rebirthDone: "Rebirth effectué.",
      resetDone: "Reset effectué.",
      offlineGain: (g) => `Hors ligne : +${g}.`,
      achUnlocked: (n) => `Achievement${n > 1 ? "s" : ""} débloqué${n > 1 ? "s" : ""} !`,
      achBonusLine: "Chaque achievement donne +1% gains (cumulable).",
      rebirthBonus: (x) => `Bonus actuel : x${x}`,
      confirmImportTitle: "Importer",
      confirmImportBody: "Importer une sauvegarde remplacera la sauvegarde actuelle. Continuer ?",
      confirmImportBtn: "Importer",
      confirmRebirthTitle: "Rebirth",
      confirmRebirthBody: "Le rebirth remet tes Bits, ta Puissance et tes upgrades à zéro, mais augmente ton multiplicateur permanent. Continuer ?",
      confirmRebirthBtn: "Rebirth",
      confirmResetTitle: "Reset",
      confirmResetBody: "Tout effacer (y compris rebirths et achievements) ?",
      confirmResetBtn: "Effacer",
      exportTitle: "Export sauvegarde",
      importTitle: "Import sauvegarde",
      langTitle: "Basculer FR/EN",
      upgradesTab: "Upgrades",
      achievementsTab: "Achievements",
      textTitle: "Texte",
    },
    en: {
      brandSubtitle: "Click RAM sticks, stack more power.",
      power: "Power",
      bits: "Bits",
      bps: "Bits/s",
      rebirth: "Rebirth",
      ramTitle: "RAM Stick",
      perClick: "Power per click",
      click: "Click",
      auto: "Auto",
      powerPerSec: "Power/s",
      achievements: "Achievements",
      nextRebirth: "Next rebirth",
      reach: "Reach",
      currentTotal: "current total",
      shop: "Shop",
      shopSubtitle: "Spend your Bits to boost your gains.",
      achTitle: "Achievements",
      achSubtitle: "Each achievement gives +1% gains (stacking).",
      options: "Options",
      saveHelp: "Your save is also stored automatically in your browser (localStorage).",
      save: "Save",
      export: "Export",
      import: "Import",
      reset: "Reset",
      close: "Close",
      copy: "Copy",
      confirm: "Confirm",
      cancel: "Cancel",
      ok: "OK",
      buy1: "Buy 1",
      buyMax: "Buy max",
      levelCost: (lvl, cost) => `Level ${lvl} · Cost ${cost} Bits`,
      locked: "Locked",
      unlockedBonus: "Unlocked (+1%)",
      saved: "Saved.",
      copied: "Copied.",
      importInvalid: "Invalid import.",
      importOk: "Import successful.",
      notEnough: "Not enough Bits.",
      notEnoughPower: "Not enough Power yet.",
      rebirthDone: "Rebirth done.",
      resetDone: "Reset done.",
      offlineGain: (g) => `Offline: +${g}.`,
      achUnlocked: (n) => `Achievement${n > 1 ? "s" : ""} unlocked!`,
      achBonusLine: "Each achievement gives +1% gains (stacking).",
      rebirthBonus: (x) => `Current bonus: x${x}`,
      confirmImportTitle: "Import",
      confirmImportBody: "Importing a save will replace your current save. Continue?",
      confirmImportBtn: "Import",
      confirmRebirthTitle: "Rebirth",
      confirmRebirthBody: "Rebirth resets your Bits, Power and upgrades, but increases your permanent multiplier. Continue?",
      confirmRebirthBtn: "Rebirth",
      confirmResetTitle: "Reset",
      confirmResetBody: "Delete everything (including rebirths and achievements)?",
      confirmResetBtn: "Delete",
      exportTitle: "Export save",
      importTitle: "Import save",
      langTitle: "Switch FR/EN",
      upgradesTab: "Upgrades",
      achievementsTab: "Achievements",
      textTitle: "Text",
    },
  };

  function normLang(s) {
    const x = String(s || "").toLowerCase();
    return x.startsWith("en") ? "en" : "fr";
  }

  let currentLang = normLang(localStorage.getItem(LANG_KEY) || "fr");
  let numberFmt = new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 0 });
  let numberFmt2 = new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 2 });

  function tr(key) {
    return I18N[currentLang]?.[key] ?? I18N.fr[key] ?? key;
  }

  const UPGRADE_DEFS = [
    {
      id: "ram",
      name: { fr: "Barrette RAM", en: "RAM Stick" },
      desc: { fr: "+1 Puissance par clic.", en: "+1 Power per click." },
      baseCost: 10,
      costMult: 1.15,
      type: "addClick",
      value: 1,
    },
    {
      id: "dual",
      name: { fr: "Dual Channel", en: "Dual Channel" },
      desc: { fr: "+5 Puissance par clic.", en: "+5 Power per click." },
      baseCost: 120,
      costMult: 1.18,
      type: "addClick",
      value: 5,
    },
    {
      id: "xmp",
      name: { fr: "Profil XMP", en: "XMP Profile" },
      desc: { fr: "+5% gains (clic + auto).", en: "+5% gains (click + auto)." },
      baseCost: 520,
      costMult: 1.22,
      type: "mulAll",
      value: 0.05,
    },
    {
      id: "cool",
      name: { fr: "Refroidissement", en: "Cooling" },
      desc: { fr: "+2 Puissance par seconde.", en: "+2 Power per second." },
      baseCost: 260,
      costMult: 1.17,
      type: "addAuto",
      value: 2,
    },
    {
      id: "rack",
      name: { fr: "Rack serveur", en: "Server Rack" },
      desc: { fr: "+25 Puissance par seconde.", en: "+25 Power per second." },
      baseCost: 2600,
      costMult: 1.19,
      type: "addAuto",
      value: 25,
    },
    {
      id: "oc",
      name: { fr: "Overclock", en: "Overclock" },
      desc: { fr: "+15% gains (clic + auto).", en: "+15% gains (click + auto)." },
      baseCost: 12000,
      costMult: 1.25,
      type: "mulAll",
      value: 0.15,
    },
  ];

  const el = (id) => document.getElementById(id);
  const ui = {
    brandSubtitle: el("brandSubtitle"),
    langToggle: el("langToggle"),
    powerLabel: el("powerLabel"),
    bitsLabel: el("bitsLabel"),
    bpsLabel: el("bpsLabel"),
    rebirthLabel: el("rebirthLabel"),
    ramTitle: el("ramTitle"),
    perClickLabel: el("perClickLabel"),
    clickHint: el("clickHint"),
    autoLabel: el("autoLabel"),
    powerPerSecLabel: el("powerPerSecLabel"),
    achLabel: el("achLabel"),
    nextRebirthTitle: el("nextRebirthTitle"),
    reachLabel: el("reachLabel"),
    powerWord: el("powerWord"),
    currentTotalLabel: el("currentTotalLabel"),
    optionsSummary: el("optionsSummary"),
    saveHelp: el("saveHelp"),
    shopTitle: el("shopTitle"),
    shopSubtitle: el("shopSubtitle"),
    achTitle: el("achTitle"),
    achSubtitle: el("achSubtitle"),
    dialogCancel: el("dialogCancel"),
    textDialogClose: el("textDialogClose"),
    powerValue: el("powerValue"),
    bitsValue: el("bitsValue"),
    bpsValue: el("bpsValue"),
    rebirthValue: el("rebirthValue"),
    perClickValue: el("perClickValue"),
    perSecValue: el("perSecValue"),
    globalMultValue: el("globalMultValue"),
    rebirthReqValue: el("rebirthReqValue"),
    powerForRebirthValue: el("powerForRebirthValue"),
    rebirthProgressBar: el("rebirthProgressBar"),
    rebirthBonusValue: el("rebirthBonusValue"),
    achCountValue: el("achCountValue"),
    achTotalValue: el("achTotalValue"),
    ramButton: el("ramButton"),
    rebirthButton: el("rebirthButton"),
    shopList: el("shopList"),
    achList: el("achList"),
    tabShop: el("tabShop"),
    tabAch: el("tabAch"),
    panelShop: el("panelShop"),
    panelAch: el("panelAch"),
    saveButton: el("saveButton"),
    exportButton: el("exportButton"),
    importButton: el("importButton"),
    resetButton: el("resetButton"),
    confirmDialog: el("confirmDialog"),
    dialogTitle: el("dialogTitle"),
    dialogBody: el("dialogBody"),
    textDialog: el("textDialog"),
    textDialogTitle: el("textDialogTitle"),
    textDialogArea: el("textDialogArea"),
    textDialogCopy: el("textDialogCopy"),
    toast: el("toast"),
  };

  function nowMs() {
    return performance.now();
  }

  function clamp01(x) {
    return Math.max(0, Math.min(1, x));
  }

  function formatShort(n) {
    if (!Number.isFinite(n)) return "0";
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";
    const trunc = (x, digits) => {
      const f = Math.pow(10, digits);
      return Math.trunc(x * f) / f;
    };
    const units = [
      { v: 1e12, s: "T" },
      { v: 1e9, s: "B" },
      { v: 1e6, s: "M" },
      { v: 1e3, s: "K" },
    ];
    for (const u of units) {
      if (abs >= u.v) return `${sign}${numberFmt2.format(trunc(abs / u.v, 2))}${u.s}`;
    }
    return `${sign}${numberFmt.format(Math.trunc(abs))}`;
  }

  function toNum(x) {
    const n = Number(x);
    return Number.isFinite(n) ? n : 0;
  }

  function defaultState() {
    return {
      v: SAVE_VERSION,
      lang: currentLang,
      power: 0,
      bits: 0,
      rebirths: 0,
      totalClicks: 0,
      totalBitsEarned: 0,
      totalPowerEarned: 0,
      totalPurchases: 0,
      lastTickEpochMs: Date.now(),
      upgrades: Object.fromEntries(UPGRADE_DEFS.map((u) => [u.id, 0])),
      achievements: {},
    };
  }

  const ACHIEVEMENTS = [
    {
      id: "click_10",
      title: { fr: "Clic facile", en: "Easy click" },
      desc: { fr: "Faire 10 clics.", en: "Do 10 clicks." },
      test: (s) => s.totalClicks >= 10,
    },
    {
      id: "click_100",
      title: { fr: "Doigt d'acier", en: "Steel finger" },
      desc: { fr: "Faire 100 clics.", en: "Do 100 clicks." },
      test: (s) => s.totalClicks >= 100,
    },
    {
      id: "click_1000",
      title: { fr: "Mitrailleuse", en: "Click machine" },
      desc: { fr: "Faire 1 000 clics.", en: "Do 1,000 clicks." },
      test: (s) => s.totalClicks >= 1000,
    },
    {
      id: "bits_1k",
      title: { fr: "Petits bits", en: "Small bits" },
      desc: { fr: "Gagner 1 000 Bits (total).", en: "Earn 1,000 Bits (total)." },
      test: (s) => s.totalBitsEarned >= 1000,
    },
    {
      id: "bits_100k",
      title: { fr: "Flux de données", en: "Data flow" },
      desc: { fr: "Gagner 100 000 Bits (total).", en: "Earn 100,000 Bits (total)." },
      test: (s) => s.totalBitsEarned >= 100000,
    },
    {
      id: "power_10k",
      title: { fr: "CPU chaud", en: "Hot CPU" },
      desc: { fr: "Atteindre 10 000 Puissance.", en: "Reach 10,000 Power." },
      test: (s) => s.power >= 10000,
    },
    {
      id: "power_1m",
      title: { fr: "Datacenter", en: "Datacenter" },
      desc: { fr: "Atteindre 1 000 000 Puissance.", en: "Reach 1,000,000 Power." },
      test: (s) => s.power >= 1000000,
    },
    {
      id: "buy_1",
      title: { fr: "Première upgrade", en: "First upgrade" },
      desc: { fr: "Acheter 1 upgrade.", en: "Buy 1 upgrade." },
      test: (s) => s.totalPurchases >= 1,
    },
    {
      id: "buy_25",
      title: { fr: "Optimisation", en: "Optimization" },
      desc: { fr: "Acheter 25 upgrades.", en: "Buy 25 upgrades." },
      test: (s) => s.totalPurchases >= 25,
    },
    {
      id: "level_10",
      title: { fr: "Stacker", en: "Stacker" },
      desc: { fr: "Monter une upgrade au niveau 10.", en: "Get an upgrade to level 10." },
      test: (s) => maxUpgradeLevel(s) >= 10,
    },
    {
      id: "auto_50",
      title: { fr: "Ça tourne", en: "It runs" },
      desc: { fr: "Atteindre 50 Puissance/s.", en: "Reach 50 Power/s." },
      test: (s) => computeDerived(s).perSec >= 50,
    },
    {
      id: "auto_500",
      title: { fr: "Production", en: "Production" },
      desc: { fr: "Atteindre 500 Puissance/s.", en: "Reach 500 Power/s." },
      test: (s) => computeDerived(s).perSec >= 500,
    },
    {
      id: "rebirth_1",
      title: { fr: "Reboot", en: "Reboot" },
      desc: { fr: "Faire 1 rebirth.", en: "Do 1 rebirth." },
      test: (s) => s.rebirths >= 1,
    },
    {
      id: "rebirth_5",
      title: { fr: "On recommence", en: "Again" },
      desc: { fr: "Faire 5 rebirths.", en: "Do 5 rebirths." },
      test: (s) => s.rebirths >= 5,
    },
    {
      id: "all_10",
      title: { fr: "Collectionneur", en: "Collector" },
      desc: { fr: "Débloquer 10 achievements.", en: "Unlock 10 achievements." },
      test: (s) => countUnlockedAchievements(s) >= 10,
    },
    {
      id: "all_16",
      title: { fr: "Légende", en: "Legend" },
      desc: { fr: "Débloquer tous les achievements.", en: "Unlock all achievements." },
      test: (s) => countUnlockedAchievements(s) >= ACHIEVEMENTS.length,
    },
  ];

  function initAchievements(s) {
    for (const a of ACHIEVEMENTS) if (typeof s.achievements[a.id] !== "boolean") s.achievements[a.id] = false;
  }

  function maxUpgradeLevel(s) {
    let m = 0;
    for (const u of UPGRADE_DEFS) m = Math.max(m, s.upgrades[u.id] ?? 0);
    return m;
  }

  function countUnlockedAchievements(s) {
    let c = 0;
    for (const a of ACHIEVEMENTS) if (s.achievements[a.id]) c++;
    return c;
  }

  function rebirthMultiplier(s) {
    return 1 + s.rebirths * 0.25;
  }

  function achievementMultiplier(s) {
    return 1 + countUnlockedAchievements(s) * 0.01;
  }

  function upgradeEffects(s) {
    let addClick = 0;
    let addAuto = 0;
    let mulAll = 1;
    for (const u of UPGRADE_DEFS) {
      const lvl = s.upgrades[u.id] ?? 0;
      if (lvl <= 0) continue;
      if (u.type === "addClick") addClick += u.value * lvl;
      if (u.type === "addAuto") addAuto += u.value * lvl;
      if (u.type === "mulAll") mulAll *= 1 + u.value * lvl;
    }
    return { addClick, addAuto, mulAll };
  }

  function computeDerived(s) {
    const baseClick = 1;
    const baseAuto = 0;
    const eff = upgradeEffects(s);
    const mult = rebirthMultiplier(s) * achievementMultiplier(s) * eff.mulAll;
    const perClick = (baseClick + eff.addClick) * mult;
    const perSec = (baseAuto + eff.addAuto) * mult;
    return { mult, perClick, perSec };
  }

  function upgradeCost(def, level) {
    return Math.floor(def.baseCost * Math.pow(def.costMult, level));
  }

  function rebirthRequirement(s) {
    const n = s.rebirths + 1;
    return Math.floor(50000 * n * n);
  }

  function toast(msg) {
    ui.toast.textContent = msg;
    ui.toast.classList.add("is-on");
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => ui.toast.classList.remove("is-on"), 1100);
  }

  function showFloat(text) {
    const div = document.createElement("div");
    div.className = "float";
    div.textContent = text;
    ui.ramButton.appendChild(div);
    window.setTimeout(() => div.remove(), 850);
  }

  function setTab(which) {
    const shop = which === "shop";
    ui.tabShop.classList.toggle("is-active", shop);
    ui.tabAch.classList.toggle("is-active", !shop);
    ui.panelShop.classList.toggle("is-active", shop);
    ui.panelAch.classList.toggle("is-active", !shop);
    ui.tabShop.setAttribute("aria-selected", String(shop));
    ui.tabAch.setAttribute("aria-selected", String(!shop));
  }

  function dialogConfirm({ title, body, confirmText = "OK" }) {
    return new Promise((resolve) => {
      ui.dialogTitle.textContent = title;
      ui.dialogBody.textContent = body;
      ui.confirmDialog.querySelector("#dialogConfirm").textContent = confirmText;
      ui.confirmDialog.addEventListener(
        "close",
        () => resolve(ui.confirmDialog.returnValue === "ok"),
        { once: true }
      );
      ui.confirmDialog.showModal();
    });
  }

  function showTextDialog({ title, value, copyLabel, mode }) {
    showTextDialog._mode = mode || null;
    ui.textDialogTitle.textContent = title;
    ui.textDialogArea.value = value;
    ui.textDialogCopy.textContent = copyLabel || tr("copy");
    ui.textDialog.showModal();
  }

  function safeJsonParse(s) {
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  }

  function hasNativeApi() {
    return !!(window.pywebview && window.pywebview.api && typeof window.pywebview.api.save_save === "function");
  }

  function hasAndroidHost() {
    return !!(window.RamHost && typeof window.RamHost.saveSave === "function" && typeof window.RamHost.loadSave === "function");
  }

  function hasWebView2Host() {
    return !!(window.chrome && window.chrome.webview && typeof window.chrome.webview.postMessage === "function");
  }

  function waitPywebviewReady() {
    return new Promise((resolve) => {
      if (window.pywebview && window.pywebview.api) return resolve();
      window.addEventListener("pywebviewready", () => resolve(), { once: true });
    });
  }

  function encodeB64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function decodeB64(b64) {
    return decodeURIComponent(escape(atob(b64)));
  }

  function webview2SaveSave(obj) {
    if (!hasWebView2Host()) return;
    try {
      const payload = encodeB64(JSON.stringify(obj));
      window.chrome.webview.postMessage(`RAMCLICKER_SAVE:${payload}`);
    } catch {
      // ignore
    }
  }

  function webview2LoadSave() {
    return new Promise((resolve) => {
      if (!hasWebView2Host()) return resolve(null);

      const timeoutMs = 1500;
      const onMsg = (event) => {
        const data = event?.data;
        if (typeof data !== "string") return;
        if (!data.startsWith("RAMCLICKER_LOADRESP:")) return;
        window.chrome.webview.removeEventListener("message", onMsg);
        const b64 = data.slice("RAMCLICKER_LOADRESP:".length);
        if (!b64) return resolve(null);
        const json = safeJsonParse(decodeB64(b64));
        resolve(json);
      };

      window.chrome.webview.addEventListener("message", onMsg);
      window.chrome.webview.postMessage("RAMCLICKER_LOAD");
      window.setTimeout(() => {
        try {
          window.chrome.webview.removeEventListener("message", onMsg);
        } catch {
          // ignore
        }
        resolve(null);
      }, timeoutMs);
    });
  }

  async function nativeLoadSave() {
    if (!hasNativeApi()) return null;
    try {
      const data = await window.pywebview.api.load_save();
      if (!data) return null;
      if (typeof data === "string") return safeJsonParse(data);
      if (typeof data === "object") return data;
      return null;
    } catch {
      return null;
    }
  }

  function nativeSaveSave(obj) {
    if (!hasNativeApi()) return;
    try {
      // fire-and-forget; the Python side returns bool
      window.pywebview.api.save_save(obj);
    } catch {
      // ignore
    }
  }

  async function hostLoadSave() {
    if (hasNativeApi() || window.pywebview) {
      await waitPywebviewReady();
      return nativeLoadSave();
    }
    if (hasAndroidHost()) {
      try {
        const raw = window.RamHost.loadSave();
        if (!raw || typeof raw !== "string") return null;
        const json = safeJsonParse(raw);
        return json || null;
      } catch {
        return null;
      }
    }
    if (hasWebView2Host()) {
      return webview2LoadSave();
    }
    return null;
  }

  function hostSaveSave(obj) {
    nativeSaveSave(obj);
    if (hasAndroidHost()) {
      try {
        window.RamHost.saveSave(JSON.stringify(obj));
      } catch {
        // ignore
      }
    }
    webview2SaveSave(obj);
  }

  function sanitizeLoadedState(raw) {
    const s = defaultState();
    if (!raw || typeof raw !== "object") return s;
    s.v = SAVE_VERSION;
    s.lang = normLang(raw.lang || s.lang);
    s.power = Math.max(0, toNum(raw.power));
    s.bits = Math.max(0, toNum(raw.bits));
    s.rebirths = Math.max(0, Math.floor(toNum(raw.rebirths)));
    s.totalClicks = Math.max(0, Math.floor(toNum(raw.totalClicks)));
    s.totalBitsEarned = Math.max(0, toNum(raw.totalBitsEarned));
    s.totalPowerEarned = Math.max(0, toNum(raw.totalPowerEarned));
    s.totalPurchases = Math.max(0, Math.floor(toNum(raw.totalPurchases)));
    s.lastTickEpochMs = Math.max(0, Math.floor(toNum(raw.lastTickEpochMs))) || Date.now();

    if (raw.upgrades && typeof raw.upgrades === "object") {
      for (const u of UPGRADE_DEFS) s.upgrades[u.id] = Math.max(0, Math.floor(toNum(raw.upgrades[u.id])));
    }
    if (raw.achievements && typeof raw.achievements === "object") {
      for (const a of ACHIEVEMENTS) s.achievements[a.id] = !!raw.achievements[a.id];
    }
    initAchievements(s);
    return s;
  }

  function saveSilently(s) {
    s.lastTickEpochMs = Date.now();
    s.lang = currentLang;
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    hostSaveSave(s);
  }

  function save(s) {
    saveSilently(s);
    toast(tr("saved"));
  }

  function load() {
    const raw = safeJsonParse(localStorage.getItem(SAVE_KEY) || "");
    const s = sanitizeLoadedState(raw);
    initAchievements(s);
    return s;
  }

  function exportSave(s) {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(s))));
    showTextDialog({ title: tr("exportTitle"), value: payload, copyLabel: tr("copy"), mode: "export" });
  }

  async function importSave() {
    showTextDialog({ title: tr("importTitle"), value: "", copyLabel: tr("import"), mode: "import" });
    const didImport = await new Promise((resolve) => {
      ui.textDialog.addEventListener(
        "close",
        () => resolve(ui.textDialog.returnValue === "copy"),
        { once: true }
      );
    });
    if (!didImport) return null;
    const payload = ui.textDialogArea.value.trim();
    if (!payload) return null;
    let decoded = "";
    try {
      decoded = decodeURIComponent(escape(atob(payload)));
    } catch {
      return null;
    }
    const json = safeJsonParse(decoded);
    if (!json) return null;
    return sanitizeLoadedState(json);
  }

  function checkAchievements(s) {
    let unlockedNow = 0;
    for (const a of ACHIEVEMENTS) {
      if (s.achievements[a.id]) continue;
      if (a.test(s)) {
        s.achievements[a.id] = true;
        unlockedNow++;
      }
    }
    if (unlockedNow > 0) {
      toast(tr("achUnlocked")(unlockedNow));
    }
  }

  function buyUpgrade(s, id, opts) {
    const def = UPGRADE_DEFS.find((u) => u.id === id);
    if (!def) return 0;
    const buyMax = !!opts?.max;
    let bought = 0;
    while (true) {
      const lvl = s.upgrades[id] ?? 0;
      const cost = upgradeCost(def, lvl);
      if (s.bits + EPS < cost) break;
      s.bits = Math.max(0, s.bits - cost);
      s.upgrades[id] = lvl + 1;
      s.totalPurchases++;
      bought++;
      if (!buyMax) break;
      if (bought > 10000) break;
    }
    return bought;
  }

  function gain(s, amount) {
    const a = Math.max(0, amount);
    s.power += a;
    s.bits += a;
    s.totalBitsEarned += a;
    s.totalPowerEarned += a;
  }

  function tick(s, dtSec) {
    const d = computeDerived(s);
    if (d.perSec > 0) gain(s, d.perSec * dtSec);
    checkAchievements(s);
  }

  function renderTop(s) {
    const d = computeDerived(s);
    ui.powerValue.textContent = formatShort(s.power);
    ui.bitsValue.textContent = formatShort(s.bits);
    ui.bpsValue.textContent = formatShort(d.perSec);
    ui.rebirthValue.textContent = String(s.rebirths);
    ui.perClickValue.textContent = formatShort(d.perClick);
    ui.perSecValue.textContent = formatShort(d.perSec);
    ui.globalMultValue.textContent = numberFmt2.format(d.mult);

    const req = rebirthRequirement(s);
    ui.rebirthReqValue.textContent = formatShort(req);
    ui.powerForRebirthValue.textContent = formatShort(s.power);
    const p = clamp01(req <= 0 ? 1 : s.power / req);
    ui.rebirthProgressBar.style.width = `${(p * 100).toFixed(2)}%`;
    ui.rebirthButton.disabled = s.power < req;
    ui.rebirthBonusValue.textContent = tr("rebirthBonus")(numberFmt2.format(rebirthMultiplier(s)));

    const achCount = countUnlockedAchievements(s);
    ui.achCountValue.textContent = String(achCount);
    ui.achTotalValue.textContent = String(ACHIEVEMENTS.length);
  }

  let lastAffordBitsInt = null;
  function updateShopAffordability(s) {
    const bitsInt = Math.floor(s.bits + EPS);
    if (lastAffordBitsInt === bitsInt) return;
    lastAffordBitsInt = bitsInt;
    for (const def of UPGRADE_DEFS) {
      const row = ui.shopList.querySelector(`[data-upgrade-id="${def.id}"]`);
      if (!row) continue;
      const lvl = s.upgrades[def.id] ?? 0;
      const cost = upgradeCost(def, lvl);
      const can = s.bits + EPS >= cost;
      const b1 = row.querySelector('[data-role="buy1"]');
      const bm = row.querySelector('[data-role="buymax"]');
      if (b1) b1.disabled = !can;
      if (bm) bm.disabled = !can;
    }
  }

  function renderShop(s) {
    ui.shopList.innerHTML = "";
    for (const def of UPGRADE_DEFS) {
      const lvl = s.upgrades[def.id] ?? 0;
      const cost = upgradeCost(def, lvl);

      const item = document.createElement("div");
      item.className = "shopItem";
      item.dataset.upgradeId = def.id;

      const main = document.createElement("div");
      main.className = "shopItem__main";
      const name = document.createElement("div");
      name.className = "shopItem__name";
      name.textContent = def.name[currentLang] || def.name.fr;
      const desc = document.createElement("div");
      desc.className = "shopItem__desc";
      desc.textContent = def.desc[currentLang] || def.desc.fr;
      const meta = document.createElement("div");
      meta.className = "shopItem__meta";
      meta.textContent = tr("levelCost")(lvl, formatShort(cost));
      main.appendChild(name);
      main.appendChild(desc);
      main.appendChild(meta);

      const actions = document.createElement("div");
      actions.className = "shopItem__actions";
      const badge = document.createElement("div");
      badge.className = "badge";
      badge.textContent = `x${lvl}`;
      const btn1 = document.createElement("button");
      btn1.className = "btn";
      btn1.type = "button";
      btn1.textContent = tr("buy1");
      btn1.dataset.role = "buy1";
      btn1.disabled = s.bits + EPS < cost;
      btn1.addEventListener("click", () => {
        const bought = buyUpgrade(s, def.id, { max: false });
        if (bought > 0) {
          saveSilently(s);
          renderAll(s);
        }
        else toast(tr("notEnough"));
      });

      const btnMax = document.createElement("button");
      btnMax.className = "btn btn--ghost";
      btnMax.type = "button";
      btnMax.textContent = tr("buyMax");
      btnMax.dataset.role = "buymax";
      btnMax.disabled = s.bits + EPS < cost;
      btnMax.addEventListener("click", () => {
        const bought = buyUpgrade(s, def.id, { max: true });
        if (bought > 0) {
          saveSilently(s);
          renderAll(s);
        }
        else toast(tr("notEnough"));
      });

      actions.appendChild(badge);
      actions.appendChild(btn1);
      actions.appendChild(btnMax);
      item.appendChild(main);
      item.appendChild(actions);
      ui.shopList.appendChild(item);
    }
  }

  function renderAchievements(s) {
    ui.achList.innerHTML = "";
    for (const a of ACHIEVEMENTS) {
      const unlocked = !!s.achievements[a.id];
      const card = document.createElement("div");
      card.className = `ach ${unlocked ? "is-unlocked" : "is-locked"}`;
      const t = document.createElement("div");
      t.className = "ach__title";
      t.textContent = a.title[currentLang] || a.title.fr;
      const d = document.createElement("div");
      d.className = "ach__desc";
      d.textContent = a.desc[currentLang] || a.desc.fr;
      const tag = document.createElement("div");
      tag.className = "ach__tag";
      tag.textContent = unlocked ? tr("unlockedBonus") : tr("locked");
      card.appendChild(t);
      card.appendChild(d);
      card.appendChild(tag);
      ui.achList.appendChild(card);
    }
  }

  function renderAll(s) {
    renderTop(s);
    renderShop(s);
    renderAchievements(s);
  }

  async function doRebirth(s) {
    const req = rebirthRequirement(s);
    if (s.power < req) {
      toast(tr("notEnoughPower"));
      return;
    }
    const ok = await dialogConfirm({
      title: tr("confirmRebirthTitle"),
      body: tr("confirmRebirthBody"),
      confirmText: tr("confirmRebirthBtn"),
    });
    if (!ok) return;

    s.rebirths += 1;
    s.power = 0;
    s.bits = 0;
    s.upgrades = Object.fromEntries(UPGRADE_DEFS.map((u) => [u.id, 0]));
    s.lastTickEpochMs = Date.now();
    checkAchievements(s);
    saveSilently(s);
    toast(tr("rebirthDone"));
    renderAll(s);
  }

  function applyLanguage() {
    currentLang = normLang(currentLang);
    localStorage.setItem(LANG_KEY, currentLang);
    document.documentElement.lang = currentLang;
    numberFmt = new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 0 });
    numberFmt2 = new Intl.NumberFormat(currentLang === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: 2 });

    ui.langToggle.textContent = currentLang.toUpperCase();
    ui.langToggle.title = tr("langTitle");
    ui.brandSubtitle.textContent = tr("brandSubtitle");
    ui.powerLabel.textContent = tr("power");
    ui.bitsLabel.textContent = tr("bits");
    ui.bpsLabel.textContent = tr("bps");
    ui.rebirthLabel.textContent = tr("rebirth");
    ui.ramTitle.textContent = tr("ramTitle");
    ui.perClickLabel.textContent = tr("perClick");
    ui.clickHint.textContent = tr("click");
    ui.autoLabel.textContent = tr("auto");
    ui.powerPerSecLabel.textContent = tr("powerPerSec");
    ui.achLabel.textContent = tr("achievements");
    ui.nextRebirthTitle.textContent = tr("nextRebirth");
    ui.reachLabel.textContent = tr("reach");
    ui.powerWord.textContent = tr("power");
    ui.currentTotalLabel.textContent = tr("currentTotal");
    ui.optionsSummary.textContent = tr("options");
    ui.saveHelp.textContent = tr("saveHelp");
    ui.shopTitle.textContent = tr("shop");
    ui.shopSubtitle.textContent = tr("shopSubtitle");
    ui.achTitle.textContent = tr("achTitle");
    ui.achSubtitle.textContent = tr("achSubtitle");
    ui.tabShop.textContent = tr("upgradesTab");
    ui.tabAch.textContent = tr("achievementsTab");
    ui.saveButton.textContent = tr("save");
    ui.exportButton.textContent = tr("export");
    ui.importButton.textContent = tr("import");
    ui.resetButton.textContent = tr("reset");
    ui.dialogCancel.textContent = tr("cancel");
    ui.textDialogClose.textContent = tr("close");
    ui.textDialogTitle.textContent = tr("textTitle");
  }

  function bindUI(s) {
    ui.ramButton.addEventListener("click", () => {
      const d = computeDerived(s);
      gain(s, d.perClick);
      s.totalClicks += 1;
      showFloat(`+${formatShort(d.perClick)}`);
      checkAchievements(s);
      renderTop(s);
    });

    ui.rebirthButton.addEventListener("click", () => doRebirth(s));
    ui.tabShop.addEventListener("click", () => setTab("shop"));
    ui.tabAch.addEventListener("click", () => setTab("ach"));

    ui.saveButton.addEventListener("click", () => save(s));
    ui.exportButton.addEventListener("click", () => exportSave(s));
    ui.importButton.addEventListener("click", async () => {
      const ok = await dialogConfirm({
        title: tr("confirmImportTitle"),
        body: tr("confirmImportBody"),
        confirmText: tr("confirmImportBtn"),
      });
      if (!ok) return;
      const loaded = await importSave();
      if (!loaded) {
        toast(tr("importInvalid"));
        return;
      }
      Object.assign(s, loaded);
      saveSilently(s);
      toast(tr("importOk"));
      renderAll(s);
    });

    ui.textDialogCopy.addEventListener("click", async (e) => {
      if (showTextDialog._mode === "export") {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(ui.textDialogArea.value);
          toast(tr("copied"));
        } catch {
          toast(tr("copied"));
        }
        ui.textDialog.close("cancel");
        return;
      }
      ui.textDialog.close("copy");
    });

    ui.resetButton.addEventListener("click", async () => {
      const ok = await dialogConfirm({
        title: tr("confirmResetTitle"),
        body: tr("confirmResetBody"),
        confirmText: tr("confirmResetBtn"),
      });
      if (!ok) return;
      const fresh = defaultState();
      initAchievements(fresh);
      Object.assign(s, fresh);
      saveSilently(s);
      toast(tr("resetDone"));
      renderAll(s);
    });

    ui.langToggle.addEventListener("click", () => {
      currentLang = currentLang === "fr" ? "en" : "fr";
      s.lang = currentLang;
      applyLanguage();
      renderAll(s);
      saveSilently(s);
    });

    window.addEventListener("beforeunload", () => saveSilently(s));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") saveSilently(s);
    });
  }

  async function start() {
    const s = load();
    initAchievements(s);
    setTab("shop");
    bindUI(s);
    currentLang = normLang(s.lang || currentLang);
    applyLanguage();

    // Allow native wrappers to force a final save on close.
    window.RAMCLICKER_forceSave = () => {
      try {
        saveSilently(s);
        return true;
      } catch {
        return false;
      }
    };

    const host = await hostLoadSave();
    if (host) {
      const loaded = sanitizeLoadedState(host);
      Object.assign(s, loaded);
      initAchievements(s);
      currentLang = normLang(s.lang || currentLang);
      applyLanguage();
    }

    const offlineSec = Math.min(8 * 60 * 60, Math.max(0, (Date.now() - (s.lastTickEpochMs || Date.now())) / 1000));
    if (offlineSec > 1) {
      const before = s.power;
      tick(s, offlineSec);
      const gained = Math.max(0, s.power - before);
      toast(tr("offlineGain")(formatShort(gained)));
    }
    s.lastTickEpochMs = Date.now();
    saveSilently(s);
    renderAll(s);

    let last = nowMs();
    let lastSave = last;
    const loop = () => {
      const t = nowMs();
      const dt = Math.min(0.25, (t - last) / 1000);
      last = t;
      tick(s, dt);
      renderTop(s);
      updateShopAffordability(s);
      if (t - lastSave > 5000) {
        lastSave = t;
        saveSilently(s);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  start();
})();
