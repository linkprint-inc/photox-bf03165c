import { shopProducts, sizeSteps, type ShopProduct } from "./shop-data";

/** Every artwork available on Metal Print. */
export const metalProducts: ShopProduct[] = shopProducts;

export const metalFrom = Math.min(...metalProducts.map((p) => p.from));

export const metalSizes = sizeSteps;

export const largeFormatPrice = sizeSteps[sizeSteps.length - 1]!.price;
export const largeFormatSize = sizeSteps[sizeSteps.length - 1]!.label;

export function metalById(id: string): ShopProduct {
  return metalProducts.find((p) => p.id === id) ?? metalProducts[0]!;
}
