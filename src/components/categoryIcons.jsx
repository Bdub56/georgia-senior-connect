import {
  UtensilsCrossed,
  HeartPulse,
  HeartHandshake,
  Home,
  Bus,
  Scale,
  Users,
  LifeBuoy,
  FolderOpen,
} from "lucide-react";

export const CATEGORY_ICONS = {
  "Meals & Nutrition": UtensilsCrossed,
  "Healthcare & Medicare": HeartPulse,
  "Caregiver & Respite": HeartHandshake,
  "Housing & Utilities": Home,
  Transportation: Bus,
  "Legal & Elder Protection": Scale,
  "Senior Centers": Users,
  "Start Here & Help Lines": LifeBuoy,
};

export function CategoryIcon({ category, className = "h-5 w-5" }) {
  const Icon = CATEGORY_ICONS[category] || FolderOpen;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}