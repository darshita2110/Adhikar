import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  integer,
  jsonb,
  customType,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Custom pgvector type
// ---------------------------------------------------------------------------
const vector = customType<{ data: number[]; driverData: string }>({
  dataType(config: unknown) {
    const dim = (config as Record<string, unknown>)?.dim ?? 1536;
    return `vector(${dim})`;
  },
  fromDriver(value: string): number[] {
    // pgvector returns "[0.1,0.2,...]"
    return value
      .replace(/^\[/, "")
      .replace(/\]$/, "")
      .split(",")
      .map(Number);
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
});

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// conversations
// ---------------------------------------------------------------------------
export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }).default("New Conversation"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// messages
// ---------------------------------------------------------------------------
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  tokenCount: integer("token_count"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// documents
// ---------------------------------------------------------------------------
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  filename: varchar("filename", { length: 500 }).notNull(),
  fileUrl: text("file_url").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  sizeBytes: integer("size_bytes"),
  status: varchar("status", { length: 50 }).default("pending"), // pending | processing | ready | error
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// legal_chunks  (RAG chunks with pgvector embeddings)
// ---------------------------------------------------------------------------
export const legalChunks = pgTable("legal_chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  // 1536-dim vector for text-embedding-3-small / ada-002
  embedding: vector("embedding", { dim: 1536 } as Record<string, unknown>),
  chunkIndex: integer("chunk_index").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------
export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversations),
  documents: many(documents),
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [conversations.userId],
      references: [users.id],
    }),
    messages: many(messages),
  })
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
  legalChunks: many(legalChunks),
}));

export const legalChunksRelations = relations(legalChunks, ({ one }) => ({
  document: one(documents, {
    fields: [legalChunks.documentId],
    references: [documents.id],
  }),
}));

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type LegalChunk = typeof legalChunks.$inferSelect;
export type NewLegalChunk = typeof legalChunks.$inferInsert;
