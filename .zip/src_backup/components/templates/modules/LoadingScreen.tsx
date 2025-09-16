import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@components/theme/ui/card";
import { ProgressBar } from "@components/theme/ui/progress-bar";

interface LoadingScreenProps {
  progress?: number;
  status?: string;
  title?: string;
  isDark?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress = 0,
  status = "Инициализация...",
  title = "Анализ товара",
  isDark = false
}) => {
  return (
    <Card className={`w-full max-w-md mx-auto ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold"
          >
            {title}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <Loader2 className={`h-12 w-12 animate-spin ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
            <div className="text-center text-gray-500 dark:text-gray-400">
              {status}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ProgressBar
              value={progress}
              className={`w-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
            />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingScreen;