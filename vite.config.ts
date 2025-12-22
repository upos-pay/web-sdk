import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      dts({
        include: ['src'],
        rollupTypes: true
      })
    ],
    base: '/',
    publicDir: 'public',
    server: {
      port: 3000,
      cors: {
        origin: 'http://localhost:8000',
        credentials: true
      },
      allowedHosts: true
    },
    preview: {
      port: 8080
    },
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [path.resolve(__dirname, 'src')]
        }
      }
    },
    build: {
      lib: {
        entry: {
          index: path.resolve(__dirname, 'src/index.ts'),
          react: path.resolve(__dirname, 'src/react.ts')
        },
        name: 'UposWebSDK',
        formats: ['es'],
        fileName: (_format, entryName) => `${entryName}.js`
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      outDir: 'dist',
      assetsDir: 'assets',
      cssCodeSplit: false,
      rollupOptions: {
        external: ['react', 'react-dom', 'lit', '@lit/context', '@lit/react'],
        output: {
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'lit': 'Lit',
            '@lit/context': 'LitContext',
            '@lit/react': 'LitReact'
          }
        }
      }
    }
  }
})
