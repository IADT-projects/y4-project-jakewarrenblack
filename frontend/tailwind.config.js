/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html','./src/**/*.{js,jsx,ts,tsx,vue,html}'],
    theme: {
      extend: {
        fontFamily: {
          'sans': ['Inter', 'Helvetica', 'Arial', 'sans-serif']
        },
        colors: {
          cyberYellow: '#FFD300',
          navy: '#212530', // background
          navyLight: '#2A303C', // input boxes
          navyLighter: '#737B88', // labels, icons
          navyLightest: '#878C98', // icon backgrounds
          navyBtn: '#434B58',
          white: '#FFFFFE',
          alert: '#E52828',
        },
      }
    },  // no options to configure
    variants: { // all the following default to ['responsive']
      imageRendering: ['responsive'],
    },

    plugins: [
      require('tailwindcss-image-rendering')(), // add this to allow pixelated style canvas
    ],
}
