/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Public Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['Sora', 'Public Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    primary: '#6366f1',
                    secondary: '#4f46e5',
                },
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    // ... other slate colors are default
                }
            }
        },
    },
    plugins: [],
}
