
import { Add } from "@mui/icons-material";
import { Box, IconButton, ListItem, ListItemButton, Typography } from "@mui/material";

interface PrepMealCardProps {
  description: string;
  amount: number;
  unit: string;
  calories: number;
}

export const PrepMealCard: React.FC<PrepMealCardProps> = ({ description, amount, unit, calories }: PrepMealCardProps) => {
  return (
    <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
      <ListItemButton>
        <Box>
          <Typography>{description}</Typography>
          <Typography>{amount} {unit} | {calories} kcal</Typography>
        </Box>
      </ListItemButton>
      <Box>
        <IconButton><Add /></IconButton>
      </Box>
    </ListItem>
  )
};