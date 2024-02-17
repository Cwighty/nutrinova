# Nutrinova
# Use Cases:

## Custom Food Data Management

### Foods

_A food can either be custom made or imported from the USDA database. After a USDA food is imported, it can be changed to be used in future meals._

- As a user I want to be able to search external resources for foods that I may have consumed so I don’t have to input the information myself
  - [ ] User can quickly search and see common foods listed by the USDA (F)
  - [ ] User can see enough detail on USDA foods to know if it matches what they consumed (F)
- As a user, If I can’t find a food that was consumed already available, I want to create my own food that models the nutritional information of what was consumed
  - [ ] User can create a custom food (F)
  - [ ] Food can accurately models the nutritional information of what was consumed (F)
  - [ ] The application should validate user-created custom foods to ensure they meet minimum data requirements. (NF)
  - [ ] When creating custom foods, users should be able to specify details such as: (F)
    - [ ] Name
    - [ ] Serving Size
    - [ ] Serving Size Unit
    - [ ] Nutritional facts (How much of each nutritional unit in serving)
- As a user, I want to manage foods I’ve created before
  - [ ] User can delete a food (F)
  - [ ] User can edit a food (F)
  - [ ] Changing a food does not change consumed history (NF)
- As a user, I want to see the details of a food to know if It matches what was consumed
  - [ ] User can see the individual details such as: (F)
    - [ ] Name
    - [ ] Nutritional facts
    - [ ] Macros

### Recipes

_A recipe is a complex (but still individual) food created from a collection of single foods or ingredients designed to make creating and logging meals easier. Recipes can be stored for easy access later when logging meals_

As a user, I want to be able to create groups of simple food (a recipe) that I eat on a consistent basis so that I can more easily enter my food plans and intake.

- Create Recipe
  - [ ] As a user I want to be able to create a recipe from my stored foods
    - [ ] I should provide a food, (NF)
    - [ ] I should provide an amount of food measured (NF)
      - [ ] Foods are measured in different ways (cups, tablespoons, etc.) I should be able to select from a multitude of options (NF)
    - [ ] I should be able to write notes about a recipe for future reference (NF)
    - [ ] As a recipe is built, I want to see the estimated totals of its nutrients (NF)
    - [ ] As a recipe is built, I want to see an estimated yield amount of how much will be made (NF)
    - [ ] I should be able to provide a yield amount that overrides that estimate (NF)
    - [ ] I should be able to provide some tags/categories to sort my recipe (NF)
- Edit Recipe
  - [ ] As a user I want be able to edit the details of a recipe without affecting recorded history
    - [ ] Recorded meals using this recipe are not adjusted (NF)
    - [ ] Edit foods in a recipe (F)
    - [ ] Edit the yield amount of the recipe (F)
    - [ ] Edit tags for the recipe (F)
    - [ ] Edit yield unit (F)
    - [ ] Edit notes (F)
    - [ ] Add foods (F)
    - [ ] Delete foods (F)
    - [ ] Adjust amount of food in recipe (F)
- View Recipes/Details
  - [ ] As a user want an overview of my recipe library
  - [ ] As a user I should be able to filter and sort the recipes to find the one I’m looking for
    - [ ] Sort by recently used, most used, category, etc (NF)
  - [ ] As a user I should be able to see recipe details
    - [ ] Foods used (link to food) (F)
    - [ ] Macro/Nutritional totals per yield (F)
    - [ ] Yield (F)
    - [ ] Notes (F)

As a caretaker, If I have a patient who is fed volumetrically by pump or syringe, and if the recipe is volumetric, I want to see how many syringes it makes.

- [ ] As a user I want to see nutritional information per syringe (F)
- [ ] I only want this to show on a recipe if it is marked as pureed/volumetric (F)
- [ ] I want to set somewhere how much volume per syringe, if this is not set, don’t show this info (NF)

As a caretaker I want to easily calculate the pump rate to see how much ml/hr is required to meet a nutritional goal.

## Record Consumption

### Meals

_Meal is an instance of a food or a recipe that has been consumed by a user._

- As a user I want to be able to record what meals have been eaten and when. I want those meals to be connected to a recipe or a specific food.
  - [ ] Meals support recording a recipe or food with a quantity of how much was eaten. (F)
  - [ ] User can record a meal quickly and intuitively.
