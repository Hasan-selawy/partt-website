import type { CollectionConfig } from 'payload';
import { isStaff, staffAccess } from './access';
import { careersOrigin } from '../lib/careers/settings';

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Job opening', plural: 'Job openings' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'status', 'employmentType', 'location', 'updatedAt'], group: 'Recruitment',
    preview: (doc) => doc.status === 'open' ? `${careersOrigin}/careers/${doc.slug}` : null,
    description: 'Open roles appear on Careers immediately. Use Preview on an open role to get its public link for LinkedIn.',
  },
  access: { create: staffAccess, update: staffAccess, delete: staffAccess,
    read: ({ req }) => isStaff(req) ? true : { status: { equals: 'open' } },
  },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 140 },
    { name: 'slug', type: 'text', required: true, unique: true, index: true,
      admin: { description: 'Unique URL name, for example senior-designer.' },
      validate: (value: unknown) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 100 || 'Use lowercase letters, numbers, and single hyphens.',
    },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', index: true, admin: { position: 'sidebar' },
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Open', value: 'open' }, { label: 'Closed', value: 'closed' }],
    },
    { name: 'department', type: 'text', maxLength: 100 },
    { name: 'location', type: 'text', required: true, defaultValue: 'Amman, Jordan', maxLength: 140 },
    { name: 'employmentType', type: 'select', required: true, defaultValue: 'full-time', options: [
      { label: 'Full-time', value: 'full-time' }, { label: 'Part-time', value: 'part-time' },
      { label: 'Contract', value: 'contract' }, { label: 'Internship', value: 'internship' },
    ] },
    { name: 'workplace', type: 'select', required: true, defaultValue: 'on-site', options: [
      { label: 'On-site', value: 'on-site' }, { label: 'Hybrid', value: 'hybrid' }, { label: 'Remote', value: 'remote' },
    ] },
    { name: 'summary', type: 'textarea', required: true, maxLength: 2000 },
    { name: 'responsibilities', type: 'textarea', required: true, maxLength: 8000, admin: { description: 'One responsibility per line.' } },
    { name: 'requirements', type: 'textarea', required: true, maxLength: 8000, admin: { description: 'One requirement per line.' } },
    { name: 'publishedAt', type: 'date', admin: { readOnly: true, position: 'sidebar' } },
  ],
  hooks: {
    beforeChange: [({ data, originalDoc }) => {
      if (data.status === 'open' && !originalDoc?.publishedAt) data.publishedAt = new Date().toISOString();
      return data;
    }],
    beforeDelete: [async ({ id, req }) => {
      const applications = await req.payload.count({ collection: 'applications', where: { job: { equals: id } }, overrideAccess: true, req });
      if (applications.totalDocs) {
        const { APIError } = await import('payload');
        throw new APIError('This role has applicants. Close it to preserve their records.', 400);
      }
    }],
  },
};
