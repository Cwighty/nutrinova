CREATE TABLE AgeSexGroups (
    GroupID SERIAL PRIMARY KEY,
    Sex VARCHAR(50) NOT NULL,
    MinAge INT NOT NULL,
    MaxAge INT NOT NULL
);

CREATE TABLE Nutrients (
    NutrientID INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Unit VARCHAR(50) NOT NULL
);

CREATE TABLE NutrientGoals (
    GoalID SERIAL PRIMARY KEY,
    GroupID INT NOT NULL REFERENCES AgeSexGroups(GroupID),
    NutrientID INT NOT NULL REFERENCES Nutrients(NutrientID),
    RDA Numeric,
    AMDR VARCHAR(50),
    AI Numeric,
    UL Numeric
);


CREATE VIEW UsdaReccomendedNutrientValues AS
SELECT
    ag.GroupID,
    ag.Sex,
    ag.MinAge,
    ag.MaxAge,
    n.Name AS NutrientName,
    CASE
        WHEN ng.RDA IS NOT NULL THEN ng.RDA
        WHEN ng.AI IS NOT NULL THEN ng.AI
        WHEN ng.UL IS NOT NULL THEN ng.UL
        ELSE 'Not Available'
    END AS RecommendedValue,
    n.Unit
FROM
    NutrientGoals ng
JOIN
    AgeSexGroups ag ON ng.GroupID = ag.GroupID
JOIN
    Nutrients n ON ng.NutrientID = n.NutrientID;


INSERT INTO AgeSexGroups (Sex, MinAge, MaxAge) VALUES 
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

INSERT INTO Nutrients (NutrientID, Name, Unit) VALUES 
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


INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 1, 13),
(2, 1, 19),
(3, 1, 19),
(4, 1, 34),
(5, 1, 34),
(6, 1, 46),
(7, 1, 52),
(8, 1, 46),
(9, 1, 56),
(10, 1, 46);

INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 3, 130),
(2, 3, 130),
(3, 3, 130),
(4, 3, 130),
(5, 3, 130),
(6, 3, 130),
(7, 3, 130),
(8, 3, 130),
(9, 3, 130),
(10, 3, 130);

INSERT INTO NutrientGoals (GroupID, NutrientID, AI) VALUES 
(1, 5, 14),
(2, 5, 16.8),
(3, 5, 16.8),
(4, 5, 19.6),
(5, 5, 19.6),
(6, 5, 25.2),
(7, 5, 30.8),
(8, 5, 25.2),
(9, 5, 30.8),
(10, 5, 25.2);

INSERT INTO NutrientGoals (GroupID, NutrientID, AI) VALUES 
(1, 8, 7),
(2, 8, 10),
(3, 8, 10),
(4, 8, 10),
(5, 8, 12),
(6, 8, 11),
(7, 8, 16),
(8, 8, 12),
(9, 8, 17),
(10, 8, 12);

INSERT INTO NutrientGoals (GroupID, NutrientID, AI) VALUES 
(1, 9, 0.7),
(2, 9, 0.9),
(3, 9, 0.9),
(4, 9, 1.0),
(5, 9, 1.2),
(6, 9, 1.1),
(7, 9, 1.6),
(8, 9, 1.1),
(9, 9, 1.6),
(10, 9, 1.1);

-- Calcium, NutrientID = 10
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 10, 700),
(2, 10, 1000),
(3, 10, 1000),
(4, 10, 1300),
(5, 10, 1300),
(6, 10, 1300),
(7, 10, 1300),
(8, 10, 1000),
(9, 10, 1000),
(10, 10, 1000);

-- Iron, NutrientID = 11
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 11, 7),
(2, 11, 10),
(3, 11, 10),
(4, 11, 8),
(5, 11, 8),
(6, 11, 15),
(7, 11, 11),
(8, 11, 18),
(9, 11, 8),
(10, 11, 18);

-- Magnesium, NutrientID = 12
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 12, 80),
(2, 12, 130),
(3, 12, 130),
(4, 12, 240),
(5, 12, 240),
(6, 12, 360),
(7, 12, 410),
(8, 12, 310),
(9, 12, 400),
(10, 12, 320);

-- Phosphorus, NutrientID = 13
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 13, 460),
(2, 13, 500),
(3, 13, 500),
(4, 13, 1250),
(5, 13, 1250),
(6, 13, 1250),
(7, 13, 1250),
(8, 13, 700),
(9, 13, 700),
(10, 13, 700);

