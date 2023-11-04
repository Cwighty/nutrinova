SET
    search_path TO public;
-- Customer Table
CREATE TABLE
    Customer (
        id UUID PRIMARY KEY,
        ObjectId TEXT NOT NULL UNIQUE,
        Email TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE
    );

CREATE TABLE
    Unit (
        id serial PRIMARY KEY, 
        description TEXT NOT NULL, 
        abreviation TEXT NOT NULL
        );

-- Nutrient Table
CREATE TABLE
    Nutrient (
        id serial PRIMARY KEY,
        Nutrient_Name TEXT NOT NULL,
        Preferred_Unit serial Not null references Unit (id)
    );

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
        fdcid integer null,
        description TEXT not null, 
        brand_name TEXT null,
        ingredients TEXT null,
        created_by uuid REFERENCES Customer(id),
        created_at TIMESTAMP WITH TIME ZONE not null,
        serving_size DECIMAL null,
        serving_size_unit serial REFERENCES Unit(id),
        note TEXT null,
        CONSTRAINT if_serving_size_then_unit_is_not_null 
        CHECK ( ( serving_size is null ) OR (serving_size_unit IS NOT NULL) ) 
        );

CREATE TABLE
    Food_History (
        id UUID PRIMARY KEY,
        fdcid integer null,
        description TEXT not null, 
        brand_name TEXT null,
        ingredients TEXT null,
        created_by uuid REFERENCES Customer(id),
        created_at TIMESTAMP WITH TIME ZONE not null,
        serving_size DECIMAL null,
        serving_size_unit serial REFERENCES Unit(id),
        note TEXT null,
        CONSTRAINT if_serving_size_then_unit_is_not_null 
        CHECK ( (serving_size is null) OR (serving_size_unit IS NOT NULL) ) 
    );

CREATE TABLE
    Recipe_Plan (
        id UUID PRIMARY KEY,
        description TEXT,
        Tags TEXT,
        Notes TEXT,
        created_by uuid REFERENCES Customer(id)
    );

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


-- Recipe_Food_History Table
CREATE TABLE
    Recipe_Food_History (
        id UUID PRIMARY KEY,
        Food_id UUID NOT NULL REFERENCES Food_History (id),
        Recipe_id UUID NOT NULL REFERENCES Recipe_History (id),
        Amount DECIMAL not null,
        Unit_id serial not null REFERENCES Unit (id)
    );

-- Meal_Recipe_History Table
CREATE TABLE
    Meal_Recipe_History (
        id UUID PRIMARY KEY,
        Recipe_History_id UUID NOT NULL REFERENCES Recipe_History (id),
        Meal_History_id UUID NOT NULL REFERENCES Meal_History (id),
        Amount DECIMAL not null,
        Unit_id serial REFERENCES Unit (id) not null
    );

-- Meal_Food_History Table
CREATE TABLE
    Meal_Food_History (
        id UUID PRIMARY KEY,
        Meal_History_id UUID NOT NULL REFERENCES Meal_History (id),
        food_id UUID not null REFERENCES Food_History (id),
        Amount DECIMAL,
        Unit_id serial not null REFERENCES Unit (id)
    );

CREATE TABLE
    Food_Plan_Nutrient (
        id UUID PRIMARY KEY,
        FoodPlan_id UUID NOT NULL REFERENCES Food_Plan (id),
        Nutrient_id serial Not Null REFERENCES Nutrient(id),
        amount DECIMAL not null,
        unit_id serial not null REFERENCES Unit (id)
    );

-- Food_History_Nutrient Table
CREATE TABLE
    Food_History_Nutrient (
        id UUID PRIMARY KEY,
        FoodHistory_id UUID NOT NULL REFERENCES Food_History (id),
        Nutrient_id serial NOT NULL REFERENCES Nutrient (id),
        amount DECIMAL NOT NULL,
        unit_id serial not null REFERENCES Unit (id)
    );

-- Recipe_Food Table
CREATE TABLE
    Recipe_Food (
        id UUID PRIMARY KEY,
        Food_id UUID NOT NULL REFERENCES Food_History (id),
        Recipe_id UUID NOT NULL REFERENCES Recipe_History (id),
        Amount DECIMAL not null,
        Unit_id serial not null REFERENCES Unit (id)
    );