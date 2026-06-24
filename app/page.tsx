 "use client";

import { useState } from "react";

export default function Home() {
  const [resort, setResort] = useState("");
  const [dates, setDates] = useState("");
  const [kids, setKids] = useState("No");
  const [tripStyle, setTripStyle] = useState("Beach relaxation");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!resort.trim() || !dates.trim()) {
      setResult("Please enter your resort or beach area and your travel dates.");
      return;
    }

    setLoading(true);
    setResult("Researching current seaweed reports and traveler-relevant alternatives...");

    try {
      const response = await fetch("/api/check-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resort,
          dates,
          kids,
          tripStyle
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setResult(data.error || "Something went wrong. Please try again.");
      } else {
        setResult(data.answer || "No answer returned.");
      }
    } catch {
      setResult("The request failed. Please check your deployment settings and API key.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <h1>Is My Cancun Beach Ruined?</h1>
        <p className="subtitle">
          Enter your resort or beach area. The AI researches current web information and gives you a quick seaweed risk, beach verdict, and backup plan.
        </p>
      </section>

      <section className="grid">
        <div className="card">
          <label htmlFor="resort">Resort or beach area</label>
          <input
            id="resort"
            value={resort}
            onChange={(e) => setResort(e.target.value)}
            placeholder="Example: Hyatt Ziva Cancun, Hotel Zone, Playa del Carmen"
          />
          <div className="help">Use a resort name if you already booked. Use an area if you are still choosing.</div>

          <label htmlFor="dates">Travel dates</label>
          <input
            id="dates"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            placeholder="Example: July 10-17, 2026"
          />

          <label htmlFor="kids">Traveling with kids?</label>
          <select id="kids" value={kids} onChange={(e) => setKids(e.target.value)}>
            <option>No</option>
            <option>Yes</option>
          </select>

          <label htmlFor="style">Trip style</label>
          <select id="style" value={tripStyle} onChange={(e) => setTripStyle(e.target.value)}>
            <option>Beach relaxation</option>
            <option>Family with kids</option>
            <option>Romantic trip</option>
            <option>Luxury resort stay</option>
            <option>Nightlife and activities</option>
            <option>Adventure and excursions</option>
          </select>

          <button onClick={submit} disabled={loading}>
            {loading ? "Checking..." : "Check My Beach"}
          </button>

          <div className="disclaimer">
            This tool is for travel planning help, not a guarantee. Seaweed changes quickly with wind, currents, cleanup crews, and exact beach orientation.
          </div>
        </div>

        <div className="card">
          <h2 className="small-title">Your beach briefing</h2>
          <div className={result ? "result" : "result placeholder"}>
            {result || "Your answer will appear here. Try a real resort name for the most useful result."}
          </div>
        </div>
      </section>
    </main>
  );
}
