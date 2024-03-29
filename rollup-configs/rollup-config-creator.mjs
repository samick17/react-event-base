import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';

export default {
  create: (moduleName) => {
    return {
      input: `src/modules/${moduleName}/index.js`,
      output: [
      {
        file: `dist/${moduleName}.js`,
        format: 'cjs',
        sourcemap: false
      },
      {
        file: `dist/${moduleName}.es.js`,
        format: 'es',
        sourcemap: false
      }
      ],
      plugins: [
      external(),
      url(),
      svgr(),
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs(),
      cleanup()
      ]
    };
  }
};
