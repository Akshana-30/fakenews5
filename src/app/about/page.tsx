export default function Page() {
  return (
    <>
      {/* Load fonts from public/fonts */}
      <style>{`
        @font-face {
          font-family: 'Boston Skyline Sans Rough';
          src: url('/fonts/BostonSkylineSansRough.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <div className="mx-auto w-full max-w-2xl px-10 py-14 text-black dark:text-white">
        {/* ── Title ── */}
        <h1
          className="font-serif font-bold text-center mb-6  tracking-wide"
          style={{
            fontSize: "64px",
            lineHeight: 1.05,
          }}
        >
          <br />
          The Daily Commit
        </h1>
        <br />

        {/* ── Subtitle ── */}
        <h2
          className="mb-10 uppercase font-bold"
          style={{
            fontFamily: "'Boston Skyline Sans Rough', sans-serif",
            fontSize: "20px",
            lineHeight: 1.7,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ display: "block", paddingLeft: "0%" }}>
            The World&apos;s
          </span>
          <span style={{ display: "block", paddingLeft: "25%" }}>
            Most Reliable
          </span>
          <span style={{ display: "block", paddingLeft: "55%" }}>
            News Source
          </span>
        </h2>

        {/* ── Intro body ── */}
        <div
          className="mb-14"
          style={{
            fontFamily: "'American Typewriter', 'Courier New', monospace",
            fontSize: "17px",
            lineHeight: 1.9,
            textAlign: "justify",
          }}
        >
          <p className="mb-4">
            The Daily Commit is your go-to source for the most up-to-date news,
            deep analysis, and dense commentary on the stories that matter most.
          </p>
          <p className="mb-4">
            We are committed to delivering accurate, unbiased, and engaging
            content that keeps you informed and empowered. Whether you are
            looking for local/world news, or editorial opinions, The Daily
            Commit has you covered.
          </p>
          <p className="mb-4">
            You can totally relay on us for the most reliable news, and we will
            never let you down with our consistently accurate reporting and
            analysis.
          </p>
          <p>
            Join our community of readers and stay ahead of the curve with The
            Daily Commit – where every story is a journey into the heart of the
            understanding what is going on in our world today.
          </p>
        </div>

        {/* ── Section heading ── */}
        <h2
          className="mb-10 uppercase font-bold"
          style={{
            fontFamily: "'Boston Skyline Sans Rough', sans-serif",
            fontSize: "20px",
            lineHeight: 1.7,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ display: "block", paddingLeft: "0%" }}>
            The Plain Truth
          </span>
          <span style={{ display: "block", paddingLeft: "35%" }}>About</span>
          <span style={{ display: "block", paddingLeft: "45%" }}>
            The Daily Commit
          </span>
        </h2>

        {/* ── About body ── */}
        <div
          style={{
            fontFamily: "'American Typewriter', 'Courier New', monospace",
            fontSize: "17px",
            lineHeight: 1.9,
            textAlign: "justify",
          }}
        >
          <p className="mb-4">
            The Daily Commit is a reliable news website that emphasizes the
            style and content of traditional news outlets.
          </p>
          <p className="mb-4">
            Our mission is to inform and educate our readers with interesting,
            well-researched, and engaging content. We cover a wide range of
            topics, untold stories, and often amazing stories that clarify
            current events, politics, and popular culture.
          </p>
          <p>
            We aim to provide a serious take on the news while also encouraging
            critical thinking and media literacy. Please note that the content
            on The Daily Commit is told as we understands it and should not be
            taken as facts set in stone.
          </p>
        </div>
      </div>
    </>
  );
}
