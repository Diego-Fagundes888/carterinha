import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  carteirinhaValidationSchema, 
  carteirinhaQuerySchema 
} from "@shared/schema";
import multer from "multer";
import path from "path";
import { randomBytes } from "crypto";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Configuração para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(
      new Error(
        "Erro: Apenas imagens nos formatos JPG, JPEG e PNG são permitidas!"
      )
    );
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware para tratar erros de validação
  const validateRequest = (schema: any) => {
    return (req: Request, res: Response, next: any) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ 
            message: 'Erro de validação',
            errors: validationError.details 
          });
        }
        
        return res.status(400).json({ 
          message: 'Erro de validação',
          error: (error as Error).message 
        });
      }
    };
  };

  // API routes
  
  // 1. Criar nova carteirinha
  app.post("/api/carteirinhas", upload.single("foto"), async (req: Request, res: Response) => {
    try {
      // Processar a foto (em um caso real, salvariamos o arquivo)
      let fotoUrl = "";
      
      // Logs detalhados para debug
      console.log("Tipo de conteúdo:", req.headers['content-type']);
      console.log("Campos recebidos na requisição:", Object.keys(req.body));
      console.log("Arquivo recebido:", req.file ? "Sim" : "Não");
      
      // Verificar se o cabeçalho indica que estamos lidando com JSON
      const isJsonRequest = req.headers['content-type']?.includes('application/json');
      console.log("É uma requisição JSON?", isJsonRequest ? "SIM" : "NÃO");
      
      if (isJsonRequest && req.body.fotoBase64) {
        // JSON com foto em base64
        fotoUrl = req.body.fotoBase64;
        console.log("Foto obtida do JSON com comprimento:", fotoUrl.length);
      } else if (req.file) {
        // Converter para base64 (em um ambiente real, seria melhor salvar o arquivo)
        const base64 = req.file.buffer.toString("base64");
        fotoUrl = `data:${req.file.mimetype};base64,${base64}`;
        console.log("Foto processada do arquivo enviado via FormData");
      } else if (req.body.fotoBase64) {
        // Caso a foto já venha como base64 via FormData
        fotoUrl = req.body.fotoBase64;
        console.log("Foto obtida de base64 via FormData com comprimento:", fotoUrl.length);
      } else {
        console.log("Erro: Nenhuma foto encontrada");
        console.log("Campos disponíveis:", Object.keys(req.body).join(", "));
        return res.status(400).json({ message: "A foto é obrigatória" });
      }
      
      // Gerar ID para QR Code
      const qrId = randomBytes(10).toString("hex");
      
      // Formatar as datas
      const validade = new Date(req.body.validade);
      const dataNascimento = new Date(req.body.dataNascimento);
      
      // Validar dados
      const carteirinhaData = {
        nome: req.body.nome,
        foto: fotoUrl,
        matricula: req.body.matricula,
        curso: req.body.curso,
        validade,
        dataNascimento,
        cpf: req.body.cpf,
        qrId,
      };
      
      // Validar dados com o schema
      carteirinhaValidationSchema.parse(carteirinhaData);
      
      // Salvar no storage
      const carteirinha = await storage.createCarteirinha(carteirinhaData);
      
      res.status(201).json(carteirinha);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: 'Erro de validação',
          errors: validationError.details 
        });
      }
      
      console.error("Erro ao criar carteirinha:", error);
      res.status(500).json({ message: "Erro ao criar carteirinha", error: (error as Error).message });
    }
  });
  
  // 2. Obter carteirinha por ID
  app.get("/api/carteirinhas/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      
      const carteirinha = await storage.getCarteirinha(id);
      if (!carteirinha) {
        return res.status(404).json({ message: "Carteirinha não encontrada" });
      }
      
      res.json(carteirinha);
    } catch (error) {
      console.error("Erro ao buscar carteirinha:", error);
      res.status(500).json({ message: "Erro ao buscar carteirinha", error: (error as Error).message });
    }
  });
  
  // 3. Verificar carteirinha por QR ID
  app.get("/api/verificar/:qrId", async (req: Request, res: Response) => {
    try {
      const qrId = req.params.qrId;
      const carteirinha = await storage.getCarteirinhaByQrId(qrId);
      
      if (!carteirinha) {
        return res.status(404).json({ 
          valid: false,
          message: "Carteirinha não encontrada" 
        });
      }
      
      // Verificar validade
      const now = new Date();
      const validade = new Date(carteirinha.validade);
      const isValid = validade > now;
      
      if (!isValid) {
        return res.json({
          valid: false,
          message: "Carteirinha expirada",
          carteirinha
        });
      }
      
      res.json({
        valid: true,
        message: "Carteirinha válida",
        carteirinha
      });
    } catch (error) {
      console.error("Erro ao verificar carteirinha:", error);
      res.status(500).json({ 
        valid: false,
        message: "Erro ao verificar carteirinha", 
        error: (error as Error).message 
      });
    }
  });
  
  // 4. Listar carteirinhas (com filtros e paginação)
  app.get("/api/carteirinhas", async (req: Request, res: Response) => {
    try {
      // Validar e extrair query params
      const queryParams = carteirinhaQuerySchema.parse({
        nome: req.query.nome as string | undefined,
        matricula: req.query.matricula as string | undefined,
        curso: req.query.curso as string | undefined,
        validade: req.query.validade as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10
      });
      
      const result = await storage.listCarteirinhas(queryParams);
      res.json(result);
    } catch (error) {
      console.error("Erro ao listar carteirinhas:", error);
      res.status(500).json({ message: "Erro ao listar carteirinhas", error: (error as Error).message });
    }
  });
  
  // 5. Excluir carteirinha
  app.delete("/api/carteirinhas/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      
      const carteirinha = await storage.getCarteirinha(id);
      if (!carteirinha) {
        return res.status(404).json({ message: "Carteirinha não encontrada" });
      }
      
      const deleted = await storage.deleteCarteirinha(id);
      if (!deleted) {
        return res.status(500).json({ message: "Erro ao excluir carteirinha" });
      }
      
      res.json({ message: "Carteirinha excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir carteirinha:", error);
      res.status(500).json({ message: "Erro ao excluir carteirinha", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
