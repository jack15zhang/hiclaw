export type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  condition: string;
  area: string;
  distanceBand: string;
  imageUrls: string[];
};

const items: MarketplaceItem[] = [
  {
    id: 'i1',
    title: 'iPhone 14 Pro 256GB',
    description: 'Unlocked, good battery health, includes case.',
    category: 'electronics',
    price: '$760',
    condition: 'good',
    area: 'Markham',
    distanceBand: 'nearby area',
    imageUrls: [],
  },
  {
    id: 'i2',
    title: 'Commuter bike',
    description: 'Reliable city bike for daily rides.',
    category: 'sports',
    price: '$180',
    condition: 'used',
    area: 'Richmond Hill',
    distanceBand: 'about 6 km',
    imageUrls: [],
  },
];

export class MarketplaceService {
  browse() {
    return items;
  }

  create(input: Omit<MarketplaceItem, 'id' | 'distanceBand'>) {
    const item: MarketplaceItem = {
      ...input,
      id: `i-${Date.now()}`,
      distanceBand: 'nearby area',
    };

    items.unshift(item);
    return item;
  }
}
