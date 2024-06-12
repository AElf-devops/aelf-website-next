import clsx from "clsx";
import Logo from "@/assets/Logo.svg";
import CommonImage from "../CommonImage";
import styles from "./styles.module.scss";

export default function CommonHeader() {
  return (
    <header className={clsx(styles.commonHeader)}>
      <CommonImage src={Logo} alt="logo" />
      <div className={styles.navWrap}>
        <div>Platform</div>
        <div>Developer</div>
        <div>Ecosystem</div>
        <div>Blog</div>
      </div>
    </header>
  );
}
