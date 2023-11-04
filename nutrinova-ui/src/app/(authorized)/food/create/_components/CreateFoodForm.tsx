'use client'
import React, { useState } from 'react';
import {
    Button,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Grid,
    Paper,
    Alert,
    Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CreateFoodNutrientRequestModel } from '../_models/createFoodNutrientRequestModel';
import { CreateFoodRequestModel } from '../_models/createFoodRequest';
import { AddNutrientDialog } from './AddNutrientDialog';

const initialNutrient: CreateFoodNutrientRequestModel = {
    nutrientId: '',
    amount: 0,
    unitId: ''
};

const availableNutrients = [
    { id: '1', name: 'Protein' },
    { id: '2', name: 'Fat' },
    // ... other nutrients
];

const availableUnits = [
    { id: 'g', name: 'grams' },
    { id: 'mg', name: 'milligrams' },
    // ... other units
];

export default function CreateFoodForm() {
    const [foodFormState, setFoodFormState] = useState<CreateFoodRequestModel>({
        description: '',
        servingSize: undefined,
        unit: '',
        note: '',
        foodNutrients: [initialNutrient]
    });

    const [newNutrient, setNewNutrient] = useState<CreateFoodNutrientRequestModel>({ ...initialNutrient });

    const handleAddNutrient = () => {
        setFoodFormState({
            ...foodFormState,
            foodNutrients: [...foodFormState.foodNutrients, newNutrient]
        });
        setNewNutrient({ ...initialNutrient });
    };

    const handleRemoveNutrient = (index: number) => {
        const updatedNutrients = [...foodFormState.foodNutrients];
        updatedNutrients.splice(index, 1);
        setFoodFormState({ ...foodFormState, foodNutrients: updatedNutrients });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Form submission logic goes here
        console.log(foodFormState);
    };

    return (
        <Paper elevation={3} sx={{ padding: 2 }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Food Name */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Food Name"
                            value={foodFormState.description}
                            onChange={(e) => setFoodFormState(
                                { ...foodFormState, description: e.target.value }
                            )}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>

                    {/* Serving Size */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="Serving Size"
                            type="number"
                            value={foodFormState.servingSize}
                            onChange={(e) => setFoodFormState(
                                { ...foodFormState, servingSize: Number(e.target.value) }
                            )}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <TextField
                            label="Unit"
                            value={foodFormState.unit}
                            onChange={(e) => setFoodFormState(
                                { ...foodFormState, unit: e.target.value }
                            )}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>

                    {/* Note */}
                    <Grid item xs={12}>
                        <TextField
                            label="Note"
                            multiline
                            rows={4}
                            value={foodFormState.note}
                            onChange={(e) => setFoodFormState(
                                { ...foodFormState, note: e.target.value }
                            )}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                </Grid>

                <List>
                    <AddNutrientDialog
                        newNutrient={newNutrient}
                        setNewNutrient={setNewNutrient}
                        handleAddNutrient={handleAddNutrient}
                        availableNutrients={availableNutrients}
                        availableUnits={availableUnits}
                    />
                    {foodFormState.foodNutrients.length === 0 &&
                        <Alert severity='warning'>Please add at least one nutrient</Alert>
                    }
                    {foodFormState.foodNutrients.map((nutrient, index) => (
                        <ListItem key={index} divider>
                            <ListItemText
                                primary={availableNutrients.find((n) => n.id === nutrient.nutrientId)?.name}
                                secondary={`${nutrient.amount} ${availableUnits.find((u) => u.id === nutrient.unitId)?.name}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveNutrient(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
                <Box display="flex" justifyContent="flex-end">
                    <Button type="submit" variant="contained" color="primary">
                        Create
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}