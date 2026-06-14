import Constants from 'expo-constants';
import { carpoolPosts, marketplaceItems } from '../data/demoData';
import { CarpoolPost, CarpoolType, MarketplaceItem } from '../types/domain';

type ServerCarpoolPost = {
  id: string;
  type: 'offer' | 'request';
  fromArea: string;
  toArea: string;
  departureTime: string;
  seats: number;
  price: string;
  distanceBand: string;
  trustLevel: number;
};

type ServerMarketplaceItem = {
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

type AgentResponse = {
  intent: string;
  reply: string;
};

type LoginProvider = 'phone' | 'google' | 'facebook';

export type CreateCarpoolPostInput = {
  type: CarpoolType;
  fromArea: string;
  toArea: string;
  departureTime: string;
  seats: number;
  price: string;
};

export type CreateMarketplaceItemInput = {
  title: string;
  description: string;
  category: string;
  price: string;
  condition: string;
  area: string;
  imageUrls: string[];
};

type QuickLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    displayName: string;
    trustLevel: number;
  };
};

const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
const apiBaseUrl = extra?.apiBaseUrl ?? (expoHost ? `http://${expoHost}:3000` : 'http://localhost:3000');

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}/api${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API ${path} failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function formatCarpoolTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
  }).format(date);
}

function toCarpoolPost(post: ServerCarpoolPost): CarpoolPost {
  return {
    id: post.id,
    type: post.type,
    fromArea: post.fromArea,
    toArea: post.toArea,
    time: formatCarpoolTime(post.departureTime),
    seats: post.seats,
    price: post.price,
    distanceBand: post.distanceBand,
    trustLevel: post.trustLevel,
  };
}

function toMarketplaceItem(item: ServerMarketplaceItem): MarketplaceItem {
  return {
    id: item.id,
    title: item.title,
    price: item.price,
    condition: item.condition,
    area: item.area,
    distanceBand: item.distanceBand,
    imageUrl:
      item.imageUrls[0] ??
      'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=900&q=80',
  };
}

export async function fetchCarpoolPosts(): Promise<CarpoolPost[]> {
  try {
    const posts = await requestJson<ServerCarpoolPost[]>('/carpool');
    return posts.map(toCarpoolPost);
  } catch {
    return carpoolPosts;
  }
}

export async function fetchMarketplaceItems(): Promise<MarketplaceItem[]> {
  try {
    const items = await requestJson<ServerMarketplaceItem[]>('/marketplace');
    return items.map(toMarketplaceItem);
  } catch {
    return marketplaceItems;
  }
}

export async function createCarpoolPost(input: CreateCarpoolPostInput): Promise<CarpoolPost> {
  try {
    const post = await requestJson<ServerCarpoolPost>('/carpool', {
      body: JSON.stringify(input),
      method: 'POST',
    });

    return toCarpoolPost(post);
  } catch {
    return {
      id: `local-carpool-${Date.now()}`,
      type: input.type,
      fromArea: input.fromArea,
      toArea: input.toArea,
      time: formatCarpoolTime(input.departureTime),
      seats: input.seats,
      price: input.price,
      distanceBand: 'nearby area',
      trustLevel: 1,
    };
  }
}

export async function createMarketplaceItem(input: CreateMarketplaceItemInput): Promise<MarketplaceItem> {
  try {
    const item = await requestJson<ServerMarketplaceItem>('/marketplace', {
      body: JSON.stringify(input),
      method: 'POST',
    });

    return toMarketplaceItem(item);
  } catch {
    return {
      id: `local-market-${Date.now()}`,
      title: input.title,
      price: input.price,
      condition: input.condition,
      area: input.area,
      distanceBand: 'nearby area',
      imageUrl:
        input.imageUrls[0] ??
        'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=900&q=80',
    };
  }
}

export async function sendAgentMessage(message: string): Promise<AgentResponse> {
  try {
    return await requestJson<AgentResponse>('/agent/message', {
      body: JSON.stringify({ message }),
      method: 'POST',
    });
  } catch {
    return {
      intent: 'offline.fallback',
      reply: 'I am using local demo data for now. I can still help you review the flow on iPhone.',
    };
  }
}

export async function quickLogin(provider: LoginProvider): Promise<QuickLoginResponse> {
  try {
    return await requestJson<QuickLoginResponse>('/auth/quick-login', {
      body: JSON.stringify({ provider }),
      method: 'POST',
    });
  } catch {
    return {
      accessToken: 'offline-dev-token',
      refreshToken: 'offline-dev-refresh-token',
      user: {
        id: `offline-${provider}`,
        displayName: `${provider} member`,
        trustLevel: 1,
      },
    };
  }
}
