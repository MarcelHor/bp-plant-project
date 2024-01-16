import Header from "./Header.tsx";
import {ReactNode} from "react";

export default function LayoutComponent({mainContent, sidebar}: { mainContent: ReactNode, sidebar: ReactNode }) {
    return (
        <div className={"flex flex-col h-screen"}>
            <Header/>
            <main className="flex flex-1 overflow-hidden mt-16">
                <div className="drawer md:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle "/>
                    {/* Main Content */}
                    <div
                        className="drawer-content flex flex-col items-center bg-base-200 overflow-y-auto p-4">
                        <div className="flex items-center p-4 w-full space-x-4 md:hidden">
                            <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button md:hidden">Open
                                drawer</label>
                        </div>
                        <div
                            className="flex flex-col items-center justify-center max-w-7xl w-full space-y-8 py-8 px-4">
                            {mainContent}
                        </div>
                    </div>
                    {/* Sidebar */}
                    {sidebar}
                </div>
            </main>
        </div>
    );
}