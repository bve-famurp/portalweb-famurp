export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        urp: {
          primary: '#008744',
          emerald: '#00A859',
          mint: '#8CF9A9',
          night: '#0F172A',
          dark: '#020617',
          white: '#FFFFFF',
        },
      },
      boxShadow: {
        'brutal': '4px 4px 0px #0f172a',
        'brutal-sm': '2px 2px 0px #0f172a',
        'brutal-lg': '6px 6px 0px #0f172a',
        'tactile': '0 2px 0 #0f172a',
        'urp-brutal': '4px 4px 0px #0f172a',
        'urp-brutal-sm': '2px 2px 0px #0f172a',
        'urp-brutal-green': '4px 4px 0px #008744',
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        '2xl': "1rem",
        '3xl': "1.5rem",
        'urp-card': "36px",
        full: "9999px"
      },
      spacing: {
        "container-max": "1280px",
        xs: "8px",
        sm: "16px",
        xl: "64px",
        "margin-mobile": "16px",
        lg: "40px",
        gutter: "24px",
        base: "4px",
        md: "24px"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
        lora: ["Lora", "serif"]
      },
    },
  },
  plugins: [],
}