- As a user I want to be able to choose the date and time the meal was fed
- As a caretaker I want to be able to choose which patient was fed a meal
  - [ ] Each meal should be linked to a patient who was fed. (F)
  - [ ] Caretakers should have a straightforward way to switch the patient when recording a meal. (F)
- As a user I want to quickly see a history of what was fed and the details of which recipes and foods were used and the amounts that were fed.
  - [ ] Details of nutritional information is available for viewing (F)
  - [ ] Only display meal for the current user (NF)
  - [ ] Meal response needs to be in a reasonable time (NF)
  - [ ] Users should be able to see a quick daily summary of what was consumed.
- As a caretaker I want to be able to see what a patient has eaten and the nutritional values for that patient.
  - [ ] Only Display information for the current patient. (NF)
  - [ ] Only allow access to information from the patient the caretaker is in charge of. (NF)
  - [ ] Caretakers should be able to see a quick daily summary of what was consumed for a patient.
- As a user I want to edit the quantity of the meal that was fed along with the date of the meal.
  - [ ] When a meal quantity is edited the nutritional information for that meal is updated to match the new quantity. (NF)
  - [ ] There is a way for the user to change previous recorded meals. (NF)
  - [ ] Should only be able to edit meals I have recorded. (NF)
- As a user I want to be able to update notes of a recorded meal.

## Nutritional Tracking

### Goals

_A goal is a daily nutritional target made for a patient or individual user. Consumption is totaled daily to provide progress towards the target._

- As an individual user, I want to set goals for specific nutrients and track my progress towards those goals on a daily basis.
  - [ ] Adding a goal is quick and simple (F)
  - [ ] Provide recommendations to the user for a specific nutrient amount based on the patients demographics (F)
  - [ ] The user should be guided to set goals within recommended and sensible limits (NF)
- As an individual user, I want to view my progress toward all my goals in a quick and easily understandable way.
  - [ ] Users should have a clear and visually appealing way to view their nutrition goals within the application. (F)
  - [ ] Users can see how close they are to hitting their goals on the current day. (F)
- As a user, I want to view more in depth progress of a specific goal and its progress history.
  - [ ] Users should be able to see an individual goal progress in various ways, including:
    - How many days in the current week have they successfully met their goals?
    - How far they are over or under their goals.
    - Stats on how they are meeting that goal generally
  - [ ] Users should see a summary of how they are meeting all their goals
