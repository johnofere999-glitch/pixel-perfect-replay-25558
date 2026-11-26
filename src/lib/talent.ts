import amina from "@/assets/amina.asset.json";
import tariq from "@/assets/tariq.asset.json";
import grace from "@/assets/grace.asset.json";
import samuel from "@/assets/samuel.asset.json";
export const tracks = ["Software Engineering", "UI/UX Design", "Data Analysis"] as const;
export const cities = ["Nairobi", "Amman", "Kampala"] as const;
export const SALARY_MIN = 1000;
export const SALARY_MAX = 5000;
export const TRIAL_WEEKS = 2;
export type Talent = {
  id: number;
  name: string;
  role: string;
  track: string;
  city: string;
  country: string;
  image?: string;
  skills: string[];
  score: number;
  assessment: string;
  bio: string;
  ready: boolean;
  idType: string;
  payout: string;
  mentor: string;
  portfolio: string;
  scores: { name: string; value: number }[];
};
export const initialTalent: Talent[] = [
  {
    id: 1,
    name: "Amina Hassan",
    role: "Full-Stack Developer",
    track: "Software Engineering",
    city: "Nairobi",
    country: "Kenya",
    image: amina.url,
    skills: ["React", "Node.js", "TypeScript"],
    score: 94,
    assessment: "Practical Code Audit",
    bio: "Building thoughtful digital products, one clean line of code at a time.",
    ready: true,
    idType: "UNHCR Refugee ID",
    payout: "Wise",
    mentor: "Sophie Laurent · Senior EU Tech Lead",
    portfolio: "https://github.com/amina-demo",
    scores: [
      { name: "Frontend engineering", value: 96 },
      { name: "Backend & APIs", value: 92 },
      { name: "Problem solving", value: 94 },
      { name: "Communication", value: 95 },
    ],
  },
  {
    id: 2,
    name: "Tariq Al-Mansoor",
    role: "Cloud & DevOps Engineer",
    track: "Software Engineering",
    city: "Amman",
    country: "Jordan",
    image: tariq.url,
    skills: ["AWS", "Docker", "Terraform"],
    score: 96,
    assessment: "Cloud Infrastructure Audit",
    bio: "Making complex infrastructure reliable, secure, and beautifully simple.",
    ready: true,
    idType: "National Alien Card",
    payout: "Payoneer",
    mentor: "Lukas Weber · Senior EU Tech Lead",
    portfolio: "https://github.com/tariq-demo",
    scores: [
      { name: "Cloud architecture", value: 98 },
      { name: "Infrastructure as code", value: 96 },
      { name: "Security & reliability", value: 94 },
      { name: "Communication", value: 92 },
    ],
  },
  {
    id: 3,
    name: "Grace Uwimana",
    role: "Product Designer",
    track: "UI/UX Design",
    city: "Kampala",
    country: "Uganda",
    image: grace.url,
    skills: ["Figma", "UX Research", "Design Systems"],
    score: 92,
    assessment: "Practical Design Review",
    bio: "Turning real human needs into intuitive, inclusive digital experiences.",
    ready: true,
    idType: "Convention Travel Document",
    payout: "Wise",
    mentor: "Emma Fischer · Senior EU Design Lead",
    portfolio: "https://behance.net/grace-demo",
    scores: [
      { name: "Product design", value: 95 },
      { name: "User research", value: 92 },
      { name: "Design systems", value: 90 },
      { name: "Communication", value: 94 },
    ],
  },
  {
    id: 4,
    name: "Samuel Osei",
    role: "Data Analyst",
    track: "Data Analysis",
    city: "Nairobi",
    country: "Kenya",
    image: samuel.url,
    skills: ["Python", "SQL", "Power BI"],
    score: 93,
    assessment: "Practical Data Assessment",
    bio: "Finding the stories in data that help teams make better decisions.",
    ready: true,
    idType: "UNHCR Refugee ID",
    payout: "Payoneer",
    mentor: "Oliver Berg · Senior EU Data Lead",
    portfolio: "https://github.com/samuel-demo",
    scores: [
      { name: "Data analysis", value: 96 },
      { name: "SQL & modeling", value: 94 },
      { name: "Visualization", value: 90 },
      { name: "Communication", value: 92 },
    ],
  },
];
export const locations = {
  Kenya: {
    currency: "KES",
    rate: 129,
    tax: 0.15,
    rail: "M-Pesa / Equity Bank",
    bridge: "via Wise Bridge",
    city: "Nairobi",
  },
  Jordan: {
    currency: "JOD",
    rate: 0.709,
    tax: 0.1,
    rail: "Local bank transfer",
    bridge: "via Payoneer",
    city: "Amman",
  },
  Uganda: {
    currency: "UGX",
    rate: 3700,
    tax: 0.12,
    rail: "MTN Mobile Money / Stanbic",
    bridge: "via Wise Bridge",
    city: "Kampala",
  },
} as const;
export type Country = keyof typeof locations;
export function calculatePayout(salary: number, country: Country) {
  const gross = Math.min(SALARY_MAX, Math.max(SALARY_MIN, salary));
  const location = locations[country];
  return {
    gross,
    fee: 199,
    total: gross + 199,
    net: Math.round(gross * (1 - location.tax) * location.rate),
    ...location,
  };
}
export function filterTalent(talent: Talent[], role: string, city: string, readyOnly: boolean) {
  return talent.filter(
    (p) =>
      (role === "All" || p.track === role) &&
      (city === "All" || p.city === city) &&
      (!readyOnly || p.ready),
  );
}
