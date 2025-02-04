import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      sourceType: "module",  
      globals: globals.browser,  
    },
    
    rules: {
      "no-console": "warn", 
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",  
    },
  },
 
];
