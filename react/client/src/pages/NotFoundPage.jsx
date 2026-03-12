import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page Not Found | Summitize Journal"
        description="The page you are trying to access does not exist."
        canonicalPath="/404"
      />

      <main id="main-content">
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div>
                <span className="eyebrow">404</span>
                <h1>Page not found.</h1>
                <p>The requested route does not exist in the React app.</p>
                <Link className="btn btn-primary" to="/">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
