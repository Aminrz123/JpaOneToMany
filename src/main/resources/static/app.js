const API_BASE = "http://localhost:8080";

const $ = (id) => document.getElementById(id);

const regionKode = $("regionKode");
const regionNavn = $("regionNavn");
const regionHref = $("regionHref");
const btnCreateRegion = $("btnCreateRegion");
const btnReload = $("btnReload");
const toastRegion = $("toastRegion");

const kommuneKode = $("kommuneKode");
const kommuneNavn = $("kommuneNavn");
const kommuneHref = $("kommuneHref");
const kommuneHrefPhoto = $("kommuneHrefPhoto");
const regionSelect = $("regionSelect");
const btnCreateKommune = $("btnCreateKommune");
const toastKommune = $("toastKommune");

const selectedRegionText = $("selectedRegionText");
const regionList = $("regionList");
const kommuneList = $("kommuneList");

const allRegions = $("allRegions");
const allKommuner = $("allKommuner");

let regionsCache = [];

function toast(el, msg, type) {
    el.classList.remove("ok", "err");
    if (type) el.classList.add(type);
    el.textContent = msg;
}

async function fetchJson(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText}${txt ? " - " + txt : ""}`);
    }
    return res.json();
}

async function loadRegions() {
    // primært: /regioner
    // fallback: /region (hvis du har den)
    let data;
    try {
        data = await fetchJson(`${API_BASE}/regioner`);
    } catch (e) {
        data = await fetchJson(`${API_BASE}/region`);
    }

    regionsCache = Array.isArray(data) ? data : [];
    renderAll(regionsCache);
    fillRegionDropdown(regionsCache);

    // hvis dropdown allerede har valg: refresh kommune-listen
    if (regionSelect.value) {
        selectRegion(regionSelect.value);
    } else {
        selectedRegionText.textContent = "Vælg en region i dropdown for at se kommuner.";
        kommuneList.innerHTML = `<div class="empty">Ingen region valgt.</div>`;
    }
}

function fillRegionDropdown(regions) {
    const placeholder = regionSelect.options[0];
    regionSelect.innerHTML = "";
    regionSelect.appendChild(placeholder);

    for (const r of regions) {
        const opt = document.createElement("option");
        opt.value = r.kode;
        opt.textContent = `${r.kode} - ${r.navn ?? ""}`.trim();
        regionSelect.appendChild(opt);
    }
}

function renderAll(regions) {
    // Master list (klikbar)
    regionList.innerHTML = "";
    if (regions.length === 0) {
        regionList.innerHTML = `<div class="empty">Ingen regioner i databasen.</div>`;
    } else {
        for (const r of regions) {
            const count = (r.kommuner ?? r.kommune ?? []).length;

            const row = document.createElement("div");
            row.className = "item clickable";
            row.innerHTML = `
        <div class="left">
          <div class="title">${r.kode} — ${escapeHtml(r.navn ?? "")}</div>
          <div class="meta">${escapeHtml(r.href ?? "")}</div>
        </div>
        <span class="badge">${count} kommuner</span>
      `;
            row.addEventListener("click", () => {
                regionSelect.value = r.kode;
                selectRegion(r.kode);
            });
            regionList.appendChild(row);
        }
    }

    // Oversigt: alle regioner
    allRegions.innerHTML = "";
    if (regions.length === 0) {
        allRegions.innerHTML = `<div class="empty">Ingen regioner.</div>`;
    } else {
        for (const r of regions) {
            const row = document.createElement("div");
            row.className = "item";
            row.innerHTML = `
        <div class="left">
          <div class="title">${r.kode} — ${escapeHtml(r.navn ?? "")}</div>
          <div class="meta">${escapeHtml(r.href ?? "")}</div>
        </div>
        <span class="badge">${(r.kommuner ?? r.kommune ?? []).length}</span>
      `;
            allRegions.appendChild(row);
        }
    }

    // Oversigt: alle kommuner (flat)
    const flatKommuner = regions.flatMap(r => (r.kommuner ?? r.kommune ?? []).map(k => ({
        ...k,
        _regionKode: r.kode,
        _regionNavn: r.navn
    })));

    allKommuner.innerHTML = "";
    if (flatKommuner.length === 0) {
        allKommuner.innerHTML = `<div class="empty">Ingen kommuner.</div>`;
    } else {
        for (const k of flatKommuner) {
            const row = document.createElement("div");
            row.className = "item";
            row.innerHTML = `
        <div class="left">
          <div class="title">${k.kode} — ${escapeHtml(k.navn ?? "")}</div>
          <div class="meta">Region: ${escapeHtml(k._regionKode)} — ${escapeHtml(k._regionNavn ?? "")}</div>
        </div>
        <span class="badge">kommune</span>
      `;
            allKommuner.appendChild(row);
        }
    }
}

function selectRegion(regionKode) {
    const r = regionsCache.find(x => x.kode === regionKode);
    if (!r) return;

    selectedRegionText.textContent = `Valgt region: ${r.kode} — ${r.navn ?? ""}`.trim();
    const kommuner = r.kommuner ?? r.kommune ?? [];
    renderKommuner(kommuner);
}

function renderKommuner(kommuner) {
    kommuneList.innerHTML = "";
    if (!kommuner || kommuner.length === 0) {
        kommuneList.innerHTML = `<div class="empty">Ingen kommuner i den region endnu.</div>`;
        return;
    }

    for (const k of kommuner) {
        const row = document.createElement("div");
        row.className = "item";
        row.innerHTML = `
      <div class="left">
        <div class="title">${k.kode} — ${escapeHtml(k.navn ?? "")}</div>
        <div class="meta">${escapeHtml(k.href ?? "")} ${k.hrefPhoto ? "• " + escapeHtml(k.hrefPhoto) : ""}</div>
      </div>
      <span class="badge">${escapeHtml(k.kode)}</span>
    `;
        kommuneList.appendChild(row);
    }
}

function escapeHtml(str) {
    return String(str ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

btnReload.addEventListener("click", async () => {
    toast(toastRegion, "Loader data...", "");
    toast(toastKommune, "", "");
    try {
        await loadRegions();
        toast(toastRegion, "Data reloaded.", "ok");
    } catch (e) {
        toast(toastRegion, `Fejl: ${e.message}`, "err");
    }
});

regionSelect.addEventListener("change", (e) => {
    selectRegion(e.target.value);
});

btnCreateRegion.addEventListener("click", async () => {
    const payload = {
        kode: regionKode.value.trim(),
        navn: regionNavn.value.trim(),
        href: regionHref.value.trim()
    };

    if (payload.kode.length !== 4) {
        toast(toastRegion, "Region-kode skal være præcis 4 tegn.", "err");
        return;
    }
    if (!payload.navn) {
        toast(toastRegion, "Region-navn mangler.", "err");
        return;
    }

    try {
        toast(toastRegion, "Opretter region...", "");
        await fetchJson(`${API_BASE}/region`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        toast(toastRegion, `Region oprettet: ${payload.kode}`, "ok");
        regionKode.value = "";
        regionNavn.value = "";
        regionHref.value = "";

        await loadRegions();
    } catch (e) {
        toast(toastRegion, `Fejl: ${e.message}`, "err");
    }
});

btnCreateKommune.addEventListener("click", async () => {
    const regionKodeVal = regionSelect.value;

    const payload = {
        kode: kommuneKode.value.trim(),
        navn: kommuneNavn.value.trim(),
        href: kommuneHref.value.trim(),
        hrefPhoto: kommuneHrefPhoto.value.trim(),
        region: regionKodeVal ? { kode: regionKodeVal } : null
    };

    if (payload.kode.length !== 4) {
        toast(toastKommune, "Kommune-kode skal være præcis 4 tegn.", "err");
        return;
    }
    if (!payload.navn) {
        toast(toastKommune, "Kommune-navn mangler.", "err");
        return;
    }
    if (!payload.region) {
        toast(toastKommune, "Vælg en region i dropdown.", "err");
        return;
    }

    try {
        toast(toastKommune, "Opretter kommune...", "");
        await fetchJson(`${API_BASE}/kommune`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        toast(toastKommune, `Kommune oprettet: ${payload.kode}`, "ok");
        kommuneKode.value = "";
        kommuneNavn.value = "";
        kommuneHref.value = "";
        kommuneHrefPhoto.value = "";

        await loadRegions();
        selectRegion(regionKodeVal);
    } catch (e) {
        toast(toastKommune, `Fejl: ${e.message}`, "err");
    }
});

// initial load
loadRegions().catch(e => {
    regionList.innerHTML = `<div class="empty">FEJL: ${escapeHtml(e.message)}</div>`;
    allRegions.innerHTML = `<div class="empty">FEJL: ${escapeHtml(e.message)}</div>`;
    allKommuner.innerHTML = `<div class="empty">FEJL: ${escapeHtml(e.message)}</div>`;
});