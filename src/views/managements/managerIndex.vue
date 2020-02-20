<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="영업 매니저 관리"/>
        <div class="mb-2 mt-2">
          <b-collapse id="displayOptions" class="d-md-block">
            <div class="d-block d-md-inline-block mb-2 position-relative">
              <b-form @submit.prevent="submitSearch" class="search-sm d-inline-block float-md-left mr-1 align-top">
                <div>
                  <b-form-input v-model="search" placeholder="소속 대행사명, 매니저명, Email 검색" required style="width:250px"/>
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
                   :items="resultUsers.data"
                   :fields="config.contactsField"
                   @row-clicked="tableRowClick">
            <template slot="empty">
              영업 매니저가 없습니다.
            </template>
            <template slot="no" slot-scope="data">
              {{resultUsers.total - (resultUsers.per_page * (resultUsers.current_page - 1)) - data.index}}
            </template>
            <template slot="children" slot-scope="data">
              <template v-if="data.value">
              <router-link :to="({ name: 'advertiserIndex', query: { page: 1, agent: data.item.id } })">
                <b-button variant="info" size="xs">{{data.value.count}}</b-button>
              </router-link>
              </template>
              <template v-else>
                -
              </template>
            </template>
            <template slot="cam_num" slot-scope="data">
              <template v-if="data.value">
                <b-button variant="light default" size="sm">{{data.value}}</b-button>
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
              <b-button variant="outline-info" class="mb-2" @click="checkButtonCheck(data.value, data.index)" :pressed="data.item.status" size="sm">{{data.value}}</b-button>
            </template>
          </b-table>
          <b-pagination-nav
            size="sm"
            align="center"
            v-model="vModel.currentPage"
            :link-gen="linkGen"
            :number-of-pages="resultUsers.last_page">
          </b-pagination-nav>
        </b-card>
        <div class="text-right">
          <router-link :to="{name: 'managerCreate'}">
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
        user: null
      },
      vModel: {
        category: { id: 0, name: '전체' },
        currentPage: this.$route.query.page
      },
      search: '',
      config: {
        contactsField: {
          no: { label: 'No', sortable: true },
          'company.name': { label: '소속대행사' },
          name: { label: '매니저명' },
          children: { label: '광고주수' },
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
      if (this.$route.query.search) {
        send.search = this.$route.query.search
      }
      return {
        name: 'managerIndex', query: send
      }
    },
    submitSearch: function () {
      if (this.search) {
        this.$router.push({ name: 'managerIndex', query: { page: 1, search: this.search } })
      } else {
        this.$router.push({ name: 'managerIndex', query: { page: 1 } })
      }
      this.getManagerList()
    },
    getManagerList: function () {
      this.response.spinner = true
      let send = {
        page: this.vModel.currentPage,
        view_type: 1
      }
      if (this.$route.query.search) {
        this.search = this.$route.query.search
        send.search_text = this.$route.query.search
      }
      this.xhttp({
        url: 'user',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.user = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.user = error.response
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
    checkButtonCheck (status, idx) {
      if (status === true) {
        this.response.user.data.data[idx].status = false
      } else {
        this.response.user.data.data[idx].status = true
      }
    },
    tableRowClick (data, index) {
      this.$router.push({ name: 'managerEdit', params: { user_id: data.id } })
    }
  },
  computed: {
    resultUsers () {
      if (this.response.user && this.response.user.success === true && this.response.user.data.data.length > 0) {
        return this.response.user.data
      } else {
        return false
      }
    }
  },
  watch: {
    vModel: {
      handler (val) {
        if (val.currentPage) {
          this.getManagerList()
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
