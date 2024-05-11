import { Select, Input } from "antd";
import React, { useCallback, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { clsx } from "clsx";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import SearchIcon from "@/assets/blog/search.png";
import debounce from "lodash/debounce";
import CommonImage from "@/components/CommonImage";
import { useRouter } from "next/router";

const sortList = [
  {
    label: "Most Recent",
    value: "mostRecent",
  },
  // {
  //   label: "Trending",
  //   value: "trend",
  // },
];

export default function Filter({
  tagList = [],
  searchParams,
  onChangeSearchParams,
}: {
  tagList: ITag[];
  searchParams: IBlogListSearchParams;
  onChangeSearchParams: (params: IBlogListSearchParams) => void;
}) {
  const deviceClassName = useDeviceClass(styles);
  const router = useRouter();

  const selectRef = useRef<any>();
  const [inputValue, setInputValue] = useState<string>("");

  const handleTagChange = useCallback(
    (value: number) => {
      router.push("/blog?tagId=" + value);
      // onChangeSearchParams({
      //   ...searchParams,
      //   tagId: value,
      // });
    },
    [router]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      if (value === "trend") {
        onChangeSearchParams({
          ...searchParams,
          isPopularArticle: true,
          page: 1,
          sort: null,
          sortValue: value,
        });
      } else {
        onChangeSearchParams({
          ...searchParams,
          isPopularArticle: null,
          sort: "date_updated",
          sortValue: value,
          page: 1,
        });
      }
    },
    [onChangeSearchParams, searchParams]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keywordDebounce = useCallback(
    debounce((val: string) => {
      onChangeSearchParams({
        ...searchParams,
        search: val,
        page: 1,
      });
    }, 300),
    []
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setInputValue(value);
    keywordDebounce(value);
  };

  return (
    <div className={clsx([styles.filter, deviceClassName])}>
      <div className={styles.filterLeft} id="selectArea">
        <Select
          className={styles.filterSelect}
          dropdownStyle={{
            background: "#000",
            color: "#FFF",
          }}
          ref={selectRef}
          getPopupContainer={() => {
            return document.getElementById("selectArea") as HTMLElement;
          }}
          onChange={handleTagChange}
          value={searchParams.tagId}
        >
          <Select.Option value="">ALL</Select.Option>
          {tagList.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.tag}
            </Select.Option>
          ))}
        </Select>

        <Select
          className={styles.sortSelect}
          dropdownStyle={{
            background: "#000",
            color: "#FFF",
          }}
          ref={selectRef}
          getPopupContainer={() => {
            return document.getElementById("selectArea") as HTMLElement;
          }}
          onChange={handleSortChange}
          value={searchParams.sortValue}
          options={sortList}
        ></Select>
      </div>

      <Input
        size="small"
        className={styles.search}
        value={inputValue}
        onChange={handleInputChange}
        width={406}
        placeholder="Search"
        maxLength={100}
        suffix={<CommonImage src={SearchIcon} width={35} height={35} alt="" />}
      />
    </div>
  );
}
