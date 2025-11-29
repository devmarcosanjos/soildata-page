import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/700.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@mapbiomas/ui/styles.css'
import './index.css'

import './i18n/config'
import { queryClient } from './lib/react-query'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
