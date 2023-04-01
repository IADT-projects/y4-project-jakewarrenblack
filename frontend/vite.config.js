import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const reactRefresh = require('@vitejs/plugin-react-refresh')
const { plugin: mdPlugin, Mode } = require('vite-plugin-markdown')

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // reactRefresh, mdPlugin({ mode: [Mode.REACT] })
    ],
    assetsInclude: ['**/*.md'], // need to allow dynamic imports for markdown files

})