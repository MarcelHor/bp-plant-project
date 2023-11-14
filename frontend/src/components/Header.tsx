import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faPlantWilt} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
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
        <header className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost md:hidden">
                        <FontAwesomeIcon icon={faBars} className="text-primary text-xl"/>
                    </label>
                    <ul tabIndex={0}
                        className="menu menu-sm dropdown-content mt-2 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a>About</a></li>
                        <li><a>Timelapse</a></li>
                    </ul>
                </div>
                <a className="btn btn-ghost normal-case text-xl">
                    <FontAwesomeIcon icon={faPlantWilt} className="text-primary mr-2"/>
                    <span className={"hidden md:flex"}>Plant Project</span>
                </a>
            </div>
            <div
                className="flex flex-col justify-center items-end md:items-center pr-4 navbar-end md:navbar-center text-center">
                <div className="text-md md:text-lg font-semibold">{currentTime.toLocaleTimeString()}</div>
                <div className="text-xs md:text-sm">{currentTime.toLocaleDateString()}</div>
            </div>
            <div className="navbar-end md:flex hidden">
                <button className="btn btn-ghost">About</button>
                <button className="btn btn-ghost">Timelapse</button>
            </div>
        </header>
    );
}
