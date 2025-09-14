"use client";

import { useState } from "react";
import { Appbar } from "./Appbar";

export function AppbarWrapper() {
  const [darkMode, setDarkMode] = useState(true);
  return <Appbar darkMode={darkMode} setDarkMode={setDarkMode} />;
}
