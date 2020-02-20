<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="인벤토리 관리" :depth="depth"/>
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
                <router-link tag="a" :to="({ name: 'GroupShow', params: { user_id: response.user_id, site_id: response.site_id, group_id: response.group_id } })" class="w-100 d-inline-block p-3">
                  사이트 정보({{response.siteInfo.name}}) > 그룹 정보({{response.groupInfo.name}} - {{deviceToString(response.deviceType)}})
                </router-link>
              </div>
              <div class="col-6 text-center float-left">
                <router-link tag="a" :to="({ name: 'AdUnitIndex', params: { user_id: response.user_id, site_id: response.site_id, group_id: response.group_id } })" class="w-100 d-inline-block p-3" style="color:#f18024">
                  인벤토리 목록
                </router-link>
                <span class="w-100 d-inline-block" style="position:absolute;top:0;left:0;height:5px;background:#f18024"></span>
              </div>
            </template>
            <template v-else-if="response.user_session.role == 'PUBLISHER'">
              <div class="col-6 text-center float-left">
                <router-link tag="a" :to="({ name: 'GroupShowAll', params: { user_id: response.user_id, site_id: response.site_id, group_id: response.group_id } })" class="w-100 d-inline-block p-3">
                  사이트 정보({{response.siteInfo.name}}) > 그룹 정보({{response.groupInfo.name}} - {{deviceToString(response.deviceType)}})
                </router-link>
              </div>
              <div class="col-6 text-center float-left">
                <router-link tag="a" :to="({ name: 'AdUnitIndexAll', params: { user_id: response.user_id, site_id: response.site_id, group_id: response.group_id } })" class="w-100 d-inline-block p-3" style="color:#f18024">
                  인벤토리 목록
                </router-link>
                <span class="w-100 d-inline-block" style="position:absolute;top:0;left:0;height:5px;background:#f18024"></span>
              </div>
            </template>
          </div>
          <b-card class="mb-4 shadow-none">
            <b-collapse id="displayOptions" class="d-md-block">
              <div class="d-block d-md-inline-block mb-2 position-relative">
                <b-dropdown
                  :text="`광고종류 : ${vModel.adType.name}`"
                  variant="outline-dark"
                  class="mr-1 float-md-left btn-group"
                  size="xs"
                >
                  <b-dropdown-item
                    @click="changeTypeBySearch({ id: 0, name: '전체' })"
                  >전체</b-dropdown-item>
                  <b-dropdown-item
                    v-for="(order,index) in response.adTypeOptions"
                    :key="index"
                    @click="changeTypeBySearch(order)"
                  >{{ order.name }}</b-dropdown-item>
                </b-dropdown>
                <b-form @submit.prevent="submitSearch" class="search-sm d-inline-block float-md-left align-top mr-1 mb-4">
                  <b-form-group>
                    <b-form-input placeholder="인벤토리명 검색" v-model="search" :state="searchValidation" required />
                    <b-form-invalid-feedback :state="searchValidation" class="text-left">
                      2자 이상 입력하세요.
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <button class="d-inline-block position-absolute border-0" style="top:2px;right:6px;width:25px;height:21px;cursor:pointer;z-index:999;background:none;" type="submit"></button>
                </b-form>
              </div>
            </b-collapse>
            <b-table id="publishersTable" class="text-center"
                     hover
                     show-empty
                     :items="resultAdUnitIndex.items"
                     :fields="config.adUnitIndexField"
                     @row-clicked="contactRowClick">
              <template slot="empty">
                인벤토리가 없습니다.
              </template>
              <template slot="no" slot-scope="data">
                {{resultAdUnitIndex.total - (resultAdUnitIndex.per_page * (currentPage - 1)) - data.index}}
              </template>
              <template slot="adType" slot-scope="data" v-if="resultAdType">
                {{data.item.adType}}
              </template>
              <template slot="size" slot-scope="data">
                {{sizeText(data.value)}}
              </template>
              <template slot="status" slot-scope="data">
                <span v-if="data.value == true" style="color: blue">On</span>
                <span v-else>Off</span>
              </template>
              <template slot="targeting" slot-scope="data">
                {{echoTargeting(data.item.targeting)}}
              </template>
              <template v-if="data.item.memo" slot="memo" slot-scope="data">
                <b-button :id="'memo-'+data.item.id" size="xs" variant="info">관리 메모</b-button>
                <b-popover :target="'memo-'+data.item.id"
                           title="Memo">
                  <pre style="max-height:150px;overflow-y:auto" class="border p-2">{{data.item.memo}}</pre>
                  <b-button type="button" @click="codeClose('memo-' + data.item.id)" size="xs" variant="light" class="float-right">닫기</b-button>
                </b-popover>
              </template>
              <template slot="script" slot-scope="data">
                <b-button :id="'script-'+data.item.id" size="xs" variant="info">VER1</b-button>
                <b-popover :target="'script-'+data.item.id"
                           title="Code">
                  <textarea :id="'code1-'+data.item.id" style="max-height:400px;min-height:300px;height:auto;overflow-y:auto;width:100%;resize: none;" class="border p-2" :value="data.item.script"></textarea>
                  <b-button type="button" @click="codeCopy(data.item.id, 1)" size="xs" variant="primary" class="left">코드 복사</b-button>
                  <b-button type="button" @click="codeClose('script-' + data.item.id)" size="xs" variant="light" class="float-right">닫기</b-button>
                </b-popover>
                <b-button :id="'script2-'+data.item.id" size="xs" variant="info">VER2</b-button>
                <b-popover :target="'script2-'+data.item.id"
                           title="Code">
                  <textarea :id="'code2-'+data.item.id" style="max-height:400px;min-height:300px;height:auto;overflow-y:auto;width:100%;resize: none;" class="border p-2" :value="data.item.script2"></textarea>
                  <b-button type="button" @click="codeCopy(data.item.id, 2)" size="xs" variant="primary" class="left">코드 복사</b-button>
                  <b-button type="button" @click="codeClose('script2-' + data.item.id)" size="xs" variant="light" class="float-right">닫기</b-button>
                </b-popover>
              </template>
            </b-table>
            <b-pagination-nav
              size="sm"
              align="center"
              v-model="currentPage"
              :link-gen="linkGen"
              :number-of-pages="resultSiteLastPage.last_page">
            </b-pagination-nav>
          </b-card>
        </b-card>
        <div class="text-right">
          <router-link tag="a" :to="({ name: 'AdUnitCreate', params: { user_id: response.user_id,site_id: response.site_id } })">
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
    this.getAdType()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_id: this.$route.params.user_id,
        site_id: this.$route.params.site_id,
        group_id: this.$route.params.group_id,
        user_session: JSON.parse(localStorage.getItem('user')),
        adType: null,
        adTypeOptions: null,
        adUnitIndex: null,
        adUnitIndexArr: null,
        siteInfo: {
          name: null,
          domain: null
        },
        groupInfo: {
          name: '그룹'
        }
      },
      vModel: {
        adType: { id: 0, name: '전체' },
        searchVal: null
      },
      currentPage: this.$route.query.page,
      search: '',
      config: {
        adUnitIndexField: {
          no: { label: 'No', sortable: true },
          id: { label: 'ID' },
          name: { label: '인벤토리명' },
          adType: { label: '광고 종류' },
          size: { label: '사이즈' },
          targeting: { label: '타겟팅' },
          status: { label: '광고 활성화' },
          script: { label: '인벤토리 코드' },
          memo: { label: '관리 메모' }
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getSiteShowList () {
      this.xhttp({
        url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id,
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.siteShow = response.data
          var resp = response.data.data
          this.response.siteInfo = resp
          this.getGroupShowList()
        }
      }).catch((error) => {
        this.response.siteShow = error.response
        this.respError(error)
      })
    },
    linkGen (pageNum) {
      if (this.vModel.search) {
        return {
          name: 'AdUnitIndex', params: { user_id: this.response.user_id, site_id: this.response.site_id, group_id: this.response.group_id }, query: { page: pageNum, search: this.vModel.search, adType: this.vModel.adType.id }
        }
      } else {
        return {
          name: 'AdUnitIndex', params: { user_id: this.response.user_id, site_id: this.response.site_id, group_id: this.response.group_id }, query: { page: pageNum, adType: this.vModel.adType.id }
        }
      }
    },
    getGroupShowList () {
      this.xhttp({
        url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id + '/groups/' + this.response.group_id,
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.groupInfo = response.data.data
          this.response.deviceType = response.data.data.device
        }
      }).catch((error) => {
        this.response.deviceType = error.response
        this.respError(error)
      })
    },
    contactRowClick (data, index) {
      let send = [3, data.name]
      this.$emit('child', send)
      this.$router.push({ name: 'AdUnitShow', params: { user_id: this.response.user_id, site_id: this.response.site_id, group_id: this.response.group_id, ad_unit_id: data.id } })
    },
    changeTypeBySearch (sort) {
      this.vModel.adType = sort
    },
    getAdType: function () {
      this.xhttp({
        url: 'resources/adTypes',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.adType = response.data
          if (response.data.data !== false) {
            this.response.adTypeOptions = response.data.data
            var adType = []
            if (this.response.adUnitIndexArr && this.response.adUnitIndexArr.length > 0) {
              var adTypeLength = this.response.adTypeOptions.length
              for (var i = 0; i < adTypeLength; i++) {
                adType.push(i + 1)
              }
              for (var j = 0; j < adTypeLength; j++) {
                adType = adType.filter(adOptions => adOptions !== this.response.adUnitIndexArr[j])
              }
              for (var z = 0; z < adTypeLength; z++) {
                this.response.adTypeOptions = this.response.adTypeOptions.filter(adOptions => adOptions.id !== adType[z])
              }
            }
            // select 옵션에 넣는다
            this.response.adTypeOptions = this.response.adTypeOptions.map(function ($value) {
              return { id: $value.id, name: $value.name }
            })
          }
          this.getAdUnitsList()
        }
      }).catch((error) => {
        this.response.adTypeOptions = error.response
        this.respError(error)
      })
    },
    submitSearch: function () {
      if (this.search) {
        if (this.search.length > 1) {
          this.$router.push({ name: 'AdUnitIndex', params: { user_id: this.response.user_id, site_id: this.response.site_id, group_id: this.response.group_id }, query: { page: 1, search: this.search, adType: this.vModel.adType.id } })
          this.getAdUnitsList()
        } else {
          this.vModel.searchVal = 'on'
        }
      } else {
        this.$router.push({ name: 'AdUnitIndex', params: { user_id: this.response.user_id, site_id: this.response.site_id, group_id: this.response.group_id }, query: { page: 1, adType: this.vModel.adType.id } })
        this.getAdUnitsList()
      }
    },
    getAdUnitsList () {
      if (this.$route.query.adType > 0) {
        this.vModel.adType.name = this.response.adTypeOptions[this.$route.query.adType - 1].name
        this.vModel.adType.id = this.$route.query.adType
      }
      let send = {
        page: this.currentPage
      }
      if (this.vModel.adType.id > 0) {
        send.adType = this.vModel.adType.id
      }
      if (this.$route.query.search) {
        this.search = this.$route.query.search
        if (this.search.length > 1) {
          send.search = this.search
        } else {
          this.vModel.searchVal = 'on'
          return
        }
      }
      this.response.adUnitIndex = null
      this.response.spinner = true
      this.xhttp({
        url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id + '/groups/' + this.response.group_id + '/AdUnits',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.adUnitIndex = response.data
          if (response.data.data !== false) {
            this.response.adUnitIndexArr = response.data.data.items.map(function ($value) {
              return $value.adType
            })
          }
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.adUnitIndex = error.response
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
    },
    codeCopy (idx, ver) {
      document.getElementById('code'+ver+'-' + idx).select()
      document.execCommand('copy')
      this.$notify('primary', '코드 복사 완료', '코드 복사 완료되었습니다.')
    },
    codeClose (idx) {
      document.getElementById(idx).click()
    },
    sizeText (data) {
      if (data.length === 2) {
        if (data[0] < 10) {
          return '-'
        } else {
          return data[0] + 'x' + data[1]
        }
      } else if (data.length === 0) {
        return '반응형'
      } else {
        let text = []
        for (var i = 0; i < data.length; i++) {
          text.push(data[i][0] + 'x' + data[i][1])
        }
        return text.join(', ')
      }
    },
    deviceToString (id) {
      return id === 1 ? 'PC' : 'Mobile'
    },
    echoTargeting (targeting) {
      var t = []
      targeting.keyword && t.push('키워드')
      targeting.page && t.push('페이지')
      targeting.visit && t.push('리타겟팅')
      targeting.category && t.push('카테고리')
      return t
    }
  },
  computed: {
    resultAdType () {
      if (this.response.adType && this.response.adType.success === true && this.response.adType.data) {
        return this.response.adType.data
      } else {
        return false
      }
    },
    resultAdUnitIndex () {
      if (this.response.adUnitIndex && this.response.adUnitIndex.success === true && this.response.adUnitIndex.data.items) {
        return this.response.adUnitIndex.data
      } else {
        return false
      }
    },
    resultSiteLastPage () {
      if (this.response.adUnitIndex && this.response.adUnitIndex.success === true && this.response.adUnitIndex.data) {
        return this.response.adUnitIndex.data
      } else {
        return false
      }
    },
    searchValidation () {
      if (this.vModel.searchVal === 'on') {
        return this.search.length > 1
      } else {
        return ''
      }
    }
  },
  watch: {
    vModel: {
      handler (val) {
        if (val.adType) {
          this.submitSearch()
        }
      },
      deep: true
    },
    search: function () {
      if (this.search === '') {
        this.vModel.searchVal = ''
        this.submitSearch()
      }
    },
    currentPage: function () {
      this.getAdUnitsList()
    }
  }
}
</script>
