import axios from "axios";

const API_URL = "http://localhost:3000";

const createTimeLapse = async (from: string, to: string, fps: string, resolution: string) => {
    try {
        const response = await axios.post(`${API_URL}/timelapses`, {
            from,
            to,
            fps,
            resolution
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

const getTimelapses = async (page: number, limit: number) => {
    try {
        const response = await axios.get(`${API_URL}/timelapses?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

const deleteTimelapse = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/timelapses/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export {createTimeLapse, getTimelapses, deleteTimelapse};