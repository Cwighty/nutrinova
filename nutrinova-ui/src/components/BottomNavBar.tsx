"use client";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Fastfood, Home, Search } from "@mui/icons-material";
import { useState } from "react";
import { NextLinkComposed } from "@/components/Link";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search-foods" },
  { label: "Create Food", href: "/create-food" },
];

// eslint-disable-next-line react/jsx-key
const ICONS = [<Home />, <Search />, <Fastfood />];

export const BottomNavBar = () => {
  const [value, setValue] = useState(0);

  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue: number) => {
          console.log("newValue", newValue);
          setValue(newValue);
        }}
      >
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
  );
};
