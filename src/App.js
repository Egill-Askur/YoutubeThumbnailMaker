import React, { useEffect, useRef, useState } from "react";
//import ThumbnailMaker from "./ThumbnailMaker";
import ThumbnailMakerOld from "./ThumbnailMakerOld";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getId, getPhaseID, getSets, getSetsByPhaseID, getTop8Sets } from "./startGGApi";

// Type for the ref methods
type ThumbnailMakerOldRef = {
  generateThumbnail: () => void;
  getCanvasDataURL: () => string | undefined;
  setDataFromApi: (data: any) => void;
};

console.log("Logging works");
function App() {
  //const ref1 = useRef(null);
  //const ref2 = useRef(null);
  //const ref3 = useRef(null);
  const refsArray = useRef([]); // Array of refs
  const thumbnailCount = 10;

  const [tournamentName, setTournamentName] = useState(""); // Event name state
  const [tournamentDate, setTournamentDate] = useState(""); // Event date state

  const [tournamentSlug, setTournamentSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const top8SetNames = ["Grand Final", "Winners Final", "Winners Semi-Final", "Losers Final", "Losers Semi-Final", "Losers Quarter-Final", "Losers Round 1"]

  const extractSlug = (input: string) => {
    const match = input.match(/tournament\/([^/]+)\/event\/([^/]+)\/brackets\/(\d+)\/(\d+)/);
    if (match) {
      const tournament = match[1];
      const event = match[2];
      return `tournament/${tournament}/event/${event}`;
      //return tournament;
    }
    const simpleMatch = input.match(/tournament\/([^/]+)\/event\/([^/]+)/);
    if (simpleMatch) {
      const [, tournamentSlug, eventSlug] = simpleMatch;
      return `tournament/${tournamentSlug}/event/${eventSlug}`;
    }
    return input; // fallback: user entered a raw slug
  }

  const handleFetchTournamentData = async () => {
    const slug = extractSlug(tournamentSlug);
    setLoading(true);
    try {
      const pages = 1;
      const perPage = 11;
      console.log("Getting id of slug:", slug)
      const idObject = await getId(slug)

      console.log("Fetching sets with slug:", idObject);
      //const sets = await getTop8Sets(idObject.id);
      
      const phaseID = await getPhaseID(idObject.id)
      console.log("phaseID received:", phaseID);
      const phaseObjects = phaseID.event.phases;
      console.log("Phases names:", phaseObjects)
      const top8Object = phaseObjects.find(phase => phase.name === "Top 8")
      console.log("Top 8 object:", top8Object)
      const top8PhaseID = top8Object.id;

      const top8ByPhaseID = await getSetsByPhaseID(top8PhaseID, pages, perPage);
      const top8SetsByPhaseID = top8ByPhaseID.phase.sets.nodes;
      //const top8SetsByPhaseID = top8ByPhaseID;
      console.log("Sets recieved by top 8 ID:", top8SetsByPhaseID)

      //const sets = await getSets(idObject.id)
      //console.log("Sets received:", sets);


      /*
      const loserRounds = sets
      .filter(set => set.fullRoundText?.includes("Losers Round"))
      .map(set => {
        const match = set.fullRoundText.match(/Losers Round (\d+)/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter(num => num !== null);

      const highestLosersRound = Math.max(...loserRounds);
      console.log("Highest losers round", highestLosersRound)

      top8SetNames.push("Losers Round " + highestLosersRound)
      */

      //let thumbnailGeneratorCounter = 0;
      //const top8Sets = sets.filter(set => top8SetNames.includes(set.fullRoundText));
      const top8Sets = top8SetsByPhaseID.filter(set => top8SetNames.includes(set.fullRoundText));
      /*
      const uniqueTop8Sets = Array.from(
        new Map(top8Sets.map(set => [set.id, set])).values()
      );
      console.log("Iterator set:", uniqueTop8Sets)
      */

      //sets.forEach((set, i) => {
      //uniqueTop8Sets.forEach((uniqueTop8Sets, i) => {
      top8Sets.forEach((top8Sets, i) => {
        //console.log("Iterator set:", set)
        console.log("Iteration:", i)
        //console.log("Is this set the Winners final?", top8SetNames.includes(set.fullRoundText))
        //if (top8SetNames.includes(set.fullRoundText)) {
          refsArray.current[i]?.setDataFromApi(top8Sets);
          refsArray.current[i]?.generateThumbnail();
          //thumbnailGeneratorCounter++;
        //}
      });
    } catch (err) {
      console.error("Failed to fetch sets", err);
      alert("Error fetching tournament data. Check the slug or URL.");
    }
    setLoading(false);
  }

  const handleGenerateThumbnails = async () => {
    for (let i = 0; i < thumbnailCount; i++) {
      const ref = refsArray.current[i];
      if (!ref) continue;

      ref.generateThumbnail();
      await new Promise((res) => setTimeout(res, 150)); //Wait to ensure canvas updated
    }
  }

  
  const downloadAllThumbnailsAsZip = async () => {
    //const refs = [ref1, ref2, ref3];
    const zip = new JSZip();

    for (let i = 0; i < thumbnailCount; i++) {
      const ref = refsArray.current[i];
      if (!ref) continue;

      ref.generateThumbnail();
      await new Promise((res) => setTimeout(res, 150)); //Wait to ensure canvas updated

      const dataURL = ref.getCanvasDataURL();
      if (dataURL) {
        const base64 = dataURL.split(',')[1];
        zip.file(`thumbnail_${i + 1}.png`, base64, { base64: true });
      }
    }


    /*
    refs.forEach((ref, index) => {
      // Trigger thumbnail generation
      ref.current.generateThumbnail();
    });

    // Slight delay to ensure rendering is done
    setTimeout(async () => {
      const zip = new  JSZip();

      refs.forEach((ref, index) => {
        const dataURL = ref.current?.getCanvasDataURL();
        if (dataURL) {
          /*
          const link = document.createElement("a");
          link.href = dataURL;
          link.download = `thumbnail_${index + 1}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
        }
        const base64 = dataURL.split(',')[1]; // strip off 'data:image/png;base64,'
        zip.file(`thumbnail_${index + 1}.png`, base64, { base64: true });
      })
    
    // Step 3: Generate and download the zip file
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "thumbnails.zip");
    }, 500); // adjust delay if needed
    */
    const blob = await zip.generateAsync({ type: "blob" })
    saveAs(blob, "thumbnails.zip")
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Thumbnail generator</h1>

      <input
        type="text"
        value={tournamentSlug}
        onChange={(e) => setTournamentSlug(e.target.value)}
        placeholder="Paste tournament URL or slug (e.g., tournament/nidhoggur-2025)"
        style={{ width: "400px", padding: "8px"}}
      />

      <button onClick={handleFetchTournamentData} disabled={loading} style={{ marginLeft: "10px" }}>
        {loading ? "Loading..." : "Fetch Data & Generate Thumbnails"}
      </button>

      <button onClick={handleGenerateThumbnails} disabled={loading} style={{ marginLeft: "10px" }}>
        {loading ? "Loading..." : "Generate Thumbnails"}
      </button>

      <br /> <br />
      <button onClick={downloadAllThumbnailsAsZip}>Download all thumbnails</button>

      <hr />

      {Array.from({ length: thumbnailCount }).map((_, i) => (
        <ThumbnailMakerOld key={i} ref={(el) => (refsArray.current[i] = el)} />
      ))}

    </div>
  )

  /*
  useEffect(() => {
    getTop8Sets("tournament/nidhoggur-2025") // Example slug
      .then((sets) => {
        sets.forEach((set, i) => {
          refsArray.current[i]?.setDataFromApi(set);
        });
      })
      .catch(console.error);
  }, []);
  */

  /*
  return (
    <div>

      <button onClick={generateAllThumbnails}>Generate all thumbnails</button>
      <button onClick={downloadAllThumbnailsAsZip}>Download All Thumbnails</button>

      
      <ThumbnailMakerOld ref={ref1}/>
      <ThumbnailMakerOld ref={ref2}/>
      <ThumbnailMakerOld ref={ref3}/> 

      <h1>All Thumbnails</h1>
      {Array.from({ length: thumbnailCount }).map((_, i) => (
        <ThumbnailMakerOld key={i} ref={(el) => (refsArray.current[i] = el)} />
      ))}
    </div>

    
  )
    */
}

export default App;