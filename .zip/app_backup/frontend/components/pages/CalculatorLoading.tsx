// path: src/components/pages/CalculatorLoading.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen.tsx";

const CalculatorLoading: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = location.state || {};

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Подготовка...");
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (!productId) {
      navigate("/calculator/form");
      return;
    }

    let isMounted = true;

    const analyze = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/parse-and-calculate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });

        const reader = res.body?.getReader();
        if (!reader) throw new Error("Нет потока");

        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (!isMounted || cancelled) return;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const json = JSON.parse(line);

              if (json.type === "progress") {
                setProgress(json.progress);
                if (json.statusText) setStatusText(json.statusText);
              }

              if (json.type === "done") {
                navigate(`/calculator/results/${productId}`, {
                  state: { results: json.data },
                });
                return;
              }

              if (json.type === "error") {
                navigate("/error", {
                  state: { message: json.message || "Ошибка обработки" },
                });
                return;
              }
            } catch (e) {
              console.warn("Ошибка парсинга JSON:", line, e);
            }
          }
        }
      } catch (e: any) {
        console.error("Ошибка анализа", e);
        navigate("/error", {
          state: { message: e.message || "Ошибка сети" },
        });
      }
    };

    analyze();

    return () => {
      isMounted = false;
    };
  }, [productId, navigate, cancelled]);

  const handleCancel = () => {
    setCancelled(true);
    navigate("/calculator/form");
  };

  return (
    <LoadingScreen
      progress={progress}
      statusText={statusText}
      onCancel={handleCancel}
    />
  );
};

export default CalculatorLoading;
