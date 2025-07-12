// components/CreditTransactionItem.tsx
"use client";

import { FC, useEffect, useState } from "react";

interface Props {
  amount: number;
  reason: string;
  created_at: string;
}

const CreditTransactionItem: FC<Props> = ({ amount, reason, created_at }) => {
  const isPositive = amount > 0;
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detectar si está en modo oscuro
  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    updateTheme();

    const observer = new MutationObserver(() => updateTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-white/10 backdrop-blur border border-white/20 rounded-lg px-6 py-4 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center transition hover:bg-white/20">
      <div>
        <p
          className={`text-lg font-semibold ${
            isPositive ? "text-green-400" : "text-red-500"
          }`}
        >
          {isPositive ? `+${amount}` : amount} créditos
        </p>
        <p className="text-sm mt-1 text-black dark:text-white">{reason}</p>
      </div>
      <p className="text-sm mt-2 sm:mt-0 text-black dark:text-white">
        {new Date(created_at).toLocaleString()}
      </p>
    </div>
  );
};

export default CreditTransactionItem;
