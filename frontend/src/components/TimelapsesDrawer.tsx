import {useState} from "react";

export default function TimelapsesDrawer() {
    const [from, setFrom] = useState<string>("")
    const [to, setTo] = useState<string>("")
    const [speed, setSpeed] = useState<number>(1)
    const [fps, setFps] = useState<number>(1)


    const createTimelapse = (from: string, to: string, speed: number, fps: number) => {
        console.log("Creating timelapse from " + from + " to " + to + " with speed " + speed + " and fps " + fps);
    }

    return (
        <div className="drawer-side h-full md:h-[calc(100vh-64px)] border-r-2 border-base-300 z-20">
            <label htmlFor="my-drawer-2" className="drawer-overlay "></label>
            <form className="w-3/4 md:w-96 min-h-full bg-base-200 flex flex-col p-8 justify-between" onSubmit={(e) => {
                e.preventDefault()
                createTimelapse(from, to, speed, fps)
            }}>
                <div className="flex flex-col space-y-8">
                    <h1 className="text-2xl font-bold">Create Timelapse</h1>
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="from" className="text-lg font-bold">From</label>
                        <input type="datetime-local" id="from" name="from" className="input input-bordered"
                               value={from} onChange={(e) => setFrom(e.target.value)}/>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="to" className="text-lg font-bold">To</label>
                        <input type="datetime-local" id="to" name="to" className="input input-bordered"
                               value={to} onChange={(e) => setTo(e.target.value)}/>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="speed" className="text-lg font-bold">Speed</label>
                        <input type="number" id="speed" name="speed" className="input input-bordered"
                               value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))}/>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="fps" className="text-lg font-bold">FPS</label>
                        <input type="number" id="fps" name="fps" className="input input-bordered"
                               value={fps} onChange={(e) => setFps(parseInt(e.target.value))}/>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </div>
    )
}