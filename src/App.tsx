import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Campaigns from "./pages/Campaigns";
import StartCampaign from "./pages/StartCampaign";
import CampaignDetail from "./pages/CampaignDetail";
import Dashboard from "./pages/Dashboard";
import MedicalRecords from "./pages/MedicalRecords";
import NotFound from "./pages/NotFound";
import { Header } from "@/components/ui/Header";
import { SupabaseInitializer } from "@/components/SupabaseInitializer";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    {/* Initialize Supabase storage buckets */}
    <SupabaseInitializer />
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/start-campaign" element={<StartCampaign />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  </TooltipProvider>
);

export default App;
