import { SwipeableDrawer } from "@mui/material";
import { NavigationList } from "@/components/NavigationList";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const NavigationDrawer = ({
  isOpen,
  onClose,
  onOpen,
}: NavigationDrawerProps) => {
  const toggleDrawer = (shouldOpen: boolean) => {
    shouldOpen ? onOpen() : onClose();
  };

  return (
    <SwipeableDrawer
      anchor="left"
      open={isOpen}
      onClose={() => toggleDrawer(false)}
      onOpen={() => toggleDrawer(true)}
    >
      <NavigationList />
    </SwipeableDrawer>
  );
};
