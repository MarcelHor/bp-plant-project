import axios from "axios";

const API_URL = "http://localhost:3000";

export const getLatest = async () => {
    try {
        const response = await axios.get(`${API_URL}/sensor-data/latest`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export const getThumbnails = async (page: number, limit: number) => {
    try{
        const response = await axios.get('http://localhost:3000/sensor-data/thumbnails', {
            params: {
                page,
                limit
            }
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export const getByID = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/sensor-data/data/${id}`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export const getChartData = async (from: string, to: string) => {
    try {
        const response = await axios.get(`${API_URL}/sensor-data/chart`, {
            params: {
                from,
                to
            }
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export const getClosestData = async (dateTime: string) => {
    try {
        const response = await axios.get(`${API_URL}/sensor-data/closest`, {
            params: { dateTime }
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
}
