// @ts-nocheck

const base64ToUint8Array = (base64) => {
  const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = [];
  let group, encoded1, encoded2, encoded3, encoded4;

  for (let i = 0; i < base64.length; i += 4) {
    encoded1 = base64Chars.indexOf(base64[i]);
    encoded2 = base64Chars.indexOf(base64[i + 1]);
    encoded3 = base64Chars.indexOf(base64[i + 2]);
    encoded4 = base64Chars.indexOf(base64[i + 3]);

    group =
      (encoded1 << 18) |
      (encoded2 << 12) |
      ((encoded3 & 63) << 6) |
      (encoded4 & 63);

    if (encoded3 == 64) {
      result.push((group >> 16) & 255);
    } else if (encoded4 == 64) {
      result.push((group >> 16) & 255, (group >> 8) & 255);
    } else {
      result.push((group >> 16) & 255, (group >> 8) & 255, group & 255);
    }
  }

  return new Uint8Array(result);
};

const uint8ArrayToBase64 = (buffer) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let base64 = "",
    enc1,
    enc2,
    enc3,
    enc4;
  for (let i = 0; i < buffer.length; i += 3) {
    enc1 = buffer[i] >> 2;
    enc2 = ((buffer[i] & 3) << 4) | (buffer[i + 1] >> 4);
    enc3 = ((buffer[i + 1] & 15) << 2) | (buffer[i + 2] >> 6);
    enc4 = buffer[i + 2] & 63;

    if (isNaN(buffer[i + 1])) {
      enc3 = enc4 = 64;
    } else if (isNaN(buffer[i + 2])) {
      enc4 = 64;
    }

    base64 +=
      chars.charAt(enc1) +
      chars.charAt(enc2) +
      chars.charAt(enc3) +
      chars.charAt(enc4);
  }
  return base64;
};

const bytesToBase64 = (bytes) =>
  `data:image/png;base64,${uint8ArrayToBase64(bytes)}`;

const frameToImage = async (node) => {
  return node
    .exportAsync({ format: "PNG" })
    .then((bytes) => {
      return bytesToBase64(bytes);
    })
    .catch((error) => {
      console.error("Görsel dışa aktarılamadı:", error);
    });
};

const handleSelectElements = async () => {
  const selections = figma.currentPage.selection;
  const images = [];
  for (let index = 0; index < selections.length; index++) {
    const node = selections[index];
    const result = await frameToImage(node);
    images.push(result);
  }
  figma.ui.postMessage({
    type: "images",
    data: images,
  });
};

const handleNotSelectElements = () => {
  figma.ui.postMessage({
    type: "images",
    data: [],
  });
};

const createImageFrame = async (base64Data, size, name) => {
  const imageBytes = base64ToUint8Array(base64Data);
  const image = figma.createImage(imageBytes);
  const frame = figma.createFrame();
  frame.resize(size.width, size.height);
  let maxY = 0;
  figma.currentPage.children.forEach((node) => {
    if (node.type === "FRAME") {
      let nodeBottomY = node.y + node.height;
      maxY = Math.max(maxY, nodeBottomY);
    }
  });
  frame.x = 0;
  frame.y = maxY + 20;
  frame.name = `MockUp - ${name}`;
  frame.fills = [{ type: "IMAGE", imageHash: image.hash, scaleMode: "FILL" }];
  figma.viewport.scrollAndZoomIntoView([frame]);
};

const handleSelectedFrames = () => {
  if (figma.currentPage.selection.length > 0) {
    handleSelectElements();
  } else {
    handleNotSelectElements();
  }
};

figma.showUI(__html__, {
  width: 1280,
  height: 720,
});

figma.ui.onmessage = (msg) => {
  if (msg.type === "resize") {
    figma.ui.resize(msg.width, msg.height);
  }
  if (msg.type === "createImage") {
    const base64Data = msg.image.replace(/^data:image\/(png|jpeg);base64,/, "");
    createImageFrame(base64Data, msg.size, msg.name);
  }
  if (msg.type === "resetSelections") {
    figma.currentPage.selection = [];
    figma.closePlugin()
  }
};

figma.on("selectionchange", () => {
  handleSelectedFrames();
});

(() => {
  handleSelectedFrames();
})();
