import axiosInstance from "./axiosInstance";

export const getLatest = async () => {
    const response = await axiosInstance.get(`/sensor-data/latest`);
    return response.data;
}

export const getLatestDate = async () => {
    const response = await axiosInstance.get(`/sensor-data/latestDate`);
    return response.data;

}

export const getThumbnails = async (page: number, limit: number) => {
    const response = await axiosInstance.get('/sensor-data/thumbnails', {
        params: {
            page,
            limit
        }
    });
    return response.data;

}

export const getByID = async (id: string) => {
    const response = await axiosInstance.get(`/sensor-data/data/${id}`);
    return response.data;
}

export const getChartData = async (from: string, to: string) => {
    const response = await axiosInstance.get(`/sensor-data/chart`, {
        params: {
            from,
            to
        }
    });
    return response.data;
}

export const getClosestData = async (dateTime: string) => {
    const response = await axiosInstance.get(`/sensor-data/closest`, {
        params: {dateTime}
    });
    return response.data;
}   
