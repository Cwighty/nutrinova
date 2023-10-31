SET
    search_path TO public;

-- Customer Table
CREATE TABLE
    Customer (
        id UUID PRIMARY KEY,
        ObjectId TEXT NOT NULL UNIQUE,
        Email TEXT NOT NULL,
        FirstName TEXT,
        LastName TEXT,
        created_at TIMESTAMP WITH TIME ZONE
    );

CREATE TABLE
    Unit (id UUID PRIMARY KEY, Unit_Name TEXT, Type TEXT);

-- Modules Table
CREATE TABLE
    Module (
        id UUID PRIMARY KEY,
        Module_Name TEXT NOT NULL,
        Description TEXT
    );

-- License Table
CREATE TABLE
    License (
        id UUID PRIMARY KEY,
        License_Name TEXT,
        Duration TIME,
        Price MONEY,
        Active BOOL
    );

CREATE TABLE
    Food_Plan (
        id UUID PRIMARY KEY,
        fdcid integer,
        Description TEXT, 
        created_by uuid REFERENCES Customer(id),
        created_at TIMESTAMP WITH TIME ZONE,
        serving_size DECIMAL,
        unit UUID REFERENCES Unit(id),
        note TEXT
        );

-- Recipe_Plan Table
CREATE TABLE
    Recipe_Plan (
        id UUID PRIMARY KEY,
        description TEXT,
        Tags TEXT,
        Notes TEXT,
        created_by uuid REFERENCES Customer(id)
    );

-- Nutrient Table
CREATE TABLE
    Nutrient (
        id UUID PRIMARY KEY,
        Nutrient_Name TEXT NOT NULL,
        Preferred_Unit TEXT
    );

-- Recipe_History Table
CREATE TABLE
    Recipe_History (
        id UUID PRIMARY KEY,
        description TEXT,
        Tags TEXT,
        Notes TEXT,
        created_by uuid REFERENCES Customer(id)
    );

-- Reported_Issues Table
CREATE TABLE
    Reported_Issues (
        id UUID PRIMARY KEY,
        Subject TEXT,
        Description TEXT,
        Customer_id UUID,
        FOREIGN KEY (Customer_id) REFERENCES Customer (id)
    );

-- Patient Table
CREATE TABLE
    Patient (
        id UUID PRIMARY KEY,
        FirstName TEXT NOT NULL,
        LastName TEXT,
        Customer_id UUID,
        FOREIGN KEY (Customer_id) REFERENCES Customer (id)
    );

-- Patient_Module Table
CREATE TABLE
    Patient_Module (
        Patient_id UUID NOT NULL,
        Module_id UUID NOT NULL,
        FOREIGN KEY (Patient_id) REFERENCES Patient (id),
        FOREIGN KEY (Module_id) REFERENCES Module (id),
        PRIMARY KEY (Patient_id, Module_id)
    );

-- Customer_License_Contract Table
CREATE TABLE
    Customer_License_Contract (
        Customer_id UUID NOT NULL,
        License_Contract_id UUID NOT NULL,
        FOREIGN KEY (Customer_id) REFERENCES Customer (id),
        PRIMARY KEY (Customer_id, License_Contract_id)
    );

-- Meal_History Table
CREATE TABLE
    Meal_History (
        id UUID PRIMARY KEY,
        RecordedBy TEXT NOT NULL,
        Patient_id UUID NOT NULL,
        RecordedDate DATE,
        FOREIGN KEY (Patient_id) REFERENCES Patient (id)
    );

-- Food_History Table
CREATE TABLE
    Food_History (
        id UUID PRIMARY KEY,
        fdcid integer,
        description TEXT, 
        created_by uuid REFERENCES Customer(id),
        created_at TIMESTAMP WITH TIME ZONE,
        serving_size DECIMAL,
        unit UUID REFERENCES Unit(id),
        note TEXT
    );

-- Recipe_Food_History Table
CREATE TABLE
    Recipe_Food_History (
        Food_id UUID NOT NULL,
        Recipe_id UUID NOT NULL,
        Amount DECIMAL,
        Unit_id UUID,
        FOREIGN KEY (Food_id) REFERENCES Food_History (id),
        FOREIGN KEY (Recipe_id) REFERENCES Recipe_History (id),
        FOREIGN KEY (Unit_id) REFERENCES Unit (id),
        PRIMARY KEY (Food_id, Recipe_id)
    );

-- Meal_Recipe_History Table
CREATE TABLE
    Meal_Recipe_History (
        Recipe_History_id UUID NOT NULL,
        Meal_History_id UUID NOT NULL,
        Amount DECIMAL,
        Unit_id UUID,
        FOREIGN KEY (Recipe_History_id) REFERENCES Recipe_History (id),
        FOREIGN KEY (Meal_History_id) REFERENCES Meal_History (id),
        FOREIGN KEY (Unit_id) REFERENCES Unit (id),
        PRIMARY KEY (Recipe_History_id, Meal_History_id)
    );

-- Meal_Food_History Table
CREATE TABLE
    Meal_Food_History (
        id UUID PRIMARY KEY,
        Meal_History_id UUID NOT NULL,
        food_id UUID not null,
        Amount DECIMAL,
        Unit_id UUID,
        FOREIGN KEY (Meal_History_id) REFERENCES Meal_History (id),
        FOREIGN KEY (food_id) REFERENCES Food_History (id),
        FOREIGN KEY (Unit_id) REFERENCES Unit (id)
    );

CREATE TABLE
    Food_Plan_Nutrient (
        id UUID PRIMARY KEY,
        FoodPlan_id UUID NOT NULL,
        Nutrient_id UUID NOT NULL,
        amount DECIMAL,
        unit_id UUID REFERENCES Unit (id),
        FOREIGN KEY (FoodPlan_id) REFERENCES Food_Plan (id),
        FOREIGN KEY (Nutrient_id) REFERENCES Nutrient (id)
    );

-- Food_History_Nutrient Table
CREATE TABLE
    Food_History_Nutrient (
        id UUID PRIMARY KEY,
        FoodHistory_id UUID NOT NULL,
        Nutrient_id UUID NOT NULL,
        amount DECIMAL,
        unit_id UUID REFERENCES Unit (id),
        FOREIGN KEY (FoodHistory_id) REFERENCES Food_History (id),
        FOREIGN KEY (Nutrient_id) REFERENCES Nutrient (id)
    );

-- Recipe_Food Table
CREATE TABLE
    Recipe_Food (
        id UUID PRIMARY KEY,
        Food_id UUID NOT NULL,
        Recipe_id UUID NOT NULL,
        Amount DECIMAL,
        Unit_id UUID,
        FOREIGN KEY (Food_id) REFERENCES Food_History (id),
        FOREIGN KEY (Recipe_id) REFERENCES Recipe_Plan (id),
        FOREIGN KEY (Unit_id) REFERENCES Unit (id)
    );