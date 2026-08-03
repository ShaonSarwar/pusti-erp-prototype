(function () {
  const NAV = [
    { section: "হোম" },
    { id: "dashboard", href: "dashboard.html", label: "ড্যাশবোর্ড" },
    { section: "মাস্টার" },
    { id: "companies", href: "companies.html", label: "কোম্পানি (ডেমো)" },
    { id: "products", href: "products.html", label: "পণ্য (SKU)" },
    { id: "parties", href: "parties.html", label: "গ্রাহক" },
    { id: "suppliers", href: "suppliers.html", label: "সরবরাহকারী" },
    { id: "staff", href: "staff.html", label: "কর্মী / SR" },
    { id: "routes-vans", href: "routes-vans.html", label: "রুট ও যান" },
    { section: "অপারেশন (মাল)" },
    { id: "load-samari", href: "load-samari.html", label: "লোড শিট (Samari)" },
    { id: "return-firot", href: "return-firot.html", label: "ফেরত (Firot)" },
    { id: "stock", href: "stock.html", label: "স্টক (মজুদ)" },
    { id: "purchase-receive", href: "purchase-receive.html", label: "মাল আসা (ঐচ্ছিক)" },
    { id: "goods-due", href: "goods-due.html", label: "পণ্য Due / Balance" },
    { id: "undelivery", href: "undelivery.html", label: "Undelevary (Sheet2)" },
    { section: "টাকা (দিনের হিসাব)" },
    { id: "daily-cash", href: "daily-cash.html", label: "দিনের টাকা সেটেল" },
    { id: "collections", href: "collections.html", label: "গ্রাহক কালেকশন" },
    { id: "cash-bank", href: "cash-bank.html", label: "নগদ / ব্যাংক" },
    { id: "ledgers", href: "ledgers.html", label: "হিসাব খাতা (গ্রাহক)" },
    { id: "pnl", href: "pnl.html", label: "লাভ-ক্ষতি" },
    { id: "vouchers", href: "vouchers.html", label: "ভাউচার" },
    { id: "sales-invoices", href: "sales-invoices.html", label: "বিক্রয় রেফ." },
    { section: "সারাংশ ও রিপোর্ট" },
    { id: "product-summary", href: "product-summary.html", label: "পণ্য মাসিক সারাংশ" },
    { id: "reports", href: "reports.html", label: "রিপোর্ট সেন্টার" },
    { id: "help", href: "help.html", label: "মডিউল ব্যাখ্যা" },
    { section: "অন্যান্য" },
    { id: "crm", href: "crm.html", label: "CRM" },
    { id: "settings-roles", href: "settings-roles.html", label: "সেটিংস / রোল" },
    { section: "ফিল্ড" },
    { id: "field", href: "../field/today-load.html", label: "মোবাইল অ্যাপ →" }
  ];

  window.toast = function (msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  };

  window.mountApp = function (opts) {
    const page = opts.page;
    const title = opts.title || "";
    const root = document.getElementById("app");
    if (!root) return;

    const pageHtml = root.innerHTML;
    const S = window.SAMPLE || {};

    root.innerHTML = `
      <div class="app-shell">
        <aside class="sidebar">
          <div class="sidebar-brand">
            PUSTI ERP
            <small>${S.companyName || "PUSTI"}</small>
          </div>
          ${NAV.map((item) =>
            item.section
              ? `<div class="nav-section">${item.section}</div>`
              : `<a class="nav-link${item.id === page ? " active" : ""}" href="${item.href}">${item.label}</a>`
          ).join("")}
        </aside>
        <div class="main">
          <header class="topbar">
            <h1>${title}</h1>
            <div class="topbar-meta">
              <span class="proto-badge">প্রোটোটাইপ — শীট-ম্যাচ মডেল</span>
              <span>${S.date || ""}</span>
              <span>${(S.user && S.user.name) || ""} · ${(S.user && S.user.role) || ""}</span>
              <a class="btn btn-ghost btn-sm" href="../index.html">প্রস্থান</a>
            </div>
          </header>
          <div class="content">
            ${pageHtml}
            <p class="footer-disclaimer">UI প্রোটোটাইপ · Pusti 2026 শীটের অপারেশন + দিনের টাকা মডেল অনুসরণ · ডাটা সেভ হয় না</p>
          </div>
        </div>
      </div>
    `;

    document.body.addEventListener("click", (e) => {
      const t = e.target.closest("[data-toast]");
      if (t) {
        e.preventDefault();
        toast(t.getAttribute("data-toast") || "সংরক্ষণ (ডেমো)");
      }
    });

    if (typeof opts.onReady === "function") opts.onReady();
  };

  window.productById = function (id) {
    return (SAMPLE.products || []).find((p) => p.id === id);
  };

  /**
   * Session bridge: load sheet → daily cash sales
   * Keys live in sessionStorage so both pages share demo state.
   */
  window.PustiStore = {
    CASH_KEY: "pusti_daily_cash_v1",
    LOAD_KEY: "pusti_load_by_date_v1",

    dayFromDate(iso) {
      if (!iso || typeof iso !== "string") return 1;
      const p = iso.split("-");
      return Math.min(31, Math.max(1, parseInt(p[2], 10) || 1));
    },

    emptyCashDay(day, date) {
      return {
        day: day || 1,
        date: date || "2026-01-01",
        sales: 0,
        due: 0,
        credit: 0,
        commission: 0,
        operating: 0,
        banking: 0,
        monirSort: 0,
        monirOver: 0,
        arifSort: 0,
        arifOver: 0,
        manikSort: 0,
        manikOver: 0,
        santoSort: 0,
        manager: 0,
        salesFromLoad: false,
        loadProfit: 0,
        loadDeliveryPcs: 0
      };
    },

    getLoadMap() {
      try {
        const raw = sessionStorage.getItem(this.LOAD_KEY);
        if (raw) return JSON.parse(raw) || {};
      } catch (e) { /* ignore */ }
      return {};
    },

    setLoadMap(map) {
      sessionStorage.setItem(this.LOAD_KEY, JSON.stringify(map));
    },

    /** All SR loads for a date */
    getLoadsForDate(date) {
      const m = this.getLoadMap();
      return (m[date] && m[date].loads) || [];
    },

    /** Summed sales for the date (all SRs) */
    salesFromLoads(date) {
      return this.getLoadsForDate(date).reduce((s, L) => s + (Number(L.sales) || 0), 0);
    },

    loadSummary(date) {
      const loads = this.getLoadsForDate(date);
      return {
        sales: loads.reduce((s, L) => s + (Number(L.sales) || 0), 0),
        deliveryPcs: loads.reduce((s, L) => s + (Number(L.deliveryPcs) || 0), 0),
        profit: loads.reduce((s, L) => s + (Number(L.profit) || 0), 0),
        srs: loads.map((L) => L.sr),
        loads
      };
    },

    /**
     * Save one load sheet. Same date + SR replaces; other SRs add.
     * Then push total sales into daily cash day (session).
     */
    saveLoadSheet(payload) {
      const date = payload.date;
      const map = this.getLoadMap();
      if (!map[date]) map[date] = { loads: [] };
      const loads = map[date].loads.filter((L) => L.sr !== payload.sr);
      loads.push({
        sr: payload.sr,
        route: payload.route || "",
        sales: Number(payload.sales) || 0,
        deliveryPcs: Number(payload.deliveryPcs) || 0,
        profit: Number(payload.profit) || 0,
        issuePcs: Number(payload.issuePcs) || 0,
        returnPcs: Number(payload.returnPcs) || 0,
        savedAt: new Date().toISOString()
      });
      map[date].loads = loads;
      this.setLoadMap(map);
      const sum = this.loadSummary(date);
      this.pushSalesToCash(date, sum);
      return sum;
    },

    getCashDays() {
      try {
        const raw = sessionStorage.getItem(this.CASH_KEY);
        if (raw) {
          const a = JSON.parse(raw);
          if (Array.isArray(a) && a.length) return a;
        }
      } catch (e) { /* ignore */ }
      return JSON.parse(JSON.stringify((SAMPLE && SAMPLE.dailyCash) || []));
    },

    setCashDays(days) {
      sessionStorage.setItem(this.CASH_KEY, JSON.stringify(days));
      if (window.SAMPLE) SAMPLE.dailyCash = days;
    },

    pushSalesToCash(date, summary) {
      let days = this.getCashDays();
      if (!days.length && SAMPLE && SAMPLE.dailyCash) {
        days = JSON.parse(JSON.stringify(SAMPLE.dailyCash));
      }
      let row = days.find((d) => d.date === date);
      const dayNum = this.dayFromDate(date);
      if (!row) {
        row = this.emptyCashDay(dayNum, date);
        // avoid day clash
        if (days.some((d) => d.day === dayNum && d.date !== date)) {
          row.day = dayNum;
        }
        days.push(row);
      }
      row.sales = summary.sales;
      row.salesFromLoad = true;
      row.loadProfit = summary.profit;
      row.loadDeliveryPcs = summary.deliveryPcs;
      row.date = date;
      days.sort((a, b) => a.day - b.day || (a.date < b.date ? -1 : 1));
      this.setCashDays(days);
      return row;
    }
  };
})();
