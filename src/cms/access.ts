import type { Access, PayloadRequest } from 'payload';

export const isStaff = (req: Pick<PayloadRequest, 'user'>) => Boolean(req.user?.collection === 'staff');
export const isAdmin = (req: Pick<PayloadRequest, 'user'>) => isStaff(req) && req.user?.role === 'admin';
export const staffAccess: Access = ({ req }) => isStaff(req);
export const adminAccess: Access = ({ req }) => isAdmin(req);
