import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Meal } from "../view/_models/viewMeal";
import { EditMealForm } from "./EditMealForm";

interface EditMealModalProps {
  meal: Meal;
  open: boolean;
  handleClose: () => void;
}

export const EditMealModal = ({
  meal,
  open,
  handleClose,
}: EditMealModalProps) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Meal</DialogTitle>
      <DialogContent>
        <EditMealForm meal={meal} />
      </DialogContent>
    </Dialog>
  );
}