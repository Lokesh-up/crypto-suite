import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Header } from "./components/Header";
import Index from "./pages/Index";
import MorsePage from "./pages/MorsePage";
import SymmetricPage from "./pages/SymmetricPage";
import AsymmetricPage from "./pages/AsymmetricPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/morse" element={<MorsePage />} />
                <Route path="/symmetric" element={<SymmetricPage />} />
                <Route path="/asymmetric" element={<AsymmetricPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
