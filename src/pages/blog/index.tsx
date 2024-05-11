import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { Spin } from "antd";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { CommonSection } from "@/components/CommonSection";
import { useRouter, useSearchParams } from "next/navigation";
import { getTagList, getBlogList } from "@/api/request";
import { Pagination } from "antd";
import styles from "./styles.module.scss";
import Filter from "./components/Filter";
import BlogItem from "./components/BlogItem";
import CustomNoData from "@/components/CustomNoData";

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
    sort: "date_updated",
    sortValue: "mostRecent",
  });
  const [total, setTotal] = useState(0);
  const [blogList, setBlogList] = useState<IBlog[]>();
  const [tagList, setTagList] = useState<ITag[]>([]);

  const handleSearch = useCallback(() => {
    setIsLoading(true);
    getBlogList({
      ...searchParams,
      tagId: searchParams.tagId == 0 ? null : searchParams.tagId,
      limit: searchParams.pageSize,
    })
      .then((res) => {
        setBlogList(res.data);
        setTotal(res.count);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchParams]);

  const handleGetTagList = useCallback(async () => {
    getTagList()
      .then((res) => {
        setTagList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePageChange = (page: number, pageSize: number) => {
    setSearchParams((state) => ({ ...state, page, pageSize }));
  };

  const viewDetail = useCallback(
    (id: number) => {
      router.push(`/blog-detail?id=${id}`);
    },
    [router]
  );

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
        sectionClassName={styles.bannerPart}
        contentClassName={styles.partContent}
      >
        <div className={styles.title}>Latest Articles</div>
        <Filter
          tagList={tagList}
          searchParams={searchParams}
          onChangeSearchParams={setSearchParams}
        />
        {isLoading && (
          <div className={styles.loading}>
            <Spin />
          </div>
        )}
        {!isLoading && blogList?.length ? (
          <div className={styles.blogList}>
            {blogList?.map((item) => (
              <BlogItem
                key={item.id}
                blog={item}
                tagList={tagList}
                onViewDetail={viewDetail}
              />
            ))}
          </div>
        ) : null}
        {!isLoading && !blogList?.length && (
          <div className={styles.noData}>
            <CustomNoData />
          </div>
        )}

        {/* <div className={styles.pageNation}>
          <Pagination
            showSizeChanger
            defaultCurrent={1}
            total={total}
            pageSize={searchParams.pageSize}
            onChange={handlePageChange}
            pageSizeOptions={pageSizeOptions}
          />
        </div> */}
      </CommonSection>
    </div>
  );
}
