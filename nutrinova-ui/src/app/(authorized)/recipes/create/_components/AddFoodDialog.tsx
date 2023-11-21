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
import { CreateRecipeFoodModel } from "../_models/createRecipeFoodModel";

interface Props {
  handleAddFood: () => void;
  newFood: CreateRecipeFoodModel;
  setNewFood: (newFood: CreateRecipeFoodModel) => void;
}

export const AddFoodDialog = ({
  handleAddFood,
  newFood,
  setNewFood,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [searchParameters, setSearchParameters] = useState<SearchParameters>({
    nutrientSearchTerm: {
      id: 0,
      description: "",
      preferredUnitId: 0,
      category: "",
    },
    foodSearchTerm: "",
    comparisonOperator: "gt",
    nutrientValue: 0,
  });
  const searchParameterDebounce = useDebounce(searchParameters, 500);
  const [validFoodSelected, setValidFoodSelected] = useState<boolean>(true);
  // const { data: food } = useGetFoodByIdQuery(newFood.foodId);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewFood({
      foodId: "",
      amount: 1,
      unitId: 1,
      name: "",
      unitName: "Gram",
    });
    setValidFoodSelected(true);
  };

  const submit = () => {
    if (newFood.amount <= 0) {
      return;
    }
    if (newFood.foodId === "") {
      setValidFoodSelected(false);
      return;
    }
    if (newFood.unitId === 0) {
      return;
    }
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
              <Typography>
                {newFood.name === "" ? "Select a Food" : newFood.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MyFoodSearchForm
                setSearchParameters={setSearchParameters}
                currentSearchParameters={searchParameters}
              />
              <SelectFoodDataGrid
                searchQuery={searchParameterDebounce}
                onFoodSelected={(food) =>
                  setNewFood({
                    ...newFood,
                    foodId: food.id,
                    name: food.description,
                  })
                }
              />
            </AccordionDetails>
          </Accordion>
          {validFoodSelected ? (
            ""
          ) : (
            <Typography fontSize={12} color="error">
              Please select a food
            </Typography>
          )}

          <AmountInput
            amount={newFood.amount}
            setAmount={(amount) =>
              setNewFood({
                ...newFood,
                amount: amount,
              })
            }
            unit={{
              id: newFood.unitId,
              description: newFood.unitName,
              abbreviation: "",
              categoryName: "",
              categoryId: newFood.unitId,
              // this will need to be changed
              category: {
                id: newFood.unitId,
                description: "",
              },
            }}
            setUnit={(unit) =>
              setNewFood({
                ...newFood,
                unitId: unit.id,
                unitName: unit.description,
              })
            }
          />
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
