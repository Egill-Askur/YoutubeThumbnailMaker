import React, { useState, useRef } from "react";
import { fetchTournamentData } from './getTournamentData';


const ThumbnailMaker = () => {
    const [selectedOption1, setSelectedOption1] = useState("");
    const [selectedOption2, setSelectedOption2] = useState("");
    //const [imageSrc1, setImageSrc1] = useState("");
    //const [imageSrc2, setImageSrc2] = useState("");
    const canvasRef = useRef(null);
    //console.log(fetchTournamentData('2453122'));

    const [canvasWidth, setCanvasWidth] = useState(1055);  // Default width
    const [canvasHeight, setCanvasHeight] = useState(593);  // Default height

    const imageMap = {
        "SF6_Cammy": "/images/SF6_Cammy_Small.png",
        "SF6_Guile": "/images/SF6_Guile_Small.png",
        "SF6_Ryu": "/images/SF6_Ryu_Small.png",
        "SF6_Zangief": "/images/SF6_Zangief_Small.png"
    };
    
    const backgroundImage = "/images/YTThumbnailBackground.png";
    const foregroundImage = "/images/YTThumbnailFrontground.png";
    
    const testVariable = "SF6_Cammy";
    

    /*
    const handleSelectChange = (event) => {
        setSelectedOption1(event.target.value);
        setSelectedOption2(event.target.value);
    }
        */

    const handleConfirm = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const imgBG = new Image();
        const imgFG = new Image();
        const img1 = new Image();
        const img2 = new Image();

        imgBG.src = backgroundImage;
        img1.src = imageMap[selectedOption1];
        img2.src = imageMap[selectedOption2];
        imgFG.src = foregroundImage;
        
        imgBG.onload = () => {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgBG, 0, 0, canvas.width, canvas.height);

            img1.onload = () => {
                ctx.drawImage(img1, -50, 100); //Left image

                img2.onload = () => {
                    ctx.drawImage(img2, 600, 100); //Right image

                    imgFG.onload = () => {
                        ctx.drawImage(imgFG, 0, 0, canvas.width, canvas.height);
                    };
                };
            };
        };

        //if (selectedOption) {
        //    setImageSrc1(imageMap[selectedOption1]);
         //   setImageSrc2(imageMap[selectedOption2]);
        //}
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.download = "generate-image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }


    return (
        <div>
            <h2>Compose your thumbnail</h2>

            <select //value={testVariable}
            onChange={(e) => setSelectedOption1(e.target.value)}>
                <option value="">-- Select --</option>
                <option value="SF6_Cammy">Cammy</option>
                <option value="SF6_Guile">Guile</option>
                <option value="SF6_Ryu">Ryu</option>
                <option value="SF6_Zangief">Zangief</option>
            </select>

            <select onChange={(e) => setSelectedOption2(e.target.value)}>
                <option value="">-- Select --</option>
                <option value="SF6_Cammy">Cammy</option>
                <option value="SF6_Guile">Guile</option>
                <option value="SF6_Ryu">Ryu</option>
                <option value="SF6_Zangief">Zangief</option>
            </select>

            <button onClick={handleConfirm}>Generate Thumbnail</button>
            <button onClick={handleSave}>Save Thumbnail to PC</button>

            <canvas ref={canvasRef} width="500" height="400" style={{ border: "1px solid black", marginTop: "20px" }}></canvas>
        </div>
    )

    /*
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Select an option from each dropdown menu</h2>
            
            <select onChange={(e) => setSelectedOption1(e.target.value)} >
                <option value="">-- Select --</option>
                <option value="SF6_Cammy">Cammy</option>
                <option value="SF6_Guile">Guile</option>
                <option value="SF6_Ryu">Ryu</option>
            </select>

            <select onChange={(e) => setSelectedOption2(e.target.value)}>
                <option value="">-- Select --</option>
                <option value="SF6_Cammy">Cammy</option>
                <option value="SF6_Guile">Guile</option>
                <option value="SF6_Ryu">Ryu</option>
            </select>

            <button onClick={handleConfirm} style={{ marginLeft: "10px"}}>
                Confirm selection
            </button>

            {imageSrc1 && <div><img src={imageSrc1} alt="Selected Option 1" style={{ marginTop: "20px", width: "300px"}}/></div>}
            {imageSrc2 && <div><img src={imageSrc2} alt="Selected Option 2" style={{ marginTop: "20px", width: "300px"}}/></div>}
            
        </div>
    )
        */
}

export default ThumbnailMaker;