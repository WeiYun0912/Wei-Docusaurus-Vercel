module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "var(--ifm-color-primary)",
                secondary: "var(--ifm-color-secondary)",
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    },
    important: true,
};
