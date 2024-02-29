import { PatientNutrientReport } from "./PatientNutrientReport";


export interface AggregatePatientNutrientReport {
  beginDate: Date;
  endDate: Date;
  daysCount: number;
  patientReports: PatientNutrientReport[];
}
