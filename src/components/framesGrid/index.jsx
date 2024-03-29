import React from "react";
import "./index.css";

const FramesGrid = ({ images = [] }) => {
  return (
    <div className="framesGrid">
      {images.map((image) => (
        <div className="framesGridItem" key={image}>
          <img src={image} className="framesGridItemImage" alt="" />
        </div>
      ))}
    </div>
  );
};

export default FramesGrid;
