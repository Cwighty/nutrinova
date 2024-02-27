"use client";
import {
  Alert,
  Autocomplete,
  Box,
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
import { useFetchNutrientRecommendation } from "@/app/(authorized)/goals/goalHooks";
import { PatientContext } from "@/components/providers/PatientProvider";

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
  const goalRangeTypes = [
    "RDA (Lower Limit)",
    "AI (Lower Limit)",
    "UL (Upper Limit)",
    "AMDR (Range)",
  ];

  const [goalType, setGoalType] = useState("recommended");
  const [goalRangeType, setGoalRangeType] = useState<string | null>(
    goalRangeTypes[0],
  );
  const [lowerLimit, setLowerLimit] = useState<number | string>("");
  const [upperLimit, setUpperLimit] = useState<number | string>("");
  const [selectedNutrient, setSelectedNutrient] =
    useState<NutrientOption | null>(null);

  const patientContext = React.useContext(PatientContext);
  const patient = patientContext?.selectedPatient;

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
  const {
    data: nutrientRecommendation,
    isLoading: nutrientRecommendationLoading,
    isError: nutrientRecommendationIsError,
  } = useFetchNutrientRecommendation(patient?.id, selectedNutrient?.id);

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
                sx={{ flexGrow: 1, mb: 1 }}
                error={error}
                helperText={helperText}
              />
            )}
            onChange={handleNutrientSelectionChange}
          />
          {nutrientRecommendationLoading && (
            <Skeleton variant="text" height="200" />
          )}
          {nutrientRecommendationIsError && (
            <Alert severity="error">
              Error loading nutrient recommendation, try again later
            </Alert>
          )}
          {selectedNutrient && nutrientRecommendation && (
            <>
              <Typography sx={{ mb: 1 }}>
                {"The USDA recommended " +
                  nutrientRecommendation.recommendedValueType +
                  " for " +
                  patientName +
                  " is " +
                  nutrientRecommendation.recommendedValue +
                  " " +
                  nutrientRecommendation.unit +
                  " of " +
                  nutrientRecommendation.nutrientName +
                  " "}
                per day.
              </Typography>
              <Typography sx={{ mb: 1 }}>
                Would you like to use the recommended amount as your target?
              </Typography>
              <RadioGroup
                name="goalType"
                value={goalType}
                onChange={handleGoalTypeChange}
                row
                sx={{ mb: 1 }}
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
                  <Autocomplete
                    options={goalRangeTypes}
                    getOptionLabel={(option) => option}
                    value={goalRangeType}
                    onChange={(_, value) => setGoalRangeType(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Goal Range"
                        sx={{ mb: 1 }}
                      />
                    )}
                  />
                  {nutrientRecommendation.unit && (
                    <>
                      {(goalRangeType === "RDA (Lower Limit)" ||
                        goalRangeType === "AI (Lower Limit)") && (
                        <Box>
                          <TextField
                            label="Lower Limit"
                            type="number"
                            value={lowerLimit}
                            onChange={handleLowerLimitChange}
                            InputProps={{
                              endAdornment: nutrientRecommendation.unit,
                            }}
                            fullWidth
                            sx={{ mb: 1 }}
                          />
                          {lowerLimit && (
                            <Typography sx={{ mb: 1 }}>
                              Goal achieved by consuming at least{" "}
                              {lowerLimit +
                                nutrientRecommendation.unit +
                                " of " +
                                nutrientRecommendation.nutrientName}
                              .
                            </Typography>
                          )}
                        </Box>
                      )}
                      {goalRangeType === "UL (Upper Limit)" && (
                        <Box>
                          <TextField
                            label="Upper Limit"
                            type="number"
                            value={upperLimit}
                            onChange={handleUpperLimitChange}
                            InputProps={{
                              endAdornment: nutrientRecommendation.unit,
                            }}
                            fullWidth
                            sx={{ mb: 1 }}
                          />
                          {upperLimit && (
                            <Typography sx={{ mb: 1 }}>
                              Goal achieved by consuming at most{" "}
                              {upperLimit +
                                nutrientRecommendation.unit +
                                " of " +
                                nutrientRecommendation.nutrientName}
                              .
                            </Typography>
                          )}
                        </Box>
                      )}
                      {goalRangeType === "AMDR (Range)" && (
                        <>
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                              label="Lower Limit"
                              type="number"
                              value={lowerLimit}
                              onChange={handleLowerLimitChange}
                              InputProps={{
                                endAdornment: nutrientRecommendation.unit,
                              }}
                              sx={{ mb: 1 }}
                            />
                            <TextField
                              label="Upper Limit"
                              type="number"
                              value={upperLimit}
                              onChange={handleUpperLimitChange}
                              InputProps={{
                                endAdornment: nutrientRecommendation.unit,
                              }}
                              sx={{ mb: 1 }}
                            />
                          </Box>
                          {lowerLimit && upperLimit && (
                            <Typography sx={{ mb: 1 }}>
                              Goal achieved by consuming between{" "}
                              {lowerLimit +
                                " and " +
                                upperLimit +
                                nutrientRecommendation.unit +
                                " of " +
                                nutrientRecommendation.nutrientName}
                              .
                            </Typography>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {!nutrientRecommendation.unit && (
                    <Alert severity="warning">
                      No unit found for this nutrient. Please contact your
                      administrator to add a unit to this nutrient.
                    </Alert>
                  )}
                </>
              )}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">
                  RDA - Recommended Dietary Allowance
                </Typography>
                <Typography variant="caption">AI - Adequate Intake</Typography>
                <Typography variant="caption">
                  UL - Tolerable Upper Intake Level
                </Typography>
                <Typography variant="caption">
                  AMDR - Acceptable Macronutrient Distribution Range
                </Typography>
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
};
