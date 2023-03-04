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
          navyBtn: '#434B58', // for buttons
          white: '#FFFFFE',
          alert: '#E52828',
        },
        fontSize: {
          base: '1rem',
          '3xl': '2.28rem',
          '2xl': '1.28rem',
          xl: '1.14rem',// h3 weight regular, h4 weight is bold
          sm: '0.71rem' // for bottom nav

        }
      }
    },  // no options to configure
    variants: { // all the following default to ['responsive']
      imageRendering: ['responsive'],
    },

    plugins: [
      require('tailwindcss-image-rendering')(), // add this to allow pixelated style canvas
    ],
}
