import { AppProps } from 'next/app';
import { ClerkProvider } from '@clerk/nextjs';

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
