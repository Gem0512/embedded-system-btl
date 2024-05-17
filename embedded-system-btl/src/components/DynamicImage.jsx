import React, { useState, useEffect } from 'react';
import style from "./style.css"

const DynamicImage = ({ imageUrl, interval = 5000 }) => {


  const [src, setSrc] = useState(imageUrl);

  useEffect(() => {
    const updateImage = () => {
      setSrc(`${imageUrl}?t=${new Date().getTime()}`);
    };

    const intervalId = setInterval(updateImage, interval);

    return () => clearInterval(intervalId);
  }, [imageUrl, interval]);

  return <img style={{
    height: 700,
    width: 1000
  }} src={src} alt="Dynamic" />;
};

export default DynamicImage;
