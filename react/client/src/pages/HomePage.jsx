import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import FeedbackSection from "../components/FeedbackSection";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Summitize Journal",
  url: "https://summitize.in/",
  description: "Practical AI playbooks for careers, hiring, and productivity."
};

export default function HomePage() {
  return (
    <>
      <Seo
        title="Summitize Journal | Practical AI Notes for Builders"
        description="Summitize Journal publishes practical AI playbooks for careers, hiring, and productivity."
        canonicalPath="/"
        keywords="AI blog, ChatGPT workflows, interview prep, resume writing, productivity systems"
        jsonLd={websiteJsonLd}
      />

      <main id="main-content">
        <section className="hero fade-in">
          <div className="container">
            <div className="hero-grid">
              <div>
                <span className="eyebrow">AI Field Notes</span>
                <h1>Rewrite your workflow before AI rewrites your market.</h1>
                <p>
                  Summitize Journal is a focused publication for people who want useful AI systems, not hype.
                  Every article combines strategy, prompt frameworks, and practical examples you can use this week.
                </p>
              </div>
              <aside className="hero-meta fade-in delay-1">
                <h3>What You Will Get Here</h3>
                <ul className="meta-list">
                  <li>
                    <span className="meta-dot" aria-hidden="true" />
                    <span>Clear playbooks for career and productivity outcomes.</span>
                  </li>
                  <li>
                    <span className="meta-dot" aria-hidden="true" />
                    <span>Prompt structures tested for consistency and speed.</span>
                  </li>
                  <li>
                    <span className="meta-dot" aria-hidden="true" />
                    <span>Simple checks to avoid generic, low-trust AI output.</span>
                  </li>
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section className="container fade-in delay-1" aria-labelledby="featured-posts">
          <div className="section-head">
            <h2 id="featured-posts">Featured Playbooks</h2>
            <p>Three deep dives to start with today</p>
          </div>
          <div className="post-grid">
            <article className="post-card">
              <span className="post-tag">Detailed Case Study</span>
              <h3>GPT Astro During the T20 World Cup: Real-Time Analysis Experiment</h3>
              <p>
                A tournament-long case study using structured live prompts, phase-based momentum analysis,
                and semifinal/final stress-test insights.
              </p>
              <Link className="post-link" to="/blog1">
                Read article
              </Link>
            </article>

            <article className="post-card">
              <span className="post-tag">Career Systems</span>
              <h3>Interview Buddy 2.0 for Real Hiring Pressure</h3>
              <p>Build realistic interview drills with rubric-driven feedback instead of random question lists.</p>
              <Link className="post-link" to="/blog2">
                Read article
              </Link>
            </article>

            <article className="post-card">
              <span className="post-tag">Job Search</span>
              <h3>Resume Builder That Proves Impact, Not Claims</h3>
              <p>Convert your experience into measurable evidence blocks that pass recruiter and ATS reviews.</p>
              <Link className="post-link" to="/blog3">
                Read article
              </Link>
            </article>
          </div>
        </section>

        <section className="container fade-in delay-2" aria-labelledby="tracked-topics">
          <div className="topic-band">
            <h2 id="tracked-topics">Topics We Are Tracking in 2026</h2>
            <ul className="topic-list">
              <li>Prompt Architecture</li>
              <li>Agentic Workflows</li>
              <li>Interview Simulations</li>
              <li>Evidence-First Writing</li>
              <li>Human-in-the-Loop QA</li>
              <li>Career Positioning with AI</li>
            </ul>
          </div>
        </section>

        <section className="container fade-in delay-3" aria-labelledby="newsletter-title">
          <div className="newsletter">
            <div>
              <h2 id="newsletter-title">Want one tactical brief every Friday?</h2>
              <p>Start with our interview playbook and adopt one system at a time.</p>
            </div>
            <Link className="btn btn-accent" to="/blog2">
              Start Reading
            </Link>
          </div>
        </section>

        <FeedbackSection
          page="home"
          title="Help Us Improve Every Article"
          description="Share what worked, what felt unclear, and which topics you want next."
          points={[
            "Tell us which sections were most useful.",
            "Request deeper templates or examples.",
            "Suggest topics for upcoming AI playbooks."
          ]}
          topics={[
            "GPT Astro Lab",
            "Interview Buddy",
            "Resume Builder",
            "Overall Site Experience"
          ]}
        />
      </main>
    </>
  );
}
