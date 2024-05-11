import { useEffect, useState } from "react";
import { apiServer } from "@/api/axios";
import { getBlogList } from "@/api/request";

export default function TextBlog() {
  const [searchParams, setSearchParams] = useState<IBlogListSearchParams>({
    page: 1,
    pageSize: 9,
    isPopularArticle: null,
    tagId: null,
    search: "",
    sort: "date_updated",
    sortValue: "mostRecent",
  });

  const getBlog = async () => {
    const resdata = await getBlogList(searchParams);

    const res = await apiServer.get("/items/blogList", {
      params: {
        page: 1,
        limit: 10,
        fields: "*",
        "fields[]": "tags.tagList_id.id",
      },
    });
  };

  useEffect(() => {
    getBlog();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        paddingTop: 200,
      }}
    >
      test blog test blogtest blogtest blogtest blog test blog test blog test
      blog test blog test blog test blog
      <button onClick={getBlog}>点击</button>
    </div>
  );
}
