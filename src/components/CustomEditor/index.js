import { createReactEditorJS } from "react-editor-js";

import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
//import Paragraph from '@editorjs/paragraph'
//import List from '@editorjs/list'
//import Warning from '@editorjs/warning'
import Code from "@editorjs/code";
//import LinkTool from '@editorjs/link'
import ImageTool from "@editorjs/image";
import NestedList from "@editorjs/nested-list";
//import Raw from '@editorjs/raw'
import Header1 from "@editorjs/header";
import Quote from "@editorjs/quote";
// import Marker from '@editorjs/marker'
// import CheckList from '@editorjs/checklist'
import Delimiter from "@editorjs/delimiter";
// import InlineCode from '@editorjs/inline-code'
import SimpleImage from "@editorjs/simple-image";
const ReactEditorJS = createReactEditorJS();
import styles from "./styles.module.scss";
import { useDeviceClass } from "@/hooks/useDeviceClass";
import clsx from "clsx";

const CustomEditor = ({ handleInstance, data, ...props }) => {
  const deviceClassName = useDeviceClass(styles);
  const EDITOR_JS_TOOLS = {
    // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
    // paragraph: Paragraph,
    embed: Embed,
    table: Table,
    //list: List,
    //warning: Warning,
    code: Code,
    //linkTool: LinkTool,
    //Image,
    nestedlist: {
      class: NestedList,
      inlineToolbar: true,
      config: {
        defaultStyle: "unordered",
      },
    },
    image: {
      class: ImageTool,
      config: {},
    },
    //raw: Raw,
    header: Header1,
    quote: Quote,
    //marker: Marker,
    // checklist: CheckList,
    delimiter: Delimiter,
    // inlineCode: InlineCode,
    simpleImage: SimpleImage,
  };

  return (
    <div className={clsx([styles.customEditor, deviceClassName])}>
      <ReactEditorJS
        {...props}
        readOnly={true}
        onInitialize={(instance) => handleInstance(instance)}
        tools={EDITOR_JS_TOOLS}
        data={data}
        placeholder={`Write from here...`}
      />
    </div>
  );
};
export default CustomEditor;
