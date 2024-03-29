import axiosInstance from "./axiosInstance";

export const getAiService = async (imageID: string, useSicknessModel: boolean) => {
    const response = await axiosInstance.get(`/ai/predict?imageID=${imageID}&useSicknessModel=${useSicknessModel}`);
    return response.data;
}