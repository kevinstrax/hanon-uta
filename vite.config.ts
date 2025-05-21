import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression';
import Sitemap from 'vite-plugin-sitemap'
import path from 'path';
import { VTUBERS } from './src/config/constants.ts';
import { htmlPrerender } from "vite-plugin-html-prerender";

const vtubers = Object.values(VTUBERS).map(v => v.name);

const isProduction = process.env.NODE_ENV === 'production'
const base = isProduction ? '/hanon-uta/' : '/'

const generateDynamicRoutes = () => {
    return Object.values(VTUBERS).map(vtuber => {
        const uri = vtuber.uri.startsWith('/') ? vtuber.uri : `/${vtuber.uri}`;
        return base + (uri === '/' ? '' : uri.replace(/^\//, ''));
    });
};

// https://vite.dev/config/
export default defineConfig({
    base: base,
    plugins: [ vue(),
        createHtmlPlugin({
            minify: true
        }),
        viteCompression({
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 10240,
            deleteOriginFile: false
        }),
        Sitemap({
            hostname: `https://kevinstrax.github.io${base}`,
            dynamicRoutes: generateDynamicRoutes(), // Your list of routes
            exclude: [ // Excluded routes
                '/',
                '/google19312be880b2f09b',
            ],
        }),
        htmlPrerender({
            staticDir: path.join(__dirname, "dist"),
            routes: Object.values(VTUBERS).map(vtuber => vtuber.uri),
            selector: "#app",
            minify: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                decodeEntities: true,
                keepClosingSlash: true,
                sortAttributes: true
            }
        })
    ],
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
            input: {
                index: path.resolve(__dirname, 'index.html'),
                page_404: path.resolve(__dirname, '404.html'),
            },
            output: {
                manualChunks: (id) =>
                    id.includes('/data/')
                        ? vtubers.find((vtuber) => id.includes(`/${ vtuber }/`))?.concat('-data')
                        : undefined
            }
        }
    },
    /*server: {
        proxy: {
            '/hanon-uta/api': {
                target: 'http://localhost:18080', // Replace with the actual backend address
                changeOrigin: true,
                // If you need to handle WebSockets
                // ws: true
            }
        }
    }*/
})
