import axiosInstance from "./axiosInstance";

export const getApiKey = async (id: string) => {
    const response = await axiosInstance.get(`/api-keys/key/${id}`)
    return response.data;
};

export const createApiKey = async () => {
    const response = await axiosInstance.post("/api-keys");
    return response.data;
};

export const deleteApiKey = async (id: string) => {
    const response = await axiosInstance.delete(`/api-keys/${id}`);
    return response.data;
}

export const getApiKeys = async () => {
    const response = await axiosInstance.get("/api-keys");
    return response.data;
}

