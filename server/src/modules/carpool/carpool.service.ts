export type CarpoolPost = {
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

const posts: CarpoolPost[] = [
  {
    id: 'c1',
    type: 'offer',
    fromArea: 'North York',
    toArea: 'Downtown Toronto',
    departureTime: '2026-06-12T18:20:00-04:00',
    seats: 2,
    price: '$8',
    distanceBand: 'about 2 km',
    trustLevel: 3,
  },
  {
    id: 'c2',
    type: 'request',
    fromArea: 'Scarborough',
    toArea: 'Pearson Airport',
    departureTime: '2026-06-13T08:00:00-04:00',
    seats: 1,
    price: 'split gas',
    distanceBand: 'about 5 km',
    trustLevel: 2,
  },
];

export class CarpoolService {
  browse() {
    return posts;
  }

  create(input: Omit<CarpoolPost, 'id' | 'distanceBand' | 'trustLevel'>) {
    const post: CarpoolPost = {
      ...input,
      id: `c-${Date.now()}`,
      distanceBand: 'nearby area',
      trustLevel: 1,
    };

    posts.unshift(post);
    return post;
  }
}
