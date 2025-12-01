export type Tab = "vote" | "view" | "claim" | "increment";

export interface Example {
  id: Tab;
  label: string;
  icon: string;
  title: string;
  requirement: string;
  description: string;
  code: string;
}

export const examples: Example[] = [
  {
    id: "vote",
    label: "Voting",
    icon: "🗳️",
    title: "Age-Gated Voting",
    requirement: "Age > 18",
    description:
      "Restrict voting to adults without collecting birthdates. Perfect for DAOs.",
    code: "persona.isAgeAtLeast(user, 19)",
  },
  {
    id: "view",
    label: "Content",
    icon: "👁️",
    title: "Gender-Gated Access",
    requirement: "Gender = Female",
    description:
      "Control content access by gender without storing gender data.",
    code: "persona.isFemale(user)",
  },
  {
    id: "claim",
    label: "Airdrop",
    icon: "🎁",
    title: "Multi-Condition Airdrop",
    requirement: "Male AND Age < 30",
    description:
      "Complex eligibility criteria using AND/OR logic on encrypted attributes.",
    code: "FHE.and(persona.isMale(user), persona.isAgeBetween(user, 0, 29))",
  },
  {
    id: "increment",
    label: "Counter",
    icon: "📊",
    title: "Conditional Counter",
    requirement: "Age ≥ 18",
    description:
      "Increment state only if conditions are met. Useful for engagement tracking.",
    code: "FHE.select(persona.isAgeAtLeast(user, 18), newValue, oldValue)",
  },
];
