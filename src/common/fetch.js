import {Host} from './config'
export default {
    Get(path) {
        return this.race('GET', path)
    },
    Post(path, body) {
        return this.race('POST', path, body)
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
                method: type
            } : {
                method: type,
                body: JSON.stringify(body),
            }
            fetch(Host + path, params)
                .then(res => res.json())
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
