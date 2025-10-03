-- Migration: add transfer_requests, transfer_events, trusted_contacts tables + RPC perform_ticket_transfer

BEGIN;

-- Create transfer_requests table
CREATE TABLE IF NOT EXISTS public.transfer_requests (
  id bigserial PRIMARY KEY,
  tiket_id bigint NOT NULL,
  from_user_id bigint NOT NULL,
  to_user_id bigint NOT NULL,
  status text NOT NULL DEFAULT 'PENDING', -- PENDING|CANCELLED|REJECTED|COMPLETED
  notes text NULL,
  requested_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NULL
);

-- Create transfer_events table (audit)
CREATE TABLE IF NOT EXISTS public.transfer_events (
  id bigserial PRIMARY KEY,
  tiket_id bigint NULL,
  from_user_id bigint NULL,
  to_user_id bigint NULL,
  event_type text NOT NULL,
  metadata jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create trusted_contacts table
CREATE TABLE IF NOT EXISTS public.trusted_contacts (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL,
  contact_user_id bigint NOT NULL,
  status text NOT NULL DEFAULT 'PENDING', -- PENDING|VERIFIED|REVOKED
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, contact_user_id)
);

-- (Optional) Indexes
CREATE INDEX IF NOT EXISTS idx_transfer_events_from_user_created_at ON public.transfer_events (from_user_id, created_at);

-- RPC: perform_ticket_transfer
-- This function performs validation and then updates ticket ownership and marks request completed in a single transaction
CREATE OR REPLACE FUNCTION public.perform_ticket_transfer(req_id bigint, performed_by bigint)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  req_row RECORD;
  t_row RECORD;
BEGIN
  SELECT * INTO req_row FROM public.transfer_requests WHERE id = req_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'transfer request % not found', req_id;
  END IF;

  IF req_row.status <> 'PENDING' THEN
    RAISE EXCEPTION 'transfer request % not pending (status=%)', req_id, req_row.status;
  END IF;

  SELECT * INTO t_row FROM public.tiket WHERE id = req_row.tiket_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'tiket % not found', req_row.tiket_id;
  END IF;

  -- Basic ownership check: ensure tiket owned by from_user_id
  IF t_row.pengguna_id IS DISTINCT FROM req_row.from_user_id THEN
    RAISE EXCEPTION 'tiket % not owned by user %', req_row.tiket_id, req_row.from_user_id;
  END IF;

  -- Update tiket owner
  UPDATE public.tiket SET pengguna_id = req_row.to_user_id, updated_at = now() WHERE id = req_row.tiket_id;

  -- Mark request completed
  UPDATE public.transfer_requests SET status = 'COMPLETED' WHERE id = req_id;

  -- Insert audit event
  INSERT INTO public.transfer_events (tiket_id, from_user_id, to_user_id, event_type, metadata, created_at)
  VALUES (req_row.tiket_id, req_row.from_user_id, req_row.to_user_id, 'TRANSFER_COMPLETE', jsonb_build_object('performed_by', performed_by), now());

  RETURN jsonb_build_object('ok', true, 'tiket_id', req_row.tiket_id, 'from', req_row.from_user_id, 'to', req_row.to_user_id);
END;
$$;

COMMIT;
