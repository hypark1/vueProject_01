<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="1:1 문의"/>
        <div class="mb-2 mt-2">
          <b-collapse id="displayOptions" class="d-md-block">
            <div class="d-block d-md-inline-block mb-2 position-relative">
              <b-dropdown
                v-if="resultCategories"
                id="ddown1"
                :text="`카테고리 : ${vModel.category.name}`"
                variant="outline-dark"
                class="mr-1 float-md-left btn-group "
                size="xs"
              >
                <b-dropdown-item
                  @click="changeOrderByCategory({id: 0, name: '전체'})"
                >전체</b-dropdown-item>
                <b-dropdown-item
                  v-for="(order,index) in resultCategories"
                  :key="index"
                  @click="changeOrderByCategory(order)"
                >{{ order.name }}</b-dropdown-item>
              </b-dropdown>

              <b-dropdown
                id="ddown2"
                :text="`상태 : ${vModel.status.name}`"
                variant="outline-dark"
                class="mr-1 float-md-left btn-group"
                size="xs"
              >
                <b-dropdown-item
                  @click="changeOrderByStatus({ id: 0, name: '전체' })"
                >전체</b-dropdown-item>
                <b-dropdown-item
                  v-for="(order,index) in resultStatuses"
                  :key="index"
                  @click="changeOrderByStatus(order)"
                >{{ order.name }}</b-dropdown-item>
              </b-dropdown>
              <b-dropdown
                id="ddown3"
                :text="`검색항목 : ${searchType.name}`"
                variant="outline-dark"
                class="mr-1 float-md-left btn-group"
                size="xs"
              >
                <b-dropdown-item
                  v-for="(order,index) in response.searches"
                  :key="index"
                  @click="changeOrderBySearch(order)"
                >{{ order.name }}</b-dropdown-item>
              </b-dropdown>
              <b-form @submit.prevent="submitSearch" class="search-sm d-inline-block float-md-left mr-1 align-top">
                <div>
                  <b-form-input placeholder="Search" v-model="search" required/>
                </div>
                <button class="d-inline-block position-absolute border-0" style="top:2px;right:6px;width:25px;height:21px;cursor:pointer;z-index:999;background:none;" type="submit"></button>
              </b-form>
            </div>
          </b-collapse>
        </div>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-table class="text-center"
                   hover
                   show-empty
                   :items="resultContacts.data"
                   :fields="config.contactsField"
                   @row-clicked="contactRowClick">
            <template slot="empty">
              문의가 없습니다.
            </template>
            <template slot="no" slot-scope="data">
              {{resultContacts.total - (resultContacts.per_page * (resultContacts.current_page - 1)) - data.index}}
            </template>
            <template slot="answer_user" slot-scope="data">
              <template v-if="data.value">
                {{data.value.name}}
              </template>
              <template v-else>
                -
              </template>
            </template>
          </b-table>
          <b-pagination-nav
            size="sm"
            align="center"
            v-model="vModel.currentPage"
            :link-gen="linkGen"
            :number-of-pages="resultContacts.last_page">
          </b-pagination-nav>
        </b-card>
        <div class="text-right">
          <router-link :to="{name: 'contactsCreate'}">
            <b-button variant="outline-primary">글쓰기</b-button>
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
    this.getCodesCategories() // 카테고리 가져오는 부분
    this.getCodesStatuses() // 상태 가져오는 부분
    this.getContacts() // 글 목록 가져오는 부분
  },
  data () {
    return {
      response: {
        spinner: true,
        categories: null,
        statuses: null,
        contacts: null,
        searches: [
          { id: 0, name: '전체' },
          { id: 'title', name: '제목' },
          { id: 'content', name: '본문' },
          { id: 'writer', name: '작성자' }
        ]
      },
      vModel: {
        category: { id: 0, name: '전체' },
        status: { id: 0, name: '전체' },
        currentPage: this.$route.query.page
      },
      searchType: { id: 0, name: '전체' },
      search: '',
      config: {
        contactsField: {
          no: { label: 'No', sortable: true },
          'category.name': { label: '카테고리' },
          question_title: { label: '제목', tdClass: 'table_title' },
          'question_user.name': { label: '작성자' },
          created_at: { label: '작성일' },
          'state.name': { label: '상태' },
          answer_user: { label: '담당자' }
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
        name: 'contactsIndex', query: send
      }
    },
    changeOrderByCategory (sort) {
      this.vModel.category = sort
    },
    changeOrderByStatus (sort) {
      this.vModel.status = sort
    },
    changeOrderBySearch (sort) {
      this.searchType = sort
    },
    contactRowClick (data, index) {
      this.$router.push({ name: 'contactsView', params: { contact_id: data.id } })
    },
    getCodesCategories: function () {
      this.xhttp({
        url: 'contacts/categories',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.categories = response.data
        }
      }).catch((error) => {
        this.response.categories = error.response
        this.respError(error)
      })
    },
    getCodesStatuses: function () {
      this.xhttp({
        url: 'contacts/statuses',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.statuses = response.data
        }
      }).catch((error) => {
        this.response.statuses = error.response
        this.respError(error)
      })
    },
    getContacts: function () {
      this.response.spinner = true
      let send = {
        contact_category_id: this.vModel.category.id,
        contact_status_id: this.vModel.status.id,
        page: this.$route.query.page
      }
      if (this.$route.query.search) {
        this.search = this.$route.query.search
        send.search = this.search
        send.search_type = this.searchType.id
      }
      this.xhttp({
        url: 'contacts',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.contacts = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.contacts = error.response
        this.respError(error)
      })
    },
    submitSearch () {
      let send = { page: 1 }
      if (this.search) {
        send.type = this.searchType.id
        send.search = this.search
      }
      this.$router.push({ name: 'contactsIndex', query: send })
      this.currentPage = 1
      this.getContacts()
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
    resultCategories () {
      if (this.response.categories && this.response.categories.success === true && this.response.categories.data.length > 0) {
        return this.response.categories.data
      } else {
        return false
      }
    },
    resultStatuses () {
      if (this.response.statuses && this.response.statuses.success === true && this.response.statuses.data.length > 0) {
        return this.response.statuses.data
      } else {
        return false
      }
    },
    resultContacts () {
      if (this.response.contacts && this.response.contacts.success === true && this.response.contacts.data.data.length > 0) {
        return this.response.contacts.data
      } else {
        return false
      }
    }
  },
  watch: {
    vModel: {
      handler (val) {
        if (val.category && val.status) {
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
