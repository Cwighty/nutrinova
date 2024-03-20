import { Dialog, DialogContent } from "@mui/material";
import { RecordMeal } from "./RecordMeal";

interface RecordMealModalProps {
  open: boolean;
  handleClose?: () => void | undefined;
}

const RecordMealModal: React.FC<RecordMealModalProps> = ({ open, handleClose = undefined }: RecordMealModalProps) => {
  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogContent sx={{ minHeight: 650 }}>
          <RecordMeal />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecordMealModal;