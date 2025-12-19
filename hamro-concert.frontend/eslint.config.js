import js from "@eslint/js";
import globals from "globals";

export default [
  // 1. Use recommended JS rules
  js.configs.recommended,

  {
    // 2. Define which files to lint
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      // 3. Define environment (Node.js)
      globals: {
        ...globals.node,
        ...globals.jest // Add this if you use Jest for testing
      },
    },
    
    // 4. Custom Rules
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "prefer-const": "error",
      "no-undef": "error"
    },
  },
  
  // 5. Ignore specific directories (formerly .eslintignore)
  {
    ignores: ["node_modules/", "dist/", "build/"]
  }
];