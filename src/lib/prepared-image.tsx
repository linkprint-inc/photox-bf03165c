import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type PreparedImage = {
  dataUrl: string;
  width: number;
  height: number;
  name: string;
  /** Which photo tool produced this version, if any. */
  source?: "upload" | "restore" | "enhance" | "text";
};

const KEY = "photox-prepared-image-v1";

type Ctx = {
  image: PreparedImage | null;
  setImage: (image: PreparedImage | null) => void;
  hydrated: boolean;
};

const PreparedImageContext = createContext<Ctx | null>(null);

export function PreparedImageProvider({ children }: { children: ReactNode }) {
  const [image, setImageState] = useState<PreparedImage | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setImageState(JSON.parse(raw) as PreparedImage);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const setImage = useCallback((next: PreparedImage | null) => {
    setImageState(next);
    try {
      if (next) sessionStorage.setItem(KEY, JSON.stringify(next));
      else sessionStorage.removeItem(KEY);
    } catch {
      /* storage full or unavailable — keep the in-memory copy */
    }
  }, []);

  const value = useMemo<Ctx>(() => ({ image, setImage, hydrated }), [image, setImage, hydrated]);

  return <PreparedImageContext.Provider value={value}>{children}</PreparedImageContext.Provider>;
}

export function usePreparedImage() {
  const ctx = useContext(PreparedImageContext);
  if (!ctx) throw new Error("usePreparedImage must be used within PreparedImageProvider");
  return ctx;
}

export const acceptedTypes = "image/jpeg,image/png,image/webp";
export const acceptedLabel = "JPG, PNG or WebP";

/** Reads a File into a data URL plus its true pixel dimensions. */
export function readImageFile(file: File): Promise<PreparedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a readable image."));
      img.onload = () =>
        resolve({
          dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          name: file.name,
          source: "upload",
        });
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/** Minimum long-edge pixels we consider comfortable for a given print inch size. */
export function minPixelsFor(inches: number) {
  return Math.round(inches * 1.5 * 150);
}
