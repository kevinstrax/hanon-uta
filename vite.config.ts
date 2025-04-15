import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression';
import Sitemap from 'vite-plugin-sitemap'
import path from 'path';
import { AKATSUKI_CLARA, KANARU_HANON, SAOTOME_GABU } from './src/config/constants.ts';

const vtubers: string[] = [ KANARU_HANON, SAOTOME_GABU, AKATSUKI_CLARA ];

// https://vite.dev/config/
export default defineConfig({
    base: process.env.NODE_ENV === 'production' ? '/hanon-uta/' : '/',
    plugins: [ vue(),
        viteCompression({
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 10240,
            deleteOriginFile: false
        }),
        Sitemap({
            hostname: 'https://kevinstrax.github.io/hanon-uta',
            dynamicRoutes: [ '/hanon-uta', '/hanon-uta/#/saotomegabu' ], // Your list of routes
            exclude: [ // Excluded routes
                '/',
                '/google19312be880b2f09b',
                '/hanon-uta/#/akatsukiclara'
            ],
        }) ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    optimizeDeps: {
        include: [ 'bootstrap' ]
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) =>
                    id.includes('/data/')
                        ? vtubers.find((vtuber) => id.includes(`/${ vtuber }/`))?.concat('-data')
                        : undefined
            }
        }
    }
})
