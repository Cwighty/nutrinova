# NutriNova
## CI/CD
- [ ] Deployment pipline


## Authentication

- [ ] The application will use a SSO provider to handle sign-ups for new users and logins for existing users. (Authentication and user account support)
- [ ] Users can authenticate so that their data can be persisted. (Authentication and user account support)
- [ ] Users will only have access to their information and won't be able to see other people's information. (Authentication and user account support)
- [ ] Users can easily log out of their accounts for convenience and security. (Authentication and user account support)

## Foods/Ingredients

### View Used Foods/Ingredients

- [ ] Overview list of my saved foods (all that have been imported/used before). (Network Calls - read data)
- [ ] Sort and filter foods. (Experience Requirements - Organized and smooth experience)
- [ ] See details about the food/ingredient. (Network Calls - read data)

### Edit Foods/Ingredients (Custom input components)

- [ ] Edit the details of a food. (Network Calls - write data)
- [ ] Changing a food should not change recorded history totals. 

### Search Foods/Ingredients (USDA API)

- [ ] Search and import foods from USDA API. (Network Calls - read data)
- [ ] Adjust imported foods from the USDA API. (Network Calls - write data)
- [ ] Search results to appear in at most 3 seconds. (Experience Requirements - Organized and smooth experience)

### Create Food

- [ ] Create custom foods. (Network Calls - write data) 
- [ ] Validate user-created custom foods. (Error handling)
- [ ] Specify details like name, nutritional facts, and macronutrients. (3+ generic form input components)

## Individual/Managed Profiles

### Single Profile

- [ ] Users can create a profile just for them. (Authentication and user account support)

### Multi-Profile

- [ ] Manage profiles for one or more individuals. (Authentication and user account support)
- [ ] Switch between profiles without logging out. (Authentication and user account support)
- [ ] Add a new profile for a new person. (Authentication and user account support)
- [ ] Profile context to share patient details across flows (Client-side state stores)

## Recipe

### Create Recipe

- [ ] Create a recipe from stored foods. (Network Calls - write data)
- [ ] Provide food and amount. (3+ generic form input components)
- [ ] Measure foods in different ways. (3+ generic form input components)
- [ ] Write notes about a recipe. (3+ generic form input components)

### Edit Recipe

- [ ] Edit the details of a recipe. (Network Calls - write data)

### View Recipes/Details

- [ ] Overview of my recipe library. (Network Calls - read data)
- [ ] Filter and sort recipes. (Experience Requirements - Organized and smooth experience)

## Meal Records/Details

### Record Meal

- [ ] Record what meals have been eaten and when. (Network Calls - write data)
- [ ] Meals can consist of multiple recipes and foods. (Network Calls - write data)
  
### View Recorded Meals/Details

- [ ] View a history of meals. (Network Calls - read data)
  
### Edit Meal Records

- [ ] Edit the amount of meal that was fed. (Network Calls - write data)

## Onboarding

### User Info

- [ ] Identifying questions at initial sign-in. (Authentication)
- [ ] Cache onboarding progress in local storage on page leave ( Local Storage )
  
### Patient Profile

- [ ] Set up new profiles for each patient. (Authentication and user account support)
  
### Account Settings

- [ ] Access and edit account information. (Authentication and user account support)

## Dashboard

### Daily Summary

- [ ] Daily summary of nutritional information. (Network Calls - read data)
  
### Goals Summary

- [ ] Summaries of nutritional goals. (Network Calls - read data)
  
### Alerts/Notification

- [ ] Alerts/notifications for when to eat. (Toasts / Websockets)

### Meal Schedule

- [ ] Schedule meals for the week. (Network Calls - write data)

## Goals

### Set a Nutrition Goal

- [ ] Set goals for a macro or a nutrient. (Network Calls - write data)

### View Goals

- [ ] Visualize my goal. (Network Calls - read data)

## Interactions

- [ ] Update nutritional goals when recording a meal. (Network Calls - write data)

## Growth Features

### Reports

- [ ] View reports. (Network Calls - read data)
  
### Export Reports

- [ ] Export reports. (Network Calls - read data)

## Module Library

- [ ] Enable a module. (Network Calls - write data)

### Allergen Alerts

- [ ] Alert for allergens in food. (Toasts / global notifications or alerts)
  
### Insulin Tracking

- [ ] Record insulin taken. (Network Calls - write data)
  
### Feeding Pump Rate Calculator

- [ ] Calculate feeding pump rate. (Network Calls - read data)

## Licensing

### Payment

- [ ] Pay for specific features. (Network Calls - write data)

### Limited Access

- [ ] Access only features corresponding to a paid license. (Authentication and user account support)

## User Feedback

- [ ] Report an issue. (Toasts / global notifications or alerts)
