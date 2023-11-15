"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { MyFoodSearchForm } from "@/app/(authorized)/food/view/_components/MyFoodsSearchForm";
import { useDebounce } from "@uidotdev/usehooks";
import { SelectFoodDataGrid } from "@/components/forms/SelectFoodDataGrid";
import { AmountInput } from "@/components/forms/AmountInput";

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
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const searchKeywordDebounce = useDebounce(searchKeyword, 500);

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
          <MyFoodSearchForm setSearchTerm={setSearchKeyword} />
          <SelectFoodDataGrid searchQuery={searchKeywordDebounce} onFoodSelected={(food) => setNewFood({
            ...newFood,
            foodId: food.fdcId,
            name: food.description,
          })} />
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