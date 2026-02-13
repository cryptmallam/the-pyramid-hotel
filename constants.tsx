
import React from 'react';
import { Wifi, Coffee, Car, Waves, Wind, Shirt, Users, Star } from 'lucide-react';
import { RoomType, Review, Facility } from './types';

export const HOTEL_DETAILS = {
  name: "The Pyramid Hotels",
  rating: 3.9,
  reviewsCount: 2149,
  address: "13 Lafia Road, City Centre, Kaduna 800283, Kaduna, Nigeria",
  phone: "0803 465 7770",
  checkout: "12:00 PM",
  colors: {
    gold: "#D4AF37",
    deepBlue: "#002147",
    gray: "#F8F9FA"
  }
};

export const AMENITIES = [
  { icon: <Wifi className="w-6 h-6" />, label: "Free Wi-Fi" },
  { icon: <Coffee className="w-6 h-6" />, label: "Free Breakfast" },
  { icon: <Car className="w-6 h-6" />, label: "Free Parking" },
  { icon: <Waves className="w-6 h-6" />, label: "Outdoor Swimming Pool" },
  { icon: <Wind className="w-6 h-6" />, label: "Air-Conditioned Rooms" },
  { icon: <Shirt className="w-6 h-6" />, label: "Laundry Service" },
  { icon: <Users className="w-6 h-6" />, label: "Conference & Event Facilities" },
];

export const ROOMS: RoomType[] = [
  {
    id: "std",
    name: "Standard Room",
    price: 50000,
    description: "Elegant comfort for the modern traveler, featuring all essential amenities in a refined setting.",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800",
    amenities: ["King Size Bed", "Fast Wi-Fi", "Smart TV", "Work Desk"]
  },
  {
    id: "dlx",
    name: "Deluxe Room",
    price: 75000,
    description: "Spacious and sophisticated, our Deluxe Rooms offer enhanced comfort and premium city views.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4df85b?auto=format&fit=crop&q=80&w=800",
    amenities: ["City View", "Mini Bar", "Luxury Linens", "Bath Tub"]
  },
  {
    id: "exec",
    name: "Executive Suite",
    price: 120000,
    description: "The pinnacle of luxury. Separate living area and master bedroom designed for business and relaxation.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800",
    amenities: ["Lounge Area", "VIP Service", "Kitchenette", "Premium View"]
  }
];

// Mock unavailable date ranges to simulate "real-time" availability
export const UNAVAILABLE_DATES: Record<string, { start: string, end: string }[]> = {
  "std": [
    { start: "2025-12-24", end: "2025-12-26" }, // Christmas
    { start: "2025-06-10", end: "2025-06-15" }
  ],
  "dlx": [
    { start: "2025-12-31", end: "2026-01-02" } // New Year
  ],
  "exec": [
    { start: "2025-05-01", end: "2025-05-05" }
  ]
};

export const FACILITIES: Facility[] = [
  {
    id: "pool",
    name: "Outdoor Pool",
    description: "A crystal clear oasis perfect for relaxation under the Kaduna sun.",
    icon: "waves",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "dining",
    name: "Restaurant & Dining",
    description: "Exquisite local and international cuisines prepared by world-class chefs.",
    icon: "utensils",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "events",
    name: "Event & Conference Hall",
    description: "State-of-the-art facilities for your professional conferences and grand celebrations.",
    icon: "users",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200"
  }
];

export const REVIEWS: Review[] = [
  {
    id: "1",
    author: "Alhaji Musa",
    rating: 4,
    comment: "Excellent service and very secure environment. The staff are professional and welcoming.",
    date: "2 months ago"
  },
  {
    id: "2",
    author: "Sarah Johnson",
    rating: 5,
    comment: "The most comfortable bed I've slept in. The proximity to the Golf Club is a huge plus!",
    date: "1 month ago"
  },
  {
    id: "3",
    author: "Emeka Okafor",
    rating: 4,
    comment: "Great conference facilities. Our corporate event went smoothly. Highly recommended.",
    date: "3 weeks ago"
  }
];
