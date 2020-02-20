<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="회원 관리"/>
        <div class="mb-2 mt-2">
          <b-collapse id="displayOptions" class="d-md-block">
            <div class="d-block d-md-inline-block mb-2 position-relative">
              <b-dropdown
                id="ddown3"
                :text="`등급 : ${vModel.category.name}`"
                variant="outline-dark"
                class="mr-1 float-md-left btn-group"
                size="xs"
              >
                <b-dropdown-item
                  v-for="(order,index) in resultCategories"
                  :key="index"
                  @click="changeOrderBySearch(order)"
                >{{ order.name }}</b-dropdown-item>
              </b-dropdown>
              <b-form @submit.prevent="submitSearch" class="search-sm d-inline-block float-md-left mr-1 align-top">
                <div>
                  <b-input placeholder="이름, 이메일, 회사명 검색" v-model="search" required style="width:200px"/>
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
        <b-card class="mb-4">
          <b-table class="text-center"
                   striped
                   show-empty
                   :items="resultUsers.data"
                   :fields="config.membersField">
            <template slot="empty">
              회원이 없습니다.
            </template>
            <template slot="no" slot-scope="data">
              {{resultUsers.total - (resultUsers.per_page * (resultUsers.current_page - 1)) - data.index}}
            </template>
            <template slot="role" slot-scope="data">
              {{roleName[data.value]}}
            </template>
            <template slot="company.name" slot-scope="data">
              <template v-if="data.item.company">{{data.value}}</template>
              <template v-else>-</template>
            </template>
            <template slot="company.number" slot-scope="data">
              <template v-if="!data.value">
                -
              </template>
              <template v-else>
                <template v-if="data.item.level >= 10">
                  {{data.value}}
                </template>
                <template v-else-if="data.item.level == 1">
                  <span style="color:#ea2016">{{data.value}}</span>
                </template>
              </template>
            </template>
            <template slot="point_sum.point_sum" slot-scope="data">
              <template v-if="data.value > 0">
                {{numReplace(data.value)}}
              </template>
              <template v-else>-</template>
            </template>
            <template slot="setting" slot-scope="data">
              <router-link :to="({ name: 'memberEdit', params: { user_id: data.item.id } })">
                <b-button size="xs" variant="info default">수정</b-button>
              </router-link>
              <b-button
                v-if="currentUser && (currentUser.role === 'ADMINISTRATOR' || (currentUser.role === 'MANAGER' && currentUser.level >= 190)) && (data.item.role === 'ADVERTISER' && data.item.agent_id !== null) == false "
                @click="forceLogin(data.item.email)"
                size="xs" variant="success default">사용자 전환
              </b-button>
            </template>
          </b-table>
          <b-pagination-nav
            size="sm"
            align="center"
            v-model="currentPage"
            :link-gen="linkGen"
            :number-of-pages="resultUsers.last_page">
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
import { mapActions, mapGetters } from 'vuex'

export default {
  created () {
    this.getCategoriesList()
  },
  data () {
    return {
      response: {
        spinner: true,
        categories: null,
        user: null
      },
      vModel: {
        category: { id: 0, name: '전체' }
      },
      search: '',
      currentPage: this.$route.query.page,
      config: {
        membersField: {
          no: { label: 'No', sortable: true },
          name: { label: '이름' },
          email: { label: '이메일' },
          role: { label: '회원등급' },
          'company.name': { label: '회사명' },
          'company.number': { label: '사업자정보 (승인여부)' },
          'point_sum.point_sum': { label: '보유 포인트' },
          setting: { label: '관리' }
        }
      },
      roleName: {
        AGENCY: '광고대행사',
        AGENT: '영업매니저',
        PUBLISHER: '매체사',
        ADVERTISER: '광고주',
        MANAGER: '운영관리자',
        ADMINISTRATOR: '최고관리자'
      }
    }
  },
  methods: {
    ...mapActions(['login', 'xhttp']),
    linkGen (pageNum) {
      let send = { page: pageNum }
      if (this.$route.query.search) {
        send.search = this.$route.query.search
      }
      return {
        name: 'memberIndex', query: send
      }
    },
    getCategoriesList: function () {
      this.xhttp({
        url: 'user/searchFilter',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.categories = response.data
          this.getUserList()
        }
      }).catch((error) => {
        this.response.categories = error.response
        this.respError(error)
      })
    },
    changeOrderBySearch (sort) {
      this.vModel.category = sort
    },
    submitSearch () {
      this.currentPage = 1
      let send = { page: 1 }
      if (this.search) {
        send.search = this.search
      }
      this.$router.push({ name: 'memberIndex', query: send })
      this.getUserList()
    },
    getUserList: function () {
      this.response.spinner = true
      let send = {
        page: this.currentPage,
        search_role: this.vModel.category.id
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
          this.response.user = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.user = error.response
        this.respError(error)
      })
    },
    numReplace: function (num) {
      num = num + ''
      const result = num.replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return result
    },
    /**
     * [관리자] 사용자로 강제 로그인
     * @param email
     */
    forceLogin (email) {
      this.xhttp({
        url: 'user/login',
        method: 'post',
        params: { email: email, password: '****' }
      }).then((response) => {
        if (response.status === 200) {
          this.login(response.data)
          window.location.href = '/dashboard/index'
        }
      }).catch((error) => {
        this.$notify('error', '인증 실패', error.response)
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
    ...mapGetters({
      currentUser: 'currentUser'
    }),
    resultCategories () {
      if (this.response.categories && this.response.categories.success === true && this.response.categories.data.length > 0) {
        return this.response.categories.data
      } else {
        return false
      }
    },
    resultUsers () {
      if (this.response.user && this.response.user.success === true && this.response.user.data.data.length > 0) {
        return this.response.user.data
      } else {
        return false
      }
    }
  },
  watch: {
    currentPage: function () {
      this.getUserList()
    },
    vModel: {
      handler (val) {
        if (val.category) {
          this.submitSearch()
        }
      },
      deep: true
    },
    search: function (val) {
      if (val === '') {
        this.submitSearch()
      }
    }
  }
}
</script>
