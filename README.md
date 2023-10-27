# NutriNova
## CI/CD
- [x] Deployment pipline
- [x] Automated testing and linting in the pipeline (abort build if fails)
- [x] Live production environment
- [x] https support

## Authentication

- [ ] The application will use a SSO provider to handle sign-ups for new users and logins for existing users. (Authentication)
- [ ] Users can authenticate so that their data can be persisted. (Authentication)
- [ ] Users will only have access to their information and won't be able to see other people's information. (Authentication)
- [ ] Users can easily log out of their accounts for convenience and security. (Authentication)

## Foods/Ingredients (Lots of reading/writing data)

### View Used Foods/Ingredients

- [ ] Overview list of my saved foods (all that have been imported/used before). 
- [ ] Sort and filter foods. 
- [ ] See details about the food/ingredient. 

### Edit Foods/Ingredients (Custom input components)

- [ ] Edit the details of a food. 
- [ ] Changing a food should not change recorded history totals. 

### Search Foods/Ingredients (USDA API)

- [ ] Search and import foods from USDA API. 
- [ ] Adjust imported foods from the USDA API. 

### Create Food (generic form input components)

- [ ] Create custom foods.  
- [ ] Validate user-created custom foods. (Error handling)
- [ ] Specify details like name, nutritional facts, and macronutrients. 

## Individual/Managed Profiles

### Single Profile

- [ ] Users can create a profile just for them. (Authentication)

### Multi-Profile

- [ ] Manage profiles for one or more individuals. (Authentication)
- [ ] Switch between profiles without logging out. (Authentication)
- [ ] Add a new profile for a new person. (Authentication)
- [ ] Profile context to share patient details across flows (Client-side state stores)

## Recipe (Lots of reading/writing data)

### Create Recipe  (generic form input components)

- [ ] Create a recipe from stored foods. 
- [ ] Provide food and amount. 
- [ ] Measure foods in different ways. 
- [ ] Write notes about a recipe. 

### Edit Recipe

- [ ] Edit the details of a recipe. 

### View Recipes/Details

- [ ] Overview of my recipe library. 
- [ ] Filter and sort recipes. 

## Meal Records/Details

### Record Meal

- [ ] Record what meals have been eaten and when. 
- [ ] Meals can consist of multiple recipes and foods. 
  
### View Recorded Meals/Details

- [ ] View a history of meals. 
  
### Edit Meal Records

- [ ] Edit the amount of meal that was fed. 

## Onboarding

### User Info

- [ ] Identifying questions at initial sign-in. (Authentication)
- [ ] Cache onboarding progress in local storage on page leave (Local Storage)
  
### Patient Profile

- [ ] Set up new profiles for each patient. (Authentication)
- [ ] Can quick switch between patients. (generic layout components)
  
### Account Settings

- [ ] Access and edit account information. (Authentication)

## Dashboard (generic layout components)

### Daily Summary

- [ ] Daily summary of nutritional information. 
  
### Goals Summary

- [ ] Summaries of nutritional goals. 
  
### Alerts/Notification

- [ ] Alerts/notifications for when to eat. (Toasts / Websockets)


# Stretch Goals

## Meal Schedule

- [ ] Schedule meals for the week.
      
## Goals

### Set a Nutrition Goal

- [ ] Set goals for a macro or a nutrient. 

### View Goals

- [ ] Visualize my goal. 

## Interactions

- [ ] Update nutritional goals when recording a meal. 


### Reports

- [ ] View reports. 
  
### Export Reports

- [ ] Export reports. 

## Module Library

- [ ] Enable a module. 

### Allergen Alerts

- [ ] Alert for allergens in food. (Toasts / global notifications or alerts)
  
### Insulin Tracking

- [ ] Record insulin taken. 
  
### Feeding Pump Rate Calculator

- [ ] Calculate feeding pump rate. 

## Licensing

### Payment

- [ ] Pay for specific features. 

### Limited Access

- [ ] Access only features corresponding to a paid license. (Authentication)

## User Feedback

- [ ] Report an issue. (Toasts / global notifications or alerts)
