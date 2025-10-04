// Logging utility functions
export const log = (message: string) => {
  console.log();
};

export const error = (message: string, error?: Error) => {
  console.error(message, error || '');
};