-- Potassium, NutrientID = 14
INSERT INTO NutrientGoals (GroupID, NutrientID, AI) VALUES 
(1, 14, 3000),
(2, 14, 3800),
(3, 14, 3800),
(4, 14, 4500),
(5, 14, 4500),
(6, 14, 4700),
(7, 14, 4700),
(8, 14, 4700),
(9, 14, 4700),
(10, 14, 4700);

-- Sodium, NutrientID = 15
INSERT INTO NutrientGoals (GroupID, NutrientID, UL) VALUES 
(1, 15, 1500),
(2, 15, 1900),
(3, 15, 1900),
(4, 15, 2200),
(5, 15, 2200),
(6, 15, 2300),
(7, 15, 2300),
(8, 15, 2300),
(9, 15, 2300),
(10, 15, 2300);

-- Zinc, NutrientID = 16
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 16, 3),
(2, 16, 5),
(3, 16, 5),
(4, 16, 8),
(5, 16, 8),
(6, 16, 9),
(7, 16, 11),
(8, 16, 8),
(9, 16, 11),
(10, 16, 8);

-- Copper, NutrientID = 17
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 17, 0.34),
(2, 17, 0.44),
(3, 17, 0.44),
(4, 17, 0.7),
(5, 17, 0.7),
(6, 17, 0.89),
(7, 17, 0.89),
(8, 17, 0.9),
(9, 17, 0.9),
(10, 17, 0.9);

-- Manganese, NutrientID = 18
INSERT INTO NutrientGoals (GroupID, NutrientID, AI) VALUES 
(1, 18, 1.2),
(2, 18, 1.5),
(3, 18, 1.5),
(4, 18, 1.6),
(5, 18, 1.9),
(6, 18, 1.6),
(7, 18, 2.2),
(8, 18, 1.8),
(9, 18, 2.3),
(10, 18, 1.8);

-- Selenium, NutrientID = 19
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 19, 20),
(2, 19, 30),
(3, 19, 30),
(4, 19, 40),
(5, 19, 40),
(6, 19, 55),
(7, 19, 55),
(8, 19, 55),
(9, 19, 55),
(10, 19, 55);

-- Vitamin A, NutrientID = 20
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 20, 300),
(2, 20, 400),
(3, 20, 400),
(4, 20, 600),
(5, 20, 600),
(6, 20, 700),
(7, 20, 900),
(8, 20, 700),
(9, 20, 900),
(10, 20, 700);

-- Vitamin E, NutrientID = 21
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 21, 6),
(2, 21, 7),
(3, 21, 7),
(4, 21, 11),
(5, 21, 11),
(6, 21, 15),
(7, 21, 15),
(8, 21, 15),
(9, 21, 15),
(10, 21, 15);

-- Vitamin D, NutrientID = 22
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 22, 600),
(2, 22, 600),
(3, 22, 600),
(4, 22, 600),
(5, 22, 600),
(6, 22, 600),
(7, 22, 600),
(8, 22, 600),
(9, 22, 600),
(10, 22, 600);

-- Vitamin C, NutrientID = 23
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 23, 15),
(2, 23, 25),
(3, 23, 25),
(4, 23, 45),
(5, 23, 45),
(6, 23, 65),
(7, 23, 75),
(8, 23, 75),
(9, 23, 90),
(10, 23, 75);

-- Thiamin, NutrientID = 24
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 24, 0.5),
(2, 24, 0.6),
(3, 24, 0.6),
(4, 24, 0.9),
(5, 24, 0.9),
(6, 24, 1),
(7, 24, 1.2),
(8, 24, 1.1),
(9, 24, 1.2),
(10, 24, 1.1);

-- Riboflavin, NutrientID = 25
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 25, 0.5),
(2, 25, 0.6),
(3, 25, 0.6),
(4, 25, 0.9),
(5, 25, 0.9),
(6, 25, 1),
(7, 25, 1.3),
(8, 25, 1.1),
(9, 25, 1.3),
(10, 25, 1.1);

-- Niacin, NutrientID = 26
INSERT INTO NutrientGoals (GroupID, NutrientID, RDA) VALUES 
(1, 26, 6),
(2, 26, 8),
(3, 26, 8),
(4, 26, 12),
(5, 26, 12),
(6, 26, 14),
(7, 26, 16),
(8, 26, 14),
(9, 26, 16),
(10, 26, 14);

