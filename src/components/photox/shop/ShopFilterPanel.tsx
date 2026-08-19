import { orientationOptions, priceBands, sizeSteps, styleOptions } from "@/lib/shop-data";

export type FilterState = {
  materials: string[];
  sizes: string[];
  orientations: string[];
  styles: string[];
  prices: string[];
};

export const emptyFilters: FilterState = {
  materials: [],
  sizes: [],
  orientations: [],
  styles: [],
  prices: [],
};

export function countFilters(f: FilterState) {
  return Object.values(f).reduce((n, arr) => n + arr.length, 0);
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li>
      <label className="flex cursor-pointer items-center gap-3 py-1.5">
        <span
          aria-hidden
          className={[
            "flex h-3.5 w-3.5 shrink-0 items-center justify-center border transition-colors duration-300",
            checked ? "border-ink bg-ink" : "border-hairline",
          ].join(" ")}
        >
          {checked ? <span className="h-1.5 w-1.5 bg-paper" /> : null}
        </span>
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <span className="px-meta">{label}</span>
      </label>
    </li>
  );
}

function Radio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li>
      <label className="flex cursor-pointer items-center gap-3 py-1.5">
        <span
          aria-hidden
          className={[
            "flex h-3.5 w-3.5 shrink-0 items-center justify-center border transition-colors duration-300",
            checked ? "border-ink bg-ink" : "border-hairline",
          ].join(" ")}
        >
          {checked ? <span className="h-1.5 w-1.5 rounded-full bg-paper" /> : null}
        </span>
        <input
          type="radio"
          name="shop-category"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <span className="px-meta">{label}</span>
      </label>
    </li>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-rule py-6">
      <h3 className="px-label mb-3">{title}</h3>
      <ul>{children}</ul>
    </div>
  );
}

export function ShopFilterPanel({
  open,
  filters,
  results,
  onToggle,
  onClear,
  onClose,
  categories,
  category,
  onCategoryChange,
}: {
  open: boolean;
  filters: FilterState;
  results: number;
  onToggle: (group: keyof FilterState, value: string) => void;
  onClear: () => void;
  onClose: () => void;
  categories?: ReadonlyArray<{ key: string; label: string }>;
  category?: string;
  onCategoryChange?: (category: string) => void;
}) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-ink/10 md:hidden" onClick={onClose} aria-hidden />
      <aside
        aria-label="Filters"
        className="fixed inset-y-0 left-0 z-50 w-[86vw] max-w-[360px] overflow-y-auto border-r border-hairline bg-paper px-6 pb-32 pt-6 md:sticky md:top-24 md:z-0 md:h-[calc(100vh-8rem)] md:w-auto md:max-w-none md:border-r-0 md:bg-transparent md:px-0 md:pb-8"
      >
        <div className="flex items-baseline justify-between">
          <h2 className="px-label">Filter</h2>
          <button type="button" onClick={onClose} className="px-label px-underline md:hidden">
            Close
          </button>
        </div>

        {categories && category && onCategoryChange ? (
          <Group title="Category">
            {categories.map((item) => (
              <Radio
                key={item.key}
                label={item.label}
                checked={category === item.key}
                onChange={() => onCategoryChange(item.key)}
              />
            ))}
          </Group>
        ) : null}

        <Group title="Material">
          {["Metal Print", "Frameless Canvas"].map((m) => (
            <Check
              key={m}
              label={m}
              checked={filters.materials.includes(m)}
              onChange={() => onToggle("materials", m)}
            />
          ))}
        </Group>

        <Group title="Size">
          {sizeSteps.map((s) => (
            <Check
              key={s.label}
              label={s.label}
              checked={filters.sizes.includes(s.label)}
              onChange={() => onToggle("sizes", s.label)}
            />
          ))}
        </Group>

        <Group title="Orientation">
          {orientationOptions.map((o) => (
            <Check
              key={o}
              label={o}
              checked={filters.orientations.includes(o)}
              onChange={() => onToggle("orientations", o)}
            />
          ))}
        </Group>

        <Group title="Style">
          {styleOptions.map((s) => (
            <Check
              key={s}
              label={s}
              checked={filters.styles.includes(s)}
              onChange={() => onToggle("styles", s)}
            />
          ))}
        </Group>

        <Group title="Price">
          {priceBands.map((b) => (
            <Check
              key={b.label}
              label={b.label}
              checked={filters.prices.includes(b.label)}
              onChange={() => onToggle("prices", b.label)}
            />
          ))}
        </Group>

        <div className="px-rule sticky bottom-0 flex flex-wrap items-center justify-between gap-3 bg-paper py-5">
          <button
            type="button"
            onClick={onClear}
            className="px-label px-underline whitespace-nowrap opacity-60"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-label px-underline whitespace-nowrap"
          >
            Show {results} results →
          </button>
        </div>
      </aside>
    </>
  );
}
