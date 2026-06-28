import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, Copy, Trash2, Check } from "lucide-react";

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem("urls");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("urls", JSON.stringify(links));
  }, [links]);

  const shortenUrl = async () => {
    if (!url.trim()) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `https://tinyurl.com/api-create.php?url=${url}`,
      );

      const newLink = {
        id: Date.now(),
        original: url,
        short: res.data,
      };

      setLinks([newLink, ...links]);
      setUrl("");
    } catch (err) {
      alert("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (short) => {
    navigator.clipboard.writeText(short);
    setCopied(short);

    setTimeout(() => {
      setCopied("");
    }, 2000);
  };

  const deleteLink = (id) => {
    setLinks(links.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-bold text-center mb-10 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
        >
          URL Shortener
        </motion.h1>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Left Panel */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">Shorten URL</h2>

            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 outline-none mb-5"
            />

            <button
              onClick={shortenUrl}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition font-semibold"
            >
              {loading ? "Generating..." : "Shorten URL"}
            </button>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-5 rounded-xl text-center">
                <h3 className="text-3xl font-bold">{links.length}</h3>
                <p className="text-slate-400">Total Links</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl text-center">
                <h3 className="text-3xl font-bold">{links.length}</h3>
                <p className="text-slate-400">Saved</p>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {links.length === 0 && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center text-slate-400">
                No shortened URLs.
              </div>
            )}

            {links.map((item) => (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm mb-2">Original URL</p>

                    <p className="break-all">{item.original}</p>

                    <p className="text-slate-400 text-sm mt-4 mb-2">
                      Short URL
                    </p>

                    <a
                      href={item.short}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 break-all"
                    >
                      {item.short}
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => copyLink(item.short)}
                      className="p-3 rounded-xl bg-indigo-600"
                    >
                      {copied === item.short ? (
                        <Check size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => deleteLink(item.id)}
                      className="p-3 rounded-xl bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
