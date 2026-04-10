"use client";

import { ShoppingCart } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
        { name: "Live Chat", href: "/chatbot" },
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blogs" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <div className="flex items-center justify-center fixed top-0 bg-[var(--bg-less-dark)]/50 backdrop-blur-xl w-dvw h-[10dvh] z-[9999]">
            <nav className="flex items-center justify-between w-[80dvw]">

                {/* Logo */}
                <Link href="/" className="font-grotesk text-[var(--accent)] font-bold text-3xl">
                    InnovixLLC
                </Link>

                <div className="flex items-center gap-5">

                    {/* Nav Links */}
                    <ul className="flex text-lg gap-5 h-[40px] items-center">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`border-b-2 pb-1 transition-all duration-150 ${isActive ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent hover:border-[var(--accent)] hover:text-[var(--accent)]"}`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Right side */}
                    <div className="mx-5 flex items-center gap-5">
                        <ThemeToggle />

                        <Link href="/cart" className="flex items-start">
                            <ShoppingCart />
                            <span className="rounded-full h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center">
                                0
                            </span>
                        </Link>
                    </div>

                    {/* CTA */}
                    <Link href="/registration">
                        <button className="bg-[var(--accent)] text-[var(--accent-dark)] font-inter text-lg rounded-full py-2 px-4 flex items-center gap-2 hover:scale-105 transition-all duration-200 hover:shadow-[0_0_10px_var(--accent)]">
                            Get Started
                        </button>
                    </Link>

                </div>
            </nav>
        </div>
    );
}