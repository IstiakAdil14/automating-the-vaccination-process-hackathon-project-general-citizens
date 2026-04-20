// ─── Landing page types ───────────────────────────────────────────────────────

export interface Feature {
  title: string;
  desc: string;
  color: string;
  icon: string;
}

export interface Stat {
  value: string;
  label: string;
  icon: string;
}

export interface Step {
  step: string;
  title: string;
  desc: string;
}

export interface Testimonial {
  avatar: string; // initials only — no full name
  role: string;
  text: string;
}

export interface TrustBadge {
  label: string;
}

// ─── New landing page types ─────────────────────────────────────────────────

export interface Program {
  id: string;
  slug: string;
  title: string;
  image: string;
  date: string;
  location: string;
  description: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  eligibility?: string;
  targetGroup?: string;
  organizer?: string;
  doses?: number;
  whatToBring?: string[];
  faqs?: { q: string; a: string }[];
}

export interface Action {
  label: string;
  href: string;
  icon: string;
  color: string;
  description: string;
}

export interface InfoCard {
  icon: string;
  title: string;
  description: string;
  color: string;
}

// ─── Citizen dashboard types ──────────────────────────────────────────────────

export interface HomeStats {
  vaccinesReceived: number;
  vaccinesScheduled: number;
  nextAppointmentDate: string;
  nextAppointmentTime: string;
  familyMembersCount: number;
  overallProgress: number; // 0–100
}

export interface Appointment {
  id: string;
  vaccineName: string;
  date: string;          // display string e.g. "Sat, 19 Apr 2026"
  time: string;          // display string e.g. "10:30 AM"
  centerName: string;
  centerAddress: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  mapsUrl: string;
  doctorName?: string;
  notes?: string;
  doseNumber?: string;   // e.g. "Dose 4 of 4"
}

export interface Reminder {
  id: string;
  type: "appointment" | "dose" | "alert" | "info";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed";
  ctaLabel: string;
  ctaHref: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  category: "Research" | "Policy" | "Outbreak" | "Innovation" | "Global" | "Bangladesh";
  title: string;
  excerpt: string;
  content: string[];
  source: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  tags?: string[];
}

// ─── Smart reminders ─────────────────────────────────────────────────────────
export type ReminderPriority = "high" | "medium" | "low";

export interface VaccineReminder {
  id: string;
  vaccine: string;
  dueDate: string; // ISO 8601 e.g. "2025-05-03"
  priority: ReminderPriority;
}

export type VaccineStatus = "Complete" | "Due Soon" | "Overdue" | "Scheduled";

export interface VaccineEntry {
  name: string;
  doses: number;      // total doses
  completed: number;  // doses completed
  status: VaccineStatus;
}

export interface FamilyMember {
  id: string;
  label: string;        // fallback display label
  name?: string;        // display name e.g. "Fatima"
  relation: string;
  progress: number;     // 0–100
  vaccinesGiven: number;
  vaccinesTotal: number;
  avatarColor?: string; // hex — assigned per member
}
