<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="그룹 관리" :depth="depth"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" no-body>
          <div class="col-lg-12 cf">
            <template v-if="response.user_session.role != 'PUBLISHER'">
              <div class="col-6 text-center float-left">
                <router-link tag="a" :to="({ name: 'SiteShow', params: { user_id: response.user_id, site_id: response.site_id } })" class="w-100 d-inline-block p-3">
                  사이트 정보({{response.siteInfo.name}} - {{response.siteInfo.domain}})
                </router-link>
              </div>
              <div class="col-6 text-center float-left">
                <router-link tag="a" :to="({ name: 'GroupIndex', params: { user_id: response.user_id, site_id: response.site_id }, query: { page: 1 } })" class="w-100 d-inline-block p-3" style="color:#f18024">
                  그룹 목록
                </router-link>
                <span class="w-100 d-inline-block" style="position:absolute;top:0;left:0;height:5px;background:#f18024"></span>
              </div>
            </template>
            <template v-else-if="response.user_session.role == 'PUBLISHER'">
              <div class="col-6 text-center float-left">
                <router-link tag="a" :to="({ name: 'SiteShowAll', params: { user_id: response.user_id, site_id: response.site_id } })" class="w-100 d-inline-block p-3">
                  사이트 정보({{response.siteInfo.name}} - {{response.siteInfo.domain}})
                </router-link>
              </div>
              <div class="col-6 text-center float-left">
                <router-link tag="a" :to="({ name: 'GroupIndexAll', params: { user_id: response.user_id, site_id: response.site_id } })" class="w-100 d-inline-block p-3" style="color:#f18024">
                  그룹 목록
                </router-link>
                <span class="w-100 d-inline-block" style="position:absolute;top:0;left:0;height:5px;background:#f18024"></span>
              </div>
            </template>
          </div>
          <b-card class="mb-4 shadow-none">
            <b-form @submit.prevent="submitSearch" class="search-sm d-inline-block float-md-left align-top mr-1 mb-4">
              <b-form-group>
                <b-form-input placeholder="그룹명 검색" v-model="vModel.search" :state="searchValidation" required />
                <b-form-invalid-feedback :state="searchValidation" class="text-left">
                  2자 이상 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <button class="d-inline-block position-absolute border-0" style="top:2px;right:6px;width:25px;height:21px;cursor:pointer;z-index:999;background:none;" type="submit"></button>
            </b-form>
            <b-table class="text-center"
                     hover
                     show-empty
                     :items="resultGroupIndex.items"
                     :fields="config.groupIndexField"
                     @row-clicked="contactRowClick">
              <template slot="empty">
                그룹이 없습니다.
              </template>
              <template slot="no" slot-scope="data">
                {{resultGroupIndex.total - (resultGroupIndex.per_page * (currentPage - 1)) - data.index}}
              </template>
              <template slot="activeCount" slot-scope="data">
                <b-button size="xs" variant="primary" @click="activeClick(data.item)">{{data.item.activeCount}} / {{data.item.total}}</b-button>
              </template>
              <template slot="device" slot-scope="data">
                <span>{{filterObject(data.value)}}</span>
              </template>
              <template slot="status" slot-scope="data">
                <span v-if="data.value == true">On</span>
                <span v-else>Off</span>
              </template>
              <template slot="script" slot-scope="data">
                <b-button :id="'script-'+data.item.id" size="xs" variant="info">VER1</b-button>
                <b-popover :target="'script-'+data.item.id"
                           title="Code">
                  <pre style="max-height:150px;overflow-y:auto" class="border p-2">{{data.item.script}}</pre>
                  <b-button type="button" @click="codeClose(data.item.id, 1)" size="xs" variant="light" class="float-right">닫기</b-button>
                  <input type="text" :id="'code1-'+data.item.id" ref="codeCopy" class="border-0" style="width:1px;opacity:0" :value="data.value">
                </b-popover>
                <b-button :id="'script2-'+data.item.id" size="xs" variant="info">VER2</b-button>
                <b-popover :target="'script2-'+data.item.id"
                           title="Code">
                  <pre style="max-height:150px;overflow-y:auto" class="border p-2">{{data.item.script2}}</pre>
                  <b-button type="button" @click="codeClose(data.item.id, 2)" size="xs" variant="light" class="float-right">닫기</b-button>
                  <input type="text" :id="'code2-'+data.item.id" ref="codeCopy" class="border-0" style="width:1px;opacity:0" :value="data.value">
                </b-popover>
              </template>
            </b-table>
            <template v-if="resultSiteLastPage">
            <b-pagination-nav
              size="sm"
              align="center"
              v-model="currentPage"
              :link-gen="linkGen"
              :number-of-pages="resultSiteLastPage.last_page">
            </b-pagination-nav>
            </template>
          </b-card>
        </b-card>
        <div class="m-2 text-right">
          <router-link tag="a" :to="({ name: 'GroupCreate', params: { user_id: response.user_id,site_id: response.site_id }})">
            <b-button variant="outline-primary">등록</b-button>
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
  props: ['depth'],
  created () {
    this.getSiteShowList()
    this.getDevice()
    this.getGroupIndexList()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_id: this.$route.params.user_id,
        site_id: this.$route.params.site_id,
        user_session: JSON.parse(localStorage.getItem('user')),
        groupIndex: null,
        deviceTypeOptions: null,
        siteInfo: {
          name: null,
          domain: null
        }
      },
      vModel: {
        search: '',
        searchVal: null
      },
      currentPage: this.$route.query.page,
      config: {
        groupIndexField: {
          no: { label: 'No', sortable: true },
          id: { label: 'ID' },
          name: { label: '그룹명' },
          device: { label: '디바이스 종류' },
          activeCount: { label: '활성인벤토리' },
          status: { label: '광고 활성화' },
          script: { label: '스크립트 코드' }
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getSiteShowList () {
      if (this.response.name !== 'create') {
        this.xhttp({
          url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id,
          method: 'get',
          params: null
        }).then((response) => {
          if (response.status === 200) {
            this.response.siteShow = response.data
            var resp = response.data.data
            this.response.siteInfo = resp
            this.respSuccess()
          }
        }).catch((error) => {
          this.response.siteShow = error.response
          this.respError(error)
        })
      } else {
        this.response.spinner = false
      }
    },
    linkGen (pageNum) {
      if (this.search) {
        return {
          name: 'GroupIndex', query: { page: pageNum, search: this.search }
        }
      } else {
        return {
          name: 'GroupIndex', query: { page: pageNum }
        }
      }
    },
    getDevice: function () {
      this.xhttp({
        url: 'resources/devices',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.deviceTypeOptions = response.data.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.deviceTypeOptions = error.response
        this.respError(error)
      })
    },
    activeClick (data) {
      let send = [2, data.name]
      this.$emit('child', send)
      this.$router.push({ name: 'AdUnitIndex', params: { user_id: this.response.user_id, site_id: this.response.site_id, group_id: data.id }, query: { page: 1 } })
    },
    contactRowClick (data, index) {
      let send = [2, data.name]
      this.$emit('child', send)
      this.$router.push({ name: 'GroupShow', params: { user_id: this.response.user_id, site_id: this.response.site_id, group_id: data.id } })
    },
    submitSearch: function () {
      if (this.vModel.search) {
        this.$router.push({ name: 'GroupIndex', query: { page: 1, search: this.vModel.search } })
      } else {
        this.$router.push({ name: 'GroupIndex', query: { page: 1 } })
      }
      this.getGroupIndexList()
    },
    getGroupIndexList () {
      this.response.spinner = true
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
      this.response.groupIndex = null
      this.xhttp({
        url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id + '/groups',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.groupIndex = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.groupIndex = error.response
        this.respError(error)
      })
    },
    codeCopy (idx) {
      document.getElementById('code-' + idx).select()
      document.execCommand('copy')
      this.$notify('primary', '코드 복사 완료', '코드 복사 완료되었습니다.')
    },
    codeClose (idx, ver) {
      document.getElementById('script'+ver+'-' + idx).click()
    },
    codeCopySuccess () {
      this.$refs['codeCopySuccess'].hide()
    },
    filterObject (id) {
      if (this.response.deviceTypeOptions) {
        for (let i = 0; i <= this.response.deviceTypeOptions.length; i++) {
          if (this.response.deviceTypeOptions[i].id === id) {
            return this.response.deviceTypeOptions[i].name
          }
        }
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
    resultGroupIndex () {
      if (this.response.groupIndex && this.response.groupIndex.success === true && this.response.groupIndex.data) {
        return this.response.groupIndex.data
      } else {
        return false
      }
    },
    resultSiteLastPage () {
      if (this.response.groupIndex && this.response.groupIndex.success === true && this.response.groupIndex.data) {
        return this.response.groupIndex.data
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
      this.getGroupIndexList()
    }
  }
}
</script>
