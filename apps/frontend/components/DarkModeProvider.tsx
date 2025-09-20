// "use client";

// import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";

// // Context type
// interface DarkModeContextType {
//   isDarkMode: boolean;
//   toggle: () => void;
// }

// // Create context
// const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// // Hook to use dark mode in any component
// export function useDarkMode() {
//   const context = useContext(DarkModeContext);
//   if (!context) throw new Error("useDarkMode must be used within DarkModeProvider");
//   return context;
// }

// // Provider component
// export function DarkModeProvider({ children }: { children: ReactNode }) {
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   const toggle = () => setIsDarkMode(prev => !prev);

//   // Sync with <html>
//   useEffect(() => {
//     if (isDarkMode) document.documentElement.classList.add("dark");
//     else document.documentElement.classList.remove("dark");
//   }, [isDarkMode]);

//   return (
//     <DarkModeContext.Provider value={{ isDarkMode, toggle }}>
//       {children}
//     </DarkModeContext.Provider>
//   );
// }
