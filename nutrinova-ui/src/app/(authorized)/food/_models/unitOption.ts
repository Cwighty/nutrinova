export interface UnitOption {
  id: number;
  description: string;
  abbreviation: string;
  categoryId: number;
  category: UnitCategory;
}

export interface UnitCategory {
  id: number;
  description: string;
}