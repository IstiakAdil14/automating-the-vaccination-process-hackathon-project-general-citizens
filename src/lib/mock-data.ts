import type {
  Feature, Stat, Step, Testimonial, TrustBadge,
  HomeStats, Appointment, Reminder, Event, FamilyMember,
  Program, Action, InfoCard, NewsArticle, VaccineReminder,
} from "@/types/home";

// ─── Landing page data ────────────────────────────────────────────────────────

export const features: Feature[] = [
  { title: "AI-Powered Booking",       desc: "Smart appointment scheduling that learns your preferences and finds the best slots near you.",   color: "#4f46e5", icon: "Calendar" },
  { title: "Digital Vaccine Passport", desc: "Tamper-proof QR-based vaccine card accepted globally. Always in your pocket.",                   color: "#10b981", icon: "QrCode"   },
  { title: "Family Management",        desc: "Manage vaccination records for your entire family from a single dashboard.",                      color: "#f59e0b", icon: "Users"    },
  { title: "AI Health Assistant",      desc: "24/7 AI chatbot answers your vaccine questions, side-effect concerns, and more.",                 color: "#8b5cf6", icon: "Brain"    },
  { title: "Real-Time Centers",        desc: "Live map showing nearby vaccination centers with slot availability and wait times.",              color: "#ef4444", icon: "MapPin"   },
  { title: "Smart Reminders",          desc: "Never miss a dose. Get SMS, email, and in-app reminders at the right time.",                     color: "#06b6d4", icon: "Bell"     },
];

export const stats: Stat[] = [
  { value: "2.4M+",  label: "Citizens Protected",  icon: "Shield" },
  { value: "98.7%",  label: "Satisfaction Rate",   icon: "Star"   },
  { value: "340+",   label: "Vaccination Centers", icon: "MapPin" },
  { value: "< 2min", label: "Avg Booking Time",    icon: "Zap"    },
];

export const steps: Step[] = [
  { step: "01", title: "Register with NID",  desc: "Quick verification using your National ID or Birth Certificate with OTP."           },
  { step: "02", title: "Book Appointment",   desc: "AI finds the best center and time slot based on your location and schedule."         },
  { step: "03", title: "Get Vaccinated",     desc: "Walk in, scan your QR code, and get vaccinated in minutes."                         },
  { step: "04", title: "Track & Share",      desc: "Your digital vaccine passport is instantly updated and shareable."                   },
];

export const testimonials: Testimonial[] = [
  { avatar: "FR", role: "Mother of 3",       text: "Managing my whole family's vaccination schedule used to be a nightmare. VaxCare made it effortless."       },
  { avatar: "KH", role: "Software Engineer", text: "The QR vaccine passport saved me at the airport. Instant verification, no paperwork."                      },
  { avatar: "NI", role: "General Physician", text: "I recommend VaxCare to all my patients. The reminders alone have improved compliance dramatically."         },
];

export const trustBadges: TrustBadge[] = [
  { label: "No credit card required" },
  { label: "Free forever"            },
  { label: "HIPAA compliant"         },
];

