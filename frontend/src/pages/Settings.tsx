import {useEffect, useState, ChangeEvent, FormEvent} from "react";
import Header from "../components/Header.tsx";
import {
    PostEmailSettings,
    getEmailSettings,
    postPlantSettings,
    getPlantSettings,
    setWatering
} from "../../api/settingsService.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faGear, faPlantWilt, faDroplet} from "@fortawesome/free-solid-svg-icons";

export default function Settings() {
    const [emailSettings, setEmailSettings] = useState({
        recipient: '',
        subject: '',
        cronTime: '',
    });
    const [plantSettings, setPlantSettings] = useState({
        captureInterval: 0,
        wateringDuration: 0,
    });
    const [plantSettingsSaved, setPlantSettingsSaved] = useState(false);
    const [plantError, setPlantError] = useState(false);

    const [emailSettingsSaved, setEmailSettingsSaved] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const [waterPlantLoading, setWaterPlantLoading] = useState(false);

    useEffect(() => {
        getEmailSettings().then((response) => {
            setEmailSettings(response);
        }).catch((error: unknown) => {
            console.log(error);
        });

        getPlantSettings().then((response) => {
            setPlantSettings(response);
        }).catch((error: unknown) => {
            console.log(error);
        });
    }, []);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmailSettings({...emailSettings, [e.target.name]: e.target.value});
    };

    const handlePlantChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPlantSettings({...plantSettings, [e.target.name]: e.target.value});
    }

    const handleWaterPlant = async () => {
        if (waterPlantLoading) return;
        try {
            setWaterPlantLoading(true);
            await setWatering(true);
            setTimeout(() => {
                setWaterPlantLoading(false);
            }, 3000);
        } catch (error: unknown) {
            setWaterPlantLoading(false);
            console.log(error);
        }
    }

    const emailSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await PostEmailSettings(emailSettings.subject, emailSettings.recipient, emailSettings.cronTime);
            setEmailSettingsSaved(true);
            setTimeout(() => {
                setEmailSettingsSaved(false);
            }, 3000);
        } catch (error: unknown) {
            console.log(error);
            setEmailError(true);
            setTimeout(() => {
                setEmailSettingsSaved(false)
                setEmailError(false);
            }, 3000);
        }
    };

    const plantSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await postPlantSettings(plantSettings.captureInterval, plantSettings.wateringDuration);
            setPlantSettingsSaved(true);
            setTimeout(() => {
                setPlantSettingsSaved(false);
            }, 3000);
        } catch (error: unknown) {
            console.log(error);
            setPlantError(true);
            setTimeout(() => {
                setPlantSettingsSaved(false)
                setPlantError(false);
            }, 3000);
        }
    }

    return (
        <div className={"flex flex-col min-h-screen items-center w-full justify-center bg-base-200 overflow-y-auto"}>
            <Header/>
            <div className="px-8 w-full h-full my-24 flex flex-col items-center justify-center">
                <div
                    className="flex items-center justify-between rounded shadow-lg border-2 border-base-300 w-full md:max-w-6xl p-12 space-y-12  flex-col ">
                    <h1 className="text-3xl text-center font-bold mb-4"><FontAwesomeIcon icon={faGear}
                                                                                         className="mr-2"/>Settings
                    </h1>
                    <div className="md:w-2/3 w-full">
                        <h2 className="text-xl font-bold mb-4 border-base-300 border-b-2"><FontAwesomeIcon
                            icon={faDroplet} className="mr-2"/>Water</h2>
                        {waterPlantLoading && <div className="alert alert-success my-4">
                            <div className="flex-1">
                                <label className="mx-2">Setting saved</label>
                            </div>
                        </div>}
                        <div className="flex items-center space-x-8">
                            <button
                                className="btn btn-primary"
                                onClick={handleWaterPlant}>
                                Water plant
                            </button>
                        </div>
                    </div>

                    <div className="md:w-2/3 w-full">
                        <form onSubmit={plantSubmit} className={"w-full"}>
                            <h2 className="text-xl font-bold mb-4 border-base-300 border-b-2"><FontAwesomeIcon
                                icon={faPlantWilt} className="mr-2"/>Plant settings</h2>
                            {plantSettingsSaved && <div className="alert alert-success my-4">
                                <div className="flex-1">
                                    <label className="mx-2">Settings saved</label>
                                </div>
                            </div>
                            }
                            {plantError && <div className="alert alert-error my-4">
                                <div className="flex-1">
                                    <label className="mx-2">Settings could not be saved</label>
                                </div>
                            </div>
                            }
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="captureInterval">
                                    Capture Interval (minutes)
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    required
                                    id="captureInterval" type="number" placeholder="Interval" name="captureInterval"
                                    value={plantSettings.captureInterval}
                                    onChange={handlePlantChange}/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2"
                                       htmlFor="wateringDuration">
                                    Watering Duration (seconds)
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    required
                                    id="wateringDuration" type="number" placeholder="Duration" name="wateringDuration"
                                    value={plantSettings.wateringDuration}
                                    onChange={handlePlantChange}/>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="btn btn-primary"
                                    type="submit">
                                    Save Settings
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="md:w-2/3 w-full">
                        <form onSubmit={emailSubmit} className={"w-full"}>
                            <h2 className="text-xl font-bold mb-4 border-base-300 border-b-2"><FontAwesomeIcon
                                icon={faEnvelope} className="mr-2"/>Email settings</h2>
                            {emailSettingsSaved && <div className="alert alert-success my-4">
                                <div className="flex-1">
                                    <label className="mx-2">Settings saved</label>
                                </div>
                            </div>
                            }
                            {emailError && <div className="alert alert-error my-4">
                                <div className="flex-1">
                                    <label className="mx-2">Settings could not be saved</label>
                                </div>
                            </div>
                            }
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipient">
                                    Email Recipient
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    required
                                    id="recipient" type="text" placeholder="Příjemce" name="recipient"
                                    value={emailSettings.recipient} onChange={handleEmailChange}/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                                    Email Subject
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    required
                                    id="subject" type="text" placeholder="Předmět" name="subject"
                                    value={emailSettings.subject}
                                    onChange={handleEmailChange}/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cronTime">
                                    Send Time (HH:mm)
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    id="cronTime" placeholder="00:00" name="cronTime"
                                    value={emailSettings.cronTime}
                                    type="time"
                                    onChange={handleEmailChange}/>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="btn btn-primary"
                                    type="submit">
                                    Save Settings
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
