import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import React from 'react';

interface SuggestionListProps {
  suggestions: string[];
  highlightedIndex: number;
  onSelect: (suggestion: string) => void;
  onMouseEnter: (index: number) => void;
  isVisible: boolean;
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  highlightedIndex,
  onSelect,
  onMouseEnter,
  isVisible,
}) => (
  <AnimatePresence>
    {isVisible && suggestions.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute z-50 mt-1 w-full rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto"
        role="listbox"
        aria-label="Предложения поиска"
      >
        {suggestions.map((suggestion, index) => (
          <div
            key={`${suggestion}-${index}`}
            className={`px-4 py-2 cursor-pointer text-sm flex items-center ${
              index === highlightedIndex ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            role="option"
            aria-selected={index === highlightedIndex}
            tabIndex={0}
            onClick={() => onSelect(suggestion)}
            onMouseEnter={() => onMouseEnter(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(suggestion);
              }
            }}
          >
            <Search className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{suggestion}</span>
          </div>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);
