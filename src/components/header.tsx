import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LoginRegButtons } from "./navbar/_components/login-register-buttons";





export default async function Header() {
    return (
        <div className="flex justify-between max-md:gap-20  dark:bg-[#2d2d2d] bg-background border-b-3 border-b-primary">
            <span className=" md:flex md:p-5 justify-start  md:mx-auto">
                <Link href="/">
                    <div className="flex  md:gap-1">
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

                        <div className=" my-auto w-full max-w-100 pt-2">
                            <div className="flex items-center max-md:h-1 gap-3 md:mb-1">
                                <div className="flex-1 h-px bg-black dark:bg-white"></div>
                                <span className="font-serif font-bold text-[10px] md:text-lg tracking-tighter md:tracking-widest">
                                    THE
                                </span>
                                <div className="flex-1 h-px bg-black dark:bg-white"></div>
                            </div>
                            <h1 className="font-serif font-bold text-lg md:text-5xl text-center max-md:h-6 tracking-tight">
                                Daily Commit
                            </h1>
                            <div className="border-b-4 border-primary md:mt-1"></div>
                            <p className="text-center text-[7px] md:text-xs tracking-tighter md:tracking-wide mt-0.5 md:mt-2">
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
