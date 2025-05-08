import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
      <AlertDialogContent className="max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <span className="material-icons text-red-600 text-4xl">warning</span>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-heading font-bold text-gray-900 mb-2">
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mb-6">
              Tem certeza que deseja excluir esta carteirinha? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="flex justify-center space-x-4 mt-6">
            <AlertDialogCancel asChild>
              <Button variant="outline">
                Cancelar
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={onConfirm}>
                Excluir
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
