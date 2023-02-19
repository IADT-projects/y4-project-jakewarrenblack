module.exports = {
  content: ['index.html','./src/**/*.{js,jsx,ts,tsx,vue,html}'],
    theme: {},  // no options to configure
    variants: { // all the following default to ['responsive']
      imageRendering: ['responsive'],
    },
    plugins: [
      require('tailwindcss-image-rendering')(), // add this to allow pixelated style canvas
    ],
}
