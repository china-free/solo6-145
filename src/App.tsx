import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/ui/Navbar";
import { Wardrobe } from "@/pages/Wardrobe";
import { Outfits } from "@/pages/Outfits";
import { Recommend } from "@/pages/Recommend";
import { Stats } from "@/pages/Stats";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Wardrobe />} />
            <Route path="/outfits" element={<Outfits />} />
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
