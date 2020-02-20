<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="캠페인별 보고서"/>
        <div class="separator mt-2 mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4 cf">
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
              <template v-if="['ADMINISTRATOR', 'MANAGER', 'AGENCY', 'AGENT'].includes(response.user_session.role)">
                <b-form-group v-if="response.advertiserOptions">
                  <v-select v-model="selectForm.advertiser"
                            :options="response.advertiserOptions"
                            @change="advertiserSelect()"
                            class="mr-2" style="width:200px"
                            placeholder="광고주 검색"/>
                </b-form-group>
              </template>
              <b-form-group v-if="response.statusOptions">
                <v-select v-model="selectForm.status"
                          :options="response.statusOptions"
                          @change="submitSearch()"
                          class="mr-2" style="width:200px"
                          placeholder="상태 검색"/>
              </b-form-group>
              <b-form-group>
                <b-form-group>
                  <b-form-input type="text" v-model="search" placeholder="캠페인명, 광고주명" required />
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
                   :items="resultCampaigns.data"
                   :fields="config.campaignsField"
                   @row-clicked="tableRowClick">
            <template slot="empty">
              캠페인이 없습니다.
            </template>
            <template slot="no" slot-scope="data">
              {{resultCampaigns.total - (resultCampaigns.per_page * (currentPage - 1)) - data.index}}
            </template>
            <template slot="start_date" slot-scope="data">
              {{data.value.substring(2,10)}}<br>
              ~ {{data.value.substring(2,10)}}
            </template>
            <template slot="status" slot-scope="data">
              <template v-if="statusTxt[data.value]">
                {{statusTxt[data.value]}}
              </template>
              <template v-else>{{data.value}}</template>
            </template>
            <template slot="budget" slot-scope="data">
              {{numReplace(data.value)}}원
            </template>
            <template slot="amount" slot-scope="data">
              {{numReplace(data.value)}}원
            </template>
            <template slot="now_budget" slot-scope="data">
              <template v-if="data.value > 0">
                {{numReplace(data.value)}}원
              </template>
              <template v-else>0 원</template>
            </template>
            <template slot="amount_p" slot-scope="data">
              <b-progress class="h-25">
                <b-progress-bar :value="Number(data.value)"
                                :variant="existsDeliveringLineItem(data.item.status) ? 'success' : 'warning' "
                                :striped="existsDeliveringLineItem(data.item.status)"
                                :animated="existsDeliveringLineItem(data.item.status)"
                                :label-html="`<strong style='color: black'>` + data.value + `%</strong>`">
                </b-progress-bar>
              </b-progress>
            </template>
            <template slot="views" slot-scope="data">
              {{numReplace(data.value)}}
            </template>
            <template slot="play" slot-scope="data">
              <template v-if="data.item.format === 'IMAGE'">-</template>
              <template v-else-if="data.value">
                {{numReplace(data.value)}}
              </template>
              <template v-else>-</template>
            </template>
            <template slot="play_time" slot-scope="data">
              <template v-if="data.item.format === 'IMAGE'">-</template>
              <template v-else-if="data.value">
                {{timeSet(data.value)}}
              </template>
              <template v-else>-</template>
            </template>
            <template slot="clicks" slot-scope="data">
              {{numReplace(data.value)}}
            </template>
            <template slot="ctr" slot-scope="data">
              <template v-if="data.value === '0.00'">0</template>
              <template v-else>{{data.value}}%</template>
            </template>
            <template slot="keyword" slot-scope="data">
              <b-button variant="info" size="xs" @click="keywordLink(data.item)">보기</b-button>
            </template>
          </b-table>
          <b-pagination-nav
            size="sm"
            align="center"
            v-model="currentPage"
            :link-gen="linkGen"
            :number-of-pages="resultCampaigns.last_page">
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
    this.getStatus()
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
        advertiser_id: this.$route.params.advertiser_id,
        advertiser_name: this.$route.params.advertiser_name,
        user_session: JSON.parse(localStorage.getItem('user')),
        campaign: null,
        status: null,
        searchList: null,
        agencyOptions: [],
        agentOptions: [],
        advertiserOptions: [],
        searchListPublisher: null,
        searchListAgent: null,
        searchListAdvertiser: null,
        type: null
      },
      vModel: {
        search_text: null
      },
      datePickerRange: {
        start: this.$moment(this.$route.query.start).add(-6, 'days')._d,
        end: this.$moment(this.$route.query.end)._d
      },
      selectForm: {
        agency: { value: '', label: '대행사 전체' },
        agencyData: { value: '', label: '대행사 전체' },
        agent: { value: '', label: '영업자 전체' },
        agentData: { value: '', label: '영업자 전체' },
        advertiser: { value: '', label: '광고주 전체' },
        advertiserData: { value: '', label: '광고주 전체' },
        status: { value: '', label: '상태 전체' }
      },
      currentPage: this.$route.query.page,
      search: '',
      fresh: false,
      config: {
        campaignsField: {
          no: { label: 'No', sortable: true },
          line_item_name: { label: '캠페인 명', tdClass: 'table_title', thStyle: { width: '240px' } },
          format: { label: '포맷' },
          start_date: { label: '시작일' },
          status: { label: '상태' },
          budget: { label: '총예산', tdClass: 'table_num' },
          amount: { label: '소진예산', tdClass: 'table_num' },
          now_budget: { label: '잔여예산', tdClass: 'table_num' },
          amount_p: { label: '소진율', tdClass: 'table_num' },
          views: { label: 'VIEW', tdClass: 'table_num' },
          play: { label: '재생', tdClass: 'table_num' },
          play_time: { label: '재생시간', tdClass: 'table_num' },
          clicks: { label: 'CLICK', tdClass: 'table_num' },
          ctr: { label: 'vCTR', tdClass: 'table_num' },
          keyword: { label: '유입 키워드' }
        }
      },
      statusTxt: {
        'DRAFT': '임시',
        'INACTIVE': '승인 대기',
        'READY': '준비',
        'PENDING APPROVAL': '승인 대기 중',
        'DISAPPROVED': '승인되지 않음',
        'EXPECTED TO UNDERDELIVER': '미달게재 예상됨',
        'DELIVERING': '게재 중',
        'COMPLETED': '완료',
        'PAUSED': '일시중지',
        'DELIVERY EXTENDED': '게재 연장됨',
        'PAUSED_INVENTORY_RELEASED': '정지(IR)'
      }
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
      if (this.$route.query.status) {
        send.status = this.$route.query.status
      }
      return {
        name: 'reportCampaignIndex', query: send
      }
    },
    getStatus: function () {
      this.xhttp({
        url: '/report/lineItemStatus',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.status = response.data
          this.response.statusOptions = this.response.status.map(function ($value) {
            return { value: $value.key, label: $value.value }
          })
          this.response.statusOptions.unshift(
            { value: '', label: '상태 전체' }
          )
          this.queryStatus()
        }
      }).catch((error) => {
        this.response.status = error.response
        this.respError(error)
      })
    },
    roleSelect () {
      if (this.response.user_session.role === 'PUBLISHER') {
        this.$router.push({ name: 'contactsIndex' })
      } else {
        if (this.response.user_session.role === 'AGENCY' && !this.response.agency_id) {
          this.$route.query.publisher = this.response.user_session.cid
        } else if (this.response.user_session.role === 'AGENT' && !this.response.agency_id) {
          this.$route.query.publisher = this.response.user_session.cid
          this.$route.query.agent = this.response.user_session.id
        }
        if (this.response.user_session.role === 'ADVERTISER' && !this.response.agency_id) {
          this.$route.query.advertiser = this.response.user_session.id
        }
      }
      this.getPublisherOptions()
    },
    fnRefresh () {
      let pubArr = this.$route.query.publisher
      let send = { page: this.$route.query.page }
      if (pubArr) {
        this.getAgentOptions(pubArr)
        let agentArr = this.$route.query.agent
        if (agentArr) {
          this.getAdvertiserOptions(pubArr, agentArr)
          send.publisher = pubArr
          send.agent = agentArr
        } else {
          send.publisher = pubArr
        }
      }
      let advertiserArr = this.$route.query.advertiser
      if (advertiserArr) {
        send.advertiser = advertiserArr
      }
      if (this.$route.query.search) {
        this.search = this.$route.query.search
        send.search = this.search
      }
      if (this.$route.query.status) {
        send.status = this.$route.query.status
      }
      this.$router.push({ name: 'reportCampaignIndex', query: send })
      this.getCampaign()
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
    queryStatus () {
      let statusArr = this.$route.query.status
      if (statusArr) {
        let pub = null
        let result = this.response.statusOptions.filter(function (val) {
          return val.value === statusArr
        })
        if (result) {
          pub = result[0]
        }
        this.selectForm.status = pub
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
      if (this.response.user_session.role === 'ADVERTISER') {
        let send = { page: 1 }
        if (this.search) {
          this.$route.query.search = this.search
          send.search = this.search
        }
        if (this.selectForm.status.value !== '') {
          this.$route.query.status = this.selectForm.status.value
          send.status = this.selectForm.status.value
        }
        send.advertiser = this.$route.query.advertiser
        this.$router.push({ name: 'reportCampaignIndex', query: send })
        this.currentPage = 1
        this.getCampaign()
      }
    },
    getCampaign: function () {
      this.response.spinner = true
      let send = {
        page: this.currentPage
      }
      if (this.$route.query.search) {
        this.search = this.$route.query.search
        send.search_text = this.search
      }
      if (this.$route.query.status) {
        send.status = this.$route.query.status
      }
      if (this.$route.query.publisher) {
        send.agency = this.$route.query.publisher
        if (this.$route.query.agent) {
          send.agent = this.$route.query.agent
        }
      }
      if (this.$route.query.advertiser) {
        send.advertiser = this.$route.query.advertiser
      }
      this.xhttp({
        url: 'report/lineItemReport',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.campaign = response.data
          this.response.type = true
          this.fresh = true
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.campaign = error.response
        this.respError(error)
      })
    },
    agencySelect: function () {
      if (this.fresh && this.response.user_session.role !== 'ADVERTISER') {
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
        if (this.selectForm.status.value !== '') {
          send.status = this.selectForm.status.value
        }
        this.$router.push({ name: 'reportCampaignIndex', query: send })
        this.currentPage = 1
        this.getCampaign()
      }
    },
    agentSelect: function () {
      if (this.fresh && this.response.user_session.role !== 'ADVERTISER') {
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
        if (this.selectForm.status.value !== '') {
          send.status = this.selectForm.status.value
        }
        this.$router.push({ name: 'reportCampaignIndex', query: send })
        this.currentPage = 1
        this.getCampaign()
      }
    },
    advertiserSelect: function () {
      if (this.fresh && this.response.user_session.role !== 'ADVERTISER') {
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
        if (this.selectForm.status.value !== '') {
          send.status = this.selectForm.status.value
        }
        this.$router.push({ name: 'reportCampaignIndex', query: send })
        this.currentPage = 1
        this.getCampaign()
      }
    },
    numReplace: function (num) {
      num = num + ''
      const result = num.replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return result
    },
    timeSet: function (val) {
      val = Number(val)
      let hour = parseInt(val / 3600) + ''
      let min = parseInt((val % 3600) / 60) + ''
      if (min.length === 1) {
        min = 0 + min
      }
      let sec = val % 60 + ''
      if (sec.length === 1) {
        sec = 0 + sec
      }
      return hour + '시간 ' + min + '분 ' + sec + '초'
    },
    tableRowClick (data, index) {
      let start = this.$moment(this.datePickerRange.start).format('YYYY-MM-DD')
      let end = this.$moment(this.datePickerRange.end).format('YYYY-MM-DD')
      this.$router.push({ name: 'reportCampaignPeriod', params: { advertiser_name: data.advertiser_name, line_item_id: data.line_item_id }, query: { type: data.format, start: start, end: end } })
    },
    keywordLink (data) {
      this.$router.push({ name: 'reportKeywordIndex', params: { line_item_id: data.line_item_id } })
    },
    /**
     * Order의 lineItems들 중 DEVELIVERING 상태인게 있나?
     * @param Statuses
     * @returns {boolean}
     */
    existsDeliveringLineItem (Statuses) {
      if (Statuses === 'DELIVERING') {
        return true
      } else {
        return false
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
    currentPage: function () {
      this.getCampaign()
    },
    search: function () {
      if (this.search === '') {
        this.submitSearch()
      }
    }
  },
  computed: {
    resultCampaigns () {
      if (this.response.campaign && this.response.campaign.success === true && this.response.campaign.data.data.length > 0) {
        return this.response.campaign.data
      } else {
        return false
      }
    }
  }
}
</script>
