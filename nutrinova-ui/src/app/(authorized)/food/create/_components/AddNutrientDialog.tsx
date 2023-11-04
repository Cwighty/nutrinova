'use client'
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CreateFoodNutrientRequestModel } from '../_models/createFoodNutrientRequestModel';

interface Props {
    handleAddNutrient: () => void;
    newNutrient: CreateFoodNutrientRequestModel;
    setNewNutrient: (newNutrient: CreateFoodNutrientRequestModel) => void;
    availableNutrients: { id: string, name: string }[];
    availableUnits: { id: string, name: string }[];
}


export const AddNutrientDialog = ({ handleAddNutrient, newNutrient, setNewNutrient, availableNutrients, availableUnits }: Props) => {
    const [open, setOpen] = useState(false);
    const [isFormError, setIsFormError] = useState(false);
    // Implement your component logic here
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNewNutrientChange = (field: keyof CreateFoodNutrientRequestModel, value: string | number) => {
        setNewNutrient({ ...newNutrient, [field]: value });
    };

    const validateAndSubmit = () => {

        if (!newNutrient.nutrientId || newNutrient.amount <= 0 || !newNutrient.unitId) {
            setIsFormError(true);
        }
        else {
            setIsFormError(false);
        }
        if (isFormError) {
            return;
        }

        handleAddNutrient();
        handleClose();
    }
    return (
        <>
            <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleOpen}
            >
                Add Nutrient
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Nutrient</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <Autocomplete
                            options={availableNutrients}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) =>
                                <TextField {...params}
                                    label="Nutrient"
                                    error={isFormError && !newNutrient.nutrientId}
                                    helperText={isFormError && !newNutrient.nutrientId ? 'Please select a nutrient' : ''}
                                />
                            }
                            onInputChange={(_, newInputValue) => handleNewNutrientChange('nutrientId', availableNutrients.find((n) => n.name === newInputValue)?.id || '')}
                        />
                    </FormControl>
                    <TextField
                        error={isFormError && newNutrient.amount <= 0}
                        helperText={isFormError && newNutrient.amount <= 0 ? 'Please enter a valid amount' : ''}
                        label="Amount"
                        type="number"
                        value={newNutrient.amount}
                        onChange={(e) => handleNewNutrientChange('amount', Number(e.target.value))}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">g</InputAdornment>,
                        }}
                        inputProps={{ min: 0 }}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="unit-label">Unit</InputLabel>
                        <Select
                            error={isFormError && !newNutrient.unitId}
                            labelId="unit-label"
                            value={newNutrient.unitId}
                            label="Unit"
                            onChange={(e) => handleNewNutrientChange('unitId', e.target.value)}
                        >
                            {availableUnits.map((unit) => (
                                <MenuItem key={unit.id} value={unit.id}>
                                    {unit.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { validateAndSubmit(); }
                    } color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

