import React, { useEffect, useState } from "react";
import {
  EmptyCard,
  FramesGrid,
  DeviceList,
  ImageGenerator,
} from "./components";
import { devices } from "./constants";
import "./app.css";

const App = () => {
  const [images, setImages] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("iPhone X");
  const [imageGenerationLoading, setImageGenerationLoading] = useState(false);

  const resetSelections = () => {
    parent.postMessage({ pluginMessage: { type: "resetSelections" } }, "*");
  };

  const onImagesGenerated = (newImages) => {
    newImages.forEach(({ image, size }) => {
      parent.postMessage(
        {
          pluginMessage: {
            type: "createImage",
            image,
            size,
            name: selectedDevice,
          },
        },
        "*"
      );
    });
    setImages([]);
    setImageGenerationLoading(false);
    resetSelections();
  };

  useEffect(() => {
    window.onmessage = (event) => {
      const { type, data } = event.data.pluginMessage;
      if (type === "images") {
        setImages(data);
      }
    };
  }, []);

  const renderContent = () => {
    if (imageGenerationLoading)
      return (
        <div className="imageGenerationLoadingContainer">
          <ImageGenerator
            device={selectedDevice}
            imageList={images}
            onFinish={onImagesGenerated}
          />
        </div>
      );
    if (!images.length)
      return (
        <EmptyCard
          title={"Please Select Frame"}
          description={
            "No frame is currently selected. The frames you select will appear here."
          }
        />
      );
    return <FramesGrid images={images} />;
  };

  return (
    <div className="appContainer">
      <div className="sidebar">
        <div className="sidebarTitle">Select Device</div>
        <DeviceList
          data={devices}
          selectedDevice={selectedDevice}
          onChangeSelectedData={setSelectedDevice}
        />
      </div>
      <div className="mainContent">
        <div className="header">
          <h1>Mockup Generator</h1>
          <button
            disabled={imageGenerationLoading}
            onClick={() => setImageGenerationLoading(true)}
          >
            Create Mockup
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
