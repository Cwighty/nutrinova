SET
    search_path TO public;
-- Customer Table
CREATE TABLE
  Customer (
    id UUID PRIMARY KEY,
    ObjectId TEXT NOT NULL UNIQUE,
    Email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE,
    isSingleUser BOOL NOT NULL
  );

CREATE TABLE 
  Unit_Category (
    id serial PRIMARY KEY,
    description TEXT NOT NULL
  );

CREATE TABLE
  Unit (
    id serial PRIMARY KEY, 
    description TEXT NOT NULL, 
    abbreviation TEXT NOT NULL,
    category_id int REFERENCES Unit_Category (id)
  );

-- Nutrient Category Table
CREATE TABLE Nutrient_Category (
    id serial PRIMARY KEY,
    description TEXT NOT NULL
);

-- Nutrient Table
CREATE TABLE
  Nutrient (
    id serial PRIMARY KEY,
    description TEXT NOT NULL,
    Preferred_Unit serial Not null references Unit (id),
    category_id serial REFERENCES Nutrient_Category (id)
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
        serving_size DECIMAL not null,
        serving_size_unit serial REFERENCES Unit(id) not null,
        imported BOOL not null,
        note TEXT null
        );

CREATE TABLE 
  Food_Conversion_Sample (
    id UUID PRIMARY KEY,
    Food_Plan_id UUID NOT NULL REFERENCES Food_Plan (id),
    food_servings_per_measurement DECIMAL not null,
    measurement_unit_id serial REFERENCES Unit (id) not null,
    created_at TIMESTAMP WITH TIME ZONE not null
  );


CREATE TABLE
  Recipe_Plan (
    id UUID PRIMARY KEY,
    description TEXT,
    Tags TEXT,
    Notes TEXT,
    Amount DECIMAL not null,
    serving_size_unit serial REFERENCES Unit(id) not null,
    created_at TIMESTAMP WITH TIME ZONE not null,
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
    Age smallint Check (Age > 0) Not Null,
    Profile_Picture_Name TEXT,
    Sex TEXT Check (Sex = 'M' OR Sex = 'F' OR Sex is null),
    Customer_id UUID,
    Opt_Out_Details BOOL Not Null,
    FOREIGN KEY (Customer_id) REFERENCES Customer (id)
  );

-- Customer_License_Contract Table
CREATE TABLE
  Customer_License_Contract (
    Customer_id UUID NOT NULL,
    License_Contract_id UUID NOT NULL,
    FOREIGN KEY (Customer_id) REFERENCES Customer (id),
    PRIMARY KEY (Customer_id, License_Contract_id)
  );

-- Meal Table
CREATE TABLE
  Meal (
    id UUID PRIMARY KEY,
    Description TEXT,
    RecordedBy TEXT NOT NULL,
    Patient_id UUID NOT NULL,
    Amount DECIMAL not null,
    Unit serial REFERENCES Unit (id) not null,
    RecordedAt TIMESTAMP WITH TIME ZONE not null,
    Notes TEXT,
    ingredients TEXT,
    FOREIGN KEY (Patient_id) REFERENCES Patient (id) ON DELETE CASCADE
  );

CREATE TABLE
  Meal_Nutrient (
    id UUID PRIMARY KEY,
    Meal_id UUID NOT NULL,
    Nutrient_id serial Not Null REFERENCES Nutrient(id),
    amount DECIMAL not null,
    FOREIGN KEY (Meal_id) REFERENCES Meal (id) ON DELETE CASCADE
  );


CREATE TABLE
  Food_Plan_Nutrient (
    id UUID PRIMARY KEY,
    FoodPlan_id UUID NOT NULL REFERENCES Food_Plan (id),
    Nutrient_id serial Not Null REFERENCES Nutrient(id),
    amount DECIMAL not null,
    unit_id serial not null REFERENCES Unit (id)
  );

-- Recipe_Food Table
CREATE TABLE
  Recipe_Food (
    id UUID PRIMARY KEY,
    Food_id UUID NOT NULL REFERENCES Food_Plan (id),
    Recipe_id UUID NOT NULL REFERENCES Recipe_Plan (id),
    Amount DECIMAL not null,
    Unit_id serial not null REFERENCES Unit (id)
  );

-- Nova Chat
Create Table chat_session (
    id UUID PRIMARY KEY,
    created_by uuid REFERENCES Customer(id) not null
);

CREATE TABLE chat_message (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES chat_session(id) not null,
    message_text TEXT NOT NULL,
    sentByCustomer BOOL not null,
    created_at TIMESTAMP WITH TIME ZONE not null
);


-- Nutrient Goals
CREATE TABLE patient_nutrient_daily_goal (
    id UUID PRIMARY KEY,
    patient_id UUID not null,
    nutrient_id serial REFERENCES Nutrient(id) not null,
    custom_upper_target DECIMAL null,
    custom_lower_target DECIMAL null,
    recommended_upper_target DECIMAL null,
    recommended_lower_target DECIMAL null,
    recommended_max DECIMAL null,
    recommended_goal_type TEXT,
    FOREIGN KEY (Patient_id) REFERENCES Patient (id) ON DELETE CASCADE
);