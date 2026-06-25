import Image from "next/image";
import Link from "next/link";
import { LoginRegButtons } from "./navbar/_components/login-register-buttons";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-end dark:bg-[#2d2d2d] bg-background border-b-5 border-b-primary">
      <div />

      <span className="hidden md:flex p-5 justify-center">
        <Link href="/">
          <div className="flex gap-3">
            <Image
              src={"/tdc_logo_gelasio_larger.svg"}
              width={90}
              height={90}
              alt="Logo"
              priority
            />
            <div className="w-full max-w-100 pt-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex-1 h-px bg-black dark:bg-white"></div>
                <span className="font-serif font-bold text-lg tracking-widest">
                  THE
                </span>
                <div className="flex-1 h-px bg-black dark:bg-white"></div>
              </div>
              <h1 className="font-serif font-bold text-5xl text-center tracking-tight">
                Daily Commit
              </h1>
              <div className="border-b-4 border-primary mt-1"></div>
              <p className="text-center text-xs tracking-wide mt-2">
                YOUR DAILY DOSE OF NEWS.{" "}
                <span className="text-primary font-bold">COMMITTED</span> TO THE
                TRUTH.
              </p>
            </div>
          </div>
        </Link>
      </span>

      <span className="flex items-end justify-end gap-3 pb-3 pr-4">
        <ThemeToggle />
        <LoginRegButtons />
      </span>
    </div>
  );
}
