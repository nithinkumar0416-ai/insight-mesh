/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mesh: {
          bg: '#0B0F19',
          card: '#111827',
          border: '#1F2937',
          accent: '#06B6D4',
          highlight: '#3B82F6',
          purple: '#8B5CF6',
          emerald: '#10B981',
          rose: '#F43F5E'
        }
      }
    },
  },
  plugins: [],
}
