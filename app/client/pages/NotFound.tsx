// path: src/components/pages/NotFound.tsx
import { AlertTriangle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button.tsx";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-foreground mb-2">404 — Страница не найдена</h1>
      <p className="text-muted-foreground mb-6">Упс! Похоже, вы перешли по несуществующему адресу или данные отсутствуют.</p>
      <Button onClick={() => navigate("/")}>Вернуться на главную</Button>
    </div>
  );
};

export default NotFound;
