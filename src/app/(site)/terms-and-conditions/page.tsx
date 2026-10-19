import { policies } from '@/content/policies';
import { pageMeta } from '@/lib/seo';
import { PolicyView } from '@/views/PolicyView';

export const metadata = pageMeta(policies.terms);

export default function TermsAndConditionsPage() {
  return <PolicyView policy={policies.terms} />;
}
