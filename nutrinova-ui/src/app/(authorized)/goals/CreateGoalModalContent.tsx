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
import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import {
  useGetNutrientsQuery,
  useGetUnitsQuery,
} from "@/app/(authorized)/food/foodHooks";
import { NutrientOption } from "@/app/(authorized)/food/_models/nutrientOption";
import { useFetchNutrientRecommendation } from "@/app/(authorized)/goals/goalHooks";
import { PatientContext } from "@/components/providers/PatientProvider";
import { NutrientGoalRequestModel } from "@/app/(authorized)/goals/_models/NutrientGoalRequestModel";

interface CreateGoalModalContentProps {
  error?: boolean;
  helperText?: string;
  onSelectedNutrientChange: (nutrient: NutrientOption | null) => void;
  newGoal: NutrientGoalRequestModel;
  setNewGoal: (newGoal: NutrientGoalRequestModel) => void;
  patientName: string;
  validationMessage: string;
  setValidationMessage: (validationMessage: string) => void;
}

export const CreateGoalModalContent = ({
  error,
  helperText,
  onSelectedNutrientChange,
  newGoal,
  setNewGoal,
  patientName,
  validationMessage,
  setValidationMessage,
}: CreateGoalModalContentProps) => {
  const goalRangeTypes = [
    "RDA (Lower Limit)",
    "AI (Lower Limit)",
    "UL (Upper Limit)",
    "AMDR (Range)",
  ];

  const [goalType, setGoalType] = useState("recommended");
  const [goalRangeType, setGoalRangeType] = useState<string | null>();
  const [lowerLimit, setLowerLimit] = useState<number | undefined>();
  const [upperLimit, setUpperLimit] = useState<number | undefined>();
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
    if (value) setNewGoal({ ...newGoal, nutrientId: value.id });
    onSelectedNutrientChange(value);
  };

  const handleGoalTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGoalType(event.target.value);
    setLowerLimit(undefined);
    setUpperLimit(undefined);
    setValidationMessage("");
    setNewGoal({
      ...newGoal,
      dailyLowerLimit: undefined,
      dailyUpperLimit: undefined,
      useRecommended: event.target.value === "recommended",
    });
    if (event.target.value === "recommended") {
      setGoalRangeType(null);
    } else {
      setGoalRangeType(goalRangeTypes[0]);
    }
  };

  const handleGoalRangeTypeChange = (goalRangeType: string | null) => {
    setLowerLimit(undefined);
    setUpperLimit(undefined);
    setValidationMessage("");
    setGoalRangeType(goalRangeType);
  };

  const handleLowerLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(event.target.value);
    if (goalRangeType === "AMDR (Range)" && upperLimit && upperLimit !== 0) {
      setValidationMessage("");
    }
    if (
      goalRangeType === "RDA (Lower Limit)" ||
      goalRangeType === "AI (Lower Limit)"
    ) {
      setValidationMessage("");
    }
    setLowerLimit(Number(event.target.value));
    setNewGoal({ ...newGoal, dailyLowerLimit: numericValue });
  };

  const handleUpperLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(event.target.value);
    if (goalRangeType === "AMDR (Range)" && lowerLimit && lowerLimit !== 0) {
      setValidationMessage("");
    }
    if (goalRangeType === "UL (Upper Limit)") {
      setValidationMessage("");
    }
    setUpperLimit(numericValue);
    setNewGoal({ ...newGoal, dailyUpperLimit: numericValue });
  };

  if (
    goalRangeType === "RDA (Lower Limit)" ||
    goalRangeType === "AI (Lower Limit"
  ) {
    if (!lowerLimit || lowerLimit === 0) {
      setValidationMessage("Please enter a lower limit");
    }
  }

  if (goalRangeType === "UL (Upper Limit)") {
    if (!upperLimit || upperLimit === 0) {
      setValidationMessage("Please enter an upper limit");
    }
  }

  if (goalRangeType === "AMDR (Range)") {
    if (!lowerLimit || lowerLimit === 0 || !upperLimit || upperLimit === 0) {
      setValidationMessage("Please enter a valid range");
    }
  }

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
        <Box component="form" noValidate sx={{ mt: 1 }}>
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
                    onChange={(_, value) => handleGoalRangeTypeChange(value)}
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
                            value={lowerLimit?.toString()}
                            onChange={handleLowerLimitChange}
                            InputProps={{
                              endAdornment: nutrientRecommendation.unit,
                            }}
                            fullWidth
                            sx={{ mb: 1 }}
                          />
                          {!validationMessage && (
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
                            value={upperLimit?.toString()}
                            onChange={handleUpperLimitChange}
                            InputProps={{
                              endAdornment: nutrientRecommendation.unit,
                            }}
                            fullWidth
                            sx={{ mb: 1 }}
                          />
                          {!validationMessage && (
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
                              value={lowerLimit?.toString()}
                              onChange={handleLowerLimitChange}
                              InputProps={{
                                endAdornment: nutrientRecommendation.unit,
                              }}
                              sx={{ mb: 1 }}
                            />
                            <TextField
                              label="Upper Limit"
                              value={upperLimit?.toString()}
                              onChange={handleUpperLimitChange}
                              InputProps={{
                                endAdornment: nutrientRecommendation.unit,
                              }}
                              sx={{ mb: 1 }}
                            />
                          </Box>
                          {!validationMessage && (
                            <Typography sx={{ mb: 1 }}>
                              Goal achieved by consuming between{" "}
                              {lowerLimit +
                                nutrientRecommendation.unit +
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
                  {validationMessage && (
                    <Typography variant="caption" sx={{ mb: 1 }} color="error">
                      {validationMessage}
                    </Typography>
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
