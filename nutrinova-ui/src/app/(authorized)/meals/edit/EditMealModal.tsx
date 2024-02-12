import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
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
      <DialogTitle>
        <Grid container justifyContent={'flex-start'} alignItems={'center'}>
          <Grid item xs={6} >
            <Typography variant="h4">
              Edit Meal
            </Typography>
          </Grid>
          <Grid item container xs={6} justifyContent={'flex-end'} >
            <Button onClick={handleClose} size="arge">
              Close
            </Button>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <EditMealForm meal={meal} closeModal={handleClose} />
      </DialogContent>
    </Dialog >
  );
}