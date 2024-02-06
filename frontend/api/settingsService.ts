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
    wateringDuration: number
) => {
    const response = await axiosInstance.post(`/plant-settings`, {
        captureInterval,
        wateringDuration
    });
    return response.data;
}

export const toggleWatering = async () => {
    const response = await axiosInstance.post(`/plant-settings/toggle`);
    return response.data;
}