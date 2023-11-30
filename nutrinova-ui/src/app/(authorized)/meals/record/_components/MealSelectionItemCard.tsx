import { Card, CardContent, Typography } from '@mui/material';
import { MealSelectionItem } from '../_models/mealSelectionItem';

interface MealSelectionItemCardProps {
  item: MealSelectionItem;
}

export const MealSelectionItemCard: React.FC<MealSelectionItemCardProps> = ({ item }) => {
  return (
    <Card
      variant="outlined"
      
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {item.description}
        </Typography>
        <Typography color="text.secondary">
          Serving Size: {item.servingSize} {item.servingSizeUnit?.abbreviation}
        </Typography>
        {item.note && (
          <Typography variant="body2">
            Note: {item.note}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};