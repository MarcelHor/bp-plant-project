import {createContext, useContext, useState, ReactNode, useEffect} from "react";
import {loginService, logoutService, getUserService} from "../api/authService.ts";

interface user {
    username: string;
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
            setCurrentUser(await loginService(username, password));
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await logoutService();
            setCurrentUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const checkAuth = async () => {
        try {
            setCurrentUser(await getUserService());
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
