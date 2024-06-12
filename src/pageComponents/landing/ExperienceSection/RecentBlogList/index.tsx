import clsx from "clsx";
import { Row, Col } from "antd";
import CommonImage from "@/components/CommonImage";
import BlogItem, { IBlogItemProps } from "../BlogItem";
import NewsIcon from "@/assets/News.svg";
import MockBlogImg1 from "@/assets/mock/MockBlogImg1.png";
import MockBlogImg2 from "@/assets/mock/MockBlogImg2.png";
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
  return (
    <div className={clsx(styles.recentBlogList, className)}>
      <div className={styles.header}>
        <CommonImage className={styles.headerIcon} src={NewsIcon} />
        <span>Recent Updates</span>
      </div>
      <Row className={styles.blogList} gutter={[24, 32]}>
        {MOCK_BLOG_LIST.map((blogItemProps, index) => (
          <Col key={index} span={8}>
            <BlogItem {...blogItemProps} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
