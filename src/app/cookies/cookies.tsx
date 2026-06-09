export default function CookiesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-10 py-14 text-black dark:text-white">
      <h1 className="font-serif font-bold text-4xl mb-8">Cookie Policy</h1>

      <p className="mb-6 text-muted-foreground text-sm">Last updated: June 2026</p>

      <section className="mb-8">
        <h2 className="font-serif font-bold text-xl mb-3">What are cookies?</h2>
        <p className="leading-relaxed text-sm">
          Cookies are small text files placed on your device when you visit a website. They are
          widely used to make websites work, improve performance, and provide information to the
          site owner.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif font-bold text-xl mb-3">How we use cookies</h2>
        <p className="leading-relaxed text-sm mb-4">
          Fakenews5 uses <strong>essential cookies only</strong>. These are strictly necessary for
          the site to function and cannot be switched off. They are set in response to actions made
          by you, such as signing in or adjusting preferences.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            <strong>Session cookies</strong> — keep you signed in while you browse.
          </li>
          <li>
            <strong>Authentication cookies</strong> — verify your identity after login.
          </li>
          <li>
            <strong>Preference cookies</strong> — remember settings like dark/light mode.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-serif font-bold text-xl mb-3">What we do NOT use</h2>
        <p className="leading-relaxed text-sm">
          We do not use tracking cookies, advertising cookies, or third-party analytics cookies.
          No data about your browsing behaviour is shared with any third party.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif font-bold text-xl mb-3">Managing cookies</h2>
        <p className="leading-relaxed text-sm">
          You can control and delete cookies through your browser settings. Note that disabling
          essential cookies may affect how the site functions — for example, you may not be able
          to stay signed in.
        </p>
      </section>

      <section>
        <h2 className="font-serif font-bold text-xl mb-3">Contact</h2>
        <p className="leading-relaxed text-sm">
          If you have any questions about our use of cookies, please{" "}
          <a href="/contact" className="underline hover:opacity-70">
            contact us
          </a>
          .
        </p>
      </section>
    </div>
  );
}
