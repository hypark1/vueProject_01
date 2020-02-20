<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="광고주 관리"/>
        <div class="mb-2 mt-2">
          <b-collapse id="displayOptions" class="d-md-block">
            <div class="d-block d-md-inline-block mb-2 position-relative">
              <template v-if="['AGENCY'].includes(response.user_session.role)">
              <b-dropdown
                :text="`영업매니저 : ${vModel.manager.name}`"
                variant="outline-dark"
                class="mr-1 float-md-left btn-group"
                size="xs"
              >
                <b-dropdown-item
                  v-for="(order,index) in resultManagers"
                  :key="index"
                  @click="changeOrderByManager(order)"
                >{{ order.name }}</b-dropdown-item>
              </b-dropdown>
              </template>
              <b-form @submit.prevent="submitSearch" class="search-sm d-inline-block float-md-left mr-1 align-top">
                <div>
                  <b-form-input placeholder="소속 대행사명, 광고주명, Email 검색" v-model="search" required style="width:250px"/>
                </div>
                <button type="submit" class="d-inline-block position-absolute border-0" style="top:2px;right:6px;width:25px;height:21px;cursor:pointer;z-index:999;background:none;"></button>
              </b-form>
            </div>
          </b-collapse>
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4 cf">
          <b-table class="text-center"
                   hover
                   show-empty
                   :items="resultAdvertisers.data"
                   :fields="config.contactsField"
                   @row-clicked="tableRowClick">
            <template slot="empty">
              광고주가 없습니다.
            </template>
            <template slot="no" slot-scope="data">
              {{resultAdvertisers.total - (resultAdvertisers.per_page * (resultAdvertisers.current_page - 1)) - data.index}}
            </template>
            <template slot="cam_num" slot-scope="data">
              <template v-if="data.value">
                <b-button variant="info" size="xs">{{data.value}}</b-button>
              </template>
              <template v-else>
                -
              </template>
            </template>
            <template slot="mobile" slot-scope="data">
              <template v-if="data.value">{{data.value}}</template>
              <template v-else>-</template>
            </template>
            <template slot="status" slot-scope="data">
              <b-button variant="outline-info" class="mb-2" @click="checkButtonCheck(data.value, data.index)" :pressed="data.value" size="sm">{{data.value}}</b-button>
            </template>
          </b-table>
          <b-pagination-nav
            size="sm"
            align="center"
            v-model="vModel.currentPage"
            :link-gen="linkGen"
            :number-of-pages="resultAdvertisers.last_page">
          </b-pagination-nav>
        </b-card>
        <div class="text-right">
          <router-link :to="{name: 'advertiserCreate'}">
            <b-button variant="outline-primary">추가</b-button>
          </router-link>
        </div>
      </b-colxx>
    </b-row>
    <div class="spinner-background" v-show="response.spinner">
      <b-spinner variant="info"></b-spinner>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  created () {
    this.getManagerList()
  },
  data () {
    return {
      response: {
        spinner: true,
        advertisers: null,
        managers: null,
        user_session: JSON.parse(localStorage.getItem('user')),
        agent: this.$route.params.agent,
        name: this.$route.name
      },
      vModel: {
        manager: { id: 0, name: '전체' },
        currentPage: this.$route.query.page
      },
      search: '',
      config: {
        contactsField: {
          no: { label: 'No', sortable: true },
          'company.name': { label: '소속대행사' },
          type: { label: '구분' },
          'agent_user.name': { label: '매니저명' },
          name: { label: '광고주명' },
          /* cam_num: { label: '캠페인수' }, */
          email: { label: 'Email' },
          mobile: { label: 'Mobile' },
          /* status: { label: '상태' }, */
          created_at: { label: '등록일' }
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    linkGen (pageNum) {
      let send = { page: pageNum }
      if (this.$route.query.agent) {
        send.agent = this.$route.query.agent
      }
      if (this.$route.query.search) {
        send.search = this.$route.query.search
      }
      return {
        name: 'advertiserIndex', query: send
      }
    },
    changeOrderByManager (sort) {
      this.vModel.manager = sort
      this.$router.push({ name: 'advertiserIndex', query: { page: 1, agent: sort.id } })
    },
    getManagerList: function () {
      if (['AGENCY'].includes(this.response.user_session.role)) {
        this.xhttp({
          url: 'user/searchFilter',
          method: 'get',
          params: null
        }).then((response) => {
          if (response.status === 200) {
            this.response.managers = response.data
            this.setAgentFilter()
            this.fnRefresh()
          }
        }).catch((error) => {
          this.response.managers = error.response
          this.respError(error)
        })
      } else {
        this.getAdvertiserList()
      }
    },
    setAgentFilter () {
      let agentArr = this.$route.query.agent
      if (agentArr) {
        let pub = null
        let result = this.response.managers.data.filter(function (val) {
          return Number(val.id) === Number(agentArr)
        })
        if (result) {
          pub = result[0]
        }
        this.vModel.manager = pub
      }
    },
    fnRefresh () {
      let send = {}
      send.page = 1
      if (this.$route.query.search) {
        this.search = this.$route.query.search
        send.search = this.search
      }
      if (this.$route.query.agent) {
        send.agent = this.$route.query.agent
      }
      this.$router.push({ name: 'advertiserIndex', query: send })
      this.getAdvertiserList()
    },
    submitSearch: function () {
      let send = {}
      send.page = 1
      if (this.$route.query.agent) {
        send.agent = this.$route.query.agent
      }
      if (this.search) {
        send.search = this.search
      }
      this.$router.push({ name: 'advertiserIndex', query: send })
      this.getAdvertiserList()
    },
    getAdvertiserList: function () {
      this.response.spinner = true
      let send = {
        search_role: this.$route.query.agent,
        page: this.vModel.currentPage,
        view_type: 2
      }
      if (this.$route.query.search) {
        this.search = this.$route.query.search
        send.search_text = this.search
      }
      this.xhttp({
        url: 'user',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.advertisers = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.advertisers = error.response
        this.respError(error)
      })
    },
    respSuccess: function () {
      this.$Progress.finish()
      this.response.spinner = false
    },
    respError: function (error) {
      let message = error.response.data.messages.message
      if (message) {
        this.$notify('error', '오류', message)
      } else {
        this.$notify('error', '오류', '관리자에게 문의바랍니다.')
      }
      this.$Progress.fail()
      this.response.spinner = false
    },
    tableRowClick (data, index) {
      this.$router.push({ name: 'advertiserEdit', params: { user_id: data.id } })
    },
    checkButtonCheck (status, idx) {
      /* if (status === true) {
        this.resultUsers.data[idx].status = false
      } else {
        this.resultUsers.data[idx].status = true
      } */
    }
  },
  computed: {
    resultManagers () {
      if (this.response.managers && this.response.managers.success === true && this.response.managers.data.length > 0) {
        return this.response.managers.data
      } else {
        return false
      }
    },
    resultAdvertisers () {
      if (this.response.advertisers && this.response.advertisers.success === true && this.response.advertisers.data.data.length > 0) {
        return this.response.advertisers.data
      } else {
        return false
      }
    }
  },
  watch: {
    vModel: {
      handler (val) {
        if (val.currentPage) {
          this.getAdvertiserList()
        }
      },
      deep: true
    },
    search: function () {
      if (this.search === '') {
        this.submitSearch()
      }
    }
  }
}
</script>
