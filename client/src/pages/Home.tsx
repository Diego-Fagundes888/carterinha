import { motion } from 'framer-motion';
import { useState } from 'react';
import CardForm from '@/components/CardForm';
import StudentCard from '@/components/StudentCard';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

export default function Home() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto text-center"
    >
      <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
        Bem-vindo ao Sistema de Carteirinha Digital
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Gere sua carteirinha digital de estudante de forma rápida e segura.
        A carteirinha pode ser acessada a qualquer momento e validada através do QR Code.
      </p>
      <div className="mt-8">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button size="lg" className="flex items-center justify-center mx-auto group">
              <span className="material-icons mr-2 group-hover:animate-pulse">add_card</span>
              Gerar Nova Carteirinha
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogTitle>Formulário de Carteirinha</DialogTitle>
            <DialogDescription>
              Preencha os dados para gerar sua carteirinha digital.
            </DialogDescription>
            <CardForm onSuccessfulSubmit={() => setOpenDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Exemplo de carteirinha */}
      <div className="mt-16">
        <h3 className="text-xl font-heading font-semibold text-gray-800 mb-6">
          Modelo de Carteirinha
        </h3>
        <div className="card-container max-w-md mx-auto">
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
      </div>
    </motion.section>
  );
}
