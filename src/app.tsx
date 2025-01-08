import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "./app.css";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { ColorModeProvider, ColorModeScript } from "@kobalte/core";
import { MetaProvider, Title } from "@solidjs/meta";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <MetaProvider>
            <Title>Switch UI</Title>
            <Suspense>
              <ColorModeScript />
              <ColorModeProvider>{props.children}</ColorModeProvider>
            </Suspense>
          </MetaProvider>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
