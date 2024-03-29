import React from "react";
import "./index.css";

const EmptyCard = ({ title, description }) => {
  return (
    <div className="emptyCard">
      <div className="emptyCardTitle">{title}</div>
      <div className="emptyCardDescription">{description}</div>
    </div>
  );
};

export default EmptyCard;
