import { useEffect } from "react";
import { useRouter } from "next/router";
import { getBlogDetailById } from "@/api/request";
import { GetServerSidePropsContext } from "next";

export default function PreBlogDetail({
  blogPath,
}: {
  blogPath: string | null;
}) {
  const router = useRouter();
  useEffect(() => {
    if (blogPath) {
      router.replace(`/blog/${blogPath}`);
    } else {
      router.replace("/blog");
    }
  }, [blogPath, router]);

  return null;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  let blogPath;
  if (query.id) {
    try {
      const result = await getBlogDetailById(Number(query.id));
      blogPath = result.data?.urlPath;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    props: {
      blogPath: blogPath || null,
    },
  };
}
