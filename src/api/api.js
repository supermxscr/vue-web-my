import request from '@/utils/request'

export function requestData(method, url, params) {
  return request({
    url: url,
    method: method,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null
  })
}
