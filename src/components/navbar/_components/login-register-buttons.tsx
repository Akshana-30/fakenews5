import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";
import UserAvatarNavbar from "./user-avatar-navbar";

export async function LoginRegButtons() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return (
        <ul className="flex">
            {session ? (
                <>
                    <li>
                        <div className="flex">
                            <UserAvatarNavbar
                                imageUrl={session.user.image ?? ""}
                                fallbackTxt={session.user.name[0]}
                            />
                            <Button
                                asChild
                                variant="ghost"
                                className="cursor-pointer border-2 hover:border-b-primary! hover:bg-[#f4ede0]! hover:dark:text-background rounded-b-none text-sm md:text-[16px]"
                            >
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        </div>
                    </li>
                    <li>
                        <SignOutButton />
                    </li>
                </>
            ) : (
                <>
                    <li>
                        <Button
                            asChild
                            variant="ghost"
                            className="cursor-pointer border-2 hover:border-b-primary! hover:bg-[#f4ede0]! hover:dark:text-background rounded-b-none text-sm md:text-[16px]"
                        >
                            <Link href="/sign-in">Sign in</Link>
                        </Button>
                    </li>{" "}
                    <li>
                        <Button
                            asChild
                            variant="ghost"
                            className="cursor-pointer border-2 hover:border-b-primary! hover:bg-[#f4ede0]! hover:dark:text-background rounded-b-none text-sm md:text-[16px]"
                        >
                            <Link href="/register">Register</Link>
                        </Button>
                    </li>
                </>
            )}
        </ul>
    );
}
