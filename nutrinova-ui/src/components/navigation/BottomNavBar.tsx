"use client";
import React, { useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from "@mui/material";
import { Dashboard, Menu, Person, Settings } from "@mui/icons-material";
import { NextLinkComposed } from "@/components/Link";
import { NavigationDrawer } from "@/components/navigation/NavigationDrawer";

const LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Account", href: "/account" },
  { label: "Settings", href: "/settings" },
];

const ICONS = [
  <Dashboard key="Dashboard" />,
  <Person key="Person" />,
  <Settings key="Settings" />,
];

export const BottomNavBar = () => {
  const [value, setValue] = useState(0);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: { xs: "flex", md: "none" } }}>
      <NavigationDrawer
        isOpen={isDrawerOpen}
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
    </Box>
  );
};
