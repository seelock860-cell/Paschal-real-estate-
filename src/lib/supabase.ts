import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Property, Enquiry, SupabaseConfig } from '../types/property';

export const DEFAULT_SUPABASE_URL = 'https://tgkgfbllswzvmnefkxiu.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRna2dmYmxsc3d6dm1uZWZreGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MjI2NTQsImV4cCI6MjEwOTE5ODY1NH0.k8nmzUnL82cZ_i61Zvb3-K1fn0ccTQFNvoNuRkyolF8';

export function normalizeSupabaseUrl(url: string): string {
  if (!url) return DEFAULT_SUPABASE_URL;
  let cleaned = url.trim();
  const match = cleaned.match(/^(https:\/\/[a-z0-9-]+\.supabase\.co)/i);
  if (match) {
    return match[1];
  }
  return cleaned.replace(/\/rest\/v1\/?$/i, '').replace(/\/$/, '');
}

let cachedClient: SupabaseClient | null = null;
let currentUrl = '';
let currentKey = '';

export function getSupabaseClient(url?: string, key?: string): SupabaseClient | null {
  const targetUrl = normalizeSupabaseUrl(
    url || 
    localStorage.getItem('paschal_supabase_url') || 
    (typeof process !== 'undefined' && process.env?.SUPABASE_URL) || 
    DEFAULT_SUPABASE_URL
  );
  
  const targetKey = (
    key || 
    localStorage.getItem('paschal_supabase_key') || 
    (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) || 
    DEFAULT_SUPABASE_KEY
  ).trim();

  if (!targetUrl || !targetKey) {
    return null;
  }

  if (cachedClient && currentUrl === targetUrl && currentKey === targetKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(targetUrl, targetKey);
    currentUrl = targetUrl;
    currentKey = targetKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string; tableReady?: boolean }> {
  try {
    const cleanUrl = normalizeSupabaseUrl(url);
    if (!cleanUrl.startsWith('https://') || !cleanUrl.includes('.supabase.co')) {
      return { success: false, message: 'Invalid Supabase Project URL. Format must be: https://your-project-id.supabase.co' };
    }
    if (!key || key.length < 20) {
      return { success: false, message: 'Invalid Supabase Publishable / Anon Key.' };
    }

    const testClient = createClient(cleanUrl, key.trim());
    // Ping public table
    const { data, error } = await testClient.from('properties').select('id').limit(1);

    if (error) {
      // Table doesn't exist yet (PGRST205 or relation does not exist)
      if (
        error.code === 'PGRST205' || 
        error.code === '42P01' || 
        error.message.includes('Could not find the table') || 
        error.message.includes('relation "public.properties" does not exist')
      ) {
        return {
          success: true,
          tableReady: false,
          message: 'Connected to Supabase project (tgkgfbllswzvmnefkxiu) successfully! Connection is live and authenticated. To enable database storage, run the SQL schema script provided below in your Supabase SQL Editor.'
        };
      }
      return { success: false, message: `Supabase authentication/gateway error: ${error.message}` };
    }

    return { 
      success: true, 
      tableReady: true,
      message: 'Connection established and "properties" table verified in Supabase! Real-time database sync is active.' 
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to connect to Supabase.' };
  }
}

export const SUPABASE_SQL_SCHEMA = `-- =========================================================================
-- PASCHAL REALTY - SUPABASE POSTGRESQL SCHEMA & STORAGE CONFIGURATION
-- Run this in your Supabase Project -> SQL Editor -> Click 'Run'
-- Project: https://tgkgfbllswzvmnefkxiu.supabase.co
-- =========================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Create Properties Table
create table if not exists public.properties (
    id text primary key default gen_random_uuid()::text,
    title text not null,
    slug text not null,
    ref_code text not null,
    category text not null,
    city text not null default 'Lagos',
    location text not null,
    neighborhood text not null,
    price_naira bigint not null,
    price_period text not null default 'per year',
    service_charge_naira bigint default 0,
    caution_deposit_percentage integer default 10,
    bedrooms integer not null,
    bathrooms integer not null,
    toilets integer default 0,
    parking_spaces integer default 2,
    area_sqm integer not null,
    furnishing text not null default 'Fully Furnished',
    availability text not null default 'Available',
    featured boolean default false,
    images jsonb not null default '[]'::jsonb,
    description text not null,
    amenities jsonb not null default '[]'::jsonb,
    year_built integer default 2024,
    security_features jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Enquiries Table
create table if not exists public.enquiries (
    id text primary key default gen_random_uuid()::text,
    property_id text references public.properties(id) on delete set null,
    property_title text,
    property_ref_code text,
    full_name text not null,
    email text not null,
    phone text not null,
    preferred_date text,
    preferred_time text,
    budget_range text,
    moving_timeline text,
    message text not null,
    status text not null default 'New',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.properties enable row level security;
alter table public.enquiries enable row level security;

-- 5. Safe idempotent policies for Properties (Public read & write access)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'properties' AND policyname = 'Allow public read access on properties'
    ) THEN
        CREATE POLICY "Allow public read access on properties"
        ON public.properties FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'properties' AND policyname = 'Allow public insert and update on properties'
    ) THEN
        CREATE POLICY "Allow public insert and update on properties"
        ON public.properties FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 6. Safe idempotent policies for Enquiries
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'enquiries' AND policyname = 'Allow anyone to submit enquiries'
    ) THEN
        CREATE POLICY "Allow anyone to submit enquiries"
        ON public.enquiries FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'enquiries' AND policyname = 'Allow read and update on enquiries'
    ) THEN
        CREATE POLICY "Allow read and update on enquiries"
        ON public.enquiries FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'enquiries' AND policyname = 'Allow delete on enquiries'
    ) THEN
        CREATE POLICY "Allow delete on enquiries"
        ON public.enquiries FOR DELETE USING (true);
    END IF;
END $$;

-- 7. Supabase Storage Bucket Configuration
-- Create 'property-images' public bucket for storing property photography
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Safe idempotent storage bucket access policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for Property Images'
    ) THEN
        CREATE POLICY "Public Access for Property Images"
        ON storage.objects FOR SELECT
        USING ( bucket_id = 'property-images' );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow Upload to Property Images'
    ) THEN
        CREATE POLICY "Allow Upload to Property Images"
        ON storage.objects FOR INSERT
        WITH CHECK ( bucket_id = 'property-images' );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow Delete in Property Images'
    ) THEN
        CREATE POLICY "Allow Delete in Property Images"
        ON storage.objects FOR DELETE
        USING ( bucket_id = 'property-images' );
    END IF;
END $$;
`;
