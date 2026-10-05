import { tiers } from "./asher";
import { serviceAddons } from "./service-addons";

export interface CatalogEntry {
  id: string;
  title: string;
  description: string;
  /** Undefined = "A cotizar" (plans until pricing is set). */
  price?: number;
  unit?: string;
  priceFrom?: boolean;
  kind: "plan" | "service";
  area: string;
}

/** Every purchasable thing, keyed by id — the cart only stores ids. */
export const catalogById: Record<string, CatalogEntry> = {};

for (const service of Object.values(serviceAddons)) {
  // A sectioned service (Legal) labels each item with its own area.
  const groups = service.sections
    ? service.sections.map((section) => ({ area: `${service.label} · ${section.label}`, items: section.items }))
    : [{ area: service.label, items: service.items }];
  for (const group of groups) {
    for (const item of group.items) {
      catalogById[item.id] = { ...item, kind: "service", area: group.area };
    }
  }
}

export const planId = (tierId: string) => `plan-${tierId}`;

for (const tier of tiers) {
  catalogById[planId(tier.id)] = {
    id: planId(tier.id),
    title: tier.name,
    description: tier.audience,
    price: tier.price,
    kind: "plan",
    area: "Plan",
  };
}
