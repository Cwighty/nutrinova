export interface CreateRecipeFoodModel {
  foodId: string;
  name: string;
  amount: number;
  unitId: number;
  unitName: string;
  conversionFactor?: number; // the amount of the food serving that is equal to 1 of the added unit
}