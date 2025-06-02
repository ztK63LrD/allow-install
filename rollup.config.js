import { babel } from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import alias from '@rollup/plugin-alias'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 获取 __dirname 的 ES 模块写法
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isPro = process.env.NODE_ENV === 'production'

export default {
    // input: 'src/index.ts', // 设置打包入口文件路径，单入口
    input: {
        index: 'src/index.ts', // 多入口，设置多个打包入口文件路径
    },
    output: {
        dir: 'dist', // 设置打包后的文件目录，多入口
        format: 'esm', // 设置打包格式为esm模块
        name: 'bundleName', // 当format格式为iife和umd时，必须提供变量名
        plugins: [],
    },
    // 打包过程中使用的插件列表
    plugins: [
        // Babel 配置
        babel({
            babelHelpers: 'runtime',
            exclude: ['node_modules/**'], // 排除node_modules目录下的@vueuse模块，避免重复打包
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'], // 指定需要转换的文件扩展名
            babelrc: true // 启用.babelrc 配置，避免重复配置插件
        }),
        // 解析第三方模块
        resolve({
            extensions: ['.mjs', '.js', '.json', '.ts', '.vue'], // 添加.ts和.vue扩展名支持
            browser: true, // 优化浏览器环境
        }),
        // 将CommonJS模块转换为ES6模块，以便打包
        commonjs(),
        // TypeScript 配置
        typescript(),
        // 替换打包结果中在浏览器中不兼容的代码，例如process.env.NODE_ENV
        replace({ 
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV), // 替换代码中的环境变量
            preventAssignment: true // 防止替换赋值表达式，例如process.env.NODE_ENV = 'production'
        }),
        // 压缩打包后的文件
        isPro && terser(), // 生产环境才压缩代码
        // 配置别名路径
        alias({
            entries: [
                { find: '@', replacement: path.resolve(__dirname, 'src') }, // 将@替换为/src
            ],
        }),
    ], 
    external: [ // 外部依赖，不打包到最终的bundle中
    ], 
}