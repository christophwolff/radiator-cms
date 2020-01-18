import apiClient from '~/services/apiClient'

export default {
  create: data => {
    const importPodcastFeed = {
      network_id: data.network_id,
      feed_url: data.feed_url,
      enclosure_types: data.enclosure_types,
      short_id: data.short_id
    }
    if (data.limit) {
      importPodcastFeed.limit = parseInt(data.limit)
    }

    const query = JSON.stringify({ import_podcast_feed: importPodcastFeed })
    return apiClient.post(`tasks`, query, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  read: data => {
    return apiClient.get(`tasks/${data.taskId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  delete: data => {
    return apiClient.delete(`tasks/${data.taskId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + data.token
      }
    })
  }
}
