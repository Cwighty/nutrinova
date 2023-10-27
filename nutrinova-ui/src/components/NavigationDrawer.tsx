import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import {
  AddBox,
  Create,
  Restaurant,
  Search,
  ViewList,
} from "@mui/icons-material";
import { NextLinkComposed } from "@/components/Link";

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const NavigationDrawer = ({
  open,
  onClose,
  onOpen,
}: NavigationDrawerProps) => {
  const toggleDrawer =
    (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      isOpen ? onOpen() : onClose();
    };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItemButton
          key="Search Foods"
          component={NextLinkComposed}
          to={{ pathname: "/food/search" }}
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
        >
          <ListItemIcon>
            <AddBox />
          </ListItemIcon>
          <ListItemText primary="Create Foods" />
        </ListItemButton>
        <ListItemButton
          key="Create Recipe"
          component={NextLinkComposed}
          to={{ pathname: "/recipes/create" }}
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
        >
          <ListItemIcon>
            <ViewList />
          </ListItemIcon>
          <ListItemText primary="View Recipes" />
        </ListItemButton>
        <ListItemButton
          key="Record Meal"
          component={NextLinkComposed}
          to={{ pathname: "/meals/record" }}
        >
          <ListItemIcon>
            <Restaurant />
          </ListItemIcon>
          <ListItemText primary="Record Meal" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      {list()}
    </SwipeableDrawer>
  );
};
