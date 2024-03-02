import axiosInstance from "./axiosInstance";


export const loginService = async (username: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', {
        username,
        password
    });
    return response.data;
}

export const logoutService = async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
}

export const getUserService = async () => {
    const response = await axiosInstance.get('/auth/user');
    return response.data;
}

export const changeCredentialsService = async (newUsername: string, newPassword: string) => {
    const response = await axiosInstance.post('/auth/change', {
        newUsername,
        newPassword
    });
    return response.data;
}