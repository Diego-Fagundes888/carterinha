import { motion } from 'framer-motion';
import { useState } from 'react';
import CardForm from '@/components/CardForm';
import StudentCard from '@/components/StudentCard';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Scan, School, ShieldCheck } from "lucide-react";

// Animações para elementos que entrarão na tela
const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Home() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 py-10"
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="animated-gradient-text mb-6">
            Sistema de Carteirinha Digital
          </h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Sua identificação estudantil digital de forma rápida, segura e acessível a qualquer momento através do QR Code.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button size="lg" className="relative overflow-hidden group bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all duration-300 shadow-lg">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  <span className="material-icons mr-2 group-hover:animate-pulse">add_card</span>
                  Gerar Nova Carteirinha
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] glassmorphism">
              <DialogTitle className="text-2xl animated-gradient-text">Formulário de Carteirinha</DialogTitle>
              <DialogDescription className="text-muted-foreground text-base">
                Preencha os dados para gerar sua carteirinha digital estudantil.
              </DialogDescription>
              <CardForm onSuccessfulSubmit={() => setOpenDialog(false)} />
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div 
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
      >
        <motion.div variants={itemAnimation}>
          <Card className="card-hover-effect h-full border-border/40">
            <CardContent className="pt-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Segurança Garantida</h3>
              <p className="text-muted-foreground">
                Proteção com QR Code único para validação e verificação instantânea.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemAnimation}>
          <Card className="card-hover-effect h-full border-border/40">
            <CardContent className="pt-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <School className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Identificação Oficial</h3>
              <p className="text-muted-foreground">
                Documento digital oficial para comprovar seu vínculo estudantil.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemAnimation}>
          <Card className="card-hover-effect h-full border-border/40">
            <CardContent className="pt-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scan className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fácil Validação</h3>
              <p className="text-muted-foreground">
                Verificações rápidas através de QR Code para confirmar autenticidade.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Exemplo de carteirinha */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-xl border border-border/30 shadow-sm"
      >
        <h3 className="text-2xl font-bold text-center mb-8 animated-gradient-text">
          Modelo de Carteirinha
        </h3>
        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <StudentCard
              example={true}
              student={{
                id: 0,
                nome: "Maria Silva Santos",
                foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=192&h=256",
                matricula: "20230015489",
                curso: "Engenharia de Software",
                validade: new Date("2024-12-31"),
                dataNascimento: new Date("1998-04-15"),
                cpf: "123.456.789-00",
                qrId: "exemplo123",
                createdAt: new Date("2023-05-10")
              }}
            />
          </div>
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <BadgeCheck className="h-4 w-4 text-accent mr-2" />
            <span>Exemplo de carteirinha digital oficial</span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
