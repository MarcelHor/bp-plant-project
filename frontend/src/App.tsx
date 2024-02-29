import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage.tsx";
import Timelapses from "./pages/TimelapsesPage.tsx";
import Settings from "./pages/Settings.tsx";
import {SSEProvider} from "../context/SSEContext.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import {AuthProvider} from "../context/AuthProvider.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

export default function App() {
    return (<Router>
        <AuthProvider>
            <SSEProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                    <Route path="/timelapses" element={<ProtectedRoute><Timelapses/></ProtectedRoute>}/>
                    <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
                    <Route path="*" element={<NoPage/>}/>
                </Routes>
            </SSEProvider>
        </AuthProvider>
    </Router>)
}

