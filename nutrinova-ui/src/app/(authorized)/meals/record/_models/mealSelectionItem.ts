export interface MealSelectionItem {
  id: string;
  fdcid?: number | null;
  description: string;
  servingSize: number;
  servingSizeUnit?: string | null;
  note?: string | null;
  type: string;
}
