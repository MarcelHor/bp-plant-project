import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

interface ThemeChoices {
    theme: 'emerald' | 'dark';
}

const ThemeModeSwitcher = () => {
    const [appTheme, setAppTheme] = useState<ThemeChoices>(() => {
        const storedTheme = localStorage.getItem('theme');
        return {
            theme: storedTheme === 'dark' ? 'dark' : 'emerald'
        };
    });

    useEffect(() => {
        document.querySelector('html')?.setAttribute('data-theme', appTheme.theme);
        localStorage.setItem('theme', appTheme.theme);
    }, [appTheme.theme]);

    const toggleTheme = () => {
        const newTheme = appTheme.theme === 'dark' ? 'emerald' : 'dark';
        setAppTheme({ theme: newTheme });
    };

    return (
        <div
            className="flex items-center cursor-pointer transition duration-500 ease-in-out transform space-x-2 btn btn-ghost"
            onClick={toggleTheme}>
            {appTheme.theme === 'emerald' ? (
                <FontAwesomeIcon icon={faMoon} size="xl" />
            ) : (
                <FontAwesomeIcon icon={faSun} size="xl" />
            )}
            {/* <span className="text-base-content mr-2">{appTheme.theme === 'emerald' ? 'Light' : 'Dark'}</span> */}
        </div>
    );
}

export default ThemeModeSwitcher;
