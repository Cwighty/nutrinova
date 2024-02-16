CREATE TABLE Age_Sex_Group (
    GroupID SERIAL PRIMARY KEY,
    Sex VARCHAR(50) NOT NULL,
    Min_Age INT NOT NULL,
    Max_Age INT NOT NULL
);

CREATE TABLE Usda_Nutrient(
    NutrientID INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Unit VARCHAR(50) NOT NULL
);

CREATE TABLE Usda_Nutrient_Goal (
    GoalID SERIAL PRIMARY KEY,
    GroupID INT NOT NULL REFERENCES Age_Sex_Group(GroupID),
    NutrientID INT NOT NULL REFERENCES Usda_Nutrient(NutrientID),
    RDA Numeric,
    AMDR VARCHAR(50),
    AI Numeric,
    UL Numeric
);

CREATE VIEW Usda_Recommended_Nutrient_Value AS
SELECT
    ag.GroupID,
    ag.Sex,
    ag.Min_Age,
    ag.Max_Age,
    n.Name AS Nutrient_Name,
    CASE
        WHEN ng.RDA IS NOT NULL THEN ng.RDA
        WHEN ng.AI IS NOT NULL THEN ng.AI
        WHEN ng.UL IS NOT NULL THEN ng.UL
        ELSE null
    END AS Recommended_Value,
    CASE
        WHEN ng.RDA IS NOT NULL THEN 'RDA'
        WHEN ng.AI IS NOT NULL THEN 'AI'
        WHEN ng.UL IS NOT NULL THEN 'UL'
        ELSE null
    END
    AS Recommended_Value_Type,
    n.Unit
FROM
    Usda_Nutrient_Goal ng
JOIN
    Age_Sex_Group ag ON ng.GroupID = ag.GroupID
JOIN
    Usda_Nutrient n ON ng.NutrientID = n.NutrientID;


INSERT INTO Age_Sex_Group (Sex, Min_Age, Max_Age) VALUES 
  ('Female', 0, 3),
  ('Male', 0, 3),
  ('Female', 4, 8),
  ('Male', 4, 8),
  ('Female', 9, 13),
  ('Male', 9, 13),
  ('Female', 14, 18),
  ('Male', 14, 18),
  ('Female', 19, 30),
  ('Male', 19, 30),
  ('Female', 31, 50),
  ('Male', 31, 50),
  ('Female', 51, 999),
  ('Male', 51, 999); 

INSERT INTO Usda_Nutrient (NutrientID, Name, Unit) VALUES 
(1, 'Protein', 'g'),
(2,'Protein', '% kcal'),
(3,'Carbohydrate', 'g'),
(4,'Carbohydrate', '% kcal'),
(5,'Dietary Fiber', 'g'),
(6,'Total fat', '% kcal'),
(7,'Saturated fat', '% kcal'),
(8,'Linoleic acid', 'g'),
(9,'Linolenic acid', 'g'),
(10,'Calcium', 'mg'),
(11,'Iron', 'mg'),
(12,'Magnesium', 'mg'),
(13,'Phosphorus', 'mg'),
(14,'Potassium', 'mg'),
(15,'Sodium', 'mg'),
(16,'Zinc', 'mg'),
(17,'Copper', 'mg'),
(18,'Manganese', 'mg'),
(19,'Selenium', 'mg'),
(20,'Vitamin A', 'mg_RAE'),
(21,'Vitamin E', 'mg AT'),
(22,'Vitamin D', 'IU'),
(23,'Vitamin C', 'mg'),
(24,'Thiamin', 'mg'),
(25,'Riboflavin', 'mg'),
(26,'Niacin', 'mg'),
(27,'Vitamin B-6', 'mg'),
(28,'Vitamin B-12', 'mg'),
(29,'Choline', 'mg'),
(30,'Vitamin K', 'mg'),
(31,'Folate', 'mg_DFE');


INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 1, 13),
(2, 1, 13),
(3, 1, 19),
(4, 1, 19),
(5, 1, 34),
(6, 1, 34),
(7, 1, 46),
(8, 1, 52),
(9, 1, 46),
(10, 1, 56),
(11, 1, 46),
(12, 1, 56),
(13, 1, 46),
(14, 1, 56);

INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 3, 130),
(2, 3, 130),
(3, 3, 130),
(4, 3, 130),
(5, 3, 130),
(6, 3, 130),
(7, 3, 130),
(8, 3, 130),
(9, 3, 130),
(10, 3, 130),
(11, 3, 130),
(12, 3, 130),
(13, 3, 130),
(14, 3, 130);

INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, AI) VALUES 
(1, 5, 14),
(2, 5, 14),
(3, 5, 16.8),
(4, 5, 16.8),
(5, 5, 19.6),
(6, 5, 19.6),
(7, 5, 25.2),
(8, 5, 30.8),
(9, 5, 25.2),
(10, 5, 30.8),
(11, 5, 25.2),
(12, 5, 30.8),
(13, 5, 22.4),
(14, 5, 28);

INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, AI) VALUES 
(1, 8, 7),
(2, 8, 7),
(3, 8, 10),
(4, 8, 10),
(5, 8, 10),
(6, 8, 12),
(7, 8, 11),
(8, 8, 16),
(9, 8, 12),
(10, 8, 17),
(11, 8, 12),
(12, 8, 17),
(13, 8, 11),
(14, 8, 14);

INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, AI) VALUES 
(1, 9, 0.7),
(2, 9, 0.7),
(3, 9, 0.9),
(4, 9, 0.9),
(5, 9, 1.0),
(6, 9, 1.2),
(7, 9, 1.1),
(8, 9, 1.6),
(9, 9, 1.1),
(10, 9, 1.6),
(11, 9, 1.1),
(12, 9, 1.6),
(13, 9, 1.1),
(14, 9, 1.6);

-- Calcium, NutrientID = 10
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 10, 700),
(2, 10, 700),
(3, 10, 1000),
(4, 10, 1000),
(5, 10, 1300),
(6, 10, 1300),
(7, 10, 1300),
(8, 10, 1300),
(9, 10, 1000),
(10, 10, 1000),
(11, 10, 1000),
(12, 10, 1000),
(13, 10, 1200),
(14, 10, 1200);

-- Iron, NutrientID = 11
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 11, 7),
(2, 11, 7),
(3, 11, 10),
(4, 11, 10),
(5, 11, 8),
(6, 11, 8),
(7, 11, 15),
(8, 11, 11),
(9, 11, 18),
(10, 11, 8),
(11, 11, 18),
(12, 11, 8),
(13, 11, 8),
(14, 11, 8);

-- Magnesium, NutrientID = 12
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 12, 80),
(2, 12, 80),
(3, 12, 130),
(4, 12, 130),
(5, 12, 240),
(6, 12, 240),
(7, 12, 360),
(8, 12, 410),
(9, 12, 310),
(10, 12, 400),
(11, 12, 320),
(12, 12, 420),
(13, 12, 320),
(14, 12, 420);

-- Phosphorus, NutrientID = 13
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 13, 460),
(2, 13, 460),
(3, 13, 500),
(4, 13, 500),
(5, 13, 1250),
(6, 13, 1250),
(7, 13, 1250),
(8, 13, 1250),
(9, 13, 700),
(10, 13, 700),
(11, 13, 700),
(12, 13, 700),
(13, 13, 700),
(14, 13, 700);

-- Potassium, NutrientID = 14
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, AI) VALUES 
(1, 14, 3000),
(2, 14, 3000),
(3, 14, 3800),
(4, 14, 3800),
(5, 14, 4500),
(6, 14, 4500),
(7, 14, 4700),
(8, 14, 4700),
(9, 14, 4700),
(10, 14, 4700),
(11, 14, 4700),
(12, 14, 4700),
(13, 14, 4700),
(14, 14, 4700);

-- Sodium, NutrientID = 15
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, UL) VALUES 
(1, 15, 1500),
(2, 15, 1500),
(3, 15, 1900),
(4, 15, 1900),
(5, 15, 2200),
(6, 15, 2200),
(7, 15, 2300),
(8, 15, 2300),
(9, 15, 2300),
(10, 15, 2300),
(11, 15, 2300),
(12, 15, 2300),
(13, 15, 2300),
(14, 15, 2300);

-- Zinc, NutrientID = 16
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 16, 3),
(2, 16, 3),
(3, 16, 5),
(4, 16, 5),
(5, 16, 8),
(6, 16, 8),
(7, 16, 9),
(8, 16, 11),
(9, 16, 8),
(10, 16, 11),
(11, 16, 8),
(12, 16, 11),
(13, 16, 8),
(14, 16, 11);

-- Copper, NutrientID = 17
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 17, 0.34),
(2, 17, 0.34),
(3, 17, 0.44),
(4, 17, 0.44),
(5, 17, 0.7),
(6, 17, 0.7),
(7, 17, 0.89),
(8, 17, 0.89),
(9, 17, 0.9),
(10, 17, 0.9),
(11, 17, 0.9),
(12, 17, 0.9),
(13, 17, 0.9),
(14, 17, 0.9);

-- Manganese, NutrientID = 18
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, AI) VALUES 
(1, 18, 1.2),
(2, 18, 1.2),
(3, 18, 1.5),
(4, 18, 1.5),
(5, 18, 1.6),
(6, 18, 1.9),
(7, 18, 1.6),
(8, 18, 2.2),
(9, 18, 1.8),
(10, 18, 2.3),
(11, 18, 1.8),
(12, 18, 2.3),
(13, 18, 1.8),
(14, 18, 2.3);

-- Selenium, NutrientID = 19
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 19, 20),
(2, 19, 20),
(3, 19, 30),
(4, 19, 30),
(5, 19, 40),
(6, 19, 40),
(7, 19, 55),
(8, 19, 55),
(9, 19, 55),
(10, 19, 55),
(11, 19, 55),
(12, 19, 55),
(13, 19, 55),
(14, 19, 55);

