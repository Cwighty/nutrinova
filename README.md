# NutriNova

# Up to date progress can be viewed in our [github project](https://github.com/users/Cwighty/projects/5)

## CI/CD
- [x] Deployment pipline
- [x] Automated testing and linting in the pipeline (abort build if fails)
- [x] Live production environment
- [x] https support

## Authentication

- [x] The application will use a SSO provider to handle sign-ups for new users and logins for existing users. (Authentication)
- [x] Users can authenticate so that their data can be persisted. (Authentication)
- [x] Users will only have access to their information and won't be able to see other people's information. (Authentication)
- [x] Users can easily log out of their accounts for convenience and security. (Authentication)
      
# Nov 4th

## Foods/Ingredients (Lots of reading/writing data)

### Search Foods/Ingredients (USDA API)

- [x] Search and import foods from USDA API. 
- [x] Adjust imported foods from the USDA API.

### Create Food (generic form input components)

- [x] Create custom foods.  
- [x] Validate user-created custom foods. (Error handling)
- [x] Specify details like name, nutritional facts, and macronutrients.

# Nov 11th

### View Used Foods/Ingredients

- [x] Overview list of my saved foods (all that have been imported/used before). 
- [x] Sort and filter foods. 
- [x] See details about the food/ingredient. 

### Edit Foods/Ingredients (Custom input components)

- [x] Edit the details of a food. 
- [x] Changing a food should not change recorded history totals. 


## Individual/Managed Profiles

### Single Profile

- [x] Users can create a profile just for them. (Authentication)

# Nov 18th

### Alerts/Notification

- [x] Alerts/notifications for when to eat. (Toasts / Websockets)

## Recipe (Lots of reading/writing data)

### Create Recipe  (generic form input components)

- [x] Create a recipe from stored foods. 
- [x] Provide food and amount. 
- [x] Measure foods in different ways. 
- [x] Write notes about a recipe.
      
# Nov 25th

### Edit Recipe

- [x] Edit the details of a recipe. 

### View Recipes/Details

- [x] Overview of my recipe library. 
- [x] Filter and sort recipes. 

## Meal Records/Details

### Record Meal

- [x] Record what meals have been eaten and when. 
- [x] Meals can consist of multiple recipes and foods. 

# Dec 2

### View Recorded Meals/Details

- [x] View a history of meals. 
  

## Onboarding

### User Info

- [x] Identifying questions at initial sign-in. (Authentication)
  
### Patient Profile

- [x] Set up new profiles for each patient. (Authentication)
- [x] Can quick switch between patients. (generic layout components)
      
# Dec 9 (due date)

### Multi-Profile

- [x] Manage profiles for one or more individuals. (Authentication)
- [x] Switch between profiles without logging out. (Authentication)
- [x] Add a new profile for a new person. (Authentication)
- [x] Profile context to share patient details across flows (Client-side state stores)
  

## Dashboard (generic layout components)

### Daily Summary

- [x] Daily summary of nutritional information. 
  
### Goals Summary

- [x] Summaries of nutritional goals. 
  



# Stretch Goals

### Edit Meal Records

- [ ] Edit the amount of meal that was fed. 

### Account Settings

- [ ] Access and edit account information. (Authentication)

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