- As a user, I want different indicators of progress depending on the nutrient I am tracking as some nutrients you want to go over and some you don’t want to go over.
  - [ ] Nutrient Goals have different indications and act differently based on their type (F)
    - I.e You can go over on vitamin C, but you don’t want to go over on sugar [https://health.gov/sites/default/files/2019-09/Appendix-E3-1-Table-A4.pdf](https://health.gov/sites/default/files/2019-09/Appendix-E3-1-Table-A4.pdf)
- As a user I want to have an easy way to see more details and edit specific goals.
  - [ ] Users can view the following details of a goal: (F)
    - Target Amount
    - Nutrient
    - Patient its for (if caretaker)
    - Recommended value based on patient demographics
  - [ ] Users can edit the following items: (F)
    - Target Amount
  - [ ] Users can delete a goal (stop tracking the goal) (F)

### Reports

_Reports are generated based on a user’s/patient's meals for a given time period._

- As a user, I want to see a report of my recorded nutritional activity and progress toward goals. I want to be able to view this report in a daily, weekly, and monthly time frame.
- As a user, I want a report that is easy to read and print so I can have a record of nutritional goals and intake.

## Cross Cutting:

### Single User vs Multi User

#### Onboarding

_Onboarding refers to the process of setting up a user's account. There are two types of users, one is an individual user and the other is a caretaker._

- As a user, I want an easy way to sign up for an account so I can utilize the features of the application.
  - [ ] Sign up follow is simple and purposeful (NF)
- As an individual user, I want a way to differentiate my usage from a caretaker user so I only have access to the features that make sense to me and that I need.
  - [ ] On sign up have users declare their purpose for using the application (F)
- As a caretaker, I want a way to differentiate my user from an individual user so I can manage multiple patients' nutritional intake and goals.
  - [ ] Caretakers add at least on patient on sign up (NF)
  - [ ] Patient are unique (NF)
- As a caretaker, I want an easy way to add patients so that I can view and manage their nutrition and goals.
  - [ ] Teach them how to add patients (NF)
  - [ ] Collecting patients information should be simple in onboarding (NF)
  - [ ] Don’t collect more patient information then is necessary (NF)
- As a user, I want to add relevant demographic information so I can make informed nutritional goals for either myself or my patients.
  - [ ] Require users on account creation to input relevant demographic information (NF)
  - [ ] Collected demographic information should be the minimum need for application to be functional
    - [ ] Information relevant to determining recommended nutritional values for users.

#### Multi Patient Management

- As a caretaker user, I want an easy way to add and edit existing patients after the onboarding process has been completed.
  - [ ] Consolidated patient account management into one place/entrypoint. (NF)
  - [ ] Allow for editing of current patient information. (F)
  - [ ] Allow for adding of new patients. (F)
  - [ ] Protect the user from accidental deletion of patients. (NF)
  - [ ] Patients relevant demographic information is required on patient creation (NF)
- As an individual user, I don’t want to be able to view or interact with any patient management options.
  - [ ] Authenticate users as a single or multi-person's account to serve them the right experience. (NF)
  - [ ] Single user account can’t add patients (F)
  - [ ] Single users are there own patient (NF)

#### Account Management

- As a user I want to be able to update the information on my account in an easy and intuitive way.
  - [ ] Make account information accessible and intuitive to find. (F)
  - [ ] Make updating information secure while keeping it easy to change. (F)
  - [ ] Require Re-authentication for changing critical information like email, password, or payment information. (NF)
- As a user I want to be able to view my account details.
  - [ ] Display non-sensitive data to the user for them to view. (NF)
- As a user I want to be able to see when licenses are linked to my account.
  - [ ] Show what active licenses are attached to a user's account. (F)

### Authentication

- As a user I don’t want others to see my account information.
  - [ ] Users only get information connected to their account. (F)
  - [ ] Users can’t request information about other users. (NF)
- As a user I don’t want others to be able to change my information.
  - [ ] Users can only change information related to them or their patients (NF)
  - [ ] Endpoints are authenticated ensuring non-logged and logged in users can’t change there information (NF)
- As a user I want my account information to be secure.
  - [ ] Users personal information is managed securely. (NF)
  - [ ] Sensitive information is hashed or obfuscated i.g passwords and payment information. (NF)

### Licensing

- As a business, we want to make the app profitable so that we can continue maintenance and support.

* [ ] Users must sign up for a subscription license that gives them access to the application features.
  - [ ] Their user account is connected to a license. (NF)
  - [ ] When the license expires, they lose access until reactivating. (F)
* [ ] Users are guided seamlessly through the process
  - [ ] They pay for their license through a trusted portal. (NF)
  - [ ] If they do not have a subscription or their subscription is expired, they are led to subscribe again. (F)
* [ ] Users can view and manage their subscriptions status (F)
  - [ ] User can see when their subscription expires (F)
  - [ ] User can cancel their subscription (F)
  - [ ] User can renew their subscription (F)

### Nova Chat

_A friendly chat bot that focuses on helping the user or caretaker achieve their goals in the app_

- As a user, I want easy access to data that will answer my questions about a food or a conversion without leaving the app or having to do intensive research elsewhere to find what I need.

* [ ] A chat window is quickly and consistently available in most interactions in the app to have constant access to help when needed.(F)
* [ ] Nova should understand its purpose and guide the user effectively towards nutritional information.(F)
* [ ] Nova should understand some context about the patient/user to make better recommendations. (F)
* [ ] The UI is easy and simple to interact with. (NF)
* [ ] Nova remembers everything from the current chat session. (NF)
* [ ] Nova is effective at staying on topic and avoids situations where it may not give accurate information. (NF)

### User Feedback

- As a user, I want to be able to report issues or bugs back to the developers in a simple and easy manner
  - [ ] Consistent way to access the feedback form on each page
  - [ ] Form is simple and quick to fill out and submit
  - [ ] Has details such as:
    - [ ] Auto fill info for logged in user (name, email, etc)
    - [ ] Title of issue
    - [ ] Description of issue
    - [ ] Time occurred
    - [ ] Screenshot upload


# **Feature Template**

## User Flow

Functional: The thing that the user sees. They are more user concerns

Non-functional: Things that the user expects to be there and don’t explicitly say

User Flow Description

### Feature Entity

Definition of feature entity

- User story description of feature (As a user / individual / caretaker …)
  - [ ] Acceptance Criteria [ F (Functional), NF (Non-Functional) ]
    - [ More details ]
