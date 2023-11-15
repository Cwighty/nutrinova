"use client"

import { Grid, TextField } from "@mui/material";
import SelectUnit from "./SelectUnit";
import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";


interface AmountInputProps {
  amount: number;
  setAmount: (amount: number) => void;
  setUnit: (unit: UnitOption) => void;
}



export const AmountInput = ({
  amount,
  setAmount,
  setUnit,
}: AmountInputProps) => {

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={6} md={6}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            fullWidth
            margin="normal"
          />
        </Grid>

        <Grid item xs={6} md={6}>
          <SelectUnit
            onSelectedUnitChange={(unit) => {
              setUnit(unit ?? { id: 1, description: "gram", abreviation: "g" });
            }
            }
          />
        </Grid>
      </Grid>
    </>
  );
}
