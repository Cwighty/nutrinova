export interface CreateRecipeFoodModel {
  foodId: string;
  name: string;
  measurement: number;
  measurementUnitId: number;
  measurementUnitName: string;
  foodServingsPerMeasurement: number | null; // the amount of the food serving that is equal to 1 of the added unit
}

export interface FoodConversionSample {
  foodPlanId: string;
  measurementUnitId: number;
  foodServingsPerMeasurement: number | null; // the amount of the food serving that is equal to 1 of the added unit
}

export interface GetMatchingFoodConversionSampleRequest {
  foodPlanId: string;
  measurementUnitId: number;
}