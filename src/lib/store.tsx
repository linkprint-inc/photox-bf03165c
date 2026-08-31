import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import customPrintImage from "@/assets/custom-print.jpg";
import { shopProducts, sizeSteps, type ShopProduct } from "./shop-data";
import type { TextConfig, ToolId } from "./image-tools";
import type { PreparedImage } from "./prepared-image";

export type BagMaterial = "metal" | "canvas";
export type PrintOrientation = "landscape" | "portrait";

export type CropPosition = {
  zoom: number;
  x: number;
  y: number;
  aspectRatio: number;
};

export type PrintCustomization = {
  originalImage: PreparedImage;
  image: PreparedImage;
  appliedTools: ToolId[];
  textConfig?: TextConfig;
  crop: CropPosition;
  startingPointId: string;
  price: number;
  preview: "artwork" | "detail" | "room";
  orientation: PrintOrientation;
};

export type BagItem = {
  key: string;
  productId: string;
  material: BagMaterial;
  sizeIndex: number;
  orientation?: PrintOrientation;
  qty: number;
  customization?: PrintCustomization;
};

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

export type Account = {
  firstName: string;
  lastName: string;
  email: string;
  shippingAddress?: ShippingAddress;
  password?: string;
};

export type OrderItem = {
  productId: string;
  material: BagMaterial;
  sizeIndex: number;
  orientation?: PrintOrientation;
  qty: number;
  customization?: PrintCustomization;
};

export type Order = {
  id: string;
  placed: string;
  status: string;
  items: OrderItem[];
  shippingAddress: string[];
};

export type CheckoutDetails = {
  email: string;
  shippingAddress: string[];
};

const STORAGE = "photox-store-v1";

export const finishLabel: Record<BagMaterial, string> = {
  metal: "Gloss",
  canvas: "Matte",
};

export const materialName: Record<BagMaterial, string> = {
  metal: "Metal Print",
  canvas: "Frameless Canvas",
};

/** Placeholder record for prints built from a customer's own image. */
export const customPrintProduct: ShopProduct = {
  id: "custom-print",
  name: "Your Custom Print",
  material: "both",
  orientation: "Landscape",
  styles: ["Photography"],
  availableSizes: sizeSteps.map((size) => size.label),
  from: 69,
  image: customPrintImage,
  room: customPrintImage,
  badges: [],
};

export function productById(id: string): ShopProduct | undefined {
  if (id === customPrintProduct.id) return customPrintProduct;
  return shopProducts.find((p) => p.id === id);
}

export function unitPrice(material: BagMaterial, sizeIndex: number) {
  const base = sizeSteps[sizeIndex]!.price;
  return material === "canvas" ? base - 10 : base;
}

export function sizeLabel(sizeIndex: number) {
  return sizeSteps[sizeIndex]!.label;
}

/**
 * The source size scale is portrait (12 × 18). Landscape is the same physical tier
 * with its dimensions exchanged, so every consumer can share one orientation state.
 */
export function orientedSizeLabel(sizeIndex: number, orientation: PrintOrientation = "landscape") {
  const label = sizeLabel(sizeIndex);
  if (orientation === "portrait") return label;
  const match = label.match(/(\d+)\s*×\s*(\d+)(.*)/);
  return match ? `${match[2]} × ${match[1]}${match[3]}` : label;
}

function seedOrders(): Order[] {
  return [
    {
      id: "PX-10482",
      placed: "Aug 08, 2026",
      status: "In production",
      items: [
        { productId: "north-sea", material: "metal", sizeIndex: 3, qty: 1 },
        { productId: "blue-hour", material: "canvas", sizeIndex: 1, qty: 1 },
      ],
      shippingAddress: [
        "Anna Ferrell",
        "148 Warren Street, Apt 4",
        "Brooklyn, NY 11201",
        "United States",
      ],
    },
    {
      id: "PX-10231",
      placed: "Jun 21, 2026",
      status: "Delivered",
      items: [{ productId: "concrete-planes", material: "metal", sizeIndex: 2, qty: 1 }],
      shippingAddress: [
        "Anna Ferrell",
        "148 Warren Street, Apt 4",
        "Brooklyn, NY 11201",
        "United States",
      ],
    },
  ];
}

type State = {
  account: Account | null;
  saved: string[];
  bag: BagItem[];
  orders: Order[];
};

