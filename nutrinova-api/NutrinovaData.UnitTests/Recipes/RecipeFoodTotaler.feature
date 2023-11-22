Feature: RecipeFoodTotaler
    In order to get accurate nutrient summaries
    As a nutrition analyst
    I want to be able to total nutrients from various recipe foods

@GetNutrientSummaries
Scenario: Total nutrients from a list of recipe foods
	Given the following foods
		| FoodId | Description |
		| 1      | Apple       |
	And the following nutrients
		| NutrientId | Description |
		| 1          | Vitamin C   |
		| 2          | Potassium   |
	And the following Unit Categories
		| UnitCategoryId | Description |
		| 1              | Solid       |
		| 2              | Liquid      |
		| 3              | Quantity    |
	And the following units
		| UnitId | Description | UnitCategoryId |
		| 1      | gram        | 1              |
		| 2      | milliliter  | 2              |
	And the following food nutrients
		| FoodId | NutrientId | Amount | UnitId |
		| 1      | 1          | 10     | 1      |
		| 1      | 2          | 5      | 1      |
	And the following recipes
		| RecipeId | Description |
		| 1        | Apple Pie   |
	And the following recipe foods
		| RecipeId | FoodId | Amount | UnitId |
		| 1        | 1      | 2      | 1      |
		| 1        | 2      | 3      | 1      |
	When I calculate nutrient summaries
	Then the nutrient summaries should be
		| NutrientId | Name      | Amount |
		| 101        | Vitamin C | 20     |
		| 102        | Potassium | 15     |
