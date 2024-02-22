"use client";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import {
  useGetNutrientsQuery,
  useGetUnitsQuery,
} from "@/app/(authorized)/food/foodHooks";
import { NutrientOption } from "@/app/(authorized)/food/_models/nutrientOption";
import { UnitOption } from "@/app/(authorized)/food/_models/unitOption";

interface CreateGoalModalContentProps {
  error?: boolean;
  helperText?: string;
  onSelectedNutrientChange: (nutrient: NutrientOption | null) => void;
  onNutrientAmountChange: (
    amount: number | null,
    unit: UnitOption | null,
  ) => void;
  patientName: string;
}

export const CreateGoalModalContent = ({
  error,
  helperText,
  onSelectedNutrientChange,
  onNutrientAmountChange,
  patientName,
}: CreateGoalModalContentProps) => {
  const [goalType, setGoalType] = useState("custom");
  const [lowerLimit, setLowerLimit] = useState<number | string>(70);
  const [upperLimit, setUpperLimit] = useState<number | string>("");
  const [selectedNutrient, setSelectedNutrient] =
    useState<NutrientOption | null>(null);

  const {
    data: nutrientOptions,
    isLoading: nutrientOptionsLoading,
    isError: nutrientOptionsIsError,
  } = useGetNutrientsQuery();
  const {
    data: unitOptions,
    isLoading: unitOptionsLoading,
    isError: unitOptionsIsError,
  } = useGetUnitsQuery();

  const handleNutrientSelectionChange = (
    _: SyntheticEvent<Element, Event>,
    value: NutrientOption | null,
  ) => {
    setSelectedNutrient(value);
    onSelectedNutrientChange(value);
  };

  const handleNutrientAmountChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newAmount = parseFloat(event.target.value) ?? null;
    const newUnit =
      unitOptions?.find((u) => u.id === selectedNutrient?.preferredUnitId) ??
      null;
    onNutrientAmountChange(newAmount, newUnit);
  };

  const handleGoalTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGoalType(event.target.value);
  };

  const handleLowerLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLowerLimit(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleUpperLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUpperLimit(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Submit form logic here
    alert(
      `Protein goal set to: ${lowerLimit}g - ${
        upperLimit || "No upper limit"
      }g`,
    );
  };

  if (nutrientOptionsLoading || unitOptionsLoading) {
    return <Skeleton variant="rounded" width={400} height={40} />;
  }
  if (nutrientOptionsIsError || unitOptionsIsError) {
    return (
      <Alert severity="error">
        Error loading nutrient options, try again later
      </Alert>
    );
  }

  return (
    <>
      {nutrientOptions && unitOptions && (
        <Box
          component="form"
          noValidate
          onSubmit={handleFormSubmit}
          sx={{ mt: 1 }}
        >
          <Autocomplete
            options={nutrientOptions}
            groupBy={(option) => option.categoryName}
            getOptionLabel={(option) => `${option.description}`}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.description}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nutrient"
                sx={{ flexGrow: 1, mb: { xs: 2, md: 0 } }}
                error={error}
                helperText={helperText}
              />
            )}
            onChange={handleNutrientSelectionChange}
          />
          {selectedNutrient && (
            <>
              <Typography>
                The USDA recommended RDA* for {patientName} is 56 g of Protein
                per day.
              </Typography>
              <Typography>
                Would you like to use the recommended amount as your target?
              </Typography>
              <RadioGroup
                name="goalType"
                value={goalType}
                onChange={handleGoalTypeChange}
                row
              >
                <FormControlLabel
                  value="recommended"
                  control={<Radio />}
                  label="Use Recommended"
                />
                <FormControlLabel
                  value="custom"
                  control={<Radio />}
                  label="Create Custom Goal"
                />
              </RadioGroup>

              {goalType === "custom" && (
                <>
                  <Typography>
                    You can set a lower limit (RDA/AI), an upper limit (UL*), or
                    set both to create a range (AMDR*).
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      label="Lower Limit"
                      type="number"
                      value={lowerLimit}
                      onChange={handleLowerLimitChange}
                      InputProps={{ endAdornment: "g" }}
                    />
                    <TextField
                      label="Upper Limit"
                      type="number"
                      value={upperLimit}
                      onChange={handleUpperLimitChange}
                      InputProps={{ endAdornment: "g" }}
                    />
                  </Box>
                  <Typography>
                    Goal achieved by consuming at least {lowerLimit}g of
                    Protein.
                  </Typography>
                </>
              )}
              <Typography variant="caption">
                *RDA - Recommended Dietary Allowance AI - Adequate Intake UL -
                Tolerable Upper Intake Level AMDR - Acceptable Macronutrient
                Distribution Range
              </Typography>
            </>
          )}
        </Box>
      )}
    </>
  );
};
