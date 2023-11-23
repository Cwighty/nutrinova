Feature: RecipeFoodTotaler
    In order to get accurate nutrient summaries
    As a nutrition analyst
    I want to be able to total nutrients from various recipe foods

@GetNutrientSummaries
Scenario: Total nutrients from a list of recipe foods
  Given a recipe food totaler
	And the following Unit Categories
		| Id | Description |
		| 1              | Solid       |
		| 2              | Liquid      |
		| 3              | Quantity    |
	And the following units
		| Id | Description | CategoryId |
		| 1      | gram        | 1              |
		| 2      | milliliter  | 2              |
	And the following nutrients
		| Id | Description |
		| 1          | Vitamin C   |
		| 2          | Potassium   |
	And the following foods
		| Id | Description | ServingSize | ServingSizeUnit |
		| 1  | Apple       | 10 		| 1                  |
	And the following food nutrients
		| FoodplanId | NutrientId | Amount | UnitId |
		| 1      | 1          | 10     | 1      |
		| 1      | 2          | 5      | 1      |
	And the following recipes
		| Id | Description |
		| 1        | Apple Pie   |
	And the following recipe foods
		| RecipeId | FoodId | Amount | UnitId |
		| 1        | 1      | 2      | 1      |
		| 1        | 2      | 3      | 1      |
	When I calculate nutrient summaries
	Then the nutrient summaries should be
		| Name      | Amount |
		| Vitamin C | 20     |
		| Potassium | 15     |
