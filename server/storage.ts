import { carteirinhas, Carteirinha, InsertCarteirinha, CarteirinhaQuery } from "@shared/schema";
import { randomBytes } from "crypto";

// Interface de armazenamento para todas as operações CRUD
export interface IStorage {
  // Criar carteirinha
  createCarteirinha(carteirinha: InsertCarteirinha): Promise<Carteirinha>;
  
  // Buscar carteirinha por ID
  getCarteirinha(id: number): Promise<Carteirinha | undefined>;
  
  // Buscar carteirinha pelo ID do QR Code
  getCarteirinhaByQrId(qrId: string): Promise<Carteirinha | undefined>;
  
  // Listar carteirinhas com paginação e filtros
  listCarteirinhas(query: CarteirinhaQuery): Promise<{
    data: Carteirinha[];
    total: number;
    page: number; 
    limit: number;
    totalPages: number;
  }>;
  
  // Excluir carteirinha
  deleteCarteirinha(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private carteirinhas: Map<number, Carteirinha>;
  private currentId: number;

  constructor() {
    this.carteirinhas = new Map();
    this.currentId = 1;
  }

  async createCarteirinha(carteirinha: InsertCarteirinha): Promise<Carteirinha> {
    const id = this.currentId++;
    // Gerar um ID único para o QR code
    const qrId = carteirinha.qrId || randomBytes(10).toString('hex');
    
    const novaCarteirinha: Carteirinha = {
      ...carteirinha,
      id,
      qrId,
      createdAt: new Date(),
    };
    
    this.carteirinhas.set(id, novaCarteirinha);
    return novaCarteirinha;
  }

  async getCarteirinha(id: number): Promise<Carteirinha | undefined> {
    return this.carteirinhas.get(id);
  }

  async getCarteirinhaByQrId(qrId: string): Promise<Carteirinha | undefined> {
    return Array.from(this.carteirinhas.values()).find(
      (carteirinha) => carteirinha.qrId === qrId
    );
  }

  async listCarteirinhas(query: CarteirinhaQuery): Promise<{
    data: Carteirinha[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let data = Array.from(this.carteirinhas.values());
    
    // Aplicar filtros
    if (query.nome) {
      data = data.filter(c => 
        c.nome.toLowerCase().includes(query.nome!.toLowerCase())
      );
    }
    
    if (query.matricula) {
      data = data.filter(c => 
        c.matricula.includes(query.matricula!)
      );
    }
    
    if (query.curso) {
      data = data.filter(c => 
        c.curso.toLowerCase().includes(query.curso!.toLowerCase())
      );
    }
    
    if (query.validade) {
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      
      switch (query.validade) {
        case 'valid':
          data = data.filter(c => new Date(c.validade) > now);
          break;
        case 'expired':
          data = data.filter(c => new Date(c.validade) <= now);
          break;
        case 'expiring':
          data = data.filter(c => {
            const validadeDate = new Date(c.validade);
            return validadeDate > now && validadeDate <= thirtyDaysFromNow;
          });
          break;
      }
    }
    
    // Ordenar por data de criação decrescente
    data = data.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const total = data.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);
    
    // Aplicar paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages
    };
  }

  async deleteCarteirinha(id: number): Promise<boolean> {
    return this.carteirinhas.delete(id);
  }
}

export const storage = new MemStorage();