type Ctx = State & {
  hydrated: boolean;
  bagCount: number;
  subtotal: number;
  signIn: (a: Account) => void;
  signOut: () => void;
  updateAccount: (patch: Partial<Account>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => boolean;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  addToBag: (item: Omit<BagItem, "key">) => void;
  updateBag: (key: string, patch: Partial<Omit<BagItem, "key">>) => void;
  removeFromBag: (key: string) => void;
  placeOrder: (details: CheckoutDetails) => Order;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

const initial: State = { account: null, saved: [], bag: [], orders: [] };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setState({ ...initial, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const signIn = useCallback((account: Account) => {
    setState((s) => ({ ...s, account, orders: s.orders.length ? s.orders : seedOrders() }));
  }, []);

  const signOut = useCallback(() => {
    setState((s) => ({ ...s, account: null }));
  }, []);

  const updateAccount = useCallback((patch: Partial<Account>) => {
    setState((s) => (s.account ? { ...s, account: { ...s.account, ...patch } } : s));
  }, []);

  const updatePassword = useCallback((currentPassword: string, newPassword: string) => {
    if (!currentPassword || !newPassword) return false;
    setState((s) => (s.account ? { ...s, account: { ...s.account, password: newPassword } } : s));
    return true;
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [id, ...s.saved],
    }));
  }, []);

  const addToBag = useCallback((item: Omit<BagItem, "key">) => {
    setState((s) => {
      const baseKey = `${item.productId}-${item.material}-${item.sizeIndex}-${item.orientation ?? "landscape"}`;
      const key = item.customization
        ? `${baseKey}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
        : baseKey;
      const found = item.customization ? undefined : s.bag.find((b) => b.key === key);
      const bag = found
        ? s.bag.map((b) => (b.key === key ? { ...b, qty: b.qty + item.qty } : b))
        : [...s.bag, { ...item, key }];
      return { ...s, bag };
    });
    setDrawerOpen(true);
  }, []);

  const updateBag = useCallback((key: string, patch: Partial<Omit<BagItem, "key">>) => {
    setState((s) => {
      const next = s.bag.map((b) => (b.key === key ? { ...b, ...patch } : b));
      // merge duplicates created by config edits
      const merged: BagItem[] = [];
      for (const item of next) {
        if (item.customization) {
          merged.push(item);
          continue;
        }
        const newKey = `${item.productId}-${item.material}-${item.sizeIndex}-${item.orientation ?? "landscape"}`;
        const existing = merged.find((m) => m.key === newKey);
        if (existing) existing.qty += item.qty;
        else merged.push({ ...item, key: newKey });
      }
      return { ...s, bag: merged };
    });
  }, []);

  const removeFromBag = useCallback((key: string) => {
    setState((s) => ({ ...s, bag: s.bag.filter((b) => b.key !== key) }));
  }, []);

  const placeOrder = useCallback((details: CheckoutDetails) => {
    const order: Order = {
      id: `PX-${String(Date.now()).slice(-5)}`,
      placed: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(new Date()),
      status: "Order received",
      items: [],
      shippingAddress: details.shippingAddress,
    };
    setState((s) => {
      order.items = s.bag.map(
        ({ productId, material, sizeIndex, orientation, qty, customization }) => ({
          productId,
          material,
          sizeIndex,
          orientation,
          qty,
          customization,
        }),
      );
      return { ...s, orders: [order, ...s.orders], bag: [] };
    });
    return order;
  }, []);

  const value = useMemo<Ctx>(() => {
    const bagCount = state.bag.reduce((n, b) => n + b.qty, 0);
    const subtotal = state.bag.reduce((n, b) => n + unitPrice(b.material, b.sizeIndex) * b.qty, 0);
    return {
      ...state,
      hydrated,
      bagCount,
      subtotal,
      signIn,
      signOut,
      updateAccount,
      updatePassword,
      toggleSaved,
      isSaved: (id: string) => state.saved.includes(id),
      addToBag,
      updateBag,
      removeFromBag,
      placeOrder,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [
    state,
    hydrated,
    drawerOpen,
    signIn,
    signOut,
    updateAccount,
    updatePassword,
    toggleSaved,
    addToBag,
    updateBag,
    removeFromBag,
    placeOrder,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