export const vaccinationPrograms: Program[] = [
  {
    id: "prog-001",
    slug: "national-polio-immunization-day",
    title: "National Polio Immunization Day",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80",
    date: "May 3, 2025",
    location: "Nationwide — All Registered Centers",
    description: "Free polio vaccination for all children under 5. Bring your health card. Walk-ins welcome at all registered centers.",
    status: "Upcoming",
    eligibility: "All children under 5 years of age, regardless of prior vaccination history.",
    targetGroup: "Children (0–5 years)",
    organizer: "Ministry of Health & Family Welfare, Bangladesh",
    doses: 1,
    whatToBring: ["Child's health card", "NID of parent/guardian", "Previous vaccination records (if any)"],
    faqs: [
      { q: "Is this vaccine free?", a: "Yes, completely free for all eligible children at all registered centers." },
      { q: "My child already received OPV. Do they need this?", a: "Yes. This is a supplementary dose to boost immunity nationwide, regardless of prior doses." },
      { q: "What are the side effects?", a: "OPV is very safe. Mild diarrhea may occur in rare cases. Serious side effects are extremely rare." },
      { q: "Can I walk in without an appointment?", a: "Yes. Walk-ins are welcome at all registered centers on the campaign day." },
    ],
  },
  {
    id: "prog-002",
    slug: "measles-rubella-campaign",
    title: "Measles–Rubella Campaign",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
    date: "Apr 28 – May 2, 2025",
    location: "Dhaka, Chittagong, Sylhet Divisions",
    description: "Targeted MR campaign across three divisions. Eligible age group: 9 months to 15 years. Walk-ins welcome.",
    status: "Upcoming",
    eligibility: "Children aged 9 months to 15 years in Dhaka, Chittagong, and Sylhet divisions.",
    targetGroup: "Children & Adolescents (9 months – 15 years)",
    organizer: "DGHS Bangladesh in partnership with UNICEF",
    doses: 1,
    whatToBring: ["Child's birth certificate or health card", "Parent/guardian NID"],
    faqs: [
      { q: "Why is this campaign limited to three divisions?", a: "These divisions showed lower MR coverage in the last national survey. The campaign targets under-immunized areas first." },
      { q: "Can children who already had measles get vaccinated?", a: "Yes. The vaccine is safe even if the child had measles before and provides protection against rubella." },
      { q: "Are there any contraindications?", a: "Children with known immunodeficiency or gelatin allergy should consult a doctor before vaccination." },
    ],
  },
  {
    id: "prog-003",
    slug: "covid-19-booster-drive",
    title: "COVID-19 Booster Drive",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&q=80",
    date: "Apr 10 – Apr 20, 2025",
    location: "All Urban Health Centers",
    description: "4th dose booster available at all urban health centers. Limited slots — book early to secure your appointment.",
    status: "Ongoing",
    eligibility: "Adults 18+ who completed their primary COVID-19 series at least 6 months ago.",
    targetGroup: "Adults (18+), especially elderly and immunocompromised",
    organizer: "Ministry of Health & Family Welfare, Bangladesh",
    doses: 1,
    whatToBring: ["National ID (NID)", "Previous COVID-19 vaccination certificate", "VaxCare QR code (if registered)"],
    faqs: [
      { q: "Which vaccine will be administered?", a: "Pfizer-BioNTech or Moderna bivalent booster, subject to availability at your chosen center." },
      { q: "Do I need to book in advance?", a: "Yes. Slots are limited. Book through VaxCare to guarantee your spot." },
      { q: "How long after my 3rd dose can I get the 4th?", a: "A minimum of 6 months after your last dose is recommended by WHO guidelines." },
      { q: "Is it safe to mix vaccine brands?", a: "Yes. Cross-brand boosting is approved and shown to produce strong immune responses." },
    ],
  },
  {
    id: "prog-004",
    slug: "hepatitis-b-awareness-drive",
    title: "Hepatitis B Awareness Drive",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
    date: "Mar 1 – Mar 31, 2025",
    location: "Dhaka & Chittagong Districts",
    description: "Free Hepatitis B screening and vaccination for adults aged 18–45. Three-dose schedule over 6 months.",
    status: "Completed",
    eligibility: "Adults aged 18–45 with no prior Hepatitis B vaccination.",
    targetGroup: "Adults (18–45 years)",
    organizer: "IEDCR Bangladesh & WHO Bangladesh Office",
    doses: 3,
    whatToBring: ["National ID (NID)", "Any prior vaccination records"],
    faqs: [
      { q: "This program is completed. Can I still get vaccinated?", a: "Yes. Hepatitis B vaccine is available year-round at registered centers. Book an appointment through VaxCare." },
      { q: "What is the 3-dose schedule?", a: "Dose 1 on day 0, Dose 2 at 1 month, Dose 3 at 6 months." },
    ],
  },
  {
    id: "prog-005",
    slug: "influenza-seasonal-campaign",
    title: "Influenza Seasonal Campaign",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&q=80",
    date: "Jun 1 – Jun 30, 2025",
    location: "All Registered Centers",
    description: "Annual flu vaccine campaign for high-risk groups including elderly, pregnant women, and healthcare workers.",
    status: "Upcoming",
    eligibility: "Priority groups: adults 60+, pregnant women, healthcare workers, and those with chronic conditions.",
    targetGroup: "High-risk adults, elderly, pregnant women, healthcare workers",
    organizer: "Ministry of Health & Family Welfare, Bangladesh",
    doses: 1,
    whatToBring: ["National ID (NID)", "Proof of eligibility (e.g. pregnancy card, employment ID for healthcare workers)"],
    faqs: [
      { q: "Why do I need a flu shot every year?", a: "Influenza viruses mutate annually. The vaccine is updated each year to match circulating strains." },
      { q: "Can I get the flu from the flu vaccine?", a: "No. The vaccine contains inactivated virus and cannot cause influenza." },
      { q: "Is it safe during pregnancy?", a: "Yes. The inactivated flu vaccine is recommended during any trimester of pregnancy." },
    ],
  },
  {
    id: "prog-006",
    slug: "hpv-vaccination-adolescents",
    title: "HPV Vaccination for Adolescents",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80",
    date: "May 15 – Jun 15, 2025",
    location: "Selected School Health Centers",
    description: "HPV vaccine for girls aged 10–14 years. Two-dose schedule. Conducted in partnership with school health programs.",
    status: "Upcoming",
    eligibility: "Girls aged 10–14 years enrolled in participating schools.",
    targetGroup: "Adolescent girls (10–14 years)",
    organizer: "DGHS Bangladesh & School Health Program",
    doses: 2,
    whatToBring: ["School ID or birth certificate", "Parent/guardian written consent form", "Parent/guardian NID"],
    faqs: [
      { q: "Why only girls?", a: "This phase targets girls as they are at highest risk for HPV-related cervical cancer. A future phase will include boys." },
      { q: "What is the 2-dose schedule?", a: "Dose 1 at enrollment, Dose 2 six months later at the same school health center." },
      { q: "Is parental consent required?", a: "Yes. A signed consent form from a parent or guardian is mandatory before vaccination." },
      { q: "Does the HPV vaccine protect against all HPV types?", a: "The vaccine covers the highest-risk strains (HPV 16 & 18) responsible for ~70% of cervical cancers." },
    ],
  },
];

