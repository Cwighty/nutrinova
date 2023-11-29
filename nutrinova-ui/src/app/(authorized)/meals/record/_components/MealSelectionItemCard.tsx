import { Card, CardContent, Typography } from '@mui/material';
import { MealSelectionItem } from '../_models/mealSelectionItem';

interface MealSelectionItemCardProps {
  item: MealSelectionItem;
  onSelect: () => void;
}

export const MealSelectionItemCard: React.FC<MealSelectionItemCardProps> = ({ item, onSelect }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        marginBottom: 0,
        cursor: 'pointer',
        transition: '0.2s',
        '&:hover': {
          transform: 'translateX(-3px)',
        },
      }}
      onClick={onSelect}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {item.description}
        </Typography>
        <Typography color="text.secondary">
          Serving Size: {item.servingSize} {item.servingSizeUnit}
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