"use client";

export interface NutrientProgressProps {
  label: string;
  value: number;
  total: number;
  unitAbbreviation: string;
  color: string; // Add a color prop for the total box
}