export const quickActionsLanding: Action[] = [
  { label: "Register",         href: "/register",     icon: "UserPlus",  color: "#4f46e5", description: "Create your free account" },
  { label: "Login",            href: "/login",        icon: "LogIn",     color: "#10b981", description: "Access your dashboard"    },
  { label: "Book Appointment", href: "/appointments", icon: "Calendar",  color: "#f59e0b", description: "Schedule a vaccination"   },
  { label: "Check Schedule",   href: "/appointments", icon: "ClipboardList", color: "#8b5cf6", description: "View upcoming programs" },
];

export const remindersInfo: InfoCard[] = [
  { icon: "Bell",       title: "Dose Reminders",    description: "Automated SMS and email alerts before every scheduled dose so you never miss a vaccination.",          color: "#4f46e5" },
  { icon: "HeartPulse", title: "Health Alerts",     description: "Instant notifications about new vaccination drives, outbreaks, and public health advisories in your area.", color: "#ef4444" },
  { icon: "RefreshCw",  title: "Follow-up Notices", description: "Smart follow-ups after each dose to confirm completion and remind you of the next dose in the series.",    color: "#10b981" },
];

// ─── Citizen dashboard data ───────────────────────────────────────────────────

export const homeStats: HomeStats = {
  vaccinesReceived: 3,
  vaccinesScheduled: 5,
  nextAppointmentDate: "Apr 24, 2025",
  nextAppointmentTime: "10:30 AM",
  familyMembersCount: 4,
  overallProgress: 60,
};

export const upcomingAppointment: Appointment = {
  id: "apt-001",
  vaccineName: "COVID-19 Booster (4th Dose)",
  date: "Sat, 19 Apr 2026",
  time: "10:30 AM",
  centerName: "Dhaka Medical Center",
  centerAddress: "Zahir Raihan Rd, Dhaka 1000",
  status: "confirmed",
  mapsUrl: "https://maps.google.com/?q=Dhaka+Medical+Center",
  doctorName: "Dr. Farhan Hossain",
  doseNumber: "Dose 4 of 4",
  notes: "Bring your vaccine card and NID. Arrive 10 minutes early for registration.",
};

