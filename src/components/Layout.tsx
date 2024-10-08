import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    Search,
    FileText,
    BookOpen,
    Github,
    Twitter,
    Rss,
    Menu,
    X,
} from "lucide-react";
import { Category } from "../types";

interface LayoutProps {
    children: React.ReactNode;
    categories: Category[];
}

const Layout: React.FC<LayoutProps> = ({ children, categories }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (sidebarRef.current && mainContentRef.current) {
                const viewportHeight = window.innerHeight;
                sidebarRef.current.style.height = `${viewportHeight}px`;
                mainContentRef.current.style.height = `${viewportHeight}px`;
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen justify-center bg-background text-foreground">
            <div className="flex w-full max-w-6xl">
                <button
                    className="fixed top-4 left-4 z-50 md:hidden"
                    onClick={toggleSidebar}
                    aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                    {isSidebarOpen ? (
                        <X className="h-6 w-6 text-foreground" />
                    ) : (
                        <Menu className="h-6 w-6 text-foreground" />
                    )}
                </button>

                <aside
                    ref={sidebarRef}
                    className={`fixed left-0 top-0 z-40 h-full w-64 overflow-y-auto border-r border-gray-800 bg-background p-8 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } scrollbar-custom`} // scrollbar-custom クラスを追加
                >
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold">Tech Blog</h1>
                        <p className="mt-2 text-lg text-gray-400">by atsukiwi</p>
                    </div>
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full rounded-md bg-gray-800 py-2 pl-10 pr-4 text-sm text-foreground placeholder-gray-500"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                    </div>
                    <nav className="space-y-3">
                        <Link href="/" className="flex items-center rounded-md px-3 py-2 text-base text-gray-300 hover:bg-gray-800">
                            <FileText className="mr-3 h-5 w-5" />
                            Blog Posts
                        </Link>
                        <Link href="/about" className="flex items-center rounded-md px-3 py-2 text-base text-gray-300 hover:bg-gray-800">
                            <BookOpen className="mr-3 h-5 w-5" />
                            About Me
                        </Link>
                    </nav>
                    <div className="mt-10">
                        <h2 className="mb-3 text-xl font-semibold">Categories</h2>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <Link href={`/category/${category.id}`} className="block rounded-md px-3 py-2 text-base text-gray-400 transition-colors hover:bg-gray-800 hover:text-foreground">
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-10 flex space-x-6">
                        <a
                            href="https://github.com/atsukiwi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-foreground"
                        >
                            <Github className="h-6 w-6" />
                        </a>
                        <a
                            href="https://twitter.com/atsukiwi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-foreground"
                        >
                            <Twitter className="h-6 w-6" />
                        </a>
                        <a href="/rss.xml" className="text-gray-400 hover:text-foreground">
                            <Rss className="h-6 w-6" />
                        </a>
                    </div>
                </aside>

                <main
                    ref={mainContentRef}
                    className="flex-1 overflow-y-auto px-4 py-8 md:px-8 scrollbar-custom" // scrollbar-custom クラスを追加
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;