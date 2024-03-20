"use client"
import { Add } from "@mui/icons-material";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MyFoodSearchProps {
  searchKeyword: string;
}

export const MyFoodSearch: React.FC<MyFoodSearchProps> = ({ searchKeyword }: MyFoodSearchProps) => {

  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortby, setSortby] = useState<string>("Date Created");
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = (sortBy: string) => {
    setSortby(sortBy);
    setAnchorEl(null);
  }



  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="text" color="primary" onClick={() => router.push("/food/create")}>
          <Add /> Create Food
        </Button>
        {searchKeyword}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography variant="h5">My Food</Typography>
        <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <Typography variant="subtitle1">{sortby}</Typography>
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
            <MenuItem onClick={() => handleClose("Date Created")}>Date Created</MenuItem>
          </Menu>
        </div>
      </Box>
    </Box>
  )
};