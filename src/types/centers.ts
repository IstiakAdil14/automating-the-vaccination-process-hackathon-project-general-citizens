export interface Center {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  distance: number;
  vaccines: string[];
  slotsAvailable: number;
  totalCapacity: number;
  rating: number;
  address: string;
  phone: string;
  hours: string;
  timeSlots: ("morning" | "afternoon" | "evening")[];
  nextAvailableSlot: string;
  familyFriendly: boolean;
}

export type AvailabilityStatus = "available" | "limited" | "full";

export interface Filters {
  vaccines: string[];
  radius: number;
  timeSlots: ("morning" | "afternoon" | "evening")[];
  availableOnly: boolean;
  date: string;
}

export type SortOption = "nearest" | "availability" | "rating";
