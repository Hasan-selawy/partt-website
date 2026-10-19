import config from '@payload-config';
import { REST_GET, REST_POST, REST_DELETE, REST_PATCH, REST_PUT, REST_OPTIONS } from '@payloadcms/next/routes';
function noStore(handler: ReturnType<typeof REST_GET>) {
  return async (...args: Parameters<typeof handler>) => {
    const response = await handler(...args);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  };
}
export const GET = noStore(REST_GET(config));
export const POST = noStore(REST_POST(config));
export const DELETE = noStore(REST_DELETE(config));
export const PATCH = noStore(REST_PATCH(config));
export const PUT = noStore(REST_PUT(config));
export const OPTIONS = noStore(REST_OPTIONS(config));
