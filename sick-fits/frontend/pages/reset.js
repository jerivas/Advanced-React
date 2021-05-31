import { useRouter } from 'next/router';
import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

export default function ResetPage() {
  const { query } = useRouter();
  return query.token ? <Reset token={query.token} /> : <RequestReset />;
}
