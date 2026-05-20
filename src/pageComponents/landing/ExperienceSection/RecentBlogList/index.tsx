import { useMemo } from "react";
import clsx from "clsx";
import { Row, Col } from "antd";
import CommonImage from "@/components/CommonImage";
import BlogItem from "../BlogItem";
import NewsIcon from "@/assets/News.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import { useConfig } from "@/contexts/useConfig/hooks";
import { DeviceWidthType } from "@/constants/breakpoints";
import { formatDate } from "@/utils";
import { IBlogPost } from "@/types/blog";
import styles from "./styles.module.scss";

interface IRecentBlogListProps {
  className?: string;
  blogList: IBlogPost[];
}

export default function RecentBlogList({
  className,
  blogList,
}: IRecentBlogListProps) {
  const deviceClassName = useDeviceClass(styles);
  const [{ deviceWidthType }] = useConfig();

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
        {blogList.map((item, index) => (
          <Col key={index} span={colSpan}>
            <BlogItem
              imageSrc={item.coverImage?.url}
              imageAlt={item.coverImage?.alt}
              date={formatDate(item.publishedAt)}
              title={item.title}
              slug={item.slug}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
