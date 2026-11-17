-- Table dédiée aux paiements PawaPay (Bridal MasterClass). MyCoolPay reste
-- inchangé (100% client-side, sans persistance) ; cette table ne reçoit pour
-- l'instant que les paiements PawaPay.
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_label TEXT NOT NULL,
  full_name TEXT NOT NULL,
  country_iso2 TEXT NOT NULL,
  phone TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  payment_provider TEXT NOT NULL,
  payment_reference TEXT NOT NULL,
  correspondent TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  raw_callback JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.payments TO service_role;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX payments_reference_idx ON public.payments (payment_provider, payment_reference);

-- public.set_updated_at() est déjà créée par la migration `registrations`.
CREATE TRIGGER payments_set_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
