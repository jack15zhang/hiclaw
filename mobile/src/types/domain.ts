export type CarpoolType = 'offer' | 'request';

export type CarpoolPost = {
  id: string;
  type: CarpoolType;
  fromArea: string;
  toArea: string;
  time: string;
  seats: number;
  price: string;
  distanceBand: string;
  trustLevel: number;
};

export type MarketplaceItem = {
  id: string;
  title: string;
  price: string;
  condition: string;
  area: string;
  distanceBand: string;
  imageUrl: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};
