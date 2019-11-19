const path = require('path');
module.exports = ({ config }) => {
	config.devtool = "source-maps";
	config.module.rules.push({
		test: /\.(ts|tsx)$/,
		use: [
			{
				loader: require.resolve('ts-loader')
			}
		],
	});
	config.resolve.extensions.push('.ts', '.tsx');
	config.resolve.alias = {
		'react': 'preact/compat',
		'react-dom': 'preact/compat'
		//,'prop-types': 'preact/compat'
	};
	return config;
};