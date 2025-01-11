import { AppProps } from 'next/app';
import { ClerkProvider } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

function MyApp({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <ClerkProvider frontendApi={clerkFrontendApi}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
