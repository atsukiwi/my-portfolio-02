import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { client } from '../../lib/microcms';
import { BlogPost, Category } from '../../types';
import Layout from '../../components/Layout';

interface PostPageProps {
  post: BlogPost;
  categories: Category[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await client.get({ endpoint: 'blogs' });
  const paths = data.contents.map((post: BlogPost) => ({
    params: { id: post.id },
  }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  const postId = params?.id as string;
  const postData = await client.get({ endpoint: 'blogs', contentId: postId });
  const categoriesData = await client.get({ endpoint: 'categories' });

  return {
    props: {
      post: postData,
      categories: categoriesData.contents,
    },
    revalidate: 60, // 60秒ごとに再生成を試みる
  };
};

const PostPage: NextPage<PostPageProps> = ({ post, categories }) => {
  return (
    <Layout categories={categories}>
      <Head>
        <title>{post.title} - Tech Blog</title>
        <meta name="description" content={`${post.title} - Tech Blog post`} />
      </Head>

      <article className="prose prose-invert max-w-none">
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </Layout>
  );
};

export default PostPage;