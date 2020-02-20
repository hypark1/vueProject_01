<template>
    <div>
      <b-row>
        <b-colxx xxs="12">
          <piaf-breadcrumb heading="업체 관리"/>
          <div class="mb-2 mt-2">
            <b-collapse id="displayOptions" class="d-md-block">
              <div class="d-block d-md-inline-block mb-2 position-relative">
                <b-form @submit.prevent="submitSearch" class="search-sm d-inline-block float-md-left mr-1 align-top">
                  <b-form-group>
                    <b-form-input placeholder="업체명 검색" v-model="vModel.search" :state="searchValidation" required />
                    <b-form-invalid-feedback :state="searchValidation" class="text-left">
                      2자 이상 입력하세요.
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <button class="d-inline-block position-absolute border-0" style="top:2px;right:6px;width:25px;height:21px;cursor:pointer;z-index:999;background:none;" type="submit"></button>
                </b-form>
              </div>
            </b-collapse>
            <div class="separator mb-5"></div>
          </div>
        </b-colxx>
      </b-row>
      <b-row>
        <b-colxx xxs="12">
          <b-card class="mb-4">
            <b-table class="text-center"
                     hover
                     show-empty
                     :items="resultPublishers.data"
                     :fields="config.publishersField"
                     @row-clicked="contactRowClick">
              <template slot="empty">
                업체가 없습니다.
              </template>
              <template slot="no" slot-scope="data">
                {{resultPublishers.total - (resultPublishers.per_page * (resultPublishers.current_page - 1)) - data.index}}
              </template>
            </b-table>
            <b-pagination-nav
              size="sm"
              align="center"
              v-model="currentPage"
              :link-gen="linkGen"
              :number-of-pages="resultPublishers.last_page">
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

export default {
  created () {
    this.publishersLink()
    this.getPublisherList()
  },
  data () {
    return {
      response: {
        spinner: true,
        publishers: null,
        user_session: JSON.parse(localStorage.getItem('user'))
      },
      vModel: {
        search: '',
        searchVal: ''
      },
      currentPage: 1,
      config: {
        publishersField: {
          no: { label: 'No', sortable: true },
          'company.name': { label: '업체명' },
          email: { label: '담당자' },
          'sites.total': { label: '사이트수' },
          'sites.activeCount': { label: '활성사이트' }
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    linkGen (pageNum) {
      if (this.vModel.search) {
        return {
          name: 'Publishers', query: { page: pageNum, search: this.search }
        }
      } else {
        return {
          name: 'Publishers', query: { page: pageNum }
        }
      }
    },
    publishersLink () {
      if (this.response.user_session.role === 'PUBLISHER') {
        this.$router.push({ name: 'SiteIndexPublisher' })
      }
    },
    contactRowClick (data, index) {
      let send = [0, data.company.name]
      this.$emit('child', send)
      this.$router.push({ name: 'SiteIndex', params: { user_id: data.id }, query: { page: 1, status: '' } })
    },
    submitSearch: function () {
      if (this.vModel.search) {
        if (this.vModel.search.length > 1) {
          this.$router.push({ name: 'Publishers', query: { page: 1, search: this.vModel.search } })
          this.getPublisherList()
        } else {
          this.vModel.searchVal = 'on'
        }
      } else {
        this.$router.push({ name: 'Publishers', query: { page: 1 } })
        this.getPublisherList()
      }
    },
    getPublisherList () {
      this.response.spinner = true
      this.currentPage = this.$route.query.page
      let send = {
        page: this.currentPage
      }
      if (this.$route.query.search) {
        this.vModel.search = this.$route.query.search
        if (this.vModel.search.length > 1) {
          send.search = this.vModel.search
        } else {
          this.vModel.searchVal = 'on'
          return
        }
      }
      this.xhttp({
        url: 'publishers',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.publishers = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.publishers = error.response
        this.respError(error)
      })
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
  computed: {
    resultPublishers () {
      if (this.response.publishers && this.response.publishers.success === true && this.response.publishers.data) {
        return this.response.publishers.data
      } else {
        return false
      }
    },
    searchValidation () {
      if (this.vModel.searchVal === 'on') {
        return this.vModel.search.length > 1
      } else {
        return ''
      }
    }
  },
  watch: {
    vModel: {
      handler (val) {
        if (val.search === '') {
          val.searchVal = ''
          this.submitSearch()
        }
      },
      deep: true
    },
    currentPage: function () {
      this.getPublisherList()
    }
  }
}
</script>
