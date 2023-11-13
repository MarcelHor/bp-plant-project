import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon, faSun} from "@fortawesome/free-solid-svg-icons";

interface ThemeChoices {
    theme: 'emerald' | 'forest';
}

const ThemeModeSwitcher = () => {
    const [appTheme, setAppTheme] = useState<ThemeChoices>(() => {
        const storedTheme = localStorage.getItem('theme');
        return {
            theme: storedTheme === 'emerald' ? 'emerald' : 'forest'
        };
    });


    const toggleTheme = () => {
        const newTheme = appTheme.theme === 'emerald' ? 'forest' : 'emerald';
        console.log(newTheme);
        setAppTheme({theme: newTheme});
        localStorage.setItem('theme', newTheme);
        document.querySelector('html')?.setAttribute('data-theme', newTheme);
    };

    return (
        <div className="flex items-center cursor-pointer transition duration-500 ease-in-out transform space-x-2"
             onClick={toggleTheme}>
            {appTheme.theme === 'forest' ? (
                <FontAwesomeIcon icon={faMoon} size="xl"/>
            ) : (
                <FontAwesomeIcon icon={faSun} size="xl"/>
            )}
            <span className="text-base-content mr-2">{appTheme.theme === 'forest' ? 'Tmavý' : 'Světlý'}</span>
        </div>
    );
}

export default ThemeModeSwitcher;
