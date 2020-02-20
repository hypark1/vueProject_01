<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="광고주별 보고서"/>
        <div class="separator mt-2 mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-form @submit.prevent="submitSearch">
            <b-row class="m-0 mb-3">
              <template v-if="['ADMINISTRATOR', 'MANAGER'].includes(response.user_session.role)">
                <b-form-group v-if="response.agencyOptions">
                  <v-select v-model="selectForm.agency"
                            :options="response.agencyOptions"
                            @change="agencySelect()"
                            class="mr-2" style="width:200px"
                            placeholder="대행사 검색"/>
                </b-form-group>
              </template>
              <template v-if="['ADMINISTRATOR', 'MANAGER', 'AGENCY'].includes(response.user_session.role)">
              <b-form-group v-if="response.agentOptions">
                <v-select v-model="selectForm.agent"
                          :options="response.agentOptions"
                          @change="agentSelect()"
                          class="mr-2" style="width:200px"
                          placeholder="영업자 검색"/>
              </b-form-group>
              </template>
              <b-form-group v-if="response.advertiserOptions">
                <v-select v-model="selectForm.advertiser"
                          :options="response.advertiserOptions"
                          @change="advertiserSelect()"
                          class="mr-2" style="width:200px"
                          placeholder="광고주 검색"/>
              </b-form-group>
              <b-form-group>
                <b-form-group>
                  <b-form-input type="text" v-model="search" placeholder="광고주명 검색" required />
                </b-form-group>
              </b-form-group>
              <b-form-group>
                <b-button type="submit" class="d-inline-block default border" variant="light">검색</b-button>
              </b-form-group>
            </b-row>
          </b-form>
          <b-table class="text-center"
                   hover
                   bordered
                   show-empty
                   :items="resultAdvertiser.data"
                   :fields="config.advertiserField"
                   @row-clicked="advertiserRowClick">
            <template slot="empty">
              광고주가 없습니다.
            </template>
            <template slot="no" slot-scope="data">
              {{resultAdvertiser.total - (resultAdvertiser.per_page * (currentPage - 1)) - data.index}}
            </template>
            <template slot="campaign" slot-scope="data">
              <template v-if="data.item.all_cam !== 0">
                <router-link :to="({ name: 'reportCampaignIndex', query: { page: 1, publisher: data.item.company_id, agent: data.item.agent_id, advertiser: data.item.id } })">
                  <b-button variant="info" size="xs">
                    {{data.item.live_cam}} / {{data.item.all_cam}}
                  </b-button>
                </router-link>
              </template>
              <template v-else><b-button variant="info" size="xs">0 / 0</b-button></template>
            </template>
            <template slot="budget" slot-scope="data">
              {{numReplace(data.value)}}원
            </template>
            <template slot="pay" slot-scope="data">
              {{numReplace(data.value)}}원
            </template>
            <template slot="pay_p" slot-scope="data">
              <b-progress class="h-25">
                <b-progress-bar :value="percentFixed(data)"
                                :variant="existsDeliveringLineItem(data) ? 'success' : 'warning' "
                                :striped="existsDeliveringLineItem(data)"
                                :animated="existsDeliveringLineItem(data)"
                                :label-html="`<strong style='color: black'>` + percentFixed(data) + `%</strong>`">
                </b-progress-bar>
              </b-progress>
            </template>
            <template slot="views" slot-scope="data">
              {{numReplace(data.value)}}
            </template>
            <template slot="clicks" slot-scope="data">
              {{numReplace(data.value)}}
            </template>
            <template slot="ctr" slot-scope="data">
              <template v-if="data.item.views === '0' || data.item.views === '0'">0 %</template>
              <template v-else>{{(data.item.clicks/data.item.views * 100).toFixed(2)}} %</template>
            </template>
          </b-table>
          <b-pagination-nav
            size="sm"
            align="center"
            v-model="currentPage"
            :link-gen="linkGen"
            :number-of-pages="resultAdvertiser.last_page">
          </b-pagination-nav>
        </b-card>
      </b-colxx>
    </b-row>
    <div class="spinner-background" v-show="response.spinner">
      <b-spinner variant="info"></b-spinner>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import vSelect from 'vue-select'

export default {
  components: {
    vSelect
  },
  created () {
    this.roleSelect()
  },
  data () {
    return {
      response: {
        spinner: true,
        agency_id: this.$route.params.agency_id,
        agency_name: this.$route.params.agency_name,
        agent_id: this.$route.params.agent_id,
        agent_name: this.$route.params.agent_name,
        user_session: JSON.parse(localStorage.getItem('user')),
        advertiser: null,
        searchList: null,
        agencyOptions: [],
        agentOptions: [],
        advertiserOptions: [],
        searchListPublisher: null,
        searchListAgent: null,
        searchListAdvertiser: null,
        type: null
      },
      selectForm: {
        agency: { value: '', label: '대행사 전체' },
        agencyData: { value: '', label: '대행사 전체' },
        agent: { value: '', label: '영업자 전체' },
        agentData: { value: '', label: '영업자 전체' },
        advertiser: { value: '', label: '광고주 전체' },
        advertiserData: { value: '', label: '광고주 전체' }
      },
      currentPage: this.$route.query.page,
      search: '',
      config: {
        advertiserField: {
          no: { label: 'No', sortable: true },
          name: { label: '광고주', tdClass: 'table_title' },
          campaign: { label: '캠페인수' },
          budget: { label: '총예산', tdClass: 'table_num' },
          pay: { label: '소진 예산', tdClass: 'table_num' },
          pay_p: { label: '소진율', tdClass: 'table_num' },
          views: { label: 'VIEW', tdClass: 'table_num' },
          clicks: { label: 'CLICK', tdClass: 'table_num' },
          ctr: { label: 'CTR', tdClass: 'table_num' }
        }
      },
      fresh: false
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    linkGen (pageNum) {
      let send = { page: pageNum }
      if (this.$route.query.publisher) {
        if (this.$route.query.agent) {
          if (this.$route.query.advertiser) {
            send.publisher = this.$route.query.publisher
            send.agent = this.$route.query.agent
            send.advertiser = this.$route.query.advertiser
          } else {
            send.publisher = this.$route.query.publisher
            send.agent = this.$route.query.agent
          }
        } else {
          send.publisher = this.$route.query.publisher
        }
      }
      if (this.$route.query.search) {
        send.search = this.$route.query.search
      }
      return {
        name: 'reportAdvertiserIndex', query: send
      }
    },
    advertiserRowClick (data, index) {
      if (['ADMINISTRATOR', 'MANAGER'].includes(this.response.user_session.role)) {
        this.$router.push({ name: 'memberEdit', params: { user_id: data.id, type: 'reportAdvertiser' } })
      } else {
        this.$router.push({ name: 'userEdit', params: { user_id: data.id } })
      }
    },
    numReplace: function (num) {
      num = num + ''
      const result = num.replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return result
    },
    roleSelect () {
      if (['ADMINISTRATOR', 'MANAGER', 'AGENCY', 'AGENT'].includes(this.response.user_session.role)) {
        if (this.response.user_session.role === 'AGENCY' && !this.response.agency_id) {
          this.$route.query.publisher = this.response.user_session.cid
        } else if (this.response.user_session.role === 'AGENT' && !this.response.agency_id) {
          this.$route.query.publisher = this.response.user_session.cid
          this.$route.query.agent = this.response.user_session.id
        }
        this.getPublisherOptions()
      } else {
        this.$router.push({ name: 'contactsIndex' })
      }
    },
    fnRefresh () {
      let pubArr = this.$route.query.publisher
      let send = { page: this.$route.query.page }
      if (pubArr) {
        this.getAgentOptions(pubArr)
        let agentArr = this.$route.query.agent
        if (agentArr) {
          this.getAdvertiserOptions(pubArr, agentArr)
          let advertiserArr = this.$route.query.advertiser
          if (advertiserArr) {
            send.publisher = pubArr
            send.agent = agentArr
            send.advertiser = advertiserArr
          } else {
            send.publisher = pubArr
            send.agent = agentArr
          }
        } else {
          send.publisher = pubArr
        }
      }
      if (this.$route.query.search) {
        this.search = this.$route.query.search
        send.search = this.search
      }
      this.$router.push({ name: 'reportAdvertiserIndex', query: send })
      this.getAdvertiser()
    },
    queryPublisher () {
      let pubArr = this.$route.query.publisher
      if (pubArr) {
        let pub = null
        let result = this.response.agencyOptions.filter(function (val) {
          return Number(val.value) === Number(pubArr)
        })
        if (result) { pub = result[0] }
        this.selectForm.agency = pub
      }
    },
    queryAgent () {
      let agentArr = this.$route.query.agent
      if (agentArr) {
        let pub = null
        let result = this.response.agentOptions.filter(function (val) {
          return Number(val.value) === Number(agentArr)
        })
        if (result) {
          pub = result[0]
        }
        this.selectForm.agent = pub
      }
    },
    queryAdvertiser () {
      let advertiserArr = this.$route.query.advertiser
      if (advertiserArr) {
        let pub = null
        let result = this.response.advertiserOptions.filter(function (val) {
          return Number(val.value) === Number(advertiserArr)
        })
        if (result) {
          pub = result[0]
        }
        this.selectForm.advertiser = pub
      }
    },
    getPublisherOptions: function () {
      this.xhttp({
        url: '/report/search',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.searchListPublisher = response.data
          if (this.response.searchListPublisher.data) {
            // 대행사 전체
            this.response.agencyOptions = this.response.searchListPublisher.data.map(function ($value) {
              return { value: $value.id, label: $value.name }
            })
            this.response.agencyOptions.unshift(
              { value: '', label: '대행사 전체' }
            )
            this.queryPublisher()
            this.fnRefresh()
          }
        }
      }).catch((error) => {
        this.response.searchListPublisher = error.response
        this.respError(error)
      })
    },
    getAgentOptions: function (id) {
      let send = {}
      send.agency_id = id
      this.xhttp({
        url: '/report/search',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.searchListAgent = response.data
          if (this.response.searchListAgent.data) {
            // 영업자 전체
            this.response.agentOptions = this.response.searchListAgent.data.map(function ($value) {
              return { value: $value.id, label: $value.name }
            })
            this.response.agentOptions.unshift(
              { value: '', label: '영업자 전체' }
            )
          }
          this.queryAgent()
        }
      }).catch((error) => {
        this.response.searchListAgent = error.response
        this.respError(error)
      })
    },
    getAdvertiserOptions: function (agency, agent) {
      let send = {}
      send.agency_id = agency
      send.agent_id = agent
      this.xhttp({
        url: '/report/search',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.searchListAdvertiser = response.data
          if (this.response.searchListAdvertiser.data) {
            // 광고주 전체
            this.response.advertiserOptions = this.response.searchListAdvertiser.data.map(function ($value) {
              return { value: $value.id, label: $value.name }
            })
            this.response.advertiserOptions.unshift(
              { value: '', label: '광고주 전체' }
            )
          }
          this.queryAdvertiser()
        }
      }).catch((error) => {
        this.response.searchListAdvertiser = error.response
        this.respError(error)
      })
    },
    submitSearch: function () {
      let agency = this.selectForm.agency.value
      let agent = this.selectForm.agent.value
      let advertiser = this.selectForm.advertiser.value
      if (agency === '') {
        this.agencySelect()
      } else {
        if (agent === '') {
          this.agencySelect()
        } else {
          if (advertiser === '') {
            this.agentSelect()
          } else {
            this.advertiserSelect()
          }
        }
      }
    },
    getAdvertiser: function () {
      this.response.spinner = true
      let send = {
        page: this.currentPage
      }
      if (this.$route.query.search) {
        this.search = this.$route.query.search
        send.search_text = this.search
      }
      if (this.$route.query.publisher) {
        send.agency = this.$route.query.publisher
        if (this.$route.query.agent) {
          send.agent = this.$route.query.agent
          if (this.$route.query.advertiser) {
            send.advertiser = this.$route.query.advertiser
          }
        }
      }
      this.xhttp({
        url: '/report/advertiser',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.advertiser = response.data
          this.response.type = true
          this.fresh = true
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.advertiser = error.response
        this.respError(error)
      })
    },
    agencySelect: function () {
      if (this.fresh) {
        let agency = this.selectForm.agency.value
        this.response.agentOptions = [this.selectForm.agentData]
        this.selectForm.agent = this.selectForm.agentData
        let send = { page: 1 }
        if (agency === '') {
        } else {
          this.getAgentOptions(agency)
          send.publisher = agency
        }
        if (this.search) {
          send.search = this.search
        }
        this.$router.push({ name: 'reportAdvertiserIndex', query: send })
        this.currentPage = 1
        this.getAdvertiser()
      }
    },
    agentSelect: function () {
      if (this.fresh) {
        let agency = this.selectForm.agency.value
        let agent = this.selectForm.agent.value
        let send = { page: 1 }
        if (agent === '') {
          send.publisher = agency
        } else {
          this.getAdvertiserOptions(agency, agent)
          send.publisher = agency
          send.agent = agent
        }
        if (this.search) {
          send.search = this.search
        }
        this.$router.push({ name: 'reportAdvertiserIndex', query: send })
        this.currentPage = 1
        this.getAdvertiser()
      }
    },
    advertiserSelect: function () {
      if (this.fresh) {
        let agency = this.selectForm.agency.value
        let agent = this.selectForm.agent.value
        let advertiser = this.selectForm.advertiser.value
        let send = { page: 1 }
        if (agent === '') {
          send.publisher = agency
        } else if (advertiser === '') {
          send.publisher = agency
          send.agent = agent
        } else {
          send.publisher = agency
          send.agent = agent
          send.advertiser = advertiser
        }
        if (this.search) {
          send.search = this.search
        }
        this.$router.push({ name: 'reportAdvertiserIndex', query: send })
        this.currentPage = 1
        this.getAdvertiser()
      }
    },
    /**
     * Order의 lineItems들 중 DEVELIVERING 상태인게 있나?
     * @param Statuses
     * @returns {boolean}
     */
    existsDeliveringLineItem (Statuses) {
      var num = this.percentFixed(Statuses)
      if (num > 0 && num < 100) {
        return true
      } else {
        return false
      }
    },
    percentFixed (data) {
      if (data.item.pay === '0' || data.item.budget === '0') {
        return 0
      } else {
        return Number((data.item.pay / data.item.budget * 100).toFixed(2))
      }
    },
    respSuccess: function () {
      this.$Progress.finish()
      this.response.spinner = false
    },
    respError: function (error) {
      if (error.response.data.messages.message) {
        this.$notify('error', '오류', error.response.data.messages.message)
      } else {
        this.$notify('error', '오류', '관리자에게 문의바랍니다.')
      }
      this.$Progress.fail()
      this.response.spinner = false
    }
  },
  watch: {
    search: function () {
      if (this.search === '') {
        this.submitSearch()
      }
    },
    currentPage: function () {
      this.getAdvertiser()
    }
  },
  computed: {
    resultAdvertiser () {
      if (this.response.advertiser && this.response.advertiser.success === true && this.response.advertiser.data.data.length > 0) {
        return this.response.advertiser.data
      } else {
        return false
      }
    }
  }
}
</script>
