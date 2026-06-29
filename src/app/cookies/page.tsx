import Link from "next/link";

export default function CookiesPage() {
    return (
        <div className="p-5 w-3xl dark:text-white light:text-black mx-auto">
            <h1 className="font-extrabold text-3xl text-center">What is a cookie?</h1>
            <p>
                Cookies are small text files placed on your device when you visit a website. They
                are widely used to make websites work, improve performance, and provide information
                to the site owner.
            </p>

            <h1 className="font-extrabold text-3xl text-center mt-10">How we use cookies</h1>
            <p>
                The Daily Commit uses <strong>essential cookies only</strong>. These are strictly
                necessary for the site to function and cannot be switched off. They are set in
                response to actions made by you, such as signing in or adjusting preferences. We do
                not use tracking cookies, advertising cookies, or third-party analytics cookies. No
                data about your browsing behaviour is shared with any third party.
            </p>
            <p className="mt-4">
                If you have any further questions about cookies, you can{" "}
                <Link
                    href="/cookies"
                    className="underline hover:text-primary transition-colors cursor-pointer"
                >
                    contact oss
                </Link>
                .
            </p>
        </div>
    );
}
