import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { CommonSection } from "@/components/CommonSection";
import { useRouter, useSearchParams } from "next/navigation";
import { getTagList, getBlogList } from "@/api/request";
import styles from "./styles.module.scss";
import Filter from "../../pageComponents/blog/Filter";
import BlogItem from "../../pageComponents/blog/BlogItem";
import CustomNoData from "@/components/CustomNoData";
import { Pagination } from "antd";
import TrendBlog from "@/pageComponents/blog/TrendBlog";

const pageSizeOptions = [9, 18, 27, 36];

export default function Community() {
  const deviceClassName = useDeviceClass(styles);
  const router = useRouter();
  const routerSearchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const tagId = routerSearchParams.get("tagId");
  const [searchParams, setSearchParams] = useState<IBlogListSearchParams>({
    page: 1,
    pageSize: 9,
    isPopularArticle: null,
    tagId: Number(tagId) || 0,
    search: "",
    sort: "-publishDate",
    sortValue: "mostRecent",
  });
  const [total, setTotal] = useState(0);
  const [blogList, setBlogList] = useState<IBlog[]>();
  const [tagList, setTagList] = useState<ITag[]>([]);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getBlogList({
        ...searchParams,
        tagId: searchParams.tagId == 0 ? null : searchParams.tagId,
        limit: searchParams.pageSize,
      });
      setBlogList(res.data);
      setTotal(res.count);
      setIsLoading(false);
    } catch (error) {}
  }, [searchParams]);

  const handleGetTagList = useCallback(async () => {
    try {
      const res = await getTagList();
      setTagList(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setSearchParams((state) => ({ ...state, page, pageSize }));
  }, []);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  useEffect(() => {
    handleGetTagList();
  }, [handleGetTagList]);

  useEffect(() => {
    setSearchParams((state: IBlogListSearchParams) => ({
      ...state,
      tagId: Number(tagId) || 0,
    }));
  }, [tagId]);

  return (
    <div className={clsx([styles.pageWrap, deviceClassName])}>
      <div className={styles.backgroundWrap}></div>
      <CommonSection
        sectionClassName={styles.blogPart}
        contentClassName={styles.partContent}
      >
        <div className={styles.title}>Discover aelf</div>
        <div className={styles.disc}>
          Stay up to date on aelf’s latest news on tech upgrades, ecosystem
          growth, community events and industry insights.
        </div>
        <TrendBlog />
        <div className={styles.title}>Latest Articles</div>
        <Filter
          tagList={tagList}
          searchParams={searchParams}
          onChangeSearchParams={setSearchParams}
        />
        {isLoading && <div className={styles.loading}>{/* <Spin /> */}</div>}
        {!isLoading && blogList?.length ? (
          <div className={styles.blogList}>
            {blogList?.map((item) => (
              <BlogItem
                key={item.id}
                blog={item}
                tagList={tagList}
              />
            ))}
          </div>
        ) : null}
        {!isLoading && !blogList?.length && (
          <div className={styles.noData}>
            <CustomNoData />
          </div>
        )}

        <div className={styles.pageNation}>
          <Pagination
            showSizeChanger
            current={searchParams.page}
            total={total}
            pageSize={searchParams.pageSize}
            onChange={handlePageChange}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      </CommonSection>
    </div>
  );
}
