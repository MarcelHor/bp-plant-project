import {useState} from "react";
import {getAiService} from "../../api/aiService";
import {imageData} from "../../types/image-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";

interface Result {
    label: string;
    probability: number;
}

export default function AIModel({mainImageData}: { mainImageData: imageData | undefined }) {
    const {t} = useTranslation();

    const [healthResult, setHealthResult] = useState<Result[] | null>(null);
    const [sicknessResult, setSicknessResult] = useState<Result[] | null>(null);


    const [healthLoading, setHealthLoading] = useState(false);
    const [sicknessLoading, setSicknessLoading] = useState(false);

    const [healthError, setHealthError] = useState("");
    const [sicknessError, setSicknessError] = useState("");

    const handlePredict = async (useSicknessModel: boolean) => {
        if (!mainImageData) {
            return;
        }

        const setLoading = useSicknessModel ? setSicknessLoading : setHealthLoading;
        const setError = useSicknessModel ? setSicknessError : setHealthError;
        const setResult = useSicknessModel ? setSicknessResult : setHealthResult;

        setLoading(true);
        setError("");

        try {
            const response = await getAiService(mainImageData.id, useSicknessModel);
            const transformedResults: Result[] = Object.entries(response.data).map(([label, probability]) => ({
                label,
                probability: Number(probability)
            }));
            const sortedResults = transformedResults.sort((a, b) => b.probability - a.probability);
            setResult(sortedResults);
        } catch (error) {
            setError("An error occurred while predicting.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderResultTable = (results: Result[]) => (
        <div className="overflow-auto max-h-44">
            <table className="table w-full">
                <thead>
                <tr>
                    <th>{t('aiModel.label')}</th>
                    <th>{t('aiModel.probability')}</th>
                </tr>
                </thead>
                <tbody>
                {results.map((result, index) => (
                    <tr key={index}>
                        <td>{t(`aiModel.labels.${result.label}`, result.label)}</td>
                        <td>{result.probability.toFixed(2)}%</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="rounded shadow-lg border-2 border-base-300 w-full p-4 flex flex-col justify-between space-y-4">
            <div>
                <h1 className="text-2xl font-bold">{t('aiModel.title')}</h1>
                <p className="text-base">{t('aiModel.description')}</p>
            </div>

            <div className="flex md:flex-row flex-col space-y-4 md:space-y-0">
                {/* Health Model Section */}
                <div className="flex-1">
                    <h2 className="text-lg font-bold">{t('aiModel.healthModel.title')}</h2>
                    <p>{t('aiModel.healthModel.description')}</p>
                    <div className="mt-4 max-h-48 overflow-auto">
                        {healthLoading ? (
                            <span className="loading loading-spinner loading-lg"></span>
                        ) : healthError ? (
                            <div className="text-red-500">{t('aiModel.error')}</div>
                        ) : healthResult ? (
                            renderResultTable(healthResult)
                        ) : (
                            <></>
                        )}
                    </div>
                    <button className="btn btn-primary w-32 mt-2" onClick={() => handlePredict(false)}>
                        <FontAwesomeIcon icon={faChevronRight}/>
                        {t('aiModel.runButton')}
                    </button>
                </div>

                {/* Sickness Model Section */}
                <div className="flex-1">
                    <h2 className="text-lg font-bold">{t('aiModel.sicknessModel.title')}</h2>
                    <p>{t('aiModel.sicknessModel.description')}</p>
                    <div className="mt-4">
                        {sicknessLoading ? (
                            <span className="loading loading-spinner loading-lg"></span>
                        ) : sicknessError ? (
                            <div className="text-red-500">{t('aiModel.error')}</div>
                        ) : sicknessResult ? (
                            renderResultTable(sicknessResult)
                        ) : (
                            <></>
                        )}
                    </div>
                    <button className="btn btn-primary mt-2 w-32" onClick={() => handlePredict(true)}>
                        <FontAwesomeIcon icon={faChevronRight}/>
                        {t('aiModel.runButton')}
                    </button>
                </div>
            </div>
        </div>
    );
}
