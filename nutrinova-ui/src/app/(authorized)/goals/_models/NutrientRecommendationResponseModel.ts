export interface NutrientRecommendationResponse {
  groupId: number | null;
  sex: string | null;
  minAge: number | null;
  maxAge: number | null;
  nutrientName: string | null;
  recommendedValue: number | null;
  recommendedValueType: string | null;
  unit: string | null;
}
