import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_PASSWORD = "admin123";

export default function App() {
  const [page, setPage] = useState("home");
  const [artworks, setArtworks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Painting");
  const [image, setImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem("artworks");
    if (saved) setArtworks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("artworks", JSON.stringify(artworks));
  }, [artworks]);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const addArtwork = () => {
    if (!title || !image) return;
    const newArt = {
      id: Date.now(),
      title,
      category,
      image
    };
    setArtworks([newArt, ...artworks]);
    setTitle("");
    setImage(null);
  };

  const deleteArtwork = (id) => {
    setArtworks(artworks.filter((a) => a.id !== id));
  };

  const categories = [
    "All",
    ...new Set(artworks.map((a) => a.category))
  ];

  const filtered =
    activeCategory === "All"
      ? artworks
      : artworks.filter((a) => a.category === activeCategory);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: 40 }}>
      <h1 style={{ fontSize: 32 }}>Artist Brand</h1>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("gallery")}>Gallery</button>
        {!isAdmin && <button onClick={() => setPage("login")}>Admin</button>}
      </div>

      {page === "login" && !isAdmin && (
        <div style={{ marginTop: 20 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => {
              if (password === ADMIN_PASSWORD) setIsAdmin(true);
            }}
          >
            Login
          </button>
        </div>
      )}

      {page === "gallery" && (
        <div style={{ marginTop: 40 }}>
          {isAdmin && (
            <div style={{ marginBottom: 40 }}>
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
              <button onClick={addArtwork}>Add</button>
            </div>
          )}

          <div>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 40 }}>
            <AnimatePresence>
              {filtered.map((art) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ marginBottom: 20 }}
                >
                  <img src={art.image} width="300" />
                  <p>{art.title}</p>
                  {isAdmin && (
                    <button onClick={() => deleteArtwork(art.id)}>Delete</button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
