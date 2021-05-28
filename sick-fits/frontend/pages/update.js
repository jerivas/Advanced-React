import { useRouter } from 'next/router';
import UpdateProduct from '../components/UpdateProduct';

export default function SellPage() {
  const router = useRouter();
  return <UpdateProduct id={router.query.id} />;
}
