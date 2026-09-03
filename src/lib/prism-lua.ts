// Loads the maintained Lua grammar from prismjs onto the Prism instance
// bundled with prism-react-renderer (which Highlight uses by default).
// prismjs language components attach to the global Prism, so it must be set
// before the side-effect import; a static import would hoist and run first.
import { Prism } from "prism-react-renderer";

(globalThis as unknown as { Prism: typeof Prism }).Prism = Prism;

// @ts-expect-error -- prismjs ships no types for language components
await import("prismjs/components/prism-lua");
