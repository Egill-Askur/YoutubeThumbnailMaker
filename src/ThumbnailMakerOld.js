import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { fetchTournamentData } from './getTournamentData';
import { loadCustomFont } from "./utils/fontLoader";
import { drawCenteredText, fitTextToWidth } from "./utils/fitTextToWidth";
import striveCharacterMap from './characterMaps/GGSTCharacterMap';


const ThumbnailMakerOld = forwardRef((props, ref) => {
    
    const [dataReady, setDataReady] = useState(false);
    const [selectedCharacter1, setSelectedCharacter1] = useState("SF6_Cammy");
    const [selectedCharacter2, setSelectedCharacter2] = useState("SF6_Guile");
    //const [imageSrc1, setImageSrc1] = useState("");
    //const [imageSrc2, setImageSrc2] = useState("");
    const canvasRef = useRef(null);
    //console.log(fetchTournamentData('2453122'));

    //const [canvasWidth, setCanvasWidth] = useState(1280);  // Thumbnail width
    //const [canvasHeight, setCanvasHeight] = useState(720);  // Thumbnail height
    const [tournamentName, setTournamentName] = useState("Níðhöggur");  // Tournament name
    const [tournamentDate, setTournamentDate] = useState("Mars 4th 2025");  // Tournament date
    const [partOfBracket, setPartOfBracket] = useState("Loser Top 8");  // Part of bracket
    const [player1Name, setPlayer1Name] = useState("Player 1");  // Player 1 name
    const [player2Name, setPlayer2Name] = useState("Player 2");  // Player 2 name
    const [gamePlayed, setGamePlayed] = useState("GGST")    // Name of game played
    

    const imageMap = {
        "SF6_Cammy": "/images/GGST_Ky_Kiske.png",
        "SF6_Guile": "/images/SF6_Guile_Small.png",
        "SF6_Ryu": "/images/SF6_Ryu_Small.png",
        "SF6_Zangief": "/images/SF6_Zangief_Small.png"
    };
    
    //const canvasWidth = 1280;
    //const canvasHeight = 720;
    const backgroundImage = "/images/YTThumbnailBackground.png";
    const foregroundImage = "/images/YTThumbnailFrontground.png";
    const canvasWidth = 1280;
    const canvasHeight = 720;

    
    let fontSize = 70;

    useImperativeHandle(ref, () => ({
        generateThumbnail: handleConfirm,
        getCanvasDataURL: () => canvasRef.current?.toDataURL("image/png"),
        setDataFromApi: (data) => {
            console.log("Full data from API:", data);
            setPlayer1Name(data.games[0].selections[0].entrant.name || "Unknown");
            setPlayer2Name(data.games[0].selections[1].entrant.name || "Unknown");
            setSelectedCharacter1(striveCharacterMap[data.games[0].selections[0].selectionValue] || "Unknown Character")
            setSelectedCharacter2(striveCharacterMap[data.games[0].selections[1].selectionValue] || "Unknown Character")
            console.log("Player 1 character:", selectedCharacter1)
            console.log("Player 2 character:", selectedCharacter2)
            setTournamentName(data.tournamentName || "Untitled");
            setTournamentDate(data.tournamentDate || "Date TBD");
            if (data.fullRoundText === "Losers Round 1") {
                setPartOfBracket("Losers Eighths");
            }
            else {
                setPartOfBracket(data.fullRoundText || "Unknown");
            }
            setDataReady(true); // triggers useEffect
        },
      }));

    useEffect(() => {
    if (dataReady) {
        handleConfirm();
        setDataReady(false); // reset for future updates
    }
    }, [player1Name, player2Name, tournamentName, tournamentDate, partOfBracket, selectedCharacter1, selectedCharacter2]);
    
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
            let imagePath1 = `/images/${gamePlayed}/${selectedCharacter1}.png`
            let imagePath2 = `/images/${gamePlayed}/${selectedCharacter2}.png`
            //let workingImagePath = "/images/GGST/Ky_Kiske.png";
            console.log("Current path:", imagePath1)
            //console.log("Path that works:", workingImagePath)
            const [imgBG, img1, img2, imgFG] = await Promise.all([
                loadImage(backgroundImage),
                //loadImage(imageMap[selectedCharacter1]),
                loadImage(imagePath1),
                loadImage(imagePath2),
                //loadImage(imageMap[selectedCharacter2]),
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

            const scaleFactor = 0.55;
            const scaledWidth1 = img1.width * scaleFactor;
            const scaledHeight1 = img1.height * scaleFactor;
            const scaledWidth2 = img2.width * scaleFactor;
            const scaledHeight2 = img2.height * scaleFactor;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgBG, 0, 0, canvas.width, canvasHeight);
            //ctx.drawImage(img1, -75, 100);  // Left character
            //ctx.drawImage(img2, 675, 100);  // Right character
            ctx.drawImage(img1, -175, 125, scaledWidth1, scaledHeight1);  // Left character (scaled)
            ctx.drawImage(img2, 630, 125, scaledWidth2, scaledHeight2);  // Right character (scaled)
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


    /*
    useImperativeHandle(ref, () => ({
        generateThumbnail: handleConfirm,
        getCanvasDataURL: () => canvasRef.current?.toDataURL("image/png"),
        setDataFromApi: (data) => {
            if (data.tournamentName) setTournamentName(data.tournamentName);
            if (data.tournamentDate) setTournamentDate(data.tournamentDate);
            if (data.partOfBracket) setPartOfBracket(data.partOfBracket);
            if (data.player1Name) setPlayer1Name(data.player1Name);
            if (data.player2Name) setPlayer2Name(data.player2Name);
            if (data.character1) setSelectedCharacter1(data.character1);
            if (data.character2) setSelectedCharacter2(data.character2);
          }
    }));
    */

    


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
            onChange={(e) => setSelectedCharacter1(e.target.value)}>
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
            <select onChange={(e) => setSelectedCharacter2(e.target.value)}>
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

});

export default ThumbnailMakerOld;
//export default ThumbnailMakerOld;