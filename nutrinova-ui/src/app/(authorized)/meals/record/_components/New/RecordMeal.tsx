import { Search } from "@mui/icons-material";
import { Box, InputAdornment, Tab, Tabs, TextField } from "@mui/material";
import { useState } from "react";
import { MyFoodSearch } from "./MyFoodSearch";
import { SearchAll } from "./SearchAll";
import { MyRecipeSearch } from "./MyRecipeSearch";
import { useDebounce } from "@uidotdev/usehooks";
import { PreMealDetail } from "./PreMealDetail";
import { PrepMealItem } from "../../_models/preMealItem";

export const RecordMeal = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const [selectedMealItem, setSelectedMealItem] = useState<PrepMealItem | undefined>();


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      {selectedMealItem &&
        <Box sx={{ my: "auto" }}>
          <PreMealDetail selectedMealItem={selectedMealItem} setSelectedMealItem={setSelectedMealItem} />
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
          {selectedTab === 0 && <SearchAll searchKeyword={debouncedSearchKeyword} setSelectedMealItem={setSelectedMealItem} />}
          {selectedTab === 1 && <MyFoodSearch searchKeyword={debouncedSearchKeyword} setSelectedMealItem={setSelectedMealItem} />}
          {selectedTab === 2 && <MyRecipeSearch searchKeyword={debouncedSearchKeyword} />}
        </>
      }
    </>
  );
};

