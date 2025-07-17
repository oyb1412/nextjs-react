/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}", // 혹시 pages도 같이 쓴다면
    "./components/**/*.{js,ts,jsx,tsx}" // 컴포넌트 폴더 있다면
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
