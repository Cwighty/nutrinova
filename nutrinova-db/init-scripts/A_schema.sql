SET search_path TO public;

-- Customer Table
CREATE TABLE Customer (
    UUID UUID PRIMARY KEY,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL
);

-- Modules Table
CREATE TABLE Modules (
    UUID UUID PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT
);

-- License Table
CREATE TABLE License (
    UUID UUID PRIMARY KEY,
    Name TEXT,
    Duration TIME,
    Price MONEY,
    Active BOOL
);


-- Recipe_Plan Table
CREATE TABLE Recipe_Plan (
    UUID UUID PRIMARY KEY,
    Name TEXT,
    Tags TEXT,
    Notes TEXT
);

-- Nutrient Table
CREATE TABLE Nutrient (
    UUID UUID PRIMARY KEY,
    Name TEXT NOT NULL,
    Preferred_Unit TEXT
);

-- Unit Table
CREATE TABLE Unit (
    UUID UUID PRIMARY KEY,
    Name TEXT NOT NULL,
    Type TEXT
);

-- Recipe_History Table
CREATE TABLE Recipe_History (
    UUID UUID PRIMARY KEY,
    Name TEXT,
    Tags TEXT,
    Notes TEXT
);


-- Reported_Issues Table
CREATE TABLE Reported_Issues (
    UUID UUID PRIMARY KEY,
    Subject TEXT,
    Description TEXT,
    Customer_ID UUID,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(UUID)
);

-- Patient Table
CREATE TABLE Patient (
    UUID UUID PRIMARY KEY,
    FirstName TEXT NOT NULL,
    LastName TEXT,
    Customer_ID UUID,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(UUID)
);


-- Patient_Modules Table
CREATE TABLE Patient_Modules (
    Patient_ID UUID NOT NULL,
    Module_ID UUID NOT NULL,
    FOREIGN KEY (Patient_ID) REFERENCES Patient(UUID),
    FOREIGN KEY (Module_ID) REFERENCES Modules(UUID),
    PRIMARY KEY (Patient_ID, Module_ID)
);



-- Customer_License_Contract Table
CREATE TABLE Customer_License_Contract (
    Customer_ID UUID NOT NULL,
    License_Contract_ID UUID NOT NULL,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(UUID),
    PRIMARY KEY (Customer_ID, License_Contract_ID)
);

-- Meal_History Table
CREATE TABLE Meal_History (
    UUID UUID PRIMARY KEY,
    RecordedBy TEXT NOT NULL,
    Patient_ID UUID NOT NULL,
    RecordedDate DATE,
    FOREIGN KEY (Patient_ID) REFERENCES Patient(UUID)
);

-- Food_History Table
CREATE TABLE Food_History (
    UUID UUID PRIMARY KEY,
    Name TEXT,
    Meal_ID UUID,
    Amount DECIMAL,
    Unit UUID,
    FOREIGN KEY (Meal_ID) REFERENCES Meal_History(UUID),
    FOREIGN KEY (Unit) REFERENCES Unit(UUID)
);


-- Recipe_Food_History Table
CREATE TABLE Recipe_Food_History (
    Food_ID UUID NOT NULL,
    Recipe_ID UUID NOT NULL,
    Amount DECIMAL,
    Unit_ID UUID,
    FOREIGN KEY (Food_ID) REFERENCES Food_History(UUID),
    FOREIGN KEY (Recipe_ID) REFERENCES Recipe_History(UUID),
    FOREIGN KEY (Unit_ID) REFERENCES Unit(UUID),
    PRIMARY KEY (Food_ID, Recipe_ID)
);

-- Meal_Recipe_History Table
CREATE TABLE Meal_Recipe_History (
    Recipe_History_ID UUID NOT NULL,
    Meal_History_ID UUID NOT NULL,
    Unit_ID UUID,
    FOREIGN KEY (Recipe_History_ID) REFERENCES Recipe_History(UUID),
    FOREIGN KEY (Meal_History_ID) REFERENCES Meal_History(UUID),
    FOREIGN KEY (Unit_ID) REFERENCES Unit(UUID),
    PRIMARY KEY (Recipe_History_ID, Meal_History_ID)
);


-- Meal_Food_History Table
CREATE TABLE Meal_Food_History (
    Meal_History_ID UUID NOT NULL,
    Food_ID UUID NOT NULL,
    Amount FLOAT,
    Unit_ID UUID,
    FOREIGN KEY (Meal_History_ID) REFERENCES Meal_History(UUID),
    FOREIGN KEY (Food_ID) REFERENCES Food_History(UUID),
    FOREIGN KEY (Unit_ID) REFERENCES Unit(UUID),
    PRIMARY KEY (Meal_History_ID, Food_ID)
);

-- Food_History_Nutrient Table
CREATE TABLE Food_History_Nutrient (
    FoodHistory_ID UUID NOT NULL,
    Nutrient_ID UUID NOT NULL,
    FOREIGN KEY (FoodHistory_ID) REFERENCES Food_History(UUID),
    FOREIGN KEY (Nutrient_ID) REFERENCES Nutrient(UUID),
    PRIMARY KEY (FoodHistory_ID, Nutrient_ID)
);

-- Recipe_Food Table
CREATE TABLE Recipe_Food (
    Food_ID UUID NOT NULL,
    Recipe_ID UUID NOT NULL,
    Amount DECIMAL,
    Unit_ID UUID,
    FOREIGN KEY (Food_ID) REFERENCES Food_History(UUID),
    FOREIGN KEY (Recipe_ID) REFERENCES Recipe_Plan(UUID),
    FOREIGN KEY (Unit_ID) REFERENCES Unit(UUID),
    PRIMARY KEY (Food_ID, Recipe_ID)
);