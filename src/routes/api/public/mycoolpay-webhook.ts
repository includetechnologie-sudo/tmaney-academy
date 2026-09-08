import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const payloadSchema = z.object({
  application: z.string().optional(),
  app_transaction_ref: z.string().max(200).optional(),
  transaction_ref: z.string().max(200).optional(),
  transaction_status: z.string().max(50).optional(),
  transaction_amount: z.number().optional(),
});

/**
 * Callback MyCoolPay. Le statut annoncé n'est jamais utilisé tel quel :
 * il est revérifié directement auprès de MyCoolPay avant de confirmer.
 */
export const Route = createFileRoute("/api/public/mycoolpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const publicKey = process.env["MYCOOLPAY_PUBLIC_KEY"];
        if (!publicKey) {
          return new Response("Payment provider not configured", { status: 503 });
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid body", { status: 400 });
        }

        const parsed = payloadSchema.safeParse(body);
        if (!parsed.success || !parsed.data.transaction_ref) {
          return new Response("Invalid payload", { status: 400 });
        }

        const { transaction_ref, app_transaction_ref } = parsed.data;

        // Vérification indépendante auprès de MyCoolPay
        const check = await fetch(`https://my-coolpay.com/api/${publicKey}/checkStatus/${transaction_ref}`);
        if (!check.ok) {
          return new Response("Verification failed", { status: 502 });
        }
        const verified = (await check.json()) as {
          status?: string;
          transaction_status?: string;
          transaction_amount?: number;
        };

        const status = (verified.transaction_status ?? "").toUpperCase();
        const paymentStatus =
          status === "SUCCESS"
            ? "paid"
            : status === "CANCELED"
              ? "canceled"
              : status === "FAILED"
                ? "failed"
                : "pending";

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const query = supabaseAdmin
          .from("registrations")
          .update({
            payment_reference: transaction_ref,
            payment_status: paymentStatus,
            status: paymentStatus === "paid" ? "confirmed" : "pending",
          });

        if (app_transaction_ref) {
          await query.eq("id", app_transaction_ref);
        } else {
          await query.eq("payment_reference", transaction_ref);
        }

        return Response.json({ received: true });
      },
    },
  },
});
