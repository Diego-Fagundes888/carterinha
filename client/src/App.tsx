import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CardDetails from "@/pages/CardDetails";
import VerifyCard from "@/pages/VerifyCard";
import Admin from "@/pages/Admin";
import AdminCardDetails from "@/pages/AdminCardDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AnimatePresence } from "framer-motion";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/carteirinha/:id" component={CardDetails} />
            <Route path="/verificar/:qrId" component={VerifyCard} />
            <Route path="/admin" component={Admin} />
            <Route path="/admin/carteirinha/:id" component={AdminCardDetails} />
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
