"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [hasMounted, setHasMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const isDark = localStorage.getItem("theme") === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  if (!hasMounted) return null;

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDark);
  };

  return (
    <button onClick={toggle} className="text-xl hover:scale-110 transition">
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
