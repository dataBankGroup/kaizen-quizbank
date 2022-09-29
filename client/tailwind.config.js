const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        screens: {
            xs: "0px",
            sm: "600px",
            md: "900px",
            lg: "1200px",
            xl: "1536px",
        },

        extend: {
            colors: {
                'main':{
                  700:'#6D5BD0'
                },
                'neutral-light': {
                    200: '#F6F6F6',
                    300: '#F0F0F0',
                    700: "#A4A4A4",
                },
                'shades-text': {
                    100: '#3D3D3D',
                },
                'iris': {
                    300: '#7879F1',
                    400: '#5D5FEF',
                },
                'delete': '#F54949',
                'correct': '#70C250',

            },
            fontFamily: {
                "sans": ["Open Sans", ...defaultTheme.fontFamily.sans],
                "alt-sans": ["Days One", "Open Sans", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
};
