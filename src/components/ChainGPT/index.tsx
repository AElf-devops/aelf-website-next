import React from "react";
import 'chaingpt-component/dist/index.css';
import styles from "./styles.module.scss";
import dynamic from 'next/dynamic';
const ChatBoxButton = dynamic(
  () => import('chaingpt-component')
    .then((mod) => mod.ChatBoxButton),
  { ssr: false }
);

export default function ChainGPT(): JSX.Element {
  return (
    <>
      <div className={styles.chainGPTContainer}>
        <ChatBoxButton
          apiUri="/api/chaingpt"
        />
      </div>
    </>
  );
}
