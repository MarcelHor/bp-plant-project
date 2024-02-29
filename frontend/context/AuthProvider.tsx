import {createContext, useContext, useState, ReactNode, useEffect} from "react";
import axiosInstance from "../api/axiosInstance";

interface user {
    username: string;
    password: string;
}

interface AuthContextType {
    currentUser: user | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<user | null>(null);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await axiosInstance.post("/auth/login", {username, password});
            setCurrentUser(response.data);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.get("/auth/logout");
            setCurrentUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const checkAuth = async () => {
        try {
            const response = await axiosInstance.get("/auth/user");
            setCurrentUser(response.data);
        } catch (error) {
            console.error("Check auth failed:", error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {currentUser, login, logout};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
