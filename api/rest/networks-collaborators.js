import apiClient from '~/services/apiClient'

export default {
  create: data => {
    const query = JSON.stringify({
      username: data.username,
      // one of "own", "manage", "edit", "readonly",
      permisssion: data.permisssion
    })
    return apiClient.post(`networks/${data.id}/collaborators`, query, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  delete: data => {
    return apiClient.delete(
      `networks/${data.id}/collaborators/${data.username}`,
      null,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + data.token
        }
      }
    )
  },
  update: data => {
    const query = JSON.stringify({
      network: {
        username: data.username,
        permisssion: data.permisssion
      }
    })
    return apiClient.put(
      `networks/${data.id}/collaborators/${data.username}`,
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
