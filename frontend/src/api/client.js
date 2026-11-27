import axios from 'axios'

// 실제 API를 연결할 때 baseURL과 옵션을 정함
export const client = axios.create({
  baseURL:'/api',
  timeout: 5000,
})
