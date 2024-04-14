import axiosInstance from "./axiosInstance";


export const getEmailSettings = async () => {
    const response = await axiosInstance.get(`/email-settings`);
    return response.data;
};

export const PostEmailSettings = async (
    subject: string,
    recipient: string,
    cronTime: string
) => {
    const response = await axiosInstance.post(`/email-settings`, {
        subject,
        recipient,
        cronTime,
    });
    return response.data;
};


export const getPlantSettings = async () => {
    const response = await axiosInstance.get(`/plant-settings`);
    return response.data;
}

export const postPlantSettings = async (
    captureInterval: number,
    wateringDuration: number,
    automaticWatering: boolean,
    wateringStartMoisture: number,
    stopLight: number,
) => {
    const response = await axiosInstance.post(`/plant-settings`, {
        captureInterval,
        wateringDuration,
        automaticWatering,
        wateringStartMoisture,
        stopLight,
    });
    return response.data;
}

export const setWatering = async (waterPlant: boolean) => {
    const response = await axiosInstance.post(`/plant-settings/watering`, {
        waterPlant
    });
    return response.data;
}