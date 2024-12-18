import Layout from "../components/Layout";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <Layout>
      <div className="flex items-center justify-center size-full">
        <div>
          <h1 className="text-3xl font-bold text-center">
            404 Page Not Found.
          </h1>
          <p className="my-2 text-center">
            The page you requested does not exist. Please check the URL or head
            back to the{" "}
            <Link to="/" className="font-bold text-blue-500 underline">
              Homepage
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default PageNotFound;
