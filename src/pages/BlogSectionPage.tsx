import { FC } from "react";
import Layout from "../Layout";

interface BlogSectionPageProps {}

const BlogSectionPage: FC<BlogSectionPageProps> = () => {
  return (
    <Layout>
      <h2 className="text-4xl my-8 border-b-4 w-min border-primary">Blogs</h2>
      <div className="text-2xl text-center h-screen	">Coming soon...</div>
    </Layout>
  );
};

export default BlogSectionPage;
