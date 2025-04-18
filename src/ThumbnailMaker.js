import React, { useState, useRef } from "react";
import { fetchTournamentData } from './getTournamentData';
import { loadCustomFont } from "./utils/fontLoader";
import { drawCenteredText, fitTextToWidth } from "./utils/fitTextToWidth";

const MatchInputCard = ({
    index,
    partOfBracket,
    setPartOfBracket,
    player1Name,
    setPlayer1Name,
    selectedOption1,
    setSelectedOption1,
    player2Name,
    setPlayer2Name,
    selectedOption2,
    setSelectedOption2
  }) => {
    return (
      <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "10px" }}>
        <label htmlFor={`partOfBracketInput-${index}`}>Part of bracket:</label>
        <input
          id={`partOfBracketInput-${index}`}
          type="text"
          value={partOfBracket}
          onChange={(e) => setPartOfBracket(e.target.value)}
          placeholder="Enter part of bracket"
          style={{ marginLeft: "10px", padding: "5px", width: "250px" }}
        />
        <br />
        <label htmlFor={`player1NameInput-${index}`}>Player 1 name:</label>
        <input
          id={`player1NameInput-${index}`}
          type="text"
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
          placeholder="Enter player 1 name"
          style={{ marginLeft: "10px", padding: "5px", width: "250px" }}
        />
        <select
          value={selectedOption1}
          onChange={(e) => setSelectedOption1(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="">-- Select --</option>
          <option value="SF6_Cammy">Cammy</option>
          <option value="SF6_Guile">Guile</option>
          <option value="SF6_Ryu">Ryu</option>
          <option value="SF6_Zangief">Zangief</option>
        </select>
        <br />
        <label htmlFor={`player2NameInput-${index}`}>Player 2 name:</label>
        <input
          id={`player2NameInput-${index}`}
          type="text"
          value={player2Name}
          onChange={(e) => setPlayer2Name(e.target.value)}
          placeholder="Enter player 2 name"
          style={{ marginLeft: "10px", padding: "5px", width: "250px" }}
        />
        <select
          value={selectedOption2}
          onChange={(e) => setSelectedOption2(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="">-- Select --</option>
          <option value="SF6_Cammy">Cammy</option>
          <option value="SF6_Guile">Guile</option>
          <option value="SF6_Ryu">Ryu</option>
          <option value="SF6_Zangief">Zangief</option>
        </select>
      </div>
    );
  };


const ThumbnailMaker = () => {
    const [matches, setMatches] = useState(
        Array.from({ length: 10 }).map(() => ({
          partOfBracket: "",
          player1Name: "",
          selectedOption1: "",
          player2Name: "",
          selectedOption2: ""
        }))
    );


    const [selectedOption1, setSelectedOption1] = useState("");
    const [selectedOption2, setSelectedOption2] = useState("");
    //const [imageSrc1, setImageSrc1] = useState("");
    //const [imageSrc2, setImageSrc2] = useState("");
    const canvasRef = useRef(null);
    //console.log(fetchTournamentData('2453122'));

    const [canvasWidth, setCanvasWidth] = useState(1280);  // Thumbnail width
    const [canvasHeight, setCanvasHeight] = useState(720);  // Thumbnail height
    const [tournamentName, setTournamentName] = useState("Níðhöggur");  // Tournament name
    const [tournamentDate, setTournamentDate] = useState("Mars 4th 2025");  // Tournament date
    const [partOfBracket, setPartOfBracket] = useState("Loser Top 8");  // Part of bracket
    const [player1Name, setPlayer1Name] = useState("Player 1");  // Player 1 name
    const [player2Name, setPlayer2Name] = useState("Player 2");  // Player 2 name
    

    
    const imageMap = {
        "SF6_Cammy": "/images/SF6_Cammy_60.png",
        "SF6_Guile": "/images/SF6_Guile_Small.png",
        "SF6_Ryu": "/images/SF6_Ryu_Small.png",
        "SF6_Zangief": "/images/SF6_Zangief_Small.png"
    };
    
    
    const backgroundImage = "/images/YTThumbnailBackground.png";
    const foregroundImage = "/images/YTThumbnailFrontground.png";
    
    let fontSize = 70;
    
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    };

    const handleConfirm = async () => {
        loadCustomFont();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        try {
            const [imgBG, img1, img2, imgFG] = await Promise.all([
                loadImage(backgroundImage),
                loadImage(imageMap[selectedOption1]),
                loadImage(imageMap[selectedOption2]),
                loadImage(foregroundImage),
            ])
            /*
            const imgBG = new Image();
            const imgFG = new Image();
            const img1 = new Image();
            const img2 = new Image();
            */

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgBG, 0, 0, canvas.width, canvasHeight);
            ctx.drawImage(img1, -75, 100);  // Left character
            ctx.drawImage(img2, 675, 100);  // Right character
            ctx.drawImage(imgFG, 0, 0, canvas.width, canvas.height);  // Overlay

            ctx.fillStyle = 'black';
            ctx.textAlign = 'center'; // or 'left', 'right'
            ctx.textBaseline = "middle";
            
            fontSize = fitTextToWidth(tournamentName + " | " + tournamentDate, canvas.width)
            ctx.font = `bold ${fontSize}px Tajawal-Black`;

            ctx.fillText(tournamentName + " | "                                 // Tournament name + date
                + tournamentDate, canvas.width / 2, 64);
            drawCenteredText(ctx, player1Name, 273, 648, 546)                   // Player 1 name

            drawCenteredText(ctx, player2Name, canvas.width - 273, 648, 546)    // Player 2 name

            ctx.fillStyle = 'white';
            drawCenteredText(ctx, partOfBracket, canvas.width / 2, 148, 466)    // Bracket match name
        } catch (error) {
            console.error("Error loading one or more images:", error);
        }

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


            <div style={{ marginTop: "20px" }}>
            <label htmlFor="tournamentNameInput">Tournament Name:</label>
            <input
                id="tournamentNameInput"
                type="text"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                placeholder="Enter tournament name"
                style={{ marginLeft: "10px", padding: "5px", width: "250px" }}
            />

            <label htmlFor="tournamentDateInput">Tournament Date:</label>
            <input
                id="tournamentDateInput"
                type="text"
                value={tournamentDate}
                onChange={(e) => setTournamentDate(e.target.value)}
                placeholder="Enter tournament date"
                style={{ marginLeft: "10px", padding: "5px", width: "250px" }}
            />
            <button onClick={handleConfirm}>Generate Thumbnail</button>
            <button onClick={handleSave}>Save Thumbnail to PC</button>

            <br/>
            
            <label htmlFor="partOfBracketInput">Part of bracket:</label>
            <input
                id="partOfBracketInput"
                type="text"
                value={partOfBracket}
                onChange={(e) => setPartOfBracket(e.target.value)}
                placeholder="Enter part of bracket"
                style={{ marginLeft: "10px", padding: "5px", width: "250px" }}
            />

            <br/>
            <label htmlFor="player1NameInput">Player 1 name:</label>
            <input
                id="player1NameInput"
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                placeholder="Enter player 1 name"
                style={{ marginLeft: "10px", padding: "5px", width: "250px" }}
            />
            <select //value={testVariable}
            onChange={(e) => setSelectedOption1(e.target.value)}>
                <option value="">-- Select --</option>
                <option value="SF6_Cammy">Cammy</option>
                <option value="SF6_Guile">Guile</option>
                <option value="SF6_Ryu">Ryu</option>
                <option value="SF6_Zangief">Zangief</option>
            </select>

            <br/>
            
            <label htmlFor="player2NameInput">Player 2 name:</label>
            <input
                id="player2NameInput"
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Enter player 2 name"
                style={{ marginLeft: "10px", padding: "5px", width: "250px" }}
            />
            <select onChange={(e) => setSelectedOption2(e.target.value)}>
                <option value="">-- Select --</option>
                <option value="SF6_Cammy">Cammy</option>
                <option value="SF6_Guile">Guile</option>
                <option value="SF6_Ryu">Ryu</option>
                <option value="SF6_Zangief">Zangief</option>
            </select>

        </div>

            <canvas ref={canvasRef} width="500" height="400" style={{ border: "1px solid black", marginTop: "20px" }}></canvas>
        </div>
    )

}

export default ThumbnailMaker;