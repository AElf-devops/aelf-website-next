import React from 'react';
import noData from '../../assets/blog/noData.svg';
import CommonImage from '../CommonImage';

function CustomNoData(props) {
  const { text = 'No Data', img = noData } = props
  return (
    <div style={styles.noData}>
      <CommonImage src={img} alt="No Data" style={styles.img}/>
      <span style={styles.text}>{text}</span>
    </div>
  );
}

const styles = {
  noData: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 120,
    height: 83
  },
  text: {
    color: '#81858C',
    marginTop: 20
  }

}

export default CustomNoData;
