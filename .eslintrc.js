module.exports = {
  extends: ['airbnb', 'plugin:flowtype/recommended'],
  parser: '@babel/eslint-parser',
  plugins: ['flowtype'],
  rules: {
    'react/jsx-filename-extension': 0,
    'eol-last': 0,
    //  Disabling the following import rules because VSCode seems to be throwing useless errors with them on
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'import/named': 0,
    // https://stackoverflow.com/questions/37682705/avoid-no-shadow-eslint-error-with-mapdispatchtoprops (react-redux bug)
    'no-shadow': [
      'error',
      {
        allow: ['addContextVariable', 'renameContextVariable'],
      },
    ],
    'no-param-reassign': ['error', { 'props': false, }],
    'no-return-assign': 0,
  },
};