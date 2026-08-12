import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type SearchCtx = {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
};

const Ctx = createContext<SearchCtx | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, openSearch, closeSearch }), [open, openSearch, closeSearch]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSearchUI(): SearchCtx {
  const ctx = useContext(Ctx);
  if (!ctx) return { open: false, openSearch: () => {}, closeSearch: () => {} };
  return ctx;
}
