import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { client } from '../../lib/microcms';
import { BlogPost } from '../../types';

interface BlogPostPageProps {
  post: BlogPost;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await client.get({ endpoint: 'blogs' });

  const paths = data.contents.map((content: BlogPost) => `/post/${content.id}`);
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const postId = params?.id as string;
  const post = await client.get({ endpoint: 'blogs', contentId: postId });

  return {
    props: {
      post,
    },
  };
};

const BlogPostPage: NextPage<BlogPostPageProps> = ({ post }) => {
  return (
    <div className="container mx-auto px-4 py-8 bg-[#0e1117] text-white">
      <Head>
        <title>{post.title} | Tech Blog</title>
        <meta name="description" content={`${post.title} - Tech Blog post`} />
      </Head>
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <p className="mb-8 text-gray-400">{post.publishedAt}</p>
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        className="prose prose-invert prose-lg max-w-none 
                   prose-headings:text-white prose-p:text-gray-300 
                   prose-a:text-blue-400 hover:prose-a:text-blue-300
                   prose-strong:text-white prose-code:text-white
                   prose-ol:text-gray-300 prose-ul:text-gray-300"
      />
    </div>
  );
};

export default BlogPostPage;