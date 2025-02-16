import { GetStaticProps, NextPage } from 'next';
import Head from "next/head";
import Link from "next/link";
import { client } from '../lib/microcms';
import { BlogPost, Category } from '../types';
import Layout from '../components/Layout';

interface HomeProps {
  blogPosts: BlogPost[];
  categories: Category[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const blogData = await client.get({ endpoint: 'blogs' });
    const categoryData = await client.get({ endpoint: 'categories' });

    return {
      props: {
        blogPosts: blogData.contents,
        categories: categoryData.contents,
      },
      revalidate: 60, // 60秒ごとに再生成を試みる
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: { blogPosts: [], categories: [] },
      revalidate: 60,
    };
  }
};

const Home: NextPage<HomeProps> = ({ blogPosts, categories }) => {
  return (
    <Layout categories={categories}>
      <Head>
        <title>Tech Blog</title>
        <meta
          name="description"
          content="A blog about web development, React, Next.js, and TypeScript"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
    </Layout>
  );
};

export default Home;