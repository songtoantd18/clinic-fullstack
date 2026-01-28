import client from './client'

export const baseurl = () => {
  return 'http://localhost:3000/'
}

export const request = async (
  url: string,
  data: any = {},
  method: 'get' | 'post' | 'put' | 'delete' = 'post'
) => {
  try {
    if (method === 'get') {
      const response = await client.get(url, { params: data })
      return response.data
    }

    const response = await client[method](url, data)
    return response.data
  } catch (error) {
    console.error('API error:', error)
    throw error // để component tự handle
  }
}
