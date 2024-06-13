import { useMemo } from "react";
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

  const colSpan = useMemo(() => {
    switch (deviceWidthType) {
      case DeviceWidthType.Mobile:
        return 24;
      case DeviceWidthType.Tablet:
        return 12;
      case DeviceWidthType.Desktop:
      default:
        return 8;
    }
  }, [deviceWidthType]);

  return (
    <div className={clsx(styles.recentBlogList, deviceClassName, className)}>
      <div className={styles.header}>
        <CommonImage className={styles.headerIcon} src={NewsIcon} />
        <span>Recent Updates</span>
      </div>
      <Row className={styles.blogList} gutter={[24, 32]}>
        {MOCK_BLOG_LIST.map((blogItemProps, index) => (
          <Col key={index} span={colSpan}>
            <BlogItem {...blogItemProps} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
