module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ['module-resolver', {
      alias: {
        '@tests': './src/__tests__',
        '@app': './src/app',
        '@config': './src/config',
        '@database': './src/database',
        '@lib': './src/lib',
        '@src': './src'
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}