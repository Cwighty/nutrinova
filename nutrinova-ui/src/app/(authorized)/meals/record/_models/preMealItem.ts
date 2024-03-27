export interface PrepMealItem {
  id: string;
  fdcid?: number | null;
  description: string;
  servingSize: number;
  servingSizeUnit?: string | null;
  calories: number;
  type: string;
}