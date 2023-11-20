SET
    search_path TO public;

INSERT INTO Unit_Category (description) VALUES
  ('Solid'),
  ('Liquid'),
  ('Quantity'),
  ('Energy');

INSERT INTO unit (description, abbreviation, category_id) VALUES
  -- Mass Units
  ('Gram', 'G', 1),
  ('Kilogram', 'KG', 1),
  ('Milligram', 'MG', 1),
  ('Microgram', 'mcg', 1),
  ('Ounce', 'OZ', 1),
  ('Pound', 'LB', 1),

  -- Volume Units
  ('Liter', 'L', 2),
  ('Milliliter', 'ML', 2),
  ('Teaspoon', 'TSP', 2),
  ('Tablespoon', 'TBSP', 2),
  ('Cup', 'Cup', 2),
  ('Fluid Ounce', 'FL OZ', 2), -- Often used in the U.S.
  ('Pint', 'PT', 2),  -- Used for larger volumes
  ('Quart', 'QT', 2), -- Larger than a pint
  ('Gallon', 'GAL', 2), -- Used for very large volumes

  -- Quantity Units
  ('Piece', 'PC', 3),
  ('Items', 'qty', 3),

  -- Energy Units
  ('Calorie', 'KCAL', 4);


INSERT INTO Nutrient_Category (id, description) VALUES
  (1, 'Macronutrients'),
  (2, 'Vitamins'),
  (3, 'Minerals'),
  (4, 'Other Components'),
  (5, 'Energy');


INSERT INTO nutrient (description, preferred_unit, category_id) VALUES 
  -- Energy
  ('Energy (Calories)', 18, 5),

  -- Macronutrients
  ('Protein', 1, 1),
  ('Total Fat', 1, 1),
  ('Carbohydrate', 1, 1),
  ('Dietary Fiber', 1, 1),
  ('Sugars', 1, 1),
  ('Saturated Fat', 1, 1),
  ('Trans Fat', 1, 1),
  ('Cholesterol', 1, 1),
  
  -- Vitamins
  ('Vitamin A', 4, 2),
  ('Vitamin C', 4, 2),
  ('Vitamin D', 4, 2),
  ('Vitamin E', 4, 2),
  ('Vitamin K', 4, 2),
  ('Vitamin B6', 4, 2),
  ('Vitamin B12', 4, 2),
  ('Folate', 4, 2),
  
  -- Minerals
  ('Calcium', 3, 3),
  ('Iron', 3, 3),
  ('Magnesium', 3, 3),
  ('Potassium', 3, 3),
  ('Sodium', 3, 3),
  ('Zinc', 3, 3),
  
  -- Other Components
  ('Water', 7, 4),
  ('Caffeine', 4, 4),
  ('Alcohol', 7, 4);

