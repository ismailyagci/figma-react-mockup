import React from "react";
import "./index.css";

const DeviceList = ({ selectedDevice, data, onChangeSelectedData }) => {
  const DeviceCard = ({ title, onClick }) => {
    const isSelected = selectedDevice === title;
    return (
      <div
        className={`deviceCard ${
          isSelected ? "deviceCardSelected" : ""
        } noselect`}
        onClick={onClick}
      >
        {title}
      </div>
    );
  };

  return data.map((item) => (
    <DeviceCard
      title={item}
      onClick={() => onChangeSelectedData(item)}
      key={item}
    />
  ));
};

export default DeviceList;
