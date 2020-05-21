import axios from 'axios'
import { Toast, Indicator, MessageBox } from 'mint-ui'
 
// 设置基础apiUrl(和请求拦截中的 配置axios请求的url 的功能类似，建议使用下面的)
// axios.defaults.baseURL = 'https://www.apiopen.top/'
 
// 请求拦截 (这里以后写axios请求拦截)
axios.interceptors.request.use(
  conf => {
    // 配置全局http请求的加载动画
    if (conf.loading) {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      });
    }
 
    // 配置axios请求的url  ${config.ajaxUrl} 是配置的请求url统一前缀，配置好就不用重复写一样的url前缀了，只写后面不同的就可以了
    conf.url = `/api${conf.url}`
 
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (sessionStorage.getItem('auth')) {
      // 配置请求头部
      conf.headers['Authorize'] = sessionStorage.getItem('auth')
    }
    return conf
  },
  err => {
    setTimeout(() => {
        Indicator.close();
    }, 200)
    Toast({
        message: 'err.response',
        position: 'middle',
        duration: 5000
    })
    // 抛出请求错误信息
    Promise.reject(err.response)
  }
)
 
// 响应拦截 (这里以后写axios响应拦截)
axios.interceptors.response.use(
  res => {
    let meta = res.data;
    if (res.config.loading) {
      Indicator.close();
    }
    if (meta.code === 1) {
      Toast({
        message: meta.message,
          position: 'middle',
          duration: 2000
      })
      return Promise.reject(meta.message)
    } else if (meta.code === 3301) {
      MessageBox.alert(meta.message).then(action => {
        window.location.href = '/'
      })
    }
    return res.data
  },
  err => {
    Indicator.close();
    Toast({
      message: '系统出错请刷新页面',
      position: 'middle',
      duration: 2000
    })
    // 抛出请求错误信息
    return Promise.reject(err)
  }
)
 
export default {
  install: function (Vue) {
    Object.defineProperty(Vue.prototype, '$http', { value: axios })
  }
}