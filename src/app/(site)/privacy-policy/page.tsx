import { policies } from '@/content/policies';
import { pageMeta } from '@/lib/seo';
import { PolicyView } from '@/views/PolicyView';

export const metadata = pageMeta(policies.privacy);

export default function PrivacyPolicyPage() {
  return <PolicyView policy={policies.privacy} />;
}
