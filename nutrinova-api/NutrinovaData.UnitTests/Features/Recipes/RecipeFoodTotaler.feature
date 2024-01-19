Feature: RecipeFoodTotaler
    In order to get accurate nutrient summaries
    As a nutrition analyst
    I want to be able to total nutrients from various recipe foods

@GetNutrientSummaries
Scenario: Total nutrients from a list of recipe foods
	Given a recipe food totaler
	And the following Unit Categories
		| Id | Description |
		| 1  | Solid       |
		| 2  | Liquid      |
		| 3  | Quantity    |
	And the following units
		| Id | Description | CategoryId |
		| 1  | gram        | 1          |
		| 2  | milliliter  | 2          |
	And the following nutrients
		| Id | Description |
		| 1  | Vitamin C   |
		| 2  | Potassium   |
	And the following foods
		| Id | Description | ServingSize | ServingSizeUnit |
		| 1  | Apple       | 10          | 1               |
	And the following food nutrients
		| FoodplanId | NutrientId | Amount | UnitId |
		| 1          | 1          | 10     | 1      |
		| 1          | 2          | 5      | 1      |
	And the following recipes
		| Id | Description |
		| 1  | Apple Pie   |
	And the following recipe foods
		| RecipeId | FoodId | Amount | UnitId |
		| 1        | 1      | 2      | 1      |
		| 1        | 2      | 3      | 1      |
	And the following food conversion samples
		| Id | FoodPlanId | FoodServingsPerMeasurement | MeasurementUnitId |
	When I calculate nutrient summaries
	Then the nutrient summaries should be
		| Name      | Amount |
		| Vitamin C | 2      |
		| Potassium | 1      |

Scenario: Total nutrients from a list of recipe foods with different units
	Given a recipe food totaler
	And the following Unit Categories
		| Id | Description |
		| 1  | Solid       |
		| 2  | Liquid      |
		| 3  | Quantity    |
	And the following units
		| Id | Description | CategoryId |
		| 1  | gram        | 1          |
		| 2  | milliliter  | 2          |
		| 3  | qty         | 3          |
	And the following nutrients
		| Id | Description |
		| 1  | Vitamin C   |
		| 2  | Potassium   |
		| 3  | Sugar       |
		| 4  | Protein     |
	And the following foods
		| Id | Description   | ServingSize | ServingSizeUnit |
		| 1  | Apple         | 150         | 1               | # nutrients are based on 150 grams serving size of apple
	And the following food nutrients
		| FoodplanId | NutrientId | Amount | UnitId |
		| 1          | 1          | 0.0084 | 1      | # 8.4 mg of vitamin C in 150 grams of apple
		| 1          | 2          | 0.195  | 1      | # 195 mg of potassium in 150 grams of apple
	And the following recipes
		| Id | Description           |
		| 1  | Apple Pie              |
		| 2  | Blended Smore Clusters |
	And the following recipe foods
		| RecipeId | FoodId | Amount | UnitId |
		| 1        | 1      | 10     | 3      | # 10 apple in the apple pie
	And the following food conversion samples
		| Id | FoodPlanId | FoodServingsPerMeasurement | MeasurementUnitId |
		| 1  | 1          | 150                        | 3                 | # 150 grams in one apple
	When I calculate nutrient summaries
	Then the nutrient summaries should be
		| Name      | Amount |
		| Vitamin C | 0.084  |
		| Potassium | 1.95   |

Scenario: Total nutrients from a list of recipe foods with different units 2
	Given a recipe food totaler
	And the following Unit Categories
		| Id | Description |
		| 1  | Solid       |
		| 2  | Liquid      |
		| 3  | Quantity    |
	And the following units
		| Id | Description | CategoryId |
		| 1  | gram        | 1          |
		| 2  | milliliter  | 2          |
		| 3  | qty         | 3          |
	And the following nutrients
		| Id | Description |
		| 1  | Vitamin C   |
		| 2  | Potassium   |
		| 3  | Sugar       |
		| 4  | Protein     |
	And the following foods
		| Id | Description   | ServingSize | ServingSizeUnit |
		| 2  | Smore Cluster | 1           | 3               | # nutrients are based on 1 smore cluster
	And the following food nutrients
		| FoodplanId | NutrientId | Amount | UnitId |
		| 2          | 3          | 12     | 1      | # 12 grams of sugar in 1 smore cluster
		| 2          | 4          | 1      | 1      | # 1 gram of protein in 1 smore cluster
	And the following recipes
		| Id | Description           |
		| 2  | Blended Smore Clusters |
	And the following recipe foods
		| RecipeId | FoodId | Amount | UnitId |
		| 2        | 2      | 77     | 1      | # throw some in a blender, weighs 77 grams
	And the following food conversion samples
		| Id | FoodPlanId | FoodServingsPerMeasurement | MeasurementUnitId |
		| 2  | 2          | 0.045                      | 1                 | # this food is measured in qty, how many qty are in 1 gram?
	When I calculate nutrient summaries
	Then the nutrient summaries should be
		| Name    | Amount |
		| Sugar   | 41.58  |
		| Protien | 3.5    |

