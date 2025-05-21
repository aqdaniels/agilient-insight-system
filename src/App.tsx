
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import NavigationBar from "./components/navigation/NavigationBar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GenAIAcceleratorManager from "./features/genai/containers/GenAIAcceleratorManager";
import SimulationTabs from "./features/simulation/containers/SimulationTabs";
import CortexIntegration from "./features/integration/containers/CortexIntegration";
import TeamConfigurator from "./features/team/containers/TeamConfigurator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <BrowserRouter>
          <NavigationBar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/genai" element={<GenAIAcceleratorManager />} />
            <Route path="/simulation" element={<SimulationTabs />} />
            <Route path="/integration/cortex" element={<CortexIntegration />} />
            <Route path="/team" element={<TeamConfigurator />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
