import { GetStaticProps, NextPage } from 'next';
import Head from "next/head";
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
import { useEffect, useRef, useState } from "react";
import { client } from '../lib/microcms';
import { BlogPost, Category } from '../types';

interface HomeProps {
  blogPosts: BlogPost[];
  categories: Category[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    console.log('Fetching blog data...');
    const blogData = await client.get({ endpoint: 'blogs' });
    console.log('Blog data:', blogData);

    console.log('Fetching category data...');
    const categoryData = await client.get({ endpoint: 'categories' });
    console.log('Category data:', categoryData);

    return {
      props: {
        blogPosts: blogData.contents,
        categories: categoryData.contents,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { props: { blogPosts: [], categories: [] } };
  }
};

const Home: NextPage<HomeProps> = ({ blogPosts, categories }) => {
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
    <div className="flex min-h-screen justify-center bg-[#0e1117] text-white">
      <Head>
        <title>Tech Blog</title>
        <meta
          name="description"
          content="A blog about web development, React, Next.js, and TypeScript"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style jsx global>{`
        :root {
          --scrollbar-width: 10px;
          --scrollbar-track-color: #1e2028;
          --scrollbar-thumb-color: #4a4f5e;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: var(--scrollbar-thumb-color)
            var(--scrollbar-track-color);
        }

        *::-webkit-scrollbar {
          width: var(--scrollbar-width);
        }

        *::-webkit-scrollbar-track {
          background: var(--scrollbar-track-color);
          border-radius: 5px;
        }

        *::-webkit-scrollbar-thumb {
          background-color: var(--scrollbar-thumb-color);
          border-radius: 5px;
          border: 2px solid var(--scrollbar-track-color);
        }

        *::-webkit-scrollbar-thumb:hover {
          background-color: #5a5f6e;
        }
      `}</style>

      <div className="flex w-full max-w-6xl">
        <button
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>

        <aside
          ref={sidebarRef}
          className={`fixed left-0 top-0 z-40 h-full w-64 overflow-y-auto border-r border-gray-800 bg-[#0e1117] p-8 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Tech Blog</h1>
            <p className="mt-2 text-lg text-gray-400">by atsukiwi</p>
          </div>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md bg-gray-800 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500"
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
                  <Link href={`/category/${category.id}`} className="block rounded-md px-3 py-2 text-base text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
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
              className="text-gray-400 hover:text-white"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com/atsukiwi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a href="/rss.xml" className="text-gray-400 hover:text-white">
              <Rss className="h-6 w-6" />
            </a>
          </div>
        </aside>

        <main
          ref={mainContentRef}
          className="flex-1 overflow-y-auto px-4 py-8 md:px-8"
        >
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Welcome to My Tech Blog
            </h2>
            <p className="text-lg text-gray-300 md:text-xl">
              Exploring the latest in web development, with a focus on React,
              Next.js, and TypeScript.
            </p>
          </div>

          <div className="mb-12">
            <h3 className="mb-6 text-2xl font-bold md:text-3xl">
              Latest Posts
            </h3>
            <div className="space-y-6">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="block rounded-lg border border-gray-800 p-6 transition-colors hover:bg-gray-800"
                >
                  <article>
                    <h4 className="mb-2 text-xl font-semibold md:text-2xl">
                      {post.title}
                    </h4>
                    <p className="text-base text-gray-400">{post.publishedAt}</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;