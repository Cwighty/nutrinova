// TypeScript type for the MealType enum
export enum MealItemType {
  CustomFood = 'CustomFood',
  Recipe = 'Recipe',
  USDAFood = 'USDAFood',
}

// TypeScript interface for the RecordMealRequest
export interface RecordMealRequest {
  patientId: string;
  amount: number;
  recordedDate: Date; // DateOnly in C# translates to Date in TypeScript
  unitId: number;
  selectedMealItemId: string;
  mealType: MealItemType;
}
