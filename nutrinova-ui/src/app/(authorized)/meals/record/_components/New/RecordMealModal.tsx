import { CloseSharp } from "@mui/icons-material";
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { RecordMeal } from "./RecordMeal";

interface RecordMealModalProps {
  open: boolean;
  handleClose?: () => void | undefined;
}

const RecordMealModal: React.FC<RecordMealModalProps> = ({ open, handleClose = undefined }: RecordMealModalProps) => {
  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Record Meal
            <IconButton onClick={handleClose} sx={{ ml: 'auto' }}>
              <CloseSharp />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ minHeight: 650 }}>
          <RecordMeal />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecordMealModal;