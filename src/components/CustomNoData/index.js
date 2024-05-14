import React from "react";
import noData from "../../assets/blog/noData.svg";
import CommonImage from "../CommonImage";
import { useConfig } from "@/contexts/useConfig/hooks";

function CustomNoData(props) {
  const { isMobile } = useConfig();
  const { text = "No Data", img = noData } = props;
  return (
    <div style={styles.noData}>
      <CommonImage src={img} alt="No Data" style={styles.img} />
      <span style={isMobile ? styles.mobileText : styles.text}>{text}</span>
    </div>
  );
}

const styles = {
  noData: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 120,
    height: 83,
  },
  text: {
    color: "#8D8D8D",
    marginTop: 20,
    fontSize: 20,
    fontWeight: 600,
  },
  mobileText: {
    fontSize: 14,
    marginTop: 8,
    color: "#8D8D8D",
  },
};

export default CustomNoData;
