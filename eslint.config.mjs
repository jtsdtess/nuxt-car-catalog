import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'no-console': 'off',
    },
  },
  ...[
    {
      name: 'app/base',
      files: ['**/*.ts', '**/*.vue'],
    },
  ]
)
