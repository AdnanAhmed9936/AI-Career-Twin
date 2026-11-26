# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Run the frontend locally

Open a terminal in the extracted folder and enter the inner `Ai-career-Twin-Major-main` directory, where `package.json` is located:

```powershell
cd .\Ai-career-Twin-Major-main
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). Keep the terminal open while using the app. To verify a production build, run `npm run build` from the same directory.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
