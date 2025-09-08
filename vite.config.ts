import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'
import fs from 'fs'
import path from 'path';
import htmlMinifier from 'html-minifier'
import { VTUBERS } from './src/config/constants.ts';

const vtubers = Object.values(VTUBERS).map(v => v.name);

const isProduction = process.env.NODE_ENV === 'production'
const base = isProduction ? '/hanon-uta/' : '/'

const generateDynamicRoutes = () => {
    return Object.values(VTUBERS).map(vtuber => {
        const uri = vtuber.uri.startsWith('/') ? vtuber.uri : `/${vtuber.uri}`;
        return base + (uri === '/' ? '' : uri.replace(/^\//, ''));
    });
};
const defaultData : any = {
    vtuber: '香鳴ハノン',
    cover: 'https://img.youtube.com/vi/V8gg1yrTzsw/maxresdefault.jpg'
};
// https://vite.dev/config/
export default defineConfig({
    base: base,
    plugins: [ vue(),
        createHtmlPlugin({
            minify: true,
            pages: [
                {
                    filename: 'index.html',
                    template: 'index.html',
                    injectOptions: {
                        data: defaultData,
                    }
                },
            ]
        }),
        Sitemap({
            hostname: `https://kevinstrax.github.io${base}`,
            dynamicRoutes: generateDynamicRoutes(), // Your list of routes
            exclude: [ // Excluded routes
                '/',
                '/google19312be880b2f09b',
            ],
        }),
        // Custom HTML generation plugin
        {
            name: 'multi-page-html',
            apply: 'build',
            enforce: 'post',
            async writeBundle() {
                const templates = [
                    {
                        outputPath: 'saotomegabu/index.html',
                        data: {
                            vtuber: '鎖乙女がぶ',
                            cover: 'https://img.youtube.com/vi/nMmWVciVOgk/maxresdefault.jpg'
                        }
                    },
                    {
                        outputPath: 'akatsukiclara/index.html',
                        data: {
                            vtuber: '暁月クララ',
                            cover: 'https://img.youtube.com/vi/iavuOMwYjpg/maxresdefault.jpg'
                        }
                    },
                ]

                for (const template of templates) {
                    // Simple template replacement
                    let processedContent = fs.readFileSync('dist/index.html', 'utf-8')
                    for (const [key, value] of Object.entries(template.data)) {
                        processedContent = processedContent.replaceAll(
                            defaultData[key],
                            value
                        )
                    }
                    // HTML compression
                    const minifiedContent = htmlMinifier.minify(processedContent, {
                        collapseWhitespace: true,
                        removeComments: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        useShortDoctype: true,
                        minifyCSS: true,
                        minifyJS: true,
                        minifyURLs: true,
                        removeAttributeQuotes: false, // keep attribute quotes to avoid problems
                        removeOptionalTags: false     // Maintain the integrity of optional labels
                    })
                    // create a directory and write to the file
                    const outputDir = path.dirname(template.outputPath)
                    const fullOutputDir = path.join('dist', outputDir)
                    if (!fs.existsSync(fullOutputDir)) {
                        fs.mkdirSync(fullOutputDir, { recursive: true })
                    }

                    fs.writeFileSync(path.join('dist', template.outputPath), minifiedContent)
                    console.log('Generated:', template.outputPath)
                }
            }
        }
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
