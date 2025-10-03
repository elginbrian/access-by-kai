-- Migration: extend transfer_requests with acceptance and waiting fields

BEGIN;

ALTER TABLE IF EXISTS public.transfer_requests
  ADD COLUMN IF NOT EXISTS from_accepted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS to_accepted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS accepted_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS waiting_period_seconds integer NULL;

COMMIT;
