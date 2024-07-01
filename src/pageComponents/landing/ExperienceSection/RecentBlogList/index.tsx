import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import { Row, Col } from "antd";
import CommonImage from "@/components/CommonImage";
import BlogItem, { IBlogItemProps } from "../BlogItem";
import NewsIcon from "@/assets/News.svg";
import MockBlogImg1 from "@/assets/mock/MockBlogImg1.png";
import MockBlogImg2 from "@/assets/mock/MockBlogImg2.png";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import { IRecentBlogItem } from "@/types/webflow";
import styles from "./styles.module.scss";

const MOCK_BLOG_LIST: IBlogItemProps[] = [
  {
    imageSrc: MockBlogImg1,
    date: "Apr 15, 2024",
    title:
      "Blockchain and AI can be the next level of development for Web3: Here’s how",
  },
  {
    imageSrc: MockBlogImg2,
    date: "Apr 12, 2024",
    title:
      "Singapore-based blockchain startup aelf joins AI race with $50m fund",
  },
  {
    imageSrc: MockBlogImg1,
    date: "Apr 15, 2024",
    title:
      "Blockchain and AI can be the next level of development for Web3: Here’s how",
  },
  {
    imageSrc: MockBlogImg1,
    date: "Apr 15, 2024",
    title:
      "Blockchain and AI can be the next level of development for Web3: Here’s how",
  },
  {
    imageSrc: MockBlogImg2,
    date: "Apr 12, 2024",
    title:
      "Singapore-based blockchain startup aelf joins AI race with $50m fund",
  },
  {
    imageSrc: MockBlogImg1,
    date: "Apr 15, 2024",
    title:
      "Blockchain and AI can be the next level of development for Web3: Here’s how",
  },
];

interface IRecentBlogListProps {
  className?: string;
}

export default function RecentBlogList({ className }: IRecentBlogListProps) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

  const [blogList, setBlogList] = useState([]);

  const getBlogList = useCallback(async () => {
    try {
      const { data } = await axios.get("api/recentBlogList");
      setBlogList(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getBlogList();
  }, [getBlogList]);

  const colSpan = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.MOBILE:
        return 24;
      case DeviceWidthType.TABLET:
        return 12;
      case DeviceWidthType.DESKTOP:
      default:
        return 8;
    }
  }, [deviceWidthType]);

  if (blogList.length === 0) return null;

  return (
    <div className={clsx(styles.recentBlogList, deviceClassName, className)}>
      <div className={styles.header}>
        <CommonImage className={styles.headerIcon} src={NewsIcon} />
        <span>Recent Updates</span>
      </div>
      <Row className={styles.blogList} gutter={[24, 32]}>
        {blogList.map((item: IRecentBlogItem, index) => (
          <Col key={index} span={colSpan}>
            <BlogItem
              imageSrc={item.articleHeaderImage.url}
              date={item.postDate}
              title={item.title}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
