"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { MyFoodSearchForm } from "@/app/(authorized)/food/view/_components/MyFoodsSearchForm";
import { useDebounce } from "@uidotdev/usehooks";
import { SelectFoodDataGrid } from "@/components/forms/SelectFoodDataGrid";
import { AmountInput } from "@/components/forms/AmountInput";
import { ExpandCircleDown } from "@mui/icons-material";
import { SearchParameters } from "@/app/(authorized)/food/view/page";

interface Props {
  handleAddFood: () => void;
  newFood: CreateRecipeFoodRequest;
  setNewFood: (newFood: CreateRecipeFoodRequest) => void;
}

export const AddFoodDialog = ({
  handleAddFood,
  newFood,
  setNewFood,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [searchParameters, setSearchParameters] = useState<SearchParameters>({
    nutrientSearchTerm: { id: 0, nutrientName: "", preferredUnit: 0 },
    foodSearchTerm: "",
    comparisonOperator: "gt",
    nutrientValue: 0,
  });
  const searchParameterDebounce = useDebounce(searchParameters, 500);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submit = () => {
    handleAddFood();
    handleClose();
  };
  return (
    <>
      <Button startIcon={<AddCircleOutlineIcon />} onClick={handleOpen}>
        Add Food
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Food</DialogTitle>
        <DialogContent>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandCircleDown />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{newFood.name === "" ? "Select a Food" : newFood.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MyFoodSearchForm setSearchParameters={setSearchParameters} currentSearchParameters={searchParameters} />
              <SelectFoodDataGrid searchQuery={searchParameterDebounce} onFoodSelected={(food) => setNewFood({
                ...newFood,
                foodId: food.fdcId,
                name: food.description,
              })} />
            </AccordionDetails>
          </Accordion>
          <AmountInput amount={newFood.amount} setAmount={(amount) => setNewFood({
            ...newFood,
            amount: amount,
          })} setUnit={(unit) => setNewFood({
            ...newFood,
            unitId: unit.id,
            unitName: unit.description
          })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              submit();
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};