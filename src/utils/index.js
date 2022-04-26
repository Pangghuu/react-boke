// 先把所有的工具函数导出的模块在这里导入
// 然后再统一导出

import { http } from './http'
import { 
    setToken,
    getToken,
    clearToken,
} from './token'

export {  
    http,
    setToken,
    getToken,
    clearToken
}

// 这个的作用在于 别的地方需要引用模块时，只需如下写
// import {http} from '@/utils'