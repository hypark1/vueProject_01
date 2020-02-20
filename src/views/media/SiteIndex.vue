<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="사이트 관리" :depth="depth"/>
        <div class="mb-2 mt-2">
          <b-collapse id="displayOptions" class="d-md-block">
            <div class="d-block d-md-inline-block mb-2 position-relative col-lg-12">
              <div class="row">
                <div class="col-lg-2">
                  <b-form-select v-model="status"
                                 @change="submitSearch"
                                 plain>
                    <option slot="first" value="">활성화) 전체</option>
                    <option value="1">활성</option>
                    <option value="0">비활성</option>
                  </b-form-select>
                </div>
                <div class="col-lg-3">
                  <b-form @submit.prevent="submitSearch" class="search-sm d-inline-block float-md-left mr-1 align-top">
                    <b-form-group>
                      <b-form-input placeholder="사이트명 검색" v-model="vModel.search" :state="searchValidation" required />
                      <b-form-invalid-feedback :state="searchValidation" class="text-left">
                        2자 이상 입력하세요.
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <button class="d-inline-block position-absolute border-0" style="top:2px;right:6px;width:25px;height:21px;cursor:pointer;z-index:999;background:none;" type="submit"></button>
                  </b-form>
                </div>
              </div>
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
                    :items="resultSiteIndex.items"
                    :fields="config.siteIndexField"
                   @row-clicked="contactRowClick">
            <template slot="empty">
              사이트가 없습니다.
            </template>
            <template slot="no" slot-scope="data">
              {{resultSiteIndex.total - (resultSiteIndex.per_page * (currentPage - 1)) - data.index}}
            </template>
            <template slot="total" slot-scope="data">
              <b-button v-if="response.user_session.role != 'PUBLISHER'" type="button" size="xs" variant="primary" @click="listGroupLink(data.item.publisher_id, data.item.id)">{{data.item.activeCount + ' / ' + data.item.total}}</b-button>
              <div v-else>{{data.item.inventoryActiveCount + ' / ' + data.item.inventoryTotal}}</div>
            </template>
            <template slot="status" slot-scope="data">
              <span v-if="data.item.status == true">On</span>
              <span v-else>Off</span>
            </template>
            <template slot="activeCount" slot-scope="data">
              <b-button v-if="response.user_session.role != 'PUBLISHER'" type="button" size="xs" variant="primary" @click="listGroupLink(data.item.publisher_id, data.item.id)">{{data.item.inventoryActiveCount + ' / ' + data.item.inventoryTotal}}</b-button>
              <div v-else>{{data.item.inventoryActiveCount + ' / ' + data.item.inventoryTotal}}</div>
            </template>
          </b-table>
          <b-pagination-nav
            size="sm"
            align="center"
            v-model="currentPage"
            :link-gen="linkGen"
            :number-of-pages="resultSiteIndex.last_page">
          </b-pagination-nav>
        </b-card>
        <template v-if="response.name == 'SiteIndex'">
        </template>
        <div class="text-right">
          <template v-if="response.user_session.role == 'PUBLISHER'">
            <router-link tag="a" :to="{name: 'SiteCreateSupply', params: { user_id: response.user_session.id }}">
              <b-button variant="outline-primary">등록</b-button>
            </router-link>
          </template>
          <template v-else-if="response.name == 'SiteIndex'">
            <router-link tag="a" :to="{name: 'SiteCreate', params: { user_id: response.user_id }}">
              <b-button variant="outline-primary">등록</b-button>
            </router-link>
          </template>
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
  props: ['depth'],
  created () {
    this.getSiteIndexList()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_id: this.$route.params.user_id,
        name: this.$route.name,
        user_session: JSON.parse(localStorage.getItem('user')),
        siteIndex: null
      },
      vModel: {
        search: '',
        searchVal: ''
      },
      status: '',
      currentPage: this.$route.query.page,
      config: {
        siteIndexField: {
          no: { label: 'No', sortable: true },
          id: { label: 'ID' },
          name: { label: '사이트명' },
          domain: { label: '도메인' },
          total: { label: '그룹수' },
          activeCount: { label: '인벤토리수' },
          status: { label: '광고 활성화' }
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    linkGen (pageNum) {
      if (this.response.name === 'SiteIndexList') {
        return {
          name: 'SiteIndexList', params: { user_id: this.response.user_id }
        }
      } else if (this.response.name === 'SiteIndex') {
        if (this.vModel.search) {
          return {
            name: 'SiteIndex', params: { user_id: this.response.user_id }, query: { page: pageNum, search: this.vModel.search, status: this.status }
          }
        } else {
          return {
            name: 'SiteIndex', params: { user_id: this.response.user_id }, query: { page: pageNum, status: this.status }
          }
        }
      } else if (this.response.name === 'SiteIndexPublisher') {
        return {
          name: 'SiteIndexPublisher'
        }
      }
    },
    listGroupLink (publisherId, id) {
      this.$router.push({ name: 'GroupIndex', params: { user_id: publisherId, site_id: id }, query: { page: 1 } })
    },
    contactRowClick (data, index) {
      let send = [1, data.name]
      this.$emit('child', send)
      if (!this.response.mode) {
        if (this.response.name === 'SiteIndex') {
          this.$router.push({ name: 'SiteShow', params: { user_id: this.response.user_id, site_id: data.id } })
        } else if (this.response.name === 'SiteIndexList') {
          let send = [0, '']
          this.$emit('child', send)
          this.$router.push({ name: 'SiteShow', params: { user_id: data.publisher_id, site_id: data.id, type: 'list' } })
        } else if (this.response.user_session.role === 'PUBLISHER') {
          this.$router.push({ name: 'SiteShowSupply', params: { site_id: data.id } })
        }
      }
    },
    submitSearch: function () {
      if (this.vModel.search) {
        if (this.vModel.search.length > 1) {
          this.$router.push({ name: 'SiteIndex', params: { user_id: this.response.user_id }, query: { page: 1, search: this.vModel.search, status: this.status } })
          this.getSiteIndexList()
        } else {
          this.vModel.searchVal = 'on'
        }
      } else {
        this.$router.push({ name: 'SiteIndex', params: { user_id: this.response.user_id }, query: { page: 1, status: this.status } })
        this.getSiteIndexList()
      }
    },
    getSiteIndexList () {
      this.status = this.$route.query.status
      let status = this.status
      if (status === '1' || status === '0') {
        status = Number(status)
      } else {
        status = null
      }
      let send = {
        page: this.currentPage,
        status: status
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
      this.response.spinner = true
      if (this.response.name === 'SiteIndexList') {
        this.xhttp({
          url: 'publishers/sites',
          method: 'get',
          params: send
        }).then((response) => {
          if (response.status === 200) {
            this.response.siteIndex = response.data
            this.respSuccess()
          }
        }).catch((error) => {
          this.response.siteIndex = error.response
          this.respError(error)
        })
      } else {
        let id
        if (this.response.name === 'SiteIndex') {
          id = this.response.user_id
        } else {
          id = this.response.user_session.id
        }
        this.xhttp({
          url: 'publishers/' + id + '/sites',
          method: 'get',
          params: send
        }).then((response) => {
          if (response.status === 200) {
            this.response.siteIndex = response.data
            this.respSuccess()
          }
        }).catch((error) => {
          this.response.siteIndex = error.response
          this.respError(error)
        })
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
  computed: {
    resultSiteIndex () {
      if (this.response.siteIndex && this.response.siteIndex.success === true && this.response.siteIndex.data) {
        return this.response.siteIndex.data
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
      this.getSiteIndexList()
    }
  }
}
</script>
