<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="대행사별 보고서"/>
        <div class="separator mt-2 mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-form>
            <b-row class="m-0 mb-3">
              <b-form-group v-if="response.agencyOptions">
                <v-select v-model="selectForm.agency" :options="response.agencyOptions" class="mr-2" style="width:200px" placeholder="대행사 검색"/>
              </b-form-group>
            </b-row>
          </b-form>
          <b-table class="text-center"
                   hover
                   bordered
                   show-empty
                   :items="resultAgency.data"
                   :fields="config.agencyField"
                   @row-clicked="agencyRowClick">
            <template slot="empty">
              대행사가 없습니다.
            </template>
            <template slot="no" slot-scope="data">
              {{resultAgency.total - (resultAgency.per_page * (currentPage - 1)) - data.index}}
            </template>
            <template slot="agent_cnt" slot-scope="data">
              <template v-if="data.value !== '0'">
                <router-link :to="({ name: 'reportAgentIndex', query: { page: 1, publisher: data.item.id } })">
                  <b-button variant="info" size="xs">{{data.value}}</b-button>
                </router-link>
              </template>
              <template v-else> <b-button variant="info" size="xs">{{data.value}}</b-button></template>
            </template>
            <template slot="adver_cnt" slot-scope="data">
              <template v-if="data.value !== '0'">
              <router-link :to="({ name: 'reportAdvertiserIndex', query: { page: 1, publisher: data.item.id } })">
                <b-button variant="info" size="xs">{{data.value}}</b-button>
              </router-link>
              </template>
              <template v-else><b-button variant="info" size="xs">{{data.value}}</b-button></template>
            </template>
            <template slot="campaign" slot-scope="data">
              <template v-if="data.item.all_cam !== 0">
              <router-link :to="({ name: 'reportCampaignIndex', query: { page: 1, publisher: data.item.id } })">
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
            :number-of-pages="resultAgency.last_page">
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
        user_session: JSON.parse(localStorage.getItem('user')),
        agency: null,
        searchList: null,
        agencyOptions: []
      },
      selectForm: {
        agency: { value: '', label: '대행사 전체' }
      },
      currentPage: this.$route.query.page,
      config: {
        agencyField: {
          no: { label: 'No', sortable: true },
          name: { label: '대행사', tdClass: 'table_title' },
          agent_cnt: { label: '영업자수' },
          adver_cnt: { label: '광고주수' },
          campaign: { label: '캠페인수' },
          budget: { label: '총예산', tdClass: 'table_num' },
          pay: { label: '소진 예산', tdClass: 'table_num' },
          pay_p: { label: '소진율', tdClass: 'table_num' },
          views: { label: 'VIEW', tdClass: 'table_num' },
          clicks: { label: 'CLICK', tdClass: 'table_num' },
          ctr: { label: 'CTR', tdClass: 'table_num' }
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    linkGen (pageNum) {
      let send = { page: pageNum }
      if (this.$route.query.publisher) {
        send.publisher = this.$route.query.publisher
      }
      return {
        name: 'reportAgencyIndex', query: send
      }
    },
    agencyRowClick (data, index) {
      if (['ADMINISTRATOR', 'MANAGER'].includes(this.response.user_session.role)) {
        this.$router.push({ name: 'memberEdit', params: { user_id: data.user_id, type: 'reportAgency' } })
      } else {
        this.$router.push({ name: 'userEdit', params: { user_id: data.user_id } })
      }
    },
    numReplace: function (num) {
      num = num + ''
      const result = num.replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return result
    },
    roleSelect () {
      if (['ADMINISTRATOR', 'MANAGER'].includes(this.response.user_session.role)) {
        this.getSearch()
      } else {
        this.$router.push({ name: 'contactsIndex' })
      }
    },
    getSearch: function () {
      this.xhttp({
        url: '/report/search',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.searchList = response.data
          if (this.response.searchList.data) {
            this.response.agencyOptions = this.response.searchList.data.map(function ($value) {
              return { value: $value.id, label: $value.name }
            })
            this.response.agencyOptions.unshift(
              { value: '', label: '대행사 전체' }
            )
          }
          this.fnRefresh()
        }
      }).catch((error) => {
        this.response.searchList = error.response
        this.respError(error)
      })
    },
    fnRefresh: function () {
      let pubArr = this.$route.query.publisher
      let send = { page: this.$route.query.page }
      if (pubArr) {
        send.publisher = pubArr
        let pub = null
        let result = this.response.agencyOptions.filter(function (val) {
          return Number(val.value) === Number(pubArr)
        })
        if (result) { pub = result[0] }
        this.selectForm.agency = pub
      }
      this.$router.push({ name: 'reportAgencyIndex', query: send })
      this.getAgency()
    },
    getAgency: function () {
      this.response.spinner = true
      let send = {
        page: this.currentPage
      }
      if (this.selectForm.agency.value !== '') {
        send.agency = this.selectForm.agency.value
      }
      this.xhttp({
        url: '/report/agency',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.agency = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.agency = error.response
        this.respError(error)
      })
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
    selectForm: {
      handler (val) {
        if (val.agency.value === '') {
          this.$router.push({ name: 'reportAgencyIndex', query: { page: 1 } })
        } else {
          this.$router.push({ name: 'reportAgencyIndex', query: { page: 1, publisher: val.agency.value } })
        }
        this.currentPage = 1
        this.getAgency()
      },
      deep: true
    },
    currentPage: function () {
      this.getAgency()
    }
  },
  computed: {
    resultAgency () {
      if (this.response.agency && this.response.agency.success === true && this.response.agency.data.data.length > 0) {
        return this.response.agency.data
      } else {
        return false
      }
    }
  }
}
</script>
