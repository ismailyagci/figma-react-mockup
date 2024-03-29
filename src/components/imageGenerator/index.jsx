import React, { useEffect, useRef, useState } from "react";
import { DeviceFrameset } from "react-device-frameset";
import { toPng } from "html-to-image";
import "react-device-frameset/styles/marvel-devices.min.css";
import "react-device-frameset/styles/device-emulator.min.css";
import "./index.css";

const ImageGenerator = ({ imageList, device, onFinish }) => {
  const [currentProccesedImage, setCurrentProccesedImage] = useState();
  const [isProccessing, setIsProccessing] = useState(false);
  const container = useRef();

  const captureContainer = async () => {
    if (container.current) {
      return await toPng(container.current, {
        cacheBust: true,
        backgroundColor: "rgba(0,0,0,0)",
      })
        .then((response) => {
          console.log(response);
          return {
            status: true,
            image: response,
            size: {
              width: container.current.clientWidth,
              height: container.current.clientHeight,
            },
          };
        })
        .catch((err) => ({
          status: false,
          error: err,
        }));
    }

    return {
      status: false,
    };
  };

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const startProcess = async () => {
    if (isProccessing) return;

    setIsProccessing(true);

    const images = [];

    for (let index = 0; index < imageList.length; index++) {
      const image = imageList[index];
      setCurrentProccesedImage(image);
      await timeout(800);
      const response = await captureContainer();
      if (response.status)
        images.push({ image: response.image, size: response.size });
    }
    setIsProccessing(false);
    onFinish(images);
  };

  useEffect(() => {
    startProcess();
  }, [imageList, isProccessing]);

  return (
    <div className="imageGeneratorContainer">
      <div ref={container}>
        {currentProccesedImage && (
          <DeviceFrameset device={device} zoom={0.8}>
            <img src={currentProccesedImage} className="deviceImage" alt="" />
          </DeviceFrameset>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
