"use client";

import { Grid, TextField } from "@mui/material";
import SelectUnit from "./SelectUnit";
import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";

interface AmountInputProps {
  amount: number;
  setAmount: (amount: number) => void;
  unit: UnitOption;
  setUnit: (unit: UnitOption) => void;
  restrictToUnitCategory?: string | null;
}

export const AmountInput = ({
  amount,
  setAmount,
  unit,
  setUnit,
  restrictToUnitCategory = null,
}: AmountInputProps) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            fullWidth
            error={amount <= 0}
            helperText={amount <= 0 ? "Amount must be greater than 0" : ""}
            margin="normal"
          />
        </Grid>

        <Grid item xs={6}>
          <SelectUnit
            value={unit}
            restrictToCategory={restrictToUnitCategory}
            onSelectedUnitChange={(unit) => {
              setUnit(
                unit ?? {
                  id: 0,
                  description: "",
                  abbreviation: "",
                  category: "",
                }
              );
            }}
            error={unit.description === ""}
            helperText={unit.description === "" ? "Please select a unit" : ""}
          />
        </Grid>
      </Grid>
    </>
  );
};
