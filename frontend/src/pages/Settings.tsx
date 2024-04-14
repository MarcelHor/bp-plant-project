import {useEffect, useState, ChangeEvent, FormEvent} from "react";
import Header from "../components/Header.tsx";
import {
    PostEmailSettings,
    getEmailSettings,
    postPlantSettings,
    getPlantSettings,
    setWatering
} from "../../api/settingsService.ts";
import {getApiKeys, createApiKey, deleteApiKey, getApiKey} from "../../api/apiKeyService.ts";
import {changeCredentialsService} from "../../api/authService.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faGear, faPlantWilt, faDroplet, faUser, faKey} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";

interface apiKeyFiltered {
    id: string;
    lastUsed: string;
    usageCount: number;
    createdAt: string;
}

export default function Settings() {
    const [t] = useTranslation();
    const [emailSettings, setEmailSettings] = useState({
        recipient: '',
        subject: '',
        cronTime: '',
    });
    const [plantSettings, setPlantSettings] = useState({
        captureInterval: 0,
        wateringDuration: 0,
        automaticWatering: false,
        wateringStartMoisture: 0,
        stopLight: 0,
    });
    const [plantSettingsSaved, setPlantSettingsSaved] = useState(false);
    const [plantError, setPlantError] = useState(false);

    const [emailSettingsSaved, setEmailSettingsSaved] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const [waterPlantLoading, setWaterPlantLoading] = useState(false);

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [changeError, setChangeError] = useState(false);
    const [changeSuccess, setChangeSuccess] = useState(false);

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
        setPlantSettings({
            ...plantSettings,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        });
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
            await postPlantSettings(plantSettings.captureInterval, plantSettings.wateringDuration, plantSettings.automaticWatering, plantSettings.wateringStartMoisture, plantSettings.stopLight);
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

    const handleChangeCredentials = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await changeCredentialsService(newUsername, newPassword);
            setChangeSuccess(true);
            setTimeout(() => {
                setChangeSuccess(false);
            }, 3000);
            setNewUsername('');
            setNewPassword('');
        } catch (error: unknown) {
            console.log(error);
            setChangeError(true);
            setTimeout(() => {
                setChangeError(false);
            }, 3000);
        }
    };

    const [apiKeys, setApiKeys] = useState<apiKeyFiltered[]>([]);
    const [loadingApiKeys, setLoadingApiKeys] = useState(true);
    const [showedKeyId, setShowedKeyId] = useState('');
    const [displayedKeyValue, setDisplayedKeyValue] = useState('');
    const [loadingKey, setLoadingKey] = useState(false);

    useEffect(() => {
        const fetchApiKeys = async () => {
            try {
                const fetchedApiKeys = await getApiKeys();
                setApiKeys(fetchedApiKeys);
                setLoadingApiKeys(false);
            } catch (error) {
                console.error("Failed to fetch API keys:", error);
                setLoadingApiKeys(false);
            }
        };

        fetchApiKeys();
    }, []);

    const handleCreateApiKey = async () => {
        try {
            const newKey = await createApiKey();
            setApiKeys([...apiKeys, newKey]);
        } catch (error) {
            console.error("Error creating API key:", error);
        }
    };

    const handleDeleteApiKey = async (id: string) => {
        try {
            await deleteApiKey(id);
            setApiKeys(apiKeys.filter((key) => key.id !== id));
        } catch (error) {
            console.error("Error deleting API key:", error);
        }
    };

    const handleShowApiKey = async (id: string) => {
        if (showedKeyId === id) {
            setShowedKeyId('');
            setDisplayedKeyValue('');
        } else {
            setLoadingKey(true);
            try {
                const apiKey = await getApiKey(id);
                setShowedKeyId(id);
                setDisplayedKeyValue(apiKey.key);
            } catch (error) {
                console.error("Error fetching API key:", error);
            }
            setLoadingKey(false);
        }
    };


    return (
        <div className={"flex flex-col min-h-screen items-center w-full justify-center bg-base-200 overflow-y-auto"}>
            <Header/>
            <div className="px-8 w-full h-full my-24 flex flex-col items-center justify-center">
                <div
                    className="flex items-center justify-between rounded shadow-lg border-2 border-base-300 w-full md:max-w-6xl p-12 space-y-12  flex-col ">
                    <h1 className="text-3xl text-center font-bold mb-4"><FontAwesomeIcon icon={faGear}
                                                                                         className="mr-2"/>
                        {t("settings.title")}
                    </h1>
                    <div className="md:w-2/3 w-full">
                        <h2 className="text-xl font-bold mb-4 border-base-300 border-b-2"><FontAwesomeIcon
                            icon={faDroplet} className="mr-2"/>{t("settings.watering")}</h2>
                        {waterPlantLoading && <div className="alert alert-success my-4">
                            <div className="flex-1">
                                <label className="mx-2">{t("settings.saved")}</label>
                            </div>
                        </div>}
                        <div className="flex items-center space-x-8">
                            <button
                                className="btn btn-primary"
                                onClick={handleWaterPlant}>
                                {t("settings.water")}
                            </button>
                        </div>
                    </div>

                    <div className="md:w-2/3 w-full">
                        <form onSubmit={plantSubmit} className={"w-full"}>
                            <h2 className="text-xl font-bold mb-4 border-base-300 border-b-2"><FontAwesomeIcon
                                icon={faPlantWilt} className="mr-2"/>{t("settings.plant")}</h2>
                            {plantSettingsSaved && <div className="alert alert-success my-4">
                                <div className="flex-1">
                                    <label className="mx-2">{t("settings.saved")}</label>
                                </div>
                            </div>
                            }
                            {plantError && <div className="alert alert-error my-4">
                                <div className="flex-1">
                                    <label className="mx-2">{t("settings.error")}</label>
                                </div>
                            </div>
                            }
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="captureInterval">
                                    {t("settings.captureInterval")}
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
                                    {t("settings.wateringDuration")}
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    required
                                    id="wateringDuration" type="number" placeholder="Duration" name="wateringDuration"
                                    value={plantSettings.wateringDuration}
                                    onChange={handlePlantChange}/>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2"
                                       htmlFor="wateringStartMoisture">
                                    {t("settings.wateringStartMoisture")}
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    required
                                    id="wateringStartMoisture" type="number" placeholder="Moisture"
                                    name="wateringStartMoisture"
                                    value={plantSettings.wateringStartMoisture}
                                    onChange={handlePlantChange}/>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2"
                                       htmlFor="stopLight">
                                    {t("settings.stopLight")}
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    required
                                    id="stopLight" type="number" placeholder="Light" name="stopLight"
                                    value={plantSettings.stopLight}
                                    onChange={handlePlantChange}/>
                            </div>

                            <div className="mb-4 flex items-center">
                                <input
                                    className="input checkbox checkbox-lg"
                                    id="automaticWatering" type="checkbox" name="automaticWatering"
                                    checked={plantSettings.automaticWatering}
                                    onChange={handlePlantChange}/>
                                <label className="text-gray-700 text-sm font-bold ml-2" htmlFor="automaticWatering">
                                    {t("settings.automaticWatering")}
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    className="btn btn-primary"
                                    type="submit">
                                    {t("settings.save")}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="md:w-2/3 w-full">
                        <form onSubmit={emailSubmit} className={"w-full"}>
                            <h2 className="text-xl font-bold mb-4 border-base-300 border-b-2"><FontAwesomeIcon
                                icon={faEnvelope} className="mr-2"/>{t("settings.email")}</h2>
                            {emailSettingsSaved && <div className="alert alert-success my-4">
                                <div className="flex-1">
                                    <label className="mx-2">{t("settings.saved")}</label>
                                </div>
                            </div>
                            }
                            {emailError && <div className="alert alert-error my-4">
                                <div className="flex-1">
                                    <label className="mx-2">{t("settings.error")}</label>
                                </div>
                            </div>
                            }
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipient">
                                    {t("settings.recipient")}
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    required
                                    id="recipient" type="text" placeholder="Příjemce" name="recipient"
                                    value={emailSettings.recipient} onChange={handleEmailChange}/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                                    {t("settings.subject")}
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
                                    {t("settings.cronTime")}
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
                                    {t("settings.save")}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="md:w-2/3 w-full">
                        <form onSubmit={handleChangeCredentials} className={"w-full"}>
                            <h2 className="text-xl font-bold mb-4 border-base-300 border-b-2"><FontAwesomeIcon
                                icon={faUser} className="mr-2"/>{t("settings.changeCredentials")}</h2>
                            {changeSuccess && <div className="alert alert-success my-4">
                                <div className="flex-1">
                                    <label className="mx-2">{t("settings.changed")}</label>
                                </div>
                            </div>}
                            {changeError && <div className="alert alert-error my-4">
                                <div className="flex-1">
                                    <label className="mx-2">{t("settings.error")}</label>
                                </div>
                            </div>}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newUsername">
                                    {t("settings.newUsername")}
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    id="newUsername" type="text" placeholder={t("settings.newUsername")}
                                    name="newUsername"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}/>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                                    {t("settings.newPassword")}
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    id="newPassword" type="password" placeholder={t("settings.newPassword")}
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}/>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="btn btn-primary"
                                    type="submit">
                                    {t("settings.save")}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="md:w-2/3 w-full mb-4">
                        <h2 className="text-xl font-bold mb-4 border-base-300 border-b-2">
                            <FontAwesomeIcon icon={faKey} className="mr-2"/>{t("settings.apiKeys")}
                        </h2>
                        {loadingApiKeys ? (
                            <p>{t("settings.loading")}</p>
                        ) : (
                            <table className="table table-zebra w-full">
                                <thead>
                                <tr>
                                    <th>{t("settings.key")}</th>
                                    <th>{t("settings.actions")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {apiKeys.map((apiKey) => (
                                    <tr key={apiKey.id}>
                                        <td>
                                            {loadingKey && showedKeyId === apiKey.id ? t("settings.loading") :
                                                showedKeyId === apiKey.id ? displayedKeyValue : '****'}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-xs mr-2"
                                                onClick={() => handleShowApiKey(apiKey.id)}
                                            >
                                                {showedKeyId === apiKey.id ? t("settings.hide") : t("settings.show")}
                                            </button>
                                            <button
                                                className="btn btn-error btn-xs"
                                                onClick={() => handleDeleteApiKey(apiKey.id)}
                                            >
                                                {t("settings.delete")}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                        <button className="btn btn-primary mt-4" onClick={handleCreateApiKey}>
                            {t("settings.createNewKey")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
