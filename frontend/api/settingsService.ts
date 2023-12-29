import axios from "axios";

const API_URL = "http://localhost:3000";

export const getEmailSettings = async () => {
    try {
        const response = await axios.get(`${API_URL}/email-settings`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export const PostEmailSettings = async (subject: string, recipient: string, cronTime: string) => {
    try {
        const response = await axios.post(`${API_URL}/email-settings`, {
            subject,
            recipient,
            cronTime
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
}