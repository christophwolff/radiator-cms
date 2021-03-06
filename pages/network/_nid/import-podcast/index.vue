<template>
  <section class="r_podcasts">
    <section class="hero is-medium is-primary">
      <div class="hero-body">
        <div class="container r_podcasts__header">
          <h1 class="title">Import Podcast</h1>
        </div>
      </div>
    </section>
    <section class="container podcasts__main podcast__import">
      <b-steps v-model="activeStep" :animated="true" :has-navigation="false">
        <b-step-item label="Enter Url">
          <section>
            <b-field horizontal label="Import from Url">
              <b-input v-model="url" placeholder="Enter RSS Feed or Website">
              </b-input>
            </b-field>
            <b-field horizontal label="Network">
              <b-select
                v-model="networkId"
                placeholder="Select a podcast network"
                required
              >
                <option
                  v-for="network in networks"
                  :key="network.id"
                  :value="network.id"
                >
                  {{ network.title }}
                </option>
              </b-select>
            </b-field>
            <div class="podlove-step-navigation-group">
              <b-button
                :disabled="networkId === null"
                @click.stop.prevent="fetchPodcastInfos()"
                class="is-primary"
              >
                Check Podcast
              </b-button>
            </div>
          </section>
        </b-step-item>
        <b-step-item label="Check Podcast">
          <section>
            <b-loading :active.sync="isFetchingInfos"></b-loading>
            <div class="podcast-name">
              <div
                :style="{
                  backgroundImage: `url(${
                    feedInfo && feedInfo.image ? feedInfo.image : ''
                  })`
                }"
                class="r_podcast__cover has-background-dark"
              ></div>
              <div class="r_podcast__title">
                <h1 class="is-size-5">{{ feedInfo.title }}</h1>
                <h2 class="is-size-7">{{ feedInfo.subtitle }}</h2>
              </div>
            </div>
            <div class="r_podcast__details">
              <b-field class="customfield" horizontal label="Feed Url">
                <span>{{ url }}</span>
              </b-field>
              <b-field class="customfield" horizontal label="Podcast Url">
                <span>{{ feedInfo.link }}</span>
              </b-field>
              <b-field class="customfield" horizontal label=" ">
                <span>
                  <span class="r_podcast__count">
                    {{ feedInfo.feeds ? feedInfo.feeds[0].episodeCount : 0 }}
                    Episodes
                  </span>
                  <span>
                    are published in
                    {{ feedInfo.title }}.
                  </span>
                </span>
              </b-field>
              <b-field horizontal label="Import latest">
                <b-input
                  v-model="episodeCount"
                  placeholder="123"
                  class="smallfield"
                  expanded
                ></b-input>
                <p>Episodes</p>
              </b-field>
              <b-field horizontal label="Short ID">
                <b-input
                  v-model="feedInfo.suggestedShortId"
                  class="smallfield"
                ></b-input>
              </b-field>
            </div>
            <div class="podlove-step-navigation-group">
              <b-button @click.stop.prevent="navigateTo(0)" class="is-primary">
                Back
              </b-button>
              <b-button
                @click.stop.prevent="fetchEpisodes()"
                class="is-primary"
              >
                Import Podcast
              </b-button>
            </div>
          </section>
        </b-step-item>
        <b-step-item label="Import Episodes">
          <section>
            <div class="podcast-name">
              <div
                :style="{
                  backgroundImage: `url(${
                    feedInfo && feedInfo.image ? feedInfo.image : ''
                  })`
                }"
                class="r_podcast__cover has-background-dark"
              ></div>
              <div class="r_podcast__title">
                <h1 class="is-size-5">{{ feedInfo.title }}</h1>
                <h2 class="r_podcast__subtitle is-size-7">
                  {{ feedInfo.subtitle }}
                </h2>
              </div>
            </div>
            <b-progress
              v-if="
                !(
                  Object.entries(currentTask).length === 0 &&
                  currentTask.constructor === Object
                )
              "
              :value="currentTask.progress"
              :max="currentTask.total"
              type="is-primary"
              size="is-medium"
              show-value
            >
              {{ currentTask.progress }} / {{ currentTask.total }}
            </b-progress>
            <episodes-table
              v-if="podcast && podcast.episodes && podcast.episodes.length"
              :episodes="podcast.episodes"
              :podcast="podcast"
              :network="activeNetwork"
            ></episodes-table>
            <b-table :data="feeds[0] ? feeds[0].episodes : []" :striped="true">
              <template slot-scope="props">
                <b-table-column field="id" label="ID" width="40" numeric>
                  {{ props.row.id }}
                </b-table-column>
                <b-table-column field="title" label="Title">
                  {{ props.row.title }}
                </b-table-column>
                <b-table-column
                  :class="checkField(props.row.mp3)"
                  field="mp3"
                  label="mp3"
                >
                  {{ props.row.mp3 }}
                </b-table-column>
                <b-table-column
                  :class="checkField(props.row.m4a)"
                  field="m4a"
                  label="m4a"
                >
                  {{ props.row.m4a }}
                </b-table-column>
                <b-table-column
                  :class="checkField(props.row.ogg)"
                  field="ogg"
                  label="ogg"
                >
                  {{ props.row.ogg }}
                </b-table-column>
                <b-table-column
                  :class="checkField(props.row.transcripts)"
                  field="transcripts"
                  label="Transcripts"
                >
                  {{ props.row.transcripts }}
                </b-table-column>
                <b-table-column
                  :class="checkField(props.row.chapter_marks)"
                  field="chapter_marks"
                  label="Chapter Marks"
                >
                  {{ props.row.chapter_marks }}
                </b-table-column>
              </template>
            </b-table>
            <div class="podlove-step-navigation-group">
              <b-button @click.stop.prevent="stopImport()" class="is-primary">
                Stop Import
              </b-button>
              <b-button
                @click="$router.push(`/network/${networkId}/podcast/${pid}`)"
                class="is-primary"
              >
                Go to Podcast Overview
              </b-button>
            </div>
          </section>
        </b-step-item>
      </b-steps>
    </section>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { ToastProgrammatic as Toast } from 'buefy'
import EpisodesTable from '~/components/EpisodesTable'

export default {
  components: {
    EpisodesTable
  },
  data() {
    return {
      activeStep: 0,
      episodeCount: 10,
      networkId: null,
      pid: null,
      url:
        'http://feeds.soundcloud.com/users/soundcloud:users:284192316/sounds.rss'
    }
  },
  computed: {
    ...mapState({
      activeNetwork: state => state.networks.activeNetwork,
      networks: state => state.networks.networks,
      feedInfo: state => state.feedInfo.feedInfo,
      feeds: state => state.feedInfo.feeds,
      currentTask: state => state.feedInfo.currentTask,
      podcast: state => state.podcasts.activePodcast
    }),
    isFetchingInfos() {
      return (
        Object.entries(this.feedInfo).length === 0 &&
        this.feedInfo.constructor === Object
      )
    }
  },
  methods: {
    checkField(value) {
      return value ? 'is-success' : 'is-danger'
    },
    navigateTo(step) {
      this.activeStep = step
    },
    fetchPodcastInfos() {
      this.$store.dispatch('feedInfo/catchFeedInfo', {
        url: this.url
      })
      this.navigateTo(1)
    },
    fetchEpisodes() {
      let enclosureType = ''
      let feedUrl = ''
      let feedLength = 0

      this.feedInfo.feeds.forEach(d => {
        if (d.enclosureType === 'audio/mpeg') {
          enclosureType = d.enclosureType
          feedUrl = d.feedUrl
          feedLength = d.episodeCount
        }
      })
      const importPodcastFeed = {
        network_id: this.networkId,
        feed_url: feedUrl,
        enclosure_types: enclosureType,
        short_id: this.feedInfo.suggestedShortId
      }

      if (this.episodeCount > 0 && this.episodeCount <= feedLength) {
        importPodcastFeed.limit = this.episodeCount
      }

      this.$store.dispatch('feedInfo/createTask', importPodcastFeed)
      this.navigateTo(2)
      this.observeTaskStatus()
    },
    stopImport() {
      Toast.open({
        message: `Import ${this.podcast.title} was stopped.`,
        type: 'is-danger'
      })
      this.$store.dispatch('feedInfo/deleteTask', {
        taskId: this.currentTask.id
      })
    },
    showTask() {
      this.$store.dispatch('feedInfo/readTask', { taskId: this.currentTask.id })
    },
    observeTaskStatus(callback) {
      const self = this
      setTimeout(checkTaskStatus, 0)
      function checkTaskStatus() {
        if (
          self.currentTask._links !== undefined &&
          self.currentTask._links['rad:subject'] !== undefined
        ) {
          const pid = self.currentTask._links['rad:subject'].href.split('/')
          self.pid = pid[pid.length - 1]
          self.$store.dispatch('podcasts/getPodcast', {
            id: self.pid
          })
        }
        if (self.currentTask.id !== undefined) {
          self.$store.dispatch('feedInfo/readTask', {
            taskId: self.currentTask.id
          })
        }
        if (self.currentTask.state !== 'done') {
          setTimeout(checkTaskStatus, 2000)
        } else {
          Toast.open({
            message: `Import ${self.podcast.title} was successful.`,
            type: 'is-success'
          })
          self.$store
            .dispatch('feedInfo/deleteTask', { taskId: self.currentTask.id })
            .then(() => {
              self.$router.push(
                `/network/${self.networkId}/podcast/${self.pid}`
              )
            })
        }
      }
    }
  }
}
</script>

<style lang="scss" scopped>
.podcasts__main {
  margin: 40px auto;
}

.step-content {
  margin-top: 2em;
}
.podcast__import {
  text-align: center;
}
.field.customfield {
  margin: 0.5em 0;
  align-items: baseline;
}
.field-body {
  text-align: left;
}
.smallfield {
  width: 5em;
}
.r_podcast__count {
  font-weight: bold;
}
.podcast-name {
  display: flex;
  direction: row;
  justify-content: flex-end;
  margin: 1.5em 0 2em 0;
  // align-items: center;
  // align-content: center;
}

.podlove-step-navigation-group {
  margin: 1em 0;
}
.r_podcast__cover {
  background-size: cover;
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  position: relative;
  margin-right: 10px;
  width: 100px;
  height: 100px;
}

.r_podcast__title {
  text-align: left;
}

.import-switch {
  label.switch {
    flex-direction: row-reverse;

    .control-label {
      padding-left: 0px;
      padding-right: 0.5em;
    }
  }
}
</style>
