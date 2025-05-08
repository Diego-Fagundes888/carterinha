import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Definição da tabela de carteirinhas
export const carteirinhas = pgTable("carteirinhas", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  foto: text("foto").notNull(), // URL ou base64 da imagem
  matricula: varchar("matricula", { length: 20 }).notNull(),
  curso: text("curso").notNull(),
  instituicao: text("instituicao").default("Universidade Exemplo"),
  validade: timestamp("validade").notNull(),
  dataNascimento: timestamp("data_nascimento").notNull(),
  cpf: varchar("cpf", { length: 14 }).notNull(),
  qrId: varchar("qr_id", { length: 20 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema para inserção
export const insertCarteirinhaSchema = createInsertSchema(carteirinhas).omit({
  id: true,
  createdAt: true,
});

// Schema para validação com regras adicionais
export const carteirinhaValidationSchema = insertCarteirinhaSchema.extend({
  nome: z.string().min(5, "O nome completo deve ter no mínimo 5 caracteres"),
  foto: z.string().min(1, "A foto é obrigatória"),
  matricula: z.string().min(4, "A matrícula deve ter no mínimo 4 caracteres"),
  curso: z.string().min(3, "O curso deve ter no mínimo 3 caracteres"),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato 000.000.000-00"),
});

// Schema para pesquisa e filtros
export const carteirinhaQuerySchema = z.object({
  nome: z.string().optional(),
  matricula: z.string().optional(),
  curso: z.string().optional(),
  validade: z.enum(["valid", "expired", "expiring", "todas"]).optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});

// Tipos derivados dos schemas
export type InsertCarteirinha = z.infer<typeof insertCarteirinhaSchema>;
export type CarteirinhaValidation = z.infer<typeof carteirinhaValidationSchema>;
export type CarteirinhaQuery = z.infer<typeof carteirinhaQuerySchema>;
export type Carteirinha = typeof carteirinhas.$inferSelect;
