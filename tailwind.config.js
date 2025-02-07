/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/webview/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        vscode: {
          'foreground': 'var(--vscode-foreground)',
          'background': 'var(--vscode-editor-background)',
          'button': 'var(--vscode-button-background)',
          'button-hover': 'var(--vscode-button-hoverBackground)',
        }
      }
    },
  },
  plugins: [],
}