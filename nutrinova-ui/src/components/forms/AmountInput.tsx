"use client";

import { Box, Grid, TextField } from "@mui/material";
import SelectUnit from "./SelectUnit";
import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";

interface AmountInputProps {
  amount: number;
  setAmount: (amount: number) => void;
  unit: UnitOption;
  setUnit: (unit: UnitOption) => void;
  restrictToUnitCategory?: string | null;
  submitted?: boolean;
}

export const AmountInput = ({
  amount,
  setAmount,
  unit,
  setUnit,
  restrictToUnitCategory = null,
  submitted = true,
}: AmountInputProps) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Amount"
            type="number"
            value={amount.toString()}
            onChange={handleAmountChange}
            fullWidth
            error={submitted && amount <= 0}
            helperText={
              submitted && amount <= 0 ? "Amount must be greater than 0" : ""
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <SelectUnit
            value={unit}
            restrictToCategory={restrictToUnitCategory}
            onSelectedUnitChange={(unit) => {
              setUnit(
                unit ?? {
                  id: 0,
                  description: "",
                  abbreviation: "",
                  categoryId: 0,
                  // this will need to be changed
                  category: {
                    id: 0,
                    description: "",
                  },
                },
              );
            }}
            error={submitted && unit.description === ""}
            helperText={
              submitted && unit.description === "" ? "Please select a unit" : ""
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};
