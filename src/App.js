import React, { useRef } from "react";
import ThumbnailMaker from "./ThumbnailMaker";
import ThumbnailMakerOld from "./ThumbnailMakerOld";

function App() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const generateAllThumbnails = () => {
    ref1.current?.generateThumbnail();
    ref2.current?.generateThumbnail();
    ref3.current?.generateThumbnail();
  };

  
  const downloadAllThumbnails = () => {
    const refs = [ref1, ref2];

    refs.forEach((ref, index) => {
      // Trigger thumbnail generation
      ref.current.generateThumbnail();

      // Slight delay to ensure rendering is done
      setTimeout(() => {
        const dataURL = ref.current?.getCanvasDataURL();
        if (dataURL) {
          const link = document.createElement("a");
          link.href = dataURL;
          link.download = `thumbnail_${index + 1}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }, 300); // adjust if your rendering is slow
    })
  }


  return (
    <div>

      <button onClick={generateAllThumbnails}>Generate all thumbnails</button>
      <button onClick={downloadAllThumbnails}>Download All Thumbnails</button>


      <ThumbnailMakerOld ref={ref1}/>
      <ThumbnailMakerOld ref={ref2}/>
      <ThumbnailMakerOld ref={ref3}/>
    </div>
  )
}

export default App;