import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from "next/head";
import Link from "next/link";
import { client } from '../../lib/microcms';
import { BlogPost, Category } from '../../types';
import Layout from '../../components/Layout';

interface CategoryPageProps {
    blogPosts: BlogPost[];
    categories: Category[];
    currentCategory: Category;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const data = await client.get({ endpoint: 'categories' });
    const paths = data.contents.map((category: Category) => ({
        params: { id: category.id },
    }));

    return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
    const categoryId = params?.id as string;
    const categoriesData = await client.get({ endpoint: 'categories' });
    const blogData = await client.get({
        endpoint: 'blogs',
        queries: { filters: `category[equals]${categoryId}` }
    });
    const currentCategory = categoriesData.contents.find((category: Category) => category.id === categoryId);

    return {
        props: {
            blogPosts: blogData.contents,
            categories: categoriesData.contents,
            currentCategory,
        },
        revalidate: 60,
    };
};

const CategoryPage: NextPage<CategoryPageProps> = ({ blogPosts, categories, currentCategory }) => {
    return (
        <Layout categories={categories}>
            <Head>
                <title>{`${currentCategory.name} - Tech Blog`}</title>
                <meta
                    name="description"
                    content={`Posts in category: ${currentCategory.name}`}
                />
            </Head>

            <div className="mb-12">
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                    {currentCategory.name}
                </h2>
                <p className="text-lg text-gray-300 md:text-xl">
                    Posts in this category
                </p>
            </div>

            <div className="mb-12">
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

export default CategoryPage;