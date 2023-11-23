Feature: NutrientMatcher

@NutrientMatching
Scenario Outline: Nutrient Matches are Identified for Inconsistent Data
	Given The description of an imported nutrient is <ImportedDescription>
	And We are tracking these nutrients in our system
		| Id | Description       |
		| 1  | Energy (Calories) |
		| 2  | Protein           |
		| 3  | Total Fat         |
		| 4  | Carbohydrate      |
		| 5  | Dietary Fiber     |
		| 6  | Sugars            |
		| 7  | Saturated Fat     |
		| 8  | Trans Fat         |
		| 9  | Cholesterol       |
		| 10 | Vitamin A         |
		| 11 | Vitamin C         |
		| 12 | Vitamin D         |
		| 13 | Vitamin E         |
		| 14 | Vitamin K         |
		| 15 | Vitamin B6        |
		| 16 | Vitamin B12       |
		| 17 | Folate            |
		| 18 | Calcium           |
		| 19 | Iron              |
		| 20 | Magnesium         |
		| 21 | Potassium         |
		| 22 | Sodium            |
		| 23 | Zinc              |
		| 24 | Water             |
		| 25 | Caffeine          |
		| 26 | Alcohol           |
	When Matching the nutrient to ours
	Then The closest match should be <ExpectedNutrientId>
Examples:
	| ImportedDescription                        | ExpectedNutrientId |
	| Energy (Atwater General Factors)           | 1                  |
	| Energy (Atwater Specific Factors)          | 1                  |
	| Alcohol, ethyl                             | 26                 |
	| Carbohydrate, by summation                 | 4                  |
	| Total fat (NLEA)                           | 3                  |
	| Fatty acids, total trans                   | 8                  |
	| Fatty acids, total saturated               | 7                  |
	| Sugars, Total                              | 6                  |
	| Sugars, Total NLEA                         | 6                  |
	| Vitamin C, total ascorbic acid             | 11                 |
	| Vitamin B-6, N411 + N412 +N413             | 15                 |
	| Low Molecular Weight Dietary Fiber (LMWDF) | 5                  |


Scenario Outline: Nutrients that should not match
	Given The description of an imported nutrient is <ImportedDescription>
	And We are tracking these nutrients in our system
		| Id | Description       |
		| 1  | Energy (Calories) |
		| 2  | Protein           |
		| 3  | Total Fat         |
		| 4  | Carbohydrate      |
		| 5  | Dietary Fiber     |
		| 6  | Sugars            |
		| 7  | Saturated Fat     |
		| 8  | Trans Fat         |
		| 9  | Cholesterol       |
		| 10 | Vitamin A         |
		| 11 | Vitamin C         |
		| 12 | Vitamin D         |
		| 13 | Vitamin E         |
		| 14 | Vitamin K         |
		| 15 | Vitamin B6        |
		| 16 | Vitamin B12       |
		| 17 | Folate            |
		| 18 | Calcium           |
		| 19 | Iron              |
		| 20 | Magnesium         |
		| 21 | Potassium         |
		| 22 | Sodium            |
		| 23 | Zinc              |
		| 24 | Water             |
		| 25 | Caffeine          |
		| 26 | Alcohol           |
	When Matching the nutrient to ours
	Then Matching throws error "No match found"
Examples:
	| ImportedDescription                        |
	| Total sugar alcohols                       |
	| Retinol                                    |
	| 25-hydroxycholecalciferol                  |
	| Tocopherol, beta                           |
	| Vitamin D2                                 |
