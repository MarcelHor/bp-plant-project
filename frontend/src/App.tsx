import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage.tsx";
import Timelapses from "./pages/TimelapsesPage.tsx";
import Settings from "./pages/Settings.tsx";

export default function App() {
    return (<Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/timelapses" element={<Timelapses/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="*" element={<NoPage/>}/>
        </Routes>
    </Router>)
}

