import client from './client';

export const request = async (
  url: string,
  data: any = {},
  method: 'get' | 'post' | 'put' | 'delete' = 'post'
) => {
  let response;

  if (method === 'get') {
    response = await client.get(url, { params: data });
  } else {
    response = await client[method](url, data);
  }

  /**
   * 👉 response.data = backend response (100%)
   * Không throw
   * Không bọc
   */
  return response.data;
};
