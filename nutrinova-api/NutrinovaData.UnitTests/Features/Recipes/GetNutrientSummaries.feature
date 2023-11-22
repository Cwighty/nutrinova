Feature: GetNutrientSummaries
    In order to provide accurate nutritional information
    As a nutritionist
    I want to get nutrient summaries for a list of recipe foods

Scenario Outline: Get nutrient summaries with various food items and nutrients
    Given I have a food item with <Nutrient> of <NutrientAmount> <Unit>
    And the recipe amount is <RecipeAmount>
    When I calculate the nutrient summaries
    Then the total nutrient count should be <TotalCount>
    And the nutrient summary for <Nutrient> should be <ExpectedAmount> <Unit>

    Examples: 
      | Nutrient   | NutrientAmount | Unit | RecipeAmount | TotalCount | ExpectedAmount |
      | Vitamin C  | 10             | mg   | 1            | 1          | 10             |
      | Calcium    | 100            | mg   | 2            | 1          | 200            |
      | Iron       | 5              | mg   | 3            | 1          | 15             |

