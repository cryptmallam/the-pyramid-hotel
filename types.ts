
export interface RoomType {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  amenities: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
}
