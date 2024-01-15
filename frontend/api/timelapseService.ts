import axiosInstance from "./axiosInstance";

const createTimeLapse = async (from: string, to: string, fps: string, resolution: string) => {
    const response = await axiosInstance.post(`/timelapses`, {
        from,
        to,
        fps,
        resolution
    });
    return response.data;

}

const getTimelapses = async (page: number, limit: number) => {
    const response = await axiosInstance.get(`/timelapses?page=${page}&limit=${limit}`);
    return response.data;
}

const deleteTimelapse = async (id: string) => {
    const response = await axiosInstance.delete(`/timelapses/${id}`);
    return response.data;
}

export {createTimeLapse, getTimelapses, deleteTimelapse};