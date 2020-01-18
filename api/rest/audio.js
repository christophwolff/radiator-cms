import apiClient from '~/services/apiClient'

export default {
  createAudioFile: data => {
    const query = new FormData()
    query.append('audio_file[audio_id]', data.audioId)
    query.append('audio_file[file]', data.file)
    query.append('audio_file[title]', data.title)
    return apiClient.post(`audios/${data.audioId}/audio_files`, query, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  createAudio: data => {
    const query = new FormData()
    query.append('audio[network_id]', data.networkId)
    query.append('audio_publication[title]', data.title)
    if (data.image) {
      query.append('audio[image]', data.image)
    }
    return apiClient.post(`networks/${data.networkId}/audios`, query, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  createPodcastAudio: data => {
    const query = new FormData()
    query.append('audio[episode_id]', data.episodeId)
    query.append('audio_publication[title]', data.title)
    if (data.image) {
      query.append('audio[image]', data.image)
    }
    return apiClient.post(`episodes/${data.episodeId}/audios`, query, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  deleteAudioFile: data => {
    return apiClient.delete(`audio_files/${data.id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  deleteAudioPublication: data => {
    return apiClient.delete(`audio_publications/${data.id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  depublishAudioPublication: data => {
    return apiClient.put(`audio_publications/${data.id}/depublish`, null, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  publishAudioPublication: data => {
    return apiClient.put(`audio_publications/${data.id}/publish`, null, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  updateAudio: data => {
    const query = new FormData()
    if (data.image) {
      query.append('audio[image]', data.image)
    }
    if (data.title) {
      query.append('audio[title]', data.title)
    }
    return apiClient.patch(`audios/${data.audioId}`, query, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + data.token
      }
    })
  },
  updateAudioPublication: data => {
    const query = new FormData()
    if (data.title) {
      query.append('audio_publication[title]', data.title)
    }
    if (data.publishState) {
      query.append('audio_publication[publish_state]', data.publishState)
    }
    return apiClient.patch(`audio_publications/${data.id}`, query, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + data.token
      }
    })
  }
}
