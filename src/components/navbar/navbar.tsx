"use client";
import { NewsDropdown } from "./_components/dropdown-menus";
import { Category } from "@/lib/types";

export default function Navbar({ categories }: { categories: Category[] | null }) {
    const links = [];
    if (categories) {
        for (const c of categories) {
            links.push({ title: c.name, href: `/category/${c.id}` });
        }
    }
    return (
        <div className="flex">
            <div className="hidden lg:flex w-full items-center gap-2 px-6 bg-[#2d2d2d]">
                <ul className="flex items-center mx-auto">
                    <li>
                        <NewsDropdown label="News" links={links} />
                    </li>
                </ul>
            </div>
        </div>
    );
}
