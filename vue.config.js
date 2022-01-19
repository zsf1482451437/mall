module.exports = {
  configureWebpack: {
    // 路径起别名
    resolve: {
      alias: {
        assets: '@/assets',
        common: '@/common',
        components: '@/components',
        network: '@/network',
        views: '@/views'
      }
    }
  },
  // 代理处理跨域
  devServer: {
    proxy: {
      '/api': {
        target: 'http://123.207.32.32:8000',
        ws: true, // 对websocket也代理
        changeOrigin: true
      }
    }
  }
}
