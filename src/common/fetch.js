//  公用请求函数
import {Host} from './config'
export default {
    Get(path) {
        return this.race('GET', path)
    },
    Post(path, body) {
        const newBody = new FormData();
        for(let x in body) {
            newBody.append(x,body[x])
        }
        return this.race('POST', path, newBody)
    },
    timeout(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({code: 301, data: '请求超时'})
            }, time)
        })
    },
    request(type, path, body = {}) {
        return new Promise((resolve, reject) => {
            const params = type === 'GET' ? {
                method: type,
            } : {
                method: type,
                body: body,
            }
            fetch(Host + path, params)
                .then(res => {
                    //  只有connect3接口是直接返回文本的 做特殊处理
                   return res.url.indexOf('connect3') !== -1 || res.url.indexOf('connect5') !== -1 ? res.text() : res.json()
                })
                .then(res => {
                    resolve({code: 200, data: res})
                })
                .catch(err => {
                    reject({code: 500, err})
                })
        })
    },
    race() {
        return Promise.race([this.timeout(10000), this.request(...arguments)])
    }
}
