import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
          success: {
            style: { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' },
            iconTheme: { primary: '#10b981', secondary: '#ecfdf5' },
          },
          error: {
            style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
            iconTheme: { primary: '#ef4444', secondary: '#fef2f2' },
          },
        }}
      />
    </>
  );
}

export default App;
