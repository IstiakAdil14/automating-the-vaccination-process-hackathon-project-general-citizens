export type FAQItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export const FAQ_CATEGORIES = [
  "Registration",
  "Booking",
  "Vaccine Card",
  "Privacy & Data",
  "Technical",
  "Family Accounts",
] as const;

export type FAQCategory = (typeof FAQ_CATEGORIES)[number];

export const faqData: FAQItem[] = [
  // ── Registration ──────────────────────────────────────────────────────────
  {
    id: "reg-1",
    category: "Registration",
    question: "Who can register on VaxEPI?",
    answer:
      "Any Bangladeshi citizen with a valid National ID (NID) or Birth Certificate can register. There is no age restriction — parents or guardians can register on behalf of minors.",
  },
  {
    id: "reg-2",
    category: "Registration",
    question: "Is registration free?",
    answer:
      "Yes. Registration and all platform features are completely free. There are no hidden charges, subscription fees, or in-app purchases.",
  },
  {
    id: "reg-3",
    category: "Registration",
    question: "What documents do I need to register?",
    answer:
      "You need either a National ID (NID) — 10 or 17 digits — or a Birth Certificate number (17 digits). A valid email address is also required for OTP verification.",
  },
  {
    id: "reg-4",
    category: "Registration",
    question: "I don't have an NID. Can I still register?",
    answer:
      "Yes. You can register using your Birth Certificate number along with your date of birth as printed on the certificate. Passport and driving license are optional for profile completion.",
  },
  {
    id: "reg-5",
    category: "Registration",
    question: "How long does registration take?",
    answer:
      "Registration takes under 5 minutes. You complete 4 steps: identity verification, email OTP, profile details, and password creation. Your account is active immediately after.",
  },

  // ── Booking ───────────────────────────────────────────────────────────────
  {
    id: "book-1",
    category: "Booking",
    question: "How do I book a vaccination appointment?",
    answer:
      "Log in to your account, go to Appointments, select a vaccine, choose a nearby center from the map, pick an available date and time slot, and confirm. You'll receive an SMS and email confirmation.",
  },
  {
    id: "book-2",
    category: "Booking",
    question: "Can I book for a family member?",
    answer:
      "Yes. After adding family members to your account under Family Management, you can book appointments on their behalf. Each member's vaccination history is tracked separately.",
  },
  {
    id: "book-3",
    category: "Booking",
    question: "Can I walk in without an appointment?",
    answer:
      "Yes. All vaccination centers accept walk-in patients. You'll receive a token number at the center. Walk-ins are served after scheduled appointments when slots are available.",
  },
  {
    id: "book-4",
    category: "Booking",
    question: "How do I cancel or reschedule an appointment?",
    answer:
      "Go to Appointments in your dashboard, find the booking, and select Cancel or Reschedule. Cancellations must be made at least 2 hours before the appointment time.",
  },
  {
    id: "book-5",
    category: "Booking",
    question: "What happens if I miss my appointment?",
    answer:
      "Missed appointments are marked as no-show. You can rebook immediately with no penalty. Repeated no-shows may temporarily limit same-day booking priority.",
  },

  // ── Vaccine Card ──────────────────────────────────────────────────────────
  {
    id: "card-1",
    category: "Vaccine Card",
    question: "What is the digital vaccine card?",
    answer:
      "Your digital vaccine card is a QR-code-based certificate that records all your vaccinations. It can be downloaded as a PDF, shared digitally, or shown at borders and institutions.",
  },
  {
    id: "card-2",
    category: "Vaccine Card",
    question: "Is the digital vaccine card officially recognized?",
    answer:
      "Yes. The VaxEPI digital vaccine card is issued under the Ministry of Health and is recognized by government institutions, schools, and international travel authorities.",
  },
  {
    id: "card-3",
    category: "Vaccine Card",
    question: "I have a paper vaccine card. Can I upload it?",
    answer:
      "Yes. Use the OCR Card Scanner feature in your profile to photograph your paper card. The system will extract and verify the records, which are then added to your digital history pending staff confirmation.",
  },
  {
    id: "card-4",
    category: "Vaccine Card",
    question: "What if my vaccination record is missing or incorrect?",
    answer:
      "Contact the vaccination center where you received the dose. Center staff can update records. You can also raise a correction request from your Vaccine Card page, which is reviewed within 3 working days.",
  },

  // ── Privacy & Data ────────────────────────────────────────────────────────
  {
    id: "priv-1",
    category: "Privacy & Data",
    question: "Is my NID stored securely?",
    answer:
      "Yes. Your NID is encrypted at rest using AES-256 and is never exposed in full in any interface. Only the last 4 digits are shown for verification purposes.",
  },
  {
    id: "priv-2",
    category: "Privacy & Data",
    question: "Does VaxEPI share my data with third parties?",
    answer:
      "No. Your personal data is never sold or shared with advertisers or commercial third parties. Anonymized, aggregated statistics may be shared with WHO and MoH for public health reporting.",
  },
  {
    id: "priv-3",
    category: "Privacy & Data",
    question: "Can I delete my account and data?",
    answer:
      "Yes. You can request account deletion from your Profile settings. Vaccination records are retained for 90 days after deletion as required by national health regulations, then permanently removed.",
  },
  {
    id: "priv-4",
    category: "Privacy & Data",
    question: "How can I export my vaccination data?",
    answer:
      "Go to Profile → Data & Privacy → Export My Data. You'll receive a downloadable JSON and PDF of all your records within 24 hours via email.",
  },

  // ── Technical ─────────────────────────────────────────────────────────────
  {
    id: "tech-1",
    category: "Technical",
    question: "Does the app work offline?",
    answer:
      "Core features like viewing your vaccine card, emergency contacts, and vaccination history are available offline. Booking and real-time center availability require an internet connection.",
  },
  {
    id: "tech-2",
    category: "Technical",
    question: "Which browsers and devices are supported?",
    answer:
      "VaxEPI works on all modern browsers (Chrome, Firefox, Safari, Edge) on both mobile and desktop. For the best experience, use Chrome or Safari on Android/iOS.",
  },
  {
    id: "tech-3",
    category: "Technical",
    question: "I'm not receiving the OTP email. What should I do?",
    answer:
      "Check your spam/junk folder first. If not found, wait 2 minutes and use the Resend Code option. Ensure the email address entered is correct. Contact support if the issue persists.",
  },
  {
    id: "tech-4",
    category: "Technical",
    question: "How do I reset my password?",
    answer:
      "Click Forgot Password on the login page, enter your registered email, and follow the reset link sent to your inbox. The link expires in 30 minutes.",
  },
  {
    id: "tech-5",
    category: "Technical",
    question: "Is there a mobile app?",
    answer:
      "VaxEPI is a Progressive Web App (PWA). You can install it on your home screen from any browser without visiting an app store. A native Android app is planned for Q3 2026.",
  },

  // ── Family Accounts ───────────────────────────────────────────────────────
  {
    id: "fam-1",
    category: "Family Accounts",
    question: "How many family members can I add?",
    answer:
      "You can add up to 6 family members under one account. Each member has their own vaccination history, appointment schedule, and digital vaccine card.",
  },
  {
    id: "fam-2",
    category: "Family Accounts",
    question: "Can I add a child who doesn't have an NID?",
    answer:
      "Yes. Children under 18 can be added using their Birth Certificate number. If no certificate is available, a guardian can register them with their own NID and the child's date of birth.",
  },
  {
    id: "fam-3",
    category: "Family Accounts",
    question: "Can a family member access their own records independently?",
    answer:
      "Adult family members (18+) can create their own separate account and link it to the family group. Minors' records are managed by the account holder.",
  },
  {
    id: "fam-4",
    category: "Family Accounts",
    question: "What happens to family records if I delete my account?",
    answer:
      "Adult family members with linked accounts retain their own records. Records of minors registered solely under your account are retained for 90 days per data retention policy, then removed.",
  },
];
