module.exports = {
  content: ['index.html','./src/**/*.{js,jsx,ts,tsx,vue,html}'],
    theme: {},  // no options to configure
    variants: { // all the following default to ['responsive']
      imageRendering: ['responsive'],
    },
    colors: {
      'cyberYellow': '#FFD300',
      'navy': '#212530', // background
      'navyLight': '#2A303C', // input boxes
      'navyLighter': '#737B88', // labels, icons
      'navyLightest': '#878C98', // icon backgrounds
      'navyBtn': '#434B58',
      'white': '#FFFFFE',
      'alert': '#E52828',
    },
    plugins: [
      require('tailwindcss-image-rendering')(), // add this to allow pixelated style canvas
    ],
}
