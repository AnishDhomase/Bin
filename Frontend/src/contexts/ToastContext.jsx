import { useContext, useState, createContext } from "react";

export const ToastDataContext = createContext();

const ToastContext = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const open = (component, timeout = 5000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, component, timeout, closing: false }]);
    setTimeout(() => close(id), timeout);
  };

  const close = (id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, closing: true } : t))
    );

    // Remove from DOM after exit animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 500); // matches toastOut duration
  };

  return (
    <ToastDataContext.Provider value={{ open, close }}>
      {children}
      <div className="space-y-3 fixed bottom-4 right-4 z-5000">
        {toasts.map(({ id, component, timeout, closing }) => (
          <div
            key={id}
            className={`
              relative min-w-[250px] max-w-sm
              ${
                closing
                  ? "animate-[toastOut_0.5s_ease-in_forwards]"
                  : "animate-[toastIn_0.5s_ease-out]"
              }
            `}
          >
            <div className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative">
              <button
                onClick={() => close(id)}
                className="absolute top-2 right-2 p-1 rounded-md transition cursor-pointer"
              >
                <i className="ri-close-large-line text-gray-700 text-lg"></i>
              </button>

              {component}

              <div
                className="absolute bottom-0 left-0 h-[3px] rounded-full bg-gradient-to-r from-[#4294FF] to-[#376CFB]"
                style={{
                  animationDuration: `${timeout}ms`,
                  animationName: `borderShrink`,
                  animationTimingFunction: "linear",
                  animationFillMode: "forwards",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes borderShrink {
            0% { width: 100%; }
            100% { width: 0%; }
          }

          @keyframes toastIn {
            0% { transform: translateY(100%) scale(0.9); opacity: 0; }
            50% { transform: translateY(-5%) scale(1.05); opacity: 1; }
            70% { transform: translateY(3%) scale(0.98); }
            100% { transform: translateY(0) scale(1); }
          }

          @keyframes toastOut {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            20% { transform: translateY(-5%) scale(1.02); }
            100% { transform: translateY(100%) scale(0.9); opacity: 0; }
          }
        `}
      </style>
    </ToastDataContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastDataContext);
  if (context === undefined) {
    throw new Error("useToast must be used within ToastContext");
  }
  return context;
};

export default ToastContext;
