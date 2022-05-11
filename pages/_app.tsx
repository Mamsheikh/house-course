import { AppProps } from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "src/apollo";
import { AuthProvider } from "src/auth/useAuth";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo();
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Head>
          <title>Home sweet Home</title>
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        </Head>
        <Component {...pageProps} />
      </ApolloProvider>
    </AuthProvider>
  );
}
