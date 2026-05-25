"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2200,
        style: {
          border: "1px solid rgba(148, 163, 184, 0.24)",
          borderRadius: "16px",
          background: "#0f172a",
          color: "#fff",
          fontSize: "14px",
        },
      }}
    />
  );
}
