"use client";
import React, { useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Dashboard, Menu, Person, Settings } from "@mui/icons-material";
import { NextLinkComposed } from "@/components/Link";
import { NavigationDrawer } from "@/components/NavigationDrawer";

const LINKS = [
  { label: "Dashboard", href: "/" },
  { label: "Account", href: "/account" },
  { label: "Settings", href: "/settings" },
];

const ICONS = [<Dashboard />, <Person />, <Settings />];

export const BottomNavBar = () => {
  const [value, setValue] = useState(0);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // Get the current theme and check if the screen width is larger than 'sm' breakpoint
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("sm"));

  // Conditionally render the BottomNavBar based on screen width
  if (isWideScreen) {
    return null; // Don't render BottomNavBar for wider screens
  }

  return (
    <>
      <NavigationDrawer
        open={isDrawerOpen}
        onClose={closeDrawer}
        onOpen={openDrawer}
      />
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue: number) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Menu"
            icon={<Menu />}
            onClick={openDrawer}
          />
          {LINKS.map(({ label, href }, index) => (
            <BottomNavigationAction
              key={index}
              label={label}
              icon={ICONS[index]}
              component={NextLinkComposed}
              to={{ pathname: href }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  );
};
