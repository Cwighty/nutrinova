export interface ComparisonOperatorOptions {
  id: number;
  name: string;
  abbreviation: string;
}

export const COMPARISON_OPERATOR_OPTIONS: Array<ComparisonOperatorOptions> = [
  {
    id: 1,
    name: "Equals",
    abbreviation: "eq"
  },
  {
    id: 2,
    name: "Greater Than",
    abbreviation: "gt"
  },
  {
    id: 3,
    name: "Greater Than Or Equal",
    abbreviation: "gte"
  },
  {
    id: 4,
    name: "Less Than",
    abbreviation: "lt"
  },
  {
    id: 5,
    name: "Less Than Or Equal",
    abbreviation: "lte"
  },
]