import { policies } from '@/content/policies';
import { pageMeta } from '@/lib/seo';
import { PolicyView } from '@/views/PolicyView';

export const metadata = pageMeta(policies.cookies);

export default function CookiePolicyPage() {
  return <PolicyView policy={policies.cookies} />;
}
