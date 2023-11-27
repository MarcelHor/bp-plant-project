import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage.tsx";
import Timelapses from "./pages/Timelapses.tsx";

export default function App() {
    return (<Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/timelapses" element={<Timelapses/>}/>
            <Route path="*" element={<NoPage/>}/>
        </Routes>
    </Router>)
}

