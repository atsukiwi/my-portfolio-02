import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { client } from '../../lib/microcms';
import { BlogPost, Category } from '../../types';
import Layout from '../../components/Layout';

interface BlogPostPageProps {
  post: BlogPost;
  categories: Category[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await client.get({ endpoint: 'blogs' });

  const paths = data.contents.map((content: BlogPost) => `/post/${content.id}`);
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const postId = params?.id as string;
  const post = await client.get({ endpoint: 'blogs', contentId: postId });
  const categoryData = await client.get({ endpoint: 'categories' });

  return {
    props: {
      post,
      categories: categoryData.contents,
    },
  };
};

const BlogPostPage: NextPage<BlogPostPageProps> = ({ post, categories }) => {
  return (
    <Layout categories={categories}>
      <Head>
        <title>{post.title} | Tech Blog</title>
        <meta name="description" content={`${post.title} - Tech Blog post`} />
      </Head>
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <p className="mb-8 text-gray-400">{post.publishedAt}</p>
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        className="prose prose-lg max-w-none 
                   prose-headings:text-foreground prose-p:text-gray-300 
                   prose-a:text-blue-400 hover:prose-a:text-blue-300
                   prose-strong:text-foreground prose-code:text-foreground
                   prose-ol:text-gray-300 prose-ul:text-gray-300"
      />
    </Layout>
  );
};

export default BlogPostPage;