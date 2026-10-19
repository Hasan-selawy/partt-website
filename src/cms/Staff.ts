import { APIError, Forbidden, type CollectionConfig } from 'payload';
import { adminAccess, isAdmin, isStaff } from './access';

export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: { singular: 'HR user', plural: 'HR users' },
  auth: {
    maxLoginAttempts: 5, lockTime: 15 * 60 * 1000, tokenExpiration: 8 * 60 * 60,
    useSessions: true,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'role'], group: 'Administration' },
  access: {
    admin: ({ req }) => isStaff(req), create: adminAccess,
    read: ({ req }) => isAdmin(req) ? true : isStaff(req) ? { id: { equals: req.user!.id } } : false,
    update: ({ req }) => isAdmin(req) ? true : isStaff(req) ? { id: { equals: req.user!.id } } : false,
    delete: ({ req }) => isAdmin(req) ? { id: { not_equals: req.user!.id } } : false,
  },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    { name: 'role', type: 'select', required: true, defaultValue: 'hr', saveToJWT: true,
      options: [{ label: 'Administrator', value: 'admin' }, { label: 'HR', value: 'hr' }],
      access: { update: ({ req }) => isAdmin(req) },
    },
  ],
  hooks: {
    beforeChange: [async ({ data, operation, req, originalDoc }) => {
      if (operation === 'create' && !isAdmin(req)) {
        const count = await req.payload.count({ collection: 'staff', overrideAccess: true, req });
        if (req.context.bootstrapStaff !== true || count.totalDocs !== 0) throw new Forbidden();
      }
      if (operation === 'update' && originalDoc?.role === 'admin' && data.role && data.role !== 'admin') {
        const count = await req.payload.count({ collection: 'staff', where: { role: { equals: 'admin' } }, overrideAccess: true, req });
        if (count.totalDocs <= 1) throw new APIError('Keep at least one administrator.', 400);
      }
      return data;
    }],
  },
};
