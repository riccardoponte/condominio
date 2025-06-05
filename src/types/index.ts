export const IssueStatus = {
  APERTO: 'Aperto',
  IN_ELABORAZIONE: 'In Elaborazione',
  RISOLTO: 'Risolto',
  CHIUSO: 'Chiuso',
} as const;

export type IssueStatusKeys = keyof typeof IssueStatus;
export type IssueStatusValues = typeof IssueStatus[IssueStatusKeys];

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string; // ISO date string
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string; // ISO date string
  url?: string;
  tags: string[];
}

export interface Issue {
  id: string;
  description: string;
  location: string;
  reportedDate: string; // ISO date string
  status: IssueStatusValues;
  urgency: string; // Could be an enum: 'Bassa', 'Media', 'Alta', 'Critica'
  priority?: string; // Could be an enum like urgency
  locationDetails?: string;
  photoUrlPlaceholder?: string;
  assignedVendor?: string;
  resolutionNotes?: string;
  // reportedBy?: string; // Missing in current structure but good for future
}

export interface Reservation {
  id: string;
  amenity: string;
  userName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
}

export interface PackageInfo { // Renamed from Package to avoid conflict with potential global Package type
  id: string;
  residentName: string;
  courier: string;
  trackingNumber?: string;
  receivedDate: string; // ISO date string
  notes?: string;
  collected: boolean;
  collectedDate?: string; // ISO date string
}

export interface PollOption {
  id: string;
  text: string;
}

export interface PollVote {
  userId: string;
  optionId: string;
}

export type PollStatus = 'active' | 'closed' | 'proposed';

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdDate: string; // ISO date string
  createdBy: string;
  status: PollStatus;
  endDate?: string; // ISO date string
  votes: PollVote[];
  proposedBy?: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  createdBy: string;
  createdDate: string; // ISO date string
  lastPostDate?: string; // ISO date string
  postCount: number;
}

export interface ForumPost {
  id: string;
  topicId: string;
  content: string;
  postedBy: string;
  postedDate: string; // ISO date string
}

export interface UserUnit {
  id: string;
  address: string;
  type: string; // Could be an enum: 'appartamento', 'garage', 'cantina', 'posto_auto'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  units: UserUnit[];
}

export type FeeStatus = 'Da Pagare' | 'Pagata' | 'In Ritardo';

export interface Fee {
  id: string;
  description: string;
  amount: number;
  dueDate: string; // ISO date string
  status: FeeStatus;
  paymentDate?: string; // ISO date string
  notes?: string;
}

// It seems FeeStatus and IssueUrgency are used as string literals directly in the code.
// If they were more complex or had a fixed set of values used in multiple places,
// creating const enums for them would be beneficial, similar to IssueStatus.
// For now, string types suffice based on current usage.

export type IssueUrgency = 'Bassa' | 'Media' | 'Alta' | 'Critica';

// Example of a more generic type for component props if needed later
export interface BaseProps {
  className?: string;
  // other common props
}

// Example for Icon components
export interface IconProps extends BaseProps {
  // specific icon props if any, e.g. size
}
