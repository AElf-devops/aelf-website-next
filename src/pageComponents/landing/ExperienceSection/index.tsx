import clsx from "clsx";
import CommonSection from "@/components/NewCommonSection";
import ExperienceCard from "./ExperienceCard";
import RecentBlogList from "./RecentBlogList";
import BlogIcon from "@/assets/Blog.svg";
import BuildIcon from "@/assets/Build.svg";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import styles from "./styles.module.scss";

export default function ExperienceSection() {
  const deviceClassName = useDeviceClass(styles);
  return (
    <CommonSection
      sectionClassName={clsx(styles.experienceSection, deviceClassName)}
      title="Experience aelf"
      description="Dive into our resources and blog for everything you need to know."
    >
      <div className={styles.cardPart}>
        <ExperienceCard
          className={styles.card}
          icon={BuildIcon}
          title="Build on aelf"
          description="Explore aelf’s documentation and learn how to create, build and deploy your dApps."
          buttonProps={{
            text: "Visit developer docs",
          }}
        />
        <ExperienceCard
          className={styles.card}
          icon={BlogIcon}
          title="Blog"
          description="Stay informed on aelf news and featured updates."
          buttonProps={{
            text: "Read our blog",
          }}
        />
      </div>
      <RecentBlogList className={styles.recentBlogList} />
    </CommonSection>
  );
}
