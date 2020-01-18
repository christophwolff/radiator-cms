import apiClient from '~/services/apiClient'

export default {
  create: data => {
    const query = JSON.stringify({
      podcast: {
        username: data.username,
        // one of "own", "manage", "edit", "readonly"
        permission: data.permission
      }
    })
    return apiClient.post(`podcasts/${data.id}/collaborators`, query, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  delete: data => {
    return apiClient.delete(`podcasts/${data.id}/collaborators`, null, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  update: data => {
    const query = JSON.stringify({
      network: {
        username: data.username,
        permission: data.permission
      }
    })
    return apiClient.put(
      `podcasts/${data.id}/collaborators/${data.username}`,
      query,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + data.token
        }
      }
    )
  }
}
