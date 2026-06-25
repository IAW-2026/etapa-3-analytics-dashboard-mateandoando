// app/components/RefreshButtonShipping.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh(); 
    
    // Apagamos la animación después de 1 segundo
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleRefresh}
      className="bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
      title="Sincronizar datos"
    >
      <svg 
        className={`w-3.5 h-3.5 text-[#1E3F20] ${isRefreshing ? "animate-spin" : ""}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
      </svg>
      Sincronizar
    </button>
  );
}