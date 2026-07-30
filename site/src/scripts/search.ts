/*
 * Client-side docs search — the first consumer of /data/docs-index.json (D8). The
 * index is fetched ONCE, lazily, on first focus, then filtered as-you-type over
 * titles / headings / summary. Pure DOM, bundled under `script-src 'self'` (no CSP
 * exception). Every [data-search] root on the page (nav + hero) shares one fetch.
 */
interface Heading {
  text: string;
  anchor: string;
}
interface Entry {
  slug: string;
  url: string;
  title: string;
  section: "Product" | "Engineering" | "Manual";
  summary: string;
  headings: Heading[];
}

let cache: Entry[] | null = null;
let inflight: Promise<Entry[]> | null = null;

async function loadIndex(): Promise<Entry[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch("/data/docs-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => (cache = d as Entry[]))
      .catch(() => (cache = []));
  }
  return inflight;
}

function esc(s: string): string {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );
}

function score(entry: Entry, q: string): { hit: boolean; heading?: Heading } {
  const t = entry.title.toLowerCase();
  if (t.includes(q)) return { hit: true };
  const h = entry.headings.find((x) => x.text.toLowerCase().includes(q));
  if (h) return { hit: true, heading: h };
  if (entry.summary.toLowerCase().includes(q)) return { hit: true };
  return { hit: false };
}

function render(
  results: { entry: Entry; heading?: Heading }[],
  panel: HTMLElement,
  input: HTMLInputElement,
) {
  if (!results.length) {
    panel.innerHTML =
      '<p class="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">No matches.</p>';
  } else {
    panel.innerHTML = results
      .slice(0, 12)
      .map(({ entry, heading }) => {
        const href = heading ? `${entry.url}#${heading.anchor}` : entry.url;
        const sub = heading ? esc(heading.text) : esc(entry.summary);
        // Product is the default (no badge); Engineering + Manual are tagged.
        const badge = { Engineering: "Eng", Manual: "Manual" }[entry.section];
        const tag = badge
          ? `<span class="ml-2 shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">${badge}</span>`
          : "";
        return `<a role="option" href="${href}" class="flex items-start gap-1 rounded-md px-3 py-2 no-underline hover:bg-slate-500/10 focus:bg-accent-500/10 focus:outline-none">
          <span class="min-w-0 flex-1">
            <span class="flex items-center text-sm font-medium text-slate-900 dark:text-slate-100">${esc(entry.title)}${tag}</span>
            ${sub ? `<span class="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">${sub}</span>` : ""}
          </span>
        </a>`;
      })
      .join("");
  }
  panel.hidden = false;
  input.setAttribute("aria-expanded", "true");
}

function wire(rootEl: HTMLElement) {
  const input = rootEl.querySelector<HTMLInputElement>("[data-search-input]")!;
  const panel = rootEl.querySelector<HTMLElement>("[data-search-results]")!;

  const run = async () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) {
      panel.hidden = true;
      input.setAttribute("aria-expanded", "false");
      return;
    }
    const index = await loadIndex();
    const results: { entry: Entry; heading?: Heading }[] = [];
    for (const entry of index) {
      const s = score(entry, q);
      if (s.hit) results.push({ entry, heading: s.heading });
    }
    render(results, panel, input);
  };

  input.addEventListener("focus", () => {
    void loadIndex();
    if (input.value.trim().length >= 2) void run();
  });
  input.addEventListener("input", () => void run());
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      panel.hidden = true;
      input.setAttribute("aria-expanded", "false");
      input.blur();
    }
    if (e.key === "ArrowDown" && !panel.hidden) {
      e.preventDefault();
      panel.querySelector<HTMLElement>("a")?.focus();
    }
  });
  panel.addEventListener("keydown", (e) => {
    const items = [...panel.querySelectorAll<HTMLElement>("a")];
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[Math.min(i + 1, items.length - 1)]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (i <= 0) input.focus();
      else items[i - 1]?.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!rootEl.contains(e.target as Node)) {
      panel.hidden = true;
      input.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll<HTMLElement>("[data-search]").forEach(wire);
