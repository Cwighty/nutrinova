import { Card, CardContent, Typography } from '@mui/material';
import { CreateRecipeFoodModel } from '../_models/createRecipeFoodModel';

interface SelectedRecipeFoodCardProps {
  item: CreateRecipeFoodModel;
}

export const SelectedRecipeFoodCard: React.FC<SelectedRecipeFoodCardProps> = ({ item }) => {
  return (
    <Card
      variant="outlined"
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {item.name}
        </Typography>
      </CardContent>
    </Card>
  );
};