import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

interface FilterMenuProps {
  options: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterMenu: React.FC<FilterMenuProps> = ({ options, selectedFilter, onFilterChange }: FilterMenuProps) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = (sortBy: string) => {
    onFilterChange(sortBy);
    setAnchorEl(null);
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Typography variant="subtitle1">{selectedFilter}</Typography>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {options.map((option) => {
          return <MenuItem key={option} onClick={() => handleClose(option)}>{option}</MenuItem>
        })}
      </Menu>
    </div>
  )
};