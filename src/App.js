import React, { useEffect, useRef, useState } from "react";
import { InputProvider } from "./inputContext";
import InputField from "./inputField";
import ThumbnailMakerOld from "./ThumbnailMakerOld";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getId, getPhaseID, getSets, getSetsByPhaseID, getTop8Sets } from "./startGGApi";



console.log("Logging works");
function App() {
  const refsArray = useRef([]); // Array of refs
  const thumbnailCount = 10;

  const [tournamentSlug, setTournamentSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const top8SetNames = ["Grand Final", "Winners Final", "Winners Semi-Final", "Losers Final", "Losers Semi-Final", "Losers Quarter-Final", "Losers Round 1"]

  const extractSlug = (input) => {
    const match = input.match(/tournament\/([^/]+)\/event\/([^/]+)\/brackets\/(\d+)\/(\d+)/);
    if (match) {
      const tournament = match[1];
      const event = match[2];
      return `tournament/${tournament}/event/${event}`;
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
      
      const phaseID = await getPhaseID(idObject.id)
      console.log("phaseID received:", phaseID);
      const phaseObjects = phaseID.event.phases;
      console.log("Phases names:", phaseObjects)
      const top8Object = phaseObjects.find(phase => phase.name === "Top 8")
      console.log("Top 8 object:", top8Object)
      const top8PhaseID = top8Object.id;

      const top8ByPhaseID = await getSetsByPhaseID(top8PhaseID, pages, perPage);
      const top8SetsByPhaseID = top8ByPhaseID.phase.sets.nodes;
      console.log("Sets recieved by top 8 ID:", top8SetsByPhaseID)

      // Make sure True Grand Finals (Grand Finals Reset) doesn't get a thumbnail
      const top8Sets = top8SetsByPhaseID.filter(set => top8SetNames.includes(set.fullRoundText));
      
      top8Sets.forEach((top8Sets, i) => {
        console.log("Iteration:", i)
        refsArray.current[i]?.setDataFromApi(top8Sets);
        refsArray.current[i]?.generateThumbnail();
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

    const blob = await zip.generateAsync({ type: "blob" })
    saveAs(blob, "thumbnails.zip")
  }

  return (
    <InputProvider>
      <div style={{ padding: "20px" }}>
        <h1>Thumbnail generator</h1>

        <input
          type="text"
          value={tournamentSlug}
          onChange={(e) => setTournamentSlug(e.target.value)}
          placeholder="Paste GGST start.gg URL (e.g. .../tournament/n-h-ggur-26-guilty-gear-strive/event/guilty-gear-strive)"
          style={{ width: "400px", padding: "8px"}}
        />

        <button onClick={handleFetchTournamentData} disabled={loading} style={{ marginLeft: "10px" }}>
          {loading ? "Loading..." : "Fetch Data & Generate Thumbnails"}
        </button>

        <button onClick={handleGenerateThumbnails} disabled={loading} style={{ marginLeft: "10px" }}>
          {loading ? "Loading..." : "Generate Thumbnails"}
        </button>

        <br /> <br />
        <InputField />

        <br /> <br />
        <button onClick={downloadAllThumbnailsAsZip}>Download all thumbnails</button>

        <hr />

        {Array.from({ length: thumbnailCount }).map((_, i) => (
          <ThumbnailMakerOld key={i} ref={(el) => (refsArray.current[i] = el)} />
        ))}

      </div>
    </InputProvider>
  )
}

export default App;