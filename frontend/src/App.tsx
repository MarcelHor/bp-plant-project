import {useState, useEffect} from 'react';

function App() {
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
        <>
            <header className="navbar bg-base-100">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
                </div>
                <div className="flex-none">
                    <span>{currentTime.toLocaleTimeString()} {currentTime.toLocaleDateString()}</span>
                </div>
            </header>
        </>
    );
}

export default App;
