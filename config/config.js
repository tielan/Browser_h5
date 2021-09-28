import routes from './routes';
export default {
  base: './',
  publicPath: './',
  treeShaking: true,
  history: 'hash',
  targets: {
    ie: 11,
  },
  hash: true,
  routes,
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'AutoTerminal',
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  proxy: {
    '/app': {
      target: 'http://10.254.12.24:8080',
      changeOrigin: true,
    },
  },
};
