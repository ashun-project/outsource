import axios from 'axios'
import { message, MessageBox } from 'element-ui'
 
// 设置基础apiUrl(和请求拦截中的 配置axios请求的url 的功能类似，建议使用下面的)
// axios.defaults.baseURL = 'https://www.apiopen.top/'
 
// 请求拦截 (这里以后写axios请求拦截)
axios.interceptors.request.use(
  conf => {
    // 配置全局http请求的加载动画
    // if (conf.loading) {
    //   Indicator.open({
    //     text: '加载中...',
    //     spinnerType: 'fading-circle'
    //   });
    // }
    if (conf.url.indexOf('jisuapi') == -1) {
      conf.url = `/api${conf.url}`
    }

    // if (sessionStorage.getItem('auth')) {
    //   conf.headers['Authorize'] = sessionStorage.getItem('auth')
    // }
    return conf
  },
  err => {
    // setTimeout(() => {
    //     Indicator.close();
    // }, 200)
    message.error(err.response);
    // 抛出请求错误信息
    Promise.reject(err.response)
  }
)
 
// 响应拦截 (这里以后写axios响应拦截)
axios.interceptors.response.use(
  res => {
    let meta = res.data;
    // if (res.config.loading) {
    //   Indicator.close();
    // }
    if (meta.code === 1) {
      message.error(meta.message);
      return Promise.reject(meta.message)
    } else if (meta.code === 3301) {
      MessageBox.confirm(meta.message, '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      }).then(() => {
        window.location.href = '/#/login'
      }).catch(() => {});
      return Promise.reject(meta.message)
    }
    return res.data
  },
  err => {
    // Indicator.close();
    message.error('系统出错请刷新页面');
    // 抛出请求错误信息
    return Promise.reject(err)
  }
)
 
export default {
  install: function (Vue) {
    Object.defineProperty(Vue.prototype, '$http', { value: axios })
  }
}