module.exports = {	
	devServer: {
		proxy: {
			'/store': {
				// target: 'http://task.turenkeji.com',
				// target: 'http://cstask.92nu.com',
				target: 'http://tt.turenkeji.com',
				ws: true,
				changOlrigin: true,		//是否跨域
			}
		}
	},
	assetsDir: "store"
}