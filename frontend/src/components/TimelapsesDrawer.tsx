import React, {useEffect, useState} from "react";
import {createTimeLapse} from "../../api/timelapseService.ts";
import {getInitialDates} from "../../utils/utils.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import {useTranslation} from "react-i18next";

const resolutions = [
    {width: 1920, height: 1080},
    {width: 1280, height: 720},
    {width: 640, height: 480},
]

export default function TimelapsesDrawer({latestDate, fetchTimelapses, currentPage}: {
    latestDate: string,
    fetchTimelapses: (page: number) => void,
    currentPage: number
}) {
    const {nowLocalISO, yesterdayLocalISO} = getInitialDates(latestDate, 1)
    const [from, setFrom] = useState<string>(yesterdayLocalISO)
    const [to, setTo] = useState<string>(nowLocalISO)
    const [fps, setFps] = useState<number>(24)
    const [resolution, setResolution] = useState<{ width: number, height: number }>(resolutions[0])
    const [createChart, setCreateChart] = useState<boolean>(false)
    const [createDateOverlay, setCreateDateOverlay] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const {t} = useTranslation()

    const handleCreateTimelapse = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoading(true)
            await createTimeLapse(from, to, fps.toString(), `${resolution.width}x${resolution.height}`, createChart, createDateOverlay)
            await fetchTimelapses(currentPage)
            setLoading(false)
            setSuccess(true)
        } catch (error: any) {
            setError(error.message)
            setLoading(false)
            setSuccess(false)
        }
    }

    useEffect(() => {
        if (success) {
            const timeout = setTimeout(() => {
                setSuccess(false)
            }, 3000)
            return () => clearTimeout(timeout)
        }
    }, [success])

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
                setError("")
            }, 3000)
            return () => clearTimeout(timeout)
        }
    }, [error])

    return (
        <div className="drawer-side h-full md:h-[calc(100vh-64px)] border-r-2 border-base-300 z-20">
            <label htmlFor="my-drawer-2" className="drawer-overlay "></label>

            <form className="w-3/4 md:w-96 min-h-full bg-base-200 flex flex-col p-8 h-full"
                  onSubmit={handleCreateTimelapse}>
                <h1 className="text-2xl font-bold mb-4">{t("timelapsesDrawer.title")}</h1>
                {!loading ? (
                    <div className="flex flex-col space-y-4 justify-between h-full">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="from" className="text-lg font-bold">{t("timelapsesDrawer.from")}</label>
                                <input type="datetime-local" id="from" name="from" className="input input-bordered"
                                       value={from} onChange={(e) => setFrom(e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="to" className="text-lg font-bold">{t("timelapsesDrawer.to")}</label>
                                <input type="datetime-local" id="to" name="to" className="input input-bordered"
                                       value={to} onChange={(e) => setTo(e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="resolution" className="text-lg font-bold">{t("timelapsesDrawer.resolution")}</label>
                                <select id="resolution" name="resolution" className="select select-bordered"
                                        value={resolution.width + "x" + resolution.height}
                                        onChange={(e) => {
                                            const resolution = e.target.value.split("x")
                                            setResolution({
                                                width: parseInt(resolution[0]),
                                                height: parseInt(resolution[1])
                                            })
                                        }}>
                                    {resolutions.map((resolution, index) => (
                                        <option key={index} value={resolution.width + "x" + resolution.height}>
                                            {resolution.width + "x" + resolution.height}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="fps" className="text-lg font-bold">FPS</label>
                                <select id="fps" name="fps" className="select select-bordered" value={fps}
                                        onChange={(e) => setFps(parseInt(e.target.value))}>
                                    <option value={1}>1</option>
                                    <option value={10}>10</option>
                                    <option value={24}>24</option>
                                    <option value={30}>30</option>
                                    <option value={60}>60</option>
                                </select>
                            </div>
                            <div className="flex flex-row space-x-4 items-center">
                                <label htmlFor="createDateOverlay" className="text-lg font-bold">{t("timelapsesDrawer.dateOverlay")}</label>
                                <input type="checkbox" id="createDateOverlay" name="createDateOverlay"
                                       className="checkbox" checked={createDateOverlay}
                                       onChange={(e) => setCreateDateOverlay(e.target.checked)}/>
                                <div className="tooltip"
                                     data-tip={t("timelapsesDrawer.dateOverlayTooltip")} >
                                    <FontAwesomeIcon icon={faQuestionCircle} size={"lg"} className={" tooltip"}/>
                                </div>
                            </div>
                            <div className="flex flex-row space-x-4 items-center">
                                <label htmlFor="createChart" className="text-lg font-bold">{t("timelapsesDrawer.chart")}</label>
                                <input type="checkbox" id="createChart" name="createChart"
                                       className="checkbox" checked={createChart}
                                       onChange={(e) => setCreateChart(e.target.checked)}/>
                                <div className="tooltip"
                                     data-tip={t("timelapsesDrawer.chartTooltip")} >
                                    <FontAwesomeIcon icon={faQuestionCircle} size={"lg"} className={" tooltip"}/>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4 items-center justify-center w-full">
                            {error && (
                                <div className="alert alert-error">
                                    <div className="flex-1">
                                        <label>{error}</label>
                                    </div>
                                </div>
                            )}
                            {success && (
                                <div className="alert alert-success">
                                    <div className="flex-1">
                                        <label>{t("timelapsesDrawer.success")}</label>
                                    </div>
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary w-full">{t("timelapsesDrawer.create")}</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full w-full">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                )}
            </form>
        </div>
    )
}