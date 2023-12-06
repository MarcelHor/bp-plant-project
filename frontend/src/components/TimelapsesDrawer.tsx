import React, {useEffect, useState} from "react";
import {createTimeLapse} from "../../api/timelapseService.ts";
import {getInitialDates} from "../../utils/utils.ts";

const resolutions = [
    {width: 1920, height: 1080},
    {width: 1280, height: 720},
    {width: 640, height: 480},
]

export default function TimelapsesDrawer({latestDate}: { latestDate: string }) {
    const {nowLocalISO, yesterdayLocalISO} = getInitialDates(latestDate, 1)
    const [from, setFrom] = useState<string>(yesterdayLocalISO)
    const [to, setTo] = useState<string>(nowLocalISO)
    const [fps, setFps] = useState<number>(24)
    const [resolution, setResolution] = useState<{ width: number, height: number }>(resolutions[0])
    const [success, setSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const handleCreateTimelapse = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoading(true)
            await createTimeLapse(from, to, fps.toString(), `${resolution.width}x${resolution.height}`)
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

    return (
        <div className="drawer-side h-full md:h-[calc(100vh-64px)] border-r-2 border-base-300 z-20">
            <label htmlFor="my-drawer-2" className="drawer-overlay "></label>

            <form className="w-3/4 md:w-96 min-h-full bg-base-200 flex flex-col p-8 h-full"
                  onSubmit={handleCreateTimelapse}>
                <h1 className="text-2xl font-bold mb-8">Create Timelapse</h1>
                {!loading ? (
                    <div className="flex flex-col space-y-4 justify-between h-full">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="from" className="text-lg font-bold">From</label>
                                <input type="datetime-local" id="from" name="from" className="input input-bordered"
                                       value={from} onChange={(e) => setFrom(e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="to" className="text-lg font-bold">To</label>
                                <input type="datetime-local" id="to" name="to" className="input input-bordered"
                                       value={to} onChange={(e) => setTo(e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="resolution" className="text-lg font-bold">Resolution</label>
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
                                <input type="number" id="fps" name="fps" className="input input-bordered"
                                       value={fps} onChange={(e) => setFps(parseInt(e.target.value))}/>
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
                                        <label>Timelapse created successfully</label>
                                    </div>
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary w-full">Create</button>
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