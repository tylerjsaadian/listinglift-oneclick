import { useState } from "react";

export default function Home() {
  const [beds, setBeds] = useState(3);
  const [baths, setBaths] = useState(2);
  const [sqft, setSqft] = useState(1400);
  const [neighborhood, setNeighborhood] = useState("Mid-City");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [enhancedUrl, setEnhancedUrl] = useState("");

  async function generateCopy() {
    try {
      const res = await fetch("/api/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facts: { beds: Number(beds), baths: Number(baths), sqft: Number(sqft), neighborhood },
          tone: "professional, upbeat"
        })
      });
      const data = await res.json();
      setDesc(data.description || JSON.stringify(data));
    } catch (e) {
      alert("Copy generation failed");
    }
  }

  async function enhanceImage() {
    try {
      if (!file) return alert("Choose a photo first");
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/enhance", { method: "POST", body: form });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setEnhancedUrl(url);
    } catch (e) {
      alert("Enhancement failed");
    }
  }

  return (
    <main style={{maxWidth:960, margin:"40px auto", fontFamily:"system-ui"}}>
      <h1>ListingLift (One-Click)</h1>
      <p>Upload ⇒ Enhance ⇒ Download MLS-ready photos. Plus AI listing descriptions.</p>

      <section style={{marginTop:24, padding:16, border:"1px solid #ddd", borderRadius:8}}>
        <h2>Generate Listing Description</h2>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8}}>
          <input type="number" value={beds} onChange={(e)=>setBeds(e.target.value)} placeholder="Beds"/>
          <input type="number" value={baths} onChange={(e)=>setBaths(e.target.value)} placeholder="Baths"/>
          <input type="number" value={sqft} onChange={(e)=>setSqft(e.target.value)} placeholder="Sqft"/>
          <input value={neighborhood} onChange={(e)=>setNeighborhood(e.target.value)} placeholder="Neighborhood"/>
        </div>
        <button style={{marginTop:12}} onClick={generateCopy}>Generate</button>
        {desc && <pre style={{whiteSpace:"pre-wrap", background:"#fafafa", padding:12, marginTop:12}}>{desc}</pre>}
      </section>

      <section style={{marginTop:24, padding:16, border:"1px solid #ddd", borderRadius:8}}>
        <h2>Enhance Photo</h2>
        <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files[0] || null)}/>
        <button style={{marginLeft:12}} onClick={enhanceImage}>Enhance</button>
        {enhancedUrl && (
          <div style={{marginTop:12}}>
            <img src={enhancedUrl} alt="Enhanced" style={{maxWidth:"100%", border:"1px solid #ddd"}}/>
            <div><a href={enhancedUrl} download="enhanced.jpg">Download enhanced.jpg</a></div>
          </div>
        )}
      </section>
    </main>
  );
}
