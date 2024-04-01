import { Search } from "@mui/icons-material";
import { Box, InputAdornment, Tab, Tabs, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { MyFoodSearch } from "./MyFoodSearch";
import { SearchAll } from "./SearchAll";
import { MyRecipeSearch } from "./MyRecipeSearch";
import { useDebounce } from "@uidotdev/usehooks";
import { PreMealDetail } from "./PreMealDetail";
import { PrepMealItem } from "../../_models/preMealItem";
import { useAddMealMutation } from "../../../mealHooks";
import { RecordMealRequest } from "../../_models/recordMealRequest";
import { PatientContext } from "@/components/providers/PatientProvider";
import { ImportFoodResponse, useImportFoodMutation } from "@/app/(authorized)/food/foodHooks";

export interface RecordMealProps {
  handleClose?: () => void | undefined;
}

export const RecordMeal: React.FC<RecordMealProps> = ({ handleClose }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const [selectedMealItem, setSelectedMealItem] = useState<PrepMealItem | undefined>();

  const selectedPatient = useContext(PatientContext).selectedPatient;

  const addMealMutation = useAddMealMutation();
  const importFoodMutation = useImportFoodMutation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleAddMealFromSuggested = (mealSelectionItem: PrepMealItem) => {
    const mealRequest: RecordMealRequest = {
      amount: mealSelectionItem.servingSize,
      mealSelectionType: mealSelectionItem.type,
      patientId: selectedPatient?.id ?? "",
      recordedAt: new Date(Date.now()),
      selectedMealItemId: mealSelectionItem.id,
      unitId: mealSelectionItem.servingSizeUnit!.id ?? 1,
    };

    addMealMutation.mutate(mealRequest, {
      onSuccess: () => {
        handleClose && handleClose();
      },
    });
  };

  const handleAddMealFromUSDA = (mealSelectionItem: PrepMealItem) => {

    importFoodMutation.mutate(mealSelectionItem.fdcid!, {
      onSuccess: (response: ImportFoodResponse) => {
        const mealRequest: RecordMealRequest = {
          amount: mealSelectionItem.servingSize,
          mealSelectionType: "CustomFood",
          patientId: selectedPatient?.id ?? "",
          recordedAt: new Date(Date.now()),
          selectedMealItemId: response.id.toString(),
          unitId: mealSelectionItem.servingSizeUnit!.id ?? 1,
        };

        addMealMutation.mutate(mealRequest, {
          onSuccess: () => {
            handleClose && handleClose();
          },
        });
      },
    });
  };

  const handleAddMealCustomized = (mealRequest: RecordMealRequest) => {
    if (mealRequest.mealSelectionType === "USDAFood") {
      importFoodMutation.mutate(Number(mealRequest.selectedMealItemId), {
        onSuccess: (response: ImportFoodResponse) => {
          mealRequest.mealSelectionType = "CustomFood";
          mealRequest.selectedMealItemId = response.id.toString();
          addMealMutation.mutate(mealRequest, {
            onSuccess: () => {
              handleClose && handleClose();
            },
          });
        },
      });
      return;
    }
    else {
      addMealMutation.mutate(mealRequest, {
        onSuccess: () => {
          handleClose && handleClose();
        },
      });
    }
  }

  return (
    <>
      {selectedMealItem &&
        <Box sx={{ my: "auto" }}>
          <PreMealDetail selectedMealItem={selectedMealItem} setSelectedMealItem={setSelectedMealItem} addMeal={handleAddMealCustomized} />
        </Box>
      }
      {!selectedMealItem &&
        <>
          <TextField
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
            <Tab label="All" />
            <Tab label="My Foods" />
            <Tab label="My Recipes" />
          </Tabs>
          {selectedTab === 0 && <SearchAll searchKeyword={debouncedSearchKeyword} setSelectedMealItem={setSelectedMealItem} addMeal={(m) => handleAddMealFromUSDA(m)} />}
          {selectedTab === 1 && <MyFoodSearch searchKeyword={debouncedSearchKeyword} setSelectedMealItem={setSelectedMealItem} addMeal={(m) => handleAddMealFromSuggested(m)} />}
          {selectedTab === 2 && <MyRecipeSearch searchKeyword={debouncedSearchKeyword} setSelectedMealItem={setSelectedMealItem} addMeal={(m) => handleAddMealFromSuggested(m)} />}
        </>
      }
    </>
  );
};

