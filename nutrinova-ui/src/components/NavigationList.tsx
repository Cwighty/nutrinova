"use client";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NextLinkComposed } from "@/components/Link";
import {
  AddBox,
  Create,
  Dashboard,
  ExpandLess,
  ExpandMore,
  Restaurant,
  Search,
  ViewList,
} from "@mui/icons-material";
import { useState } from "react";

interface NavigationListProps {
  closeDrawer?: () => void;
}

export const NavigationList = ({ closeDrawer }: NavigationListProps) => {
  const [foodOpen, setFoodOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [mealsOpen, setMealsOpen] = useState(false);

  const handleFoodClick = () => {
    setFoodOpen(!foodOpen);
  };

  const handleRecipesClick = () => {
    setRecipesOpen(!recipesOpen);
  };

  const handleMealsClick = () => {
    setMealsOpen(!mealsOpen);
  };

  return (
    <List sx={{ width: "100%" }}>
      <ListItemButton
        key="Dashboard"
        component={NextLinkComposed}
        to={{ pathname: "/" }}
      >
        <ListItemIcon>
          <Dashboard />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={handleFoodClick}>
        <ListItemIcon>
          <Restaurant />
        </ListItemIcon>
        <ListItemText primary="Food" />
        {foodOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={foodOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            key="Search Foods"
            component={NextLinkComposed}
            to={{ pathname: "/food/search" }}
            sx={{ pl: 4 }}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <Search />
            </ListItemIcon>
            <ListItemText primary="Search Foods" />
          </ListItemButton>
          <ListItemButton
            key="Create Food"
            component={NextLinkComposed}
            to={{ pathname: "/food/create" }}
            sx={{ pl: 4 }}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <AddBox />
            </ListItemIcon>
            <ListItemText primary="Create Foods" />
          </ListItemButton>
        </List>
      </Collapse>
      <ListItemButton onClick={handleRecipesClick}>
        <ListItemIcon>
          <Restaurant />
        </ListItemIcon>
        <ListItemText primary="Recipes" />
        {recipesOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={recipesOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            key="Create Recipe"
            component={NextLinkComposed}
            to={{ pathname: "/recipes/create" }}
            sx={{ pl: 4 }}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <Create />
            </ListItemIcon>
            <ListItemText primary="Create Recipe" />
          </ListItemButton>
          <ListItemButton
            key="View Recipes"
            component={NextLinkComposed}
            to={{ pathname: "/recipes/view" }}
            sx={{ pl: 4 }}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <ViewList />
            </ListItemIcon>
            <ListItemText primary="View Recipes" />
          </ListItemButton>
        </List>
      </Collapse>
      <ListItemButton onClick={handleMealsClick}>
        <ListItemIcon>
          <Restaurant />
        </ListItemIcon>
        <ListItemText primary="Meals" />
        {mealsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={mealsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            key="Create Meal"
            component={NextLinkComposed}
            to={{ pathname: "/meals/record" }}
            sx={{ pl: 4 }}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <Create />
            </ListItemIcon>
            <ListItemText primary="Create Meal" />
          </ListItemButton>
          <ListItemButton
            key="View Meals"
            component={NextLinkComposed}
            to={{ pathname: "/meals/view" }}
            sx={{ pl: 4 }}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <ViewList />
            </ListItemIcon>
            <ListItemText primary="View Meals" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
};
