import Header from "../components/Header.tsx";
import TimelapsesDrawer from "../components/TimelapsesDrawer.tsx";
import Timelapses from "../components/Timelapses.tsx";

export default function Home() {


    return (
        <div className={"flex flex-col h-screen"}>
            <Header/>
            <main className="flex flex-1 overflow-hidden mt-16">
                <div className="drawer md:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle "/>
                    {/* Main Content */}
                    <div
                        className="drawer-content flex flex-col items-center bg-base-200 overflow-y-auto h-full">
                        <div className="flex items-center p-4 w-full space-x-4 lg:hidden">
                            <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open
                                drawer</label>
                        </div>
                        <div className="flex flex-col items-center justify-center max-w-7xl space-y-8 py-8 px-4">
                            <Timelapses/>
                        </div>
                    </div>
                    {/* Sidebar */}
                    <TimelapsesDrawer/>
                </div>
            </main>
        </div>
    );
}