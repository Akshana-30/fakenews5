import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LoginRegButtons } from "./navbar/_components/login-register-buttons";

export default async function Header() {
  return (
    <div className="flex justify-between max-md:gap-2 dark:bg-[#2d2d2d] bg-background border-b-3 border-b-primary">
      {/* invisible mirror of the right-side buttons — reserves equal width so the logo centers correctly */}
      <span
        className="hidden md:flex items-end justify-end gap-3 pb-3 pr-4 invisible pointer-events-none"
        aria-hidden="true"
      >
        <LoginRegButtons />
        <ThemeToggle />
      </span>

      <span className="md:flex md:p-5 justify-start">
        <Link href="/">
          <div className="flex md:gap-1">
            <div className="relative">
              <Image
                src="/lightlogo.png"
                width={144}
                height={144}
                alt="Logo"
                className="dark:hidden"
                priority
              />
              <Image
                src="/darklogo.png"
                width={144}
                height={144}
                alt="Logo"
                className="hidden dark:block"
                priority
              />
            </div>

            <div className="my-auto w-full max-w-40 md:max-w-100 pt-2">
              <div className="flex items-center gap-2 md:gap-3 mb-0.5 md:mb-1">
                <div className="flex-1 h-px bg-black dark:bg-white"></div>
                <span className="font-serif font-bold text-[8px] md:text-lg tracking-tighter md:tracking-widest whitespace-nowrap">
                  THE
                </span>
                <div className="flex-1 h-px bg-black dark:bg-white"></div>
              </div>
              <h1 className="font-serif font-bold text-sm md:text-5xl text-center leading-tight tracking-tight whitespace-nowrap">
                Daily Commit
              </h1>
              <div className="border-b-2 md:border-b-4 border-primary mt-0.5 md:mt-1"></div>
              <p className="text-center text-[6px] md:text-xs tracking-tighter md:tracking-wide mt-0.5 md:mt-2 leading-tight">
                YOUR DAILY DOSE OF NEWS.{" "}
                <span className="text-primary font-bold">COMMITTED</span> TO THE
                TRUTH.
              </p>
            </div>
          </div>
        </Link>
      </span>

      <span className="flex items-end justify-end gap-3 pb-3 pr-4">
        <LoginRegButtons />
        <ThemeToggle />
      </span>
    </div>
  );
}