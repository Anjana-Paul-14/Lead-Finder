// apps/v4/types/place.ts
export interface Place {
  _id?: string;  
  name: string;
  vicinity: string;
  place_id: string;
  rating?: number;
  website?: string;
}