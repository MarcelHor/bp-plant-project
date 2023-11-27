import {Link} from "react-router-dom";

export default function NoPage() {
    return (<div className="flex flex-col items-center justify-center space-y-2 h-screen">
            <h1 className="text-3xl font-bold">404</h1>
            <h2 className="text-2xl">Page not found</h2>
            <span>Sorry, we couldn't find the page you were looking for.</span>
            <Link to={"/"} className="btn btn-primary">Go back</Link>
        </div>
    );
}