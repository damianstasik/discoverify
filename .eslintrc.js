const path = require('path');

const sharedRules = {
  'no-console': 'off',
  'import/prefer-default-export': 'off',
  'no-bitwise': 'off',
  'no-param-reassign': 'off',
  'consistent-return': ['error', { treatUndefinedAsUnspecified: false }],
};

const sharedReactRules = {
  'react/react-in-jsx-scope': 'off',
  'react/no-unknown-property': [
    'error',
    { ignore: ['stroke-width', 'stroke-linecap', 'stroke-linejoin'] },
  ],
};

module.exports = {
  root: true,

  env: {
    node: true,
    browser: true,
    jest: true,
  },

  overrides: [
    {
      files: ['*.js'],
      extends: ['airbnb-base', 'plugin:prettier/recommended'],

      parserOptions: {
        ecmaVersion: 2020,
      },

      rules: sharedRules,
    },
    {
      files: ['*.ts'],

      extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:prettier/recommended',
      ],

      parserOptions: {
        project: path.resolve('./tsconfig.json'),
      },

      rules: sharedRules,
    },
    {
      files: ['*.tsx'],

      extends: ['airbnb', 'airbnb-typescript', 'plugin:prettier/recommended'],

      parserOptions: {
        project: path.resolve('./tsconfig.json'),
      },

      rules: Object.assign(sharedRules, sharedReactRules),
    },
  ],
};
