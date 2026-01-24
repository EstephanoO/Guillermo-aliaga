import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const forms = pgTable("forms", {
  id: uuid("id").defaultRandom().primaryKey(),
  nombre: text("nombre").notNull(),
  telefono: text("telefono").notNull(),
  fecha: timestamp("fecha", { withTimezone: true }).notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  zona: text("zona").notNull(),
  candidate: text("candidate").notNull(),
  fotoUrl: text("foto_url"),
});

export type FormRow = typeof forms.$inferSelect;
