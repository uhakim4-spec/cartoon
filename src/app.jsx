import React, { useState, useEffect } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000";

  // --- Upload & AI process ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Choose a file first");
    if (!prompt) return alert("Write a task for the AI");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      fd.append("prompt", prompt);

      const res = await fetch(`${API}/cartoonize`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (!data.ok) throw new Error(data.error || "Upload failed");
      setResultUrl(data.url);

      // refresh gallery after upload
      loadGallery();
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Load gallery ---
  const loadGallery = async () => {
    try {
      const res = await fetch(`${API}/gallery`);
      const data = await res.json();
      if (data.ok) setGallery(data.items);
    } catch (err) {
      console.error("Gallery load failed", err);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>✨ AI Photo Assistant</h1>

      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <br />
        <input
          type="text"
          placeholder="e.g. Make it Pixar style"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "100%", marginTop: 10 }}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Send to AI"}
        </button>
      </form>

      {resultUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>Latest Result</h3>
          <img src={resultUrl} alt="AI result" style={{ maxWidth: 400 }} />
        </div>
      )}

      <hr />
      <h3>📂 Gallery</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {gallery.length === 0 && <p>No images yet.</p>}
        {gallery.map((url, idx) => (
          <div key={idx} style={{ width: 150 }}>
            <a href={url} target="_blank" rel="noreferrer">
              <img src={url} alt="" style={{ width: "100%", borderRadius: 8 }} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
