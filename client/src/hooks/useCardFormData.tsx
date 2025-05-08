import { useState, useEffect } from 'react';

type CardFormData = {
  id: number;
  nome: string;
  foto: string;
  matricula: string;
  curso: string;
  dataNascimento: string;
  validade: string;
  cpf: string;
  qrId: string;
};

const STORAGE_KEY = 'carteirinha_form_data';

export default function useCardFormData() {
  const [formData, setFormData] = useState<CardFormData | null>(null);

  // Carregar dados salvos do localStorage quando o hook é montado
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Salvar dados do formulário
  const saveFormData = (data: CardFormData) => {
    setFormData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // Limpar dados salvos
  const clearFormData = () => {
    setFormData(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    formData,
    saveFormData,
    clearFormData,
  };
}
