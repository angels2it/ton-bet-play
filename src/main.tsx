import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  TonConnectUIProvider,
  TonConnectUIProviderPropsWithConnector,
} from "@tonconnect/ui-react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
const manifestUrl = "https://gist.githubusercontent.com/cryptoinmyheart/0609e5586c10bc26fcb6e69ca15cfb17/raw/1288f24920e30cadb955483215fded03378ba2f4/tonconnect-manifest.json";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </TonConnectUIProvider>
);
