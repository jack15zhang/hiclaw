import { CarpoolPost, ChatMessage, MarketplaceItem } from '../types/domain';

export const initialMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    text: 'Tell me what you need. I can find a ride, post a ride, search second-hand items, or help you publish one.',
  },
];

export const carpoolPosts: CarpoolPost[] = [
  {
    id: 'c1',
    type: 'offer',
    fromArea: 'North York',
    toArea: 'Downtown Toronto',
    time: 'Today 6:20 PM',
    seats: 2,
    price: '$8',
    distanceBand: 'about 2 km away',
    trustLevel: 3,
  },
  {
    id: 'c2',
    type: 'request',
    fromArea: 'Scarborough',
    toArea: 'Pearson Airport',
    time: 'Tomorrow 8:00 AM',
    seats: 1,
    price: 'split gas',
    distanceBand: 'about 5 km away',
    trustLevel: 2,
  },
];

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: 'i1',
    title: 'iPhone 14 Pro 256GB',
    price: '$760',
    condition: 'Good',
    area: 'Markham',
    distanceBand: 'nearby area',
    imageUrl: 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'i2',
    title: 'Commuter bike',
    price: '$180',
    condition: 'Used',
    area: 'Richmond Hill',
    distanceBand: 'about 6 km away',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
  },
];
