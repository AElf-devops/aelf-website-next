import React, { useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import CodeTool from "@editorjs/code";
import List from "@editorjs/nested-list";
import NestedList from "@editorjs/nested-list";
import raw from "@editorjs/raw";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Delimiter from '@editorjs/delimiter';
import styles from "./styles.module.scss";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import clsx from "clsx";

const EditorComponent = ({ blog }: { blog: IBlog }) => {
  const deviceClassName = useDeviceClass(styles);
  const editorInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // editorInstance.current = new EditorJS({
      //   holder: "editorjs",
      //   tools: {
      //     header: {
      //       class: Header,
      //       inlineToolbar: ["marker", "link"],
      //       config: {
      //         placeholder: "Header",
      //       },
      //       shortcut: "CMD+SHIFT+H",
      //     },
      //     image: {
      //       class: Image,
      //     },
      //     // list: {
      //     //   class: List,
      //     //   inlineToolbar: true,
      //     //   shortcut: "CMD+SHIFT+L",
      //     // },
      //     nestedlist: {
      //       class: NestedList,
      //       inlineToolbar: true,
      //       config: {
      //         defaultStyle: "unordered",
      //       },
      //     },
      //     raw: raw,
      //     linkTool: {
      //       class: LinkTool,
      //     },
      //     inlineCode: {
      //       class: InlineCode,
      //       shortcut: "CMD+SHIFT+M",
      //     },
      //     code: {
      //       class: CodeTool,
      //       shortcut: "CMD+SHIFT+C",
      //     },
      //     delimiter: Delimiter,
      //   },
      //   data: {
      //     ...blog?.content,
      //   },
      //   readOnly: true,
      // });
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
      }
    };
  }, [blog]);

  return (
    <div
      id="editorjs"
      className={clsx([styles.customEditor, deviceClassName])}
    />
  );
};

export default EditorComponent;