-- Vitamin A, NutrientID = 20
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 20, 300),
(2, 20, 300),
(3, 20, 400),
(4, 20, 400),
(5, 20, 600),
(6, 20, 600),
(7, 20, 700),
(8, 20, 900),
(9, 20, 700),
(10, 20, 900),
(11, 20, 700),
(12, 20, 900),
(13, 20, 700),
(14, 20, 900);

-- Vitamin E, NutrientID = 21
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 21, 6),
(2, 21, 6),
(3, 21, 7),
(4, 21, 7),
(5, 21, 11),
(6, 21, 11),
(7, 21, 15),
(8, 21, 15),
(9, 21, 15),
(10, 21, 15),
(11, 21, 15),
(12, 21, 15),
(13, 21, 15),
(14, 21, 15);

-- Vitamin D, NutrientID = 22
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 22, 600),
(2, 22, 600),
(3, 22, 600),
(4, 22, 600),
(5, 22, 600),
(6, 22, 600),
(7, 22, 600),
(8, 22, 600),
(9, 22, 600),
(10, 22, 600),
(11, 22, 600),
(12, 22, 600),
(13, 22, 600),
(14, 22, 600);

-- Vitamin C, NutrientID = 23
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 23, 15),
(2, 23, 15),
(3, 23, 25),
(4, 23, 25),
(5, 23, 45),
(6, 23, 45),
(7, 23, 65),
(8, 23, 75),
(9, 23, 75),
(10, 23, 90),
(11, 23, 75),
(12, 23, 90),
(13, 23, 75),
(14, 23, 90);

-- Thiamin, NutrientID = 24
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 24, 0.5),
(2, 24, 0.5),
(3, 24, 0.6),
(4, 24, 0.6),
(5, 24, 0.9),
(6, 24, 0.9),
(7, 24, 1),
(8, 24, 1.2),
(9, 24, 1.1),
(10, 24, 1.2),
(11, 24, 1.1),
(12, 24, 1.2),
(13, 24, 1.1),
(14, 24, 1.2);

-- Riboflavin, NutrientID = 25
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 25, 0.5),
(2, 25, 0.5),
(3, 25, 0.6),
(4, 25, 0.6),
(5, 25, 0.9),
(6, 25, 0.9),
(7, 25, 1),
(8, 25, 1.3),
(9, 25, 1.1),
(10, 25, 1.3),
(11, 25, 1.1),
(12, 25, 1.3),
(13, 25, 1.1),
(14, 25, 1.3);

-- Niacin, NutrientID = 26
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 26, 6),
(2, 26, 6),
(3, 26, 8),
(4, 26, 8),
(5, 26, 12),
(6, 26, 12),
(7, 26, 14),
(8, 26, 16),
(9, 26, 14),
(10, 26, 16),
(11, 26, 14),
(12, 26, 16),
(13, 26, 14),
(14, 26, 16);

-- Vitamin B-6, NutrientID = 27
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 27, 0.5),
(2, 27, 0.5),
(3, 27, 0.6),
(4, 27, 0.6),
(5, 27, 1),
(6, 27, 1),
(7, 27, 1.2),
(8, 27, 1.3),
(9, 27, 1.3),
(10, 27, 1.3),
(11, 27, 1.3),
(12, 27, 1.3),
(13, 27, 1.5),
(14, 27, 1.7);

-- Vitamin B-12, NutrientID = 28
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 28, 0.9),
(2, 28, 0.9),
(3, 28, 1.2),
(4, 28, 1.2),
(5, 28, 1.8),
(6, 28, 1.8),
(7, 28, 2.4),
(8, 28, 2.4),
(9, 28, 2.4),
(10, 28, 2.4),
(11, 28, 2.4),
(12, 28, 2.4),
(13, 28, 2.4),
(14, 28, 2.4);

-- Choline, NutrientID = 29
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, AI) VALUES 
(1, 29, 200),
(2, 29, 200),
(3, 29, 250),
(4, 29, 250),
(5, 29, 375),
(6, 29, 375),
(7, 29, 400),
(8, 29, 550),
(9, 29, 425),
(10, 29, 550),
(11, 29, 425),
(12, 29, 550),
(13, 29, 425),
(14, 29, 550);

-- Vitamin K, NutrientID = 30
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, AI) VALUES 
(1, 30, 30),
(2, 30, 30),
(3, 30, 55),
(4, 30, 55),
(5, 30, 60),
(6, 30, 60),
(7, 30, 75),
(8, 30, 75),
(9, 30, 90),
(10, 30, 120),
(11, 30, 90),
(12, 30, 120),
(13, 30, 90),
(14, 30, 120);

-- Folate, NutrientID = 31
INSERT INTO Usda_Nutrient_Goal (GroupID, NutrientID, RDA) VALUES 
(1, 31, 150),
(2, 31, 150),
(3, 31, 200),
(4, 31, 200),
(5, 31, 300),
(6, 31, 300),
(7, 31, 400),
(8, 31, 400),
(9, 31, 400),
(10, 31, 400),
(11, 31, 400),
(12, 31, 400),
(13, 31, 400),
(14, 31, 400);