export const appointments: Appointment[] = [
  upcomingAppointment,
  {
    id: "apt-002",
    vaccineName: "Hepatitis B (Dose 3)",
    date: "May 12, 2025",
    time: "2:00 PM",
    centerName: "Square Hospital",
    centerAddress: "18/F West Panthapath, Dhaka 1205",
    status: "pending",
    mapsUrl: "https://maps.google.com/?q=Square+Hospital+Dhaka",
  },
];

export const reminders: Reminder[] = [
  { id: "rem-001", type: "appointment", title: "Upcoming Appointment",  description: "COVID-19 Booster in 3 days at Dhaka Medical Center.",          time: "2 hours ago", read: false },
  { id: "rem-002", type: "dose",        title: "Dose Due Soon",         description: "Hepatitis B Dose 3 is due next month. Book your slot early.",   time: "Yesterday",   read: false },
  { id: "rem-003", type: "alert",       title: "New Vaccination Drive", description: "Meningococcal vaccine drive announced for your region.",        time: "2 days ago",  read: true  },
  { id: "rem-004", type: "info",        title: "Passport Updated",      description: "Your digital vaccine passport has been updated successfully.",  time: "3 days ago",  read: true  },
];

export const events: Event[] = [
  {
    id: "evt-001",
    title: "National Polio Immunization Day",
    description: "Free polio vaccination for all children under 5. Bring your health card.",
    date: "May 3, 2025",
    location: "Nationwide — All Registered Centers",
    status: "upcoming",
    ctaLabel: "Register Now",
    ctaHref: "/appointments",
  },
  {
    id: "evt-002",
    title: "Measles–Rubella Campaign",
    description: "Targeted MR campaign across three divisions. Walk-ins welcome.",
    date: "Apr 28 – May 2, 2025",
    location: "Dhaka, Chittagong, Sylhet Divisions",
    status: "upcoming",
    ctaLabel: "View Details",
    ctaHref: "/appointments",
  },
  {
    id: "evt-003",
    title: "COVID-19 Booster Drive",
    description: "4th dose booster available at all urban health centers. Limited slots.",
    date: "Apr 10 – Apr 20, 2025",
    location: "All Urban Health Centers",
    status: "ongoing",
    ctaLabel: "Book Slot",
    ctaHref: "/appointments",
  },
];

