/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                mainBgColor: 'rgba(178,187,205,0.47)'
            }
        },
    },
    plugins: [],
}

