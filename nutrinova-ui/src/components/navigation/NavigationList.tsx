"use client";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
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
  Fastfood,
  MenuBook,
  Person,
  Restaurant,
  Search,
  Settings,
  ViewList,
} from "@mui/icons-material";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface NavigationListProps {
  closeDrawer?: () => void;
  isDesktop?: boolean;
}

export const NavigationList = ({
  closeDrawer,
  isDesktop,
}: NavigationListProps) => {
  const [foodOpen, setFoodOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [mealsOpen, setMealsOpen] = useState(false);

  const { theme } = useTheme();

  const imageSrc =
    theme === "dark"
      ? "/nutrinova-atomic-white.svg"
      : "/nutrinova-atomic-black.svg";

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
    <List disablePadding={true} sx={{ width: "100%" }}>
      <ListItem>
        <Box
          component="img"
          sx={{
            maxWidth: "100%",
            height: "auto",
            py: { xs: 5, md: 1.3, lg: 0.3 },
          }}
          src={imageSrc}
        />
      </ListItem>
      <Divider />
      {isDesktop && (
        <>
          <ListItemButton
            key="Dashboard"
            component={NextLinkComposed}
            to={{ pathname: "/dashboard" }}
          >
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <Divider />
        </>
      )}
      <ListItemButton onClick={handleFoodClick}>
        <ListItemIcon>
          <Fastfood />
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
          <ListItemButton
            key="My Foods"
            component={NextLinkComposed}
            to={{ pathname: "/food/view" }}
            sx={{ pl: 4 }}
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <ViewList />
            </ListItemIcon>
            <ListItemText primary="My Foods" />
          </ListItemButton>
        </List>
      </Collapse>
      <ListItemButton onClick={handleRecipesClick}>
        <ListItemIcon>
          <MenuBook />
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
      {isDesktop && (
        <>
          <Divider />
          <ListItemButton
            key="Account"
            component={NextLinkComposed}
            to={{ pathname: "/account" }}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItemButton>
          <ListItemButton
            key="Settings"
            component={NextLinkComposed}
            to={{ pathname: "/settings" }}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </>
      )}
    </List>
  );
};