export const vaccinationNews: NewsArticle[] = [
  {
    id: "n1",
    slug: "bangladesh-78-percent-epi-coverage-q1-2025",
    category: "Bangladesh",
    title: "Bangladesh Achieves 78% EPI Coverage in Q1 2025 — WHO Commends Progress",
    excerpt: "The Expanded Programme on Immunization has reached a record 78% national coverage rate in the first quarter of 2025, with rural districts showing the highest improvement in a decade.",
    content: [
      "Bangladesh's Expanded Programme on Immunization (EPI) has achieved a landmark 78% national coverage rate in Q1 2025, marking the highest quarterly figure since the programme's inception. The milestone was announced jointly by the Directorate General of Health Services (DGHS) and the World Health Organization Bangladesh office.",
      "Rural districts, historically the most challenging to reach, recorded the steepest improvement — up 14 percentage points compared to Q1 2024. Health officials attribute this to a combination of community health worker deployment, mobile vaccination units, and the VaxCare digital booking platform which reduced no-show rates by an estimated 22%.",
      "WHO Representative Dr. Bardan Jung Rana praised Bangladesh's commitment: 'This achievement demonstrates what is possible when digital health infrastructure, community engagement, and government commitment align. Bangladesh is setting a model for the region.'",
      "The EPI programme covers 10 antigens including BCG, OPV, Pentavalent, PCV, MR, and COVID-19 boosters. The Q1 data shows particularly strong uptake for the Pentavalent vaccine (82%) and MR second dose (76%), both of which had lagged in previous years.",
      "DGHS Director General Professor Dr. Abul Bashar Mohammad Khurshid Alam stated that the government aims to reach 85% coverage by end of 2025, with a focus on hard-to-reach char and haor areas through dedicated outreach campaigns.",
    ],
    source: "WHO Bangladesh",
    date: "Apr 20, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
    featured: true,
    tags: ["EPI", "Coverage", "WHO", "Bangladesh", "Rural Health"],
  },
  {
    id: "n2",
    slug: "mrna-malaria-vaccine-77-percent-efficacy-phase-3",
    category: "Research",
    title: "New mRNA Malaria Vaccine Shows 77% Efficacy in Phase III Trials",
    excerpt: "Oxford University and Serum Institute report breakthrough results for the R21/Matrix-M malaria vaccine, potentially transforming immunization in tropical regions including South Asia.",
    content: [
      "A landmark Phase III clinical trial has demonstrated 77% efficacy for the R21/Matrix-M malaria vaccine developed by Oxford University's Jenner Institute in partnership with the Serum Institute of India. The results, published in The Lancet, represent the most effective malaria vaccine to date.",
      "The trial enrolled 4,800 children aged 5–36 months across four African countries and followed participants for two years. The vaccine showed sustained protection with a booster dose, maintaining 75% efficacy through the second transmission season — a critical benchmark for malaria-endemic regions.",
      "For South Asia, including Bangladesh, where malaria remains endemic in the Chittagong Hill Tracts, the implications are significant. IEDCR researchers are evaluating the vaccine's applicability to the Plasmodium vivax strains predominant in the region, which differ from the African P. falciparum strains studied in the trial.",
      "Professor Adrian Hill, Director of the Jenner Institute, noted: 'The mRNA platform allows rapid adaptation to regional parasite variants. We anticipate a South Asia-specific formulation could enter trials within 18 months.'",
      "The WHO's malaria vaccine advisory group is expected to review the data for potential prequalification in late 2025, which would open the door for GAVI-funded rollout in eligible countries.",
    ],
    source: "The Lancet",
    date: "Apr 18, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    tags: ["mRNA", "Malaria", "Oxford", "Phase III", "Research"],
  },
  {
    id: "n3",
    slug: "gavi-1-2-billion-south-asia-vaccine-access-2027",
    category: "Policy",
    title: "GAVI Commits $1.2B to Expand Vaccine Access Across South Asia Through 2027",
    excerpt: "The Vaccine Alliance announces a major funding commitment targeting HPV, pneumococcal, and rotavirus vaccines for low-income countries, with Bangladesh among priority recipients.",
    content: [
      "The GAVI Vaccine Alliance has announced a $1.2 billion funding commitment to expand vaccine access across South and Southeast Asia through 2027. Bangladesh is among eight priority countries identified for accelerated support, with a focus on HPV, pneumococcal (PCV13), and rotavirus vaccines.",
      "For Bangladesh, the funding will support the national introduction of the HPV vaccine for adolescent girls — a programme currently in pilot phase — and the expansion of PCV13 coverage to all 64 districts. GAVI estimates the investment will protect an additional 3.2 million children in Bangladesh alone over the funding period.",
      "GAVI CEO Dr. Sania Nishtar stated: 'South Asia carries a disproportionate burden of vaccine-preventable disease. This commitment reflects our determination to close the equity gap and ensure every child, regardless of geography or income, has access to life-saving vaccines.'",
      "The funding mechanism includes performance-based disbursements tied to coverage targets, supply chain improvements, and digital health integration. Bangladesh's VaxCare platform has been cited as a model for the digital health component, with GAVI exploring co-investment in its expansion.",
      "Civil society organisations have welcomed the announcement but called for stronger community engagement components, particularly for reaching indigenous and minority communities in the Chittagong Hill Tracts and coastal char areas.",
    ],
    source: "GAVI Alliance",
    date: "Apr 15, 2025",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    tags: ["GAVI", "Funding", "HPV", "PCV", "Policy"],
  },
  {
    id: "n4",
    slug: "cholera-outbreak-coxs-bazar-oral-vaccine-200000",
    category: "Outbreak",
    title: "Cholera Outbreak in Cox's Bazar: Oral Vaccine Distribution Reaches 200,000 Residents",
    excerpt: "IEDCR and UNICEF have jointly deployed oral cholera vaccines across 12 camps in Cox's Bazar following a surge in cases. Door-to-door vaccination teams are operational.",
    content: [
      "A cholera outbreak in Cox's Bazar district has prompted a rapid emergency vaccination response, with IEDCR and UNICEF jointly deploying oral cholera vaccine (OCV) to over 200,000 residents across 12 refugee camps and surrounding host communities.",
      "The outbreak, which began in late March 2025, has been linked to contaminated water sources following seasonal flooding. As of April 12, IEDCR has confirmed 847 cases and 6 deaths, with the case fatality rate declining from 1.2% to 0.7% following the vaccination and oral rehydration therapy (ORT) scale-up.",
      "Door-to-door vaccination teams comprising 340 community health workers are operating across the affected areas, prioritising children under 5 and adults over 60. The two-dose OCV schedule is being administered with a two-week interval.",
      "UNICEF Bangladesh Representative Sheldon Yett said: 'Speed is everything in a cholera outbreak. The combination of rapid vaccine deployment, WASH interventions, and community mobilisation is already showing results in the declining case fatality rate.'",
      "The government has also deployed 15 water purification units and distributed 50,000 water purification tablets. IEDCR is conducting genomic sequencing of the Vibrio cholerae isolates to determine the outbreak strain and inform treatment protocols.",
    ],
    source: "IEDCR Bangladesh",
    date: "Apr 12, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&q=80",
    tags: ["Cholera", "Outbreak", "Cox's Bazar", "UNICEF", "Emergency"],
  },
  {
    id: "n5",
    slug: "ai-cold-chain-monitoring-cuts-vaccine-wastage-34-percent",
    category: "Innovation",
    title: "AI-Powered Cold Chain Monitoring Cuts Vaccine Wastage by 34% in Pilot Districts",
    excerpt: "A DGHS pilot using IoT sensors and machine learning to monitor vaccine storage temperatures has reduced spoilage significantly across 8 districts, with nationwide rollout planned.",
    content: [
      "A DGHS pilot programme deploying IoT temperature sensors and machine learning algorithms to monitor vaccine cold chain integrity has achieved a 34% reduction in vaccine wastage across 8 pilot districts, according to a new evaluation report.",
      "The system, developed in partnership with a Dhaka-based health-tech startup, uses 2,400 sensors installed across district health complexes, upazila health centres, and community clinics. The sensors transmit real-time temperature data every 15 minutes to a central dashboard, triggering automated alerts when temperatures deviate from the 2–8°C recommended range.",
      "Machine learning models trained on 18 months of historical data can now predict cold chain failures up to 6 hours in advance with 89% accuracy, allowing health workers to transfer vaccines before spoilage occurs. The system also optimises vaccine distribution routes, reducing transport time by an average of 28%.",
      "DGHS Director of EPI Dr. Shamsul Haque stated: 'Cold chain failure has historically been responsible for up to 25% of vaccine wastage in Bangladesh. This technology is transforming our ability to protect the cold chain at every point from district store to last-mile delivery.'",
      "Following the successful pilot, DGHS has approved a nationwide rollout covering all 64 districts by December 2025. The World Bank has committed $4.2 million to fund the expansion as part of its Health Sector Support Programme.",
    ],
    source: "DGHS Bangladesh",
    date: "Apr 9, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80",
    tags: ["AI", "Cold Chain", "IoT", "Innovation", "DGHS"],
  },
  {
    id: "n6",
    slug: "who-polio-eradication-southeast-asia-bangladesh-certified",
    category: "Global",
    title: "WHO Declares Polio Eradication in Southeast Asia Region — Bangladesh Certified",
    excerpt: "The World Health Organization has officially certified the Southeast Asia region as polio-free, with Bangladesh maintaining zero wild poliovirus cases for over 5 consecutive years.",
    content: [
      "The World Health Organization has officially certified the South-East Asia Region as free of wild poliovirus, with Bangladesh among the 11 member states receiving certification. Bangladesh has maintained zero wild poliovirus cases for over five consecutive years, meeting the WHO's stringent certification criteria.",
      "The certification follows decades of sustained immunization effort through the national EPI programme, supplementary immunization activities (SIAs), and acute flaccid paralysis (AFP) surveillance. Bangladesh conducted its last National Immunization Day (NID) for polio in 2023, with coverage exceeding 98% of the target population.",
      "WHO Regional Director Dr. Saima Wazed, herself a Bangladeshi public health advocate, called the achievement 'a triumph of public health that belongs to every community health worker, every parent who brought their child for vaccination, and every government official who prioritised immunization.'",
      "Despite the certification, WHO and DGHS emphasise that high OPV coverage must be maintained to prevent re-importation of poliovirus from remaining endemic countries. Bangladesh's AFP surveillance system, which monitors for any paralysis cases that could indicate poliovirus circulation, will continue operating at full capacity.",
      "The achievement places Bangladesh among a growing list of countries that have eliminated polio, a disease that once paralysed hundreds of thousands of children annually. Global eradication efforts continue in the two remaining endemic countries.",
    ],
    source: "WHO SEARO",
    date: "Apr 5, 2025",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80",
    tags: ["Polio", "Eradication", "WHO", "Certification", "Global"],
  },
  {
    id: "n7",
    slug: "dengue-vaccine-dengvaxia-seropositive-adults-bangladesh",
    category: "Research",
    title: "Dengue Vaccine Efficacy Study: Sanofi's Dengvaxia Shows Promise for Pre-Immune Adults",
    excerpt: "New clinical data supports targeted dengue vaccination for seropositive adults in endemic regions. Bangladesh's IEDCR is evaluating a national dengue immunization strategy.",
    content: [
      "New clinical data from a multi-country study has reinforced the efficacy of Sanofi's Dengvaxia vaccine for seropositive adults — those who have previously been infected with dengue — in endemic regions. The study, involving 12,000 participants across Southeast Asia and Latin America, showed 83% efficacy against severe dengue in the seropositive population.",
      "For Bangladesh, where dengue has become a year-round urban health crisis with over 300,000 cases reported in 2024, the findings are particularly relevant. IEDCR is currently evaluating a targeted dengue immunization strategy that would prioritise seropositive adults in high-burden urban areas including Dhaka, Chittagong, and Sylhet.",
      "The key challenge is pre-vaccination screening. Dengvaxia is contraindicated in seronegative individuals — those who have never had dengue — as it can increase the risk of severe disease upon subsequent infection. A rapid diagnostic test for dengue serostatus, currently in validation trials at IEDCR, could enable targeted deployment.",
      "Dr. Meerjady Sabrina Flora, former IEDCR Director, noted: 'Bangladesh's dengue epidemiology has shifted dramatically. We now see year-round transmission in urban areas, and a targeted vaccine strategy for high-risk seropositive adults could significantly reduce ICU admissions and deaths.'",
      "A decision on national dengue vaccine policy is expected by Q3 2025, pending the outcome of the serostatus screening validation study and a health economic analysis being conducted with support from the WHO Bangladesh office.",
    ],
    source: "IEDCR / Sanofi",
    date: "Apr 2, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    tags: ["Dengue", "Dengvaxia", "Sanofi", "Research", "Bangladesh"],
  },
];

