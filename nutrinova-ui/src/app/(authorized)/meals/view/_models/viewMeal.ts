import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";
import { Patient } from "@/app/(authorized)/patients/_models/patient";

export interface Meal {
  id: string;
  recordedby: string;
  patientId: string;
  recordedAt: Date;
  notes: string;
  amount: number;
  unit: UnitOption;
  nutrientSummaries: NutrientSummary[];
  patientResponse: Patient;
  description: string;
}

export interface NutrientSummary {
  nutrientId: string;
  name: string;
  amount: number;
  unit: UnitOption;
}