import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faPlantWilt} from "@fortawesome/free-solid-svg-icons";
import {Link, useLocation} from "react-router-dom";
import ThemeModeSwitcher from "./ThemeModeSwitcher.tsx";

export default function Header() {
    const location = useLocation();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <header className="navbar bg-base-100 fixed top-0 z-10">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost md:hidden">
                        <FontAwesomeIcon icon={faBars} className="text-primary text-xl"/>
                    </label>
                    <ul tabIndex={0}
                        className="menu menu-sm dropdown-content mt-2 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {location.pathname !== "/" && (
                            <li><Link to={"/"}>Home</Link></li>
                        )}
                        {location.pathname !== "/timelapses" && (
                            <li><Link to={"/timelapses"}>Timelapses</Link></li>
                        )}
                        {location.pathname !== "/settings" && (
                            <li><Link to={"/settings"}>Settings</Link></li>)}
                    </ul>
                </div>
                <Link className="btn btn-ghost normal-case text-xl" to={"/"}>
                    <FontAwesomeIcon icon={faPlantWilt} className="text-primary mr-2"/>
                    <span className={"hidden md:flex"}>Plant Project</span>
                </Link>
            </div>
            <div
                className="flex flex-col justify-center items-end md:items-center pr-4 navbar-end md:navbar-center text-center">
                <div className="text-md md:text-lg font-semibold">{currentTime.toLocaleTimeString()}</div>
                <div className="text-xs md:text-sm">{currentTime.toLocaleDateString()}</div>
            </div>
            <div className="navbar-end md:flex hidden">
                <>
                    {location.pathname !== "/" && (
                        <Link to={"/"} className="btn btn-ghost">Home</Link>
                    )}
                    {location.pathname !== "/timelapses" && (
                        <Link to={"/timelapses"} className="btn btn-ghost">Timelapses</Link>
                    )}
                    {location.pathname !== "/settings" && (
                        <Link to={"/settings"} className="btn btn-ghost">Settings</Link>
                    )}
                </>
                <ThemeModeSwitcher/>
            </div>
        </header>
    );
}
