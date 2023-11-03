'use client'
import createAuthenticatedAxiosInstanceFactory from '@/services/axiosRequestFactory';
import React from 'react';
import { CreateFoodRequestModel } from '../_models/createFoodRequest';

interface Props {
    // Define any props here
}

const CreateFoodForm: React.FC<Props> = () => {

    const handleSubmit = async () => {
        const apiClient = await createAuthenticatedAxiosInstanceFactory({ additionalHeaders: {}, origin: "client" });
        const newFood: CreateFoodRequestModel = {
            description: "custom food",
            servingSize: 1,
            foodNutrients: [],
        }
        await apiClient.post('/food', newFood);
    };
    return (
        <>
            <button onClick={handleSubmit}>Test</button>
        </>
    );
};

export default CreateFoodForm;
