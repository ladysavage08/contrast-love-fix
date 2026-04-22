import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import BurkeCounty from "./pages/BurkeCounty.tsx";
import Counties from "./pages/Counties.tsx";
import CountyPage from "./pages/CountyPage.tsx";
import WegoHome from "./pages/wego/WegoHome.tsx";
import WegoAbout from "./pages/wego/WegoAbout.tsx";
import WegoServices from "./pages/wego/WegoServices.tsx";
import WegoSchedule from "./pages/wego/WegoSchedule.tsx";
import WegoFaq from "./pages/wego/WegoFaq.tsx";
import WegoContact from "./pages/wego/WegoContact.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/counties" element={<Counties />} />
          <Route path="/counties/burke" element={<BurkeCounty />} />
          <Route path="/counties/:slug" element={<CountyPage />} />
          <Route path="/wego" element={<WegoHome />} />
          <Route path="/wego/about" element={<WegoAbout />} />
          <Route path="/wego/services" element={<WegoServices />} />
          <Route path="/wego/schedule" element={<WegoSchedule />} />
          <Route path="/wego/faq" element={<WegoFaq />} />
          <Route path="/wego/contact" element={<WegoContact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
