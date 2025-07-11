export {};


//Keep this alligned in order to prevents ts typing errors
declare global {
  interface Window {
    api: {
      minimize: () => void;
      close: () => void;
    };
  }
}