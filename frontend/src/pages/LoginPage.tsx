import ThemeModeSwitcher from "../components/ThemeModeSwitcher.tsx";
import {useState, FormEvent, useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlantWilt, faKey} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthProvider.tsx";

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const {login, currentUser} = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<boolean>(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            return;
        }
        const success = await login(username, password);
        if (success) {
            navigate("/");
        } else {
            setError(true);
        }
    };

    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    return (
        <div className={"flex flex-col min-h-screen items-center w-full justify-center bg-base-200 overflow-y-auto"}>
            <div className={"hidden"}>
                <ThemeModeSwitcher/>
            </div>

            <form className={"flex flex-col w-1/3 bg-base-100 p-10 rounded-lg space-y-4"} onSubmit={handleLogin}
                  id={"login-form"}>
                <h1 className={"text-3xl font-semibold text-center"}><FontAwesomeIcon icon={faPlantWilt}
                                                                                      className={"text-primary mr-4"}/> Plant
                    project</h1>

                {error &&
                    <div className={"alert alert-error"}>
                        <div className={"flex items-center"}>
                            <div className={"alert-content"}>Invalid username or password</div>
                        </div>
                    </div>
                }
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                       name="username" className={"input input-bordered"}/>
                <input type="password" placeholder="Password" value={password}
                       onChange={(e) => setPassword(e.target.value)} name="password"
                       className={"input input-bordered"}/>
                <button className={"btn btn-primary"} type={"submit"}><FontAwesomeIcon icon={faKey}/> Login
                </button>
            </form>
        </div>
    )
}