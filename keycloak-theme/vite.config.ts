import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { keycloakify } from 'keycloakify/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      themeName: 'usp-iconomy',
      accountThemeImplementation: 'none',
      // Keycloak 26 only; the 22-to-25 build is not needed.
      keycloakVersionTargets: { '22-to-25': false, 'all-other-versions': 'usp-iconomy-theme.jar' },
    }),
  ],
  // The theme reads the web app's design tokens from ../src.
  server: { fs: { allow: ['..'] } },
})
