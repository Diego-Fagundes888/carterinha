import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-xl bg-white">
        <div className="p-6">
          <div className="bg-red-50 p-4 rounded-xl mb-5">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-200 animate-ping opacity-30"></div>
                <div className="relative bg-red-100 p-4 rounded-full border border-red-200">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>
            
            <AlertDialogHeader className="mt-4 text-center">
              <AlertDialogTitle className="text-xl font-bold text-red-600 mb-1">
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-700">
                Esta ação não pode ser desfeita. Todos os dados desta carteirinha serão permanentemente excluídos do sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Aviso importante:</h4>
            <p className="text-sm text-gray-600">
              Ao excluir esta carteirinha, o estudante não poderá mais utilizá-la para comprovar seu vínculo com a instituição. Tem certeza que deseja prosseguir?
            </p>
          </div>
          
          <AlertDialogFooter className="flex-col md:flex-row space-y-2 md:space-y-0 mt-6">
            <AlertDialogCancel asChild>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full flex items-center justify-center gap-2 font-medium text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                variant="destructive" 
                onClick={onConfirm}
                size="lg"
                className="w-full flex items-center justify-center gap-2 font-medium bg-red-600 hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Permanentemente
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