export const familyMembers: FamilyMember[] = [
  { id: "fm-001", label: "Member 1", name: "Fatima",  relation: "Self",   progress: 100, vaccinesGiven: 5, vaccinesTotal: 5, avatarColor: "#4f46e5" },
  { id: "fm-002", label: "Member 2", name: "Arif",    relation: "Spouse", progress: 67,  vaccinesGiven: 4, vaccinesTotal: 6, avatarColor: "#0891b2" },
  { id: "fm-003", label: "Member 3", name: "Nadia",   relation: "Child",  progress: 56,  vaccinesGiven: 5, vaccinesTotal: 9, avatarColor: "#7c3aed" },
  { id: "fm-004", label: "Member 4", name: "Karim",   relation: "Parent", progress: 80,  vaccinesGiven: 4, vaccinesTotal: 5, avatarColor: "#0d9488" },
];

// ─── Vaccine reminders ────────────────────────────────────────────────────────
// Dates are relative to today for realistic countdown display
const today = new Date();
const daysFromNow = (d: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().split("T")[0];
};

export const vaccineReminders: VaccineReminder[] = [
  { id: "vr-001", vaccine: "Hepatitis B (Dose 3)",    dueDate: daysFromNow(-3),  priority: "high"   },
  { id: "vr-002", vaccine: "COVID-19 Booster",        dueDate: daysFromNow(4),   priority: "high"   },
  { id: "vr-003", vaccine: "Influenza (Annual)",      dueDate: daysFromNow(9),   priority: "medium" },
  { id: "vr-004", vaccine: "Measles (Dose 2)",        dueDate: daysFromNow(18),  priority: "medium" },
  { id: "vr-005", vaccine: "HPV (Dose 1)",            dueDate: daysFromNow(35),  priority: "low"    },
];
