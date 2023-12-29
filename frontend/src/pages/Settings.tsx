import {useEffect, useState} from "react";
import Header from "../components/Header.tsx";
import {PostEmailSettings, getEmailSettings} from "../../api/settingsService.ts";

export default function Settings() {
    const [emailSettings, setEmailSettings] = useState({
        recipient: '',
        subject: '',
        cronTime: '',
    });
    const [emailSettingsSaved, setEmailSettingsSaved] = useState(false);

    useEffect(() => {
        getEmailSettings().then((response: any) => {
            setEmailSettings(response);
        }).catch((error: any) => {
            console.log(error);
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailSettings({...emailSettings, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await PostEmailSettings(emailSettings.subject, emailSettings.recipient, emailSettings.cronTime);
            setEmailSettingsSaved(true);
            setTimeout(() => {
                setEmailSettingsSaved(false);
            }, 3000);
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <div className={"flex flex-col h-screen items-center w-full justify-center bg-base-200 overflow-y-auto"}>
            <Header/>
            <div
                className="flex-col flex items-center justify-around rounded shadow-lg border-2 border-base-300 w-full max-w-7xl p-8">
                <h1 className="text-3xl text-center font-bold mb-4">Nastavení</h1>
                <div className={"w-full flex flex-row items-center space-x-16"}>
                    <form onSubmit={handleSubmit} className={"w-1/2"}>
                        <h2 className="text-xl font-bold mb-4 border-base-300 border-b-2">Nastavení E-mailu</h2>
                        {emailSettingsSaved && <div className="alert alert-success my-4">
                            <div className="flex-1">
                                <label className="mx-2">Nastavení uloženo</label>
                            </div>
                        </div>
                        }
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipient">
                                Příjemce E-mailu
                            </label>
                            <input
                                className="input input-bordered w-full"
                                id="recipient" type="text" placeholder="Příjemce" name="recipient"
                                value={emailSettings.recipient} onChange={handleChange}/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                                Předmět E-mailu
                            </label>
                            <input
                                className="input input-bordered w-full"
                                id="subject" type="text" placeholder="Předmět" name="subject"
                                value={emailSettings.subject}
                                onChange={handleChange}/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cronTime">
                                Čas Odeslání (HH:mm)
                            </label>
                            <input
                                className="input input-bordered w-full"
                                id="cronTime" type="text" placeholder="00:00" name="cronTime"
                                value={emailSettings.cronTime}
                                onChange={handleChange}/>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="btn btn-primary"
                                type="submit">
                                Uložit Nastavení
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
        ;
}
