import type { ReactNode } from 'react';
import type { ServerFunctionClient } from 'payload';
import config from '@payload-config';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import '@payloadcms/next/css';
import '@/styles/hr.css';
import { importMap } from './hr/importMap';

export const metadata = { robots: { index: false, follow: false } };
const serverFunction: ServerFunctionClient = async (args) => {
  'use server';
  return handleServerFunctions({ ...args, config, importMap });
};
export default function HRLayout({ children }: { children: ReactNode }) {
  return RootLayout({ children, config, importMap, serverFunction });
}
