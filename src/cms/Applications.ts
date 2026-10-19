import path from 'node:path';
import { APIError, type CollectionConfig } from 'payload';
import { staffAccess } from './access';
import { careersDataDir } from '../lib/careers/settings';

export const Applications: CollectionConfig = {
  slug: 'applications',
  labels: { singular: 'Application', plural: 'Applications' },
  admin: {
    useAsTitle: 'fullName', group: 'Recruitment',
    defaultColumns: ['fullName', 'job', 'status', 'email', 'createdAt'],
    description: 'Private applicant records and PDF CVs. Filter by job or status to review your pipeline.',
  },
  access: { create: staffAccess, read: staffAccess, update: staffAccess, delete: staffAccess },
  upload: {
    staticDir: path.join(careersDataDir, 'cvs'), mimeTypes: ['application/pdf'],
    filesRequiredOnCreate: true, displayPreview: false, bulkUpload: false,
    pasteURL: false,
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'private, no-store');
      headers.set('Content-Disposition', 'attachment');
      headers.set('X-Content-Type-Options', 'nosniff');
      return headers;
    },
  },
  indexes: [{ fields: ['job', 'email'], unique: true }],
  fields: [
    { name: 'fullName', type: 'text', required: true, maxLength: 120 },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', maxLength: 40 },
    { name: 'job', type: 'relationship', relationTo: 'jobs', required: true, index: true },
    { name: 'portfolioUrl', type: 'text', maxLength: 500,
      validate: (value: unknown) => {
        if (!value) return true;
        try { return ['https:', 'http:'].includes(new URL(String(value)).protocol) || 'Enter an http or https URL.'; }
        catch { return 'Enter a valid URL.'; }
      },
    },
    { name: 'coverNote', type: 'textarea', maxLength: 4000, label: 'Applicant message' },
    { name: 'status', type: 'select', required: true, defaultValue: 'new', index: true,
      admin: { position: 'sidebar' }, options: [
        { label: 'New', value: 'new' }, { label: 'Reviewing', value: 'reviewing' },
        { label: 'Shortlisted', value: 'shortlisted' }, { label: 'Interview', value: 'interview' },
        { label: 'Hired', value: 'hired' }, { label: 'Rejected', value: 'rejected' },
      ],
    },
    { name: 'assignedTo', type: 'relationship', relationTo: 'staff', admin: { position: 'sidebar' } },
    { name: 'internalNotes', type: 'textarea', maxLength: 10000, admin: { description: 'Visible to the HR team only.' } },
    { name: 'privacyConsent', type: 'checkbox', required: true, admin: { readOnly: true } },
    { name: 'consentedAt', type: 'date', required: true, admin: { readOnly: true } },
    { name: 'privacyPolicyVersion', type: 'text', required: true, admin: { readOnly: true } },
  ],
  hooks: {
    beforeValidate: [({ data }) => {
      if (data?.email) data.email = String(data.email).trim().toLowerCase();
      return data;
    }],
    beforeChange: [async ({ data, operation, req }) => {
      if (operation === 'create') {
        const jobID = typeof data.job === 'object' ? data.job.id : data.job;
        const job = await req.payload.findByID({ collection: 'jobs', id: jobID, overrideAccess: true, req });
        if (job.status !== 'open') throw new APIError('This role is no longer accepting applications.', 410);
        if (data.privacyConsent !== true) throw new APIError('Privacy consent is required.', 400);
      }
      return data;
    }],
  },
};
