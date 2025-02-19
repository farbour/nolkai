import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BrandsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/brands/');
  }, [router]);

  return null;
}