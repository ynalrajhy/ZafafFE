import { User } from "./User";

export interface Event {
  _id: string;
  title: string;
  description: string;
  category:
    | "Sports"
    | "Music"
    | "Art"
    | "Food"
    | "Technology"
    | "Business"
    | "Social"
    | "Other";
  date: string;
  time: string;
  location: string;
  area: string;
  familyName?: string;
  image?: string;
  createdBy: User;
  likes: string[];
  attendees: string[];
  createdAt: string;
  updatedAt: string;
}
