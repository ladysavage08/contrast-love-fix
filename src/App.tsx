import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Counties from "./pages/Counties.tsx";
import CountyPage from "./pages/CountyPage.tsx";
import Programs from "./pages/Programs.tsx";
import ProgramPage from "./pages/ProgramPage.tsx";
import EnvironmentalHealth from "./pages/EnvironmentalHealth.tsx";
import EnvironmentalHealthPage from "./pages/EnvironmentalHealthPage.tsx";
import WomensHealth from "./pages/WomensHealth.tsx";
import WomensHealthPage from "./pages/WomensHealthPage.tsx";
import News from "./pages/News.tsx";
import NewsPost from "./pages/NewsPost.tsx";
import Services from "./pages/Services.tsx";
import Directory from "./pages/Directory.tsx";
import Auth from "./pages/Auth.tsx";
import Wic from "./pages/Wic.tsx";
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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/counties" element={<Counties />} />
          <Route path="/counties/:slug" element={<CountyPage />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:slug" element={<ProgramPage />} />
          <Route path="/environmental-health" element={<EnvironmentalHealth />} />
          <Route path="/environmental-health/:slug" element={<EnvironmentalHealthPage />} />
          <Route path="/womens-health" element={<WomensHealth />} />
          <Route path="/womens-health/:slug" element={<WomensHealthPage />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsPost />} />
          <Route path="/services" element={<Services />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/wic" element={<Wic />} />
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
