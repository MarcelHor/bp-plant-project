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
