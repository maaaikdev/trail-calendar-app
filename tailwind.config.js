/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
		"./src/**/*.{html,js}",
		"./node_modules/tw-elements-react/dist/js/**/*.js"
	],
    theme: {
		extend: {
			gridTemplateRows: {
				'[auto,auto,1fr]': 'auto auto 1fr',
			},
		},
		screens: {
			'sm': '640px',  // Configuración para pantallas pequeñas
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			// ...otros tamaños de pantalla
		},
    },
    plugins: [
		require('@tailwindcss/aspect-ratio'),
		require("tw-elements-react/dist/plugin.cjs")
	],
}

