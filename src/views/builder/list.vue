<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Rich Media 소재 목록"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx>
        <b-card>
          <div class="col-8 float-left">
            <div class="cf mb-2">
              <div class="float-left">
                <b-form-group>
                  <b-form-select v-model="vModel.format_type"
                                 :options="response.formatOptions"
                                 style="width:200px;height:43px;"
                                 class="mr-2"
                                 @change="getBuilderList"
                                 plain required>
                    <option slot="first" value="">전체</option>
                  </b-form-select>
                </b-form-group>
              </div>
              <b-form @submit.prevent="getBuilderList" class="float-right w-30">
                <b-form-group class="w-70 float-left">
                  <b-form-input type="text" v-model="search" placeholder="Search" required />
                </b-form-group>
                <b-form-group class="w-30 m-0">
                  <b-button type="submit" class=" default border" variant="light">검색</b-button>
                </b-form-group>
              </b-form>
            </div>
            <b-table class="text-center"
                     hover
                     show-empty
                     :items="resultBuilders.data"
                     :fields="config.bannerField"
                     @row-clicked="bannerRowClick">
              <template slot="empty">
                배너가 없습니다.
              </template>
              <template slot="no" slot-scope="data">
                {{resultBuilders.total - (resultBuilders.per_page * (resultBuilders.current_page - 1)) - data.index}}
              </template>
            </b-table>
            <b-pagination-nav
              size="sm"
              align="center"
              v-model="currentPage"
              :link-gen="linkGen"
              :number-of-pages="resultBuilders.last_page">
            </b-pagination-nav>
          </div>
          <div class="col-4 float-right">
            <formatComponent
              :file="this.response.file"
              :text="this.vModel.text"
              :format="resultFormats"
              type="list">
            </formatComponent>
          </div>
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
import formatComponent from './formatComponent.vue'

export default {
  components: {
    formatComponent
  },
  created () {
    this.getFormat()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_session: JSON.parse(localStorage.getItem('user')),
        formatOptions: [],
        type: null,
        builderIndex: null,
        file: null,
        item: null
      },
      vModel: {
        text: {
          headcopy: null,
          url: null
        },
        format_type: '',
        list_format: null
      },
      config: {
        bannerField: {
          no: { label: 'NO', sortable: true },
          format: { label: '형태' },
          banner_name: { label: '배너명' },
          created_at: { label: '날짜' }
        }
      },
      search: '',
      currentPage: 1
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    linkGen (pageNum) {
      return {
        name: 'adBuilderIndex'
      }
    },
    bannerRowClick (data, index) {
      this.response.file = null
      this.vModel.text.headcopy = null
      this.vModel.list_format = data.format
      this.getBuilderData(data.id)
    },
    getFormat () {
      this.xhttp({
        url: '/builder/preset',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.type = response.data
          if (response.data.data.length > 0) {
            this.response.formatOptions = response.data.data
          }
          this.getBuilderList()
        }
      }).catch((error) => {
        this.response.type = error.response
        this.respError(error)
      })
    },
    getBuilderList () {
      this.response.spinner = true
      let send = {
        page: this.currentPage
      }
      if (this.search) {
        send.banner_name = this.search
      }
      if (this.vModel.format_type) {
        send.format = this.vModel.format_type
      }
      this.xhttp({
        url: '/builder',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.builderIndex = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.builderIndex = error.response
        this.respError(error)
      })
    },
    getBuilderData (id) {
      this.xhttp({
        url: '/builder/' + id,
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.item = response.data
          if (this.response.item.data) {
            this.response.file = this.response.item.data.values
            this.response.file.vimeo_id = this.response.item.data.vimeo_id
          }
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.item = error.response
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
    resultBuilders () {
      if (this.response.builderIndex && this.response.builderIndex.success === true && this.response.builderIndex.data) {
        return this.response.builderIndex.data
      } else {
        return false
      }
    },
    resultFormats () {
      if (this.vModel.list_format) {
        let format = this.response.formatOptions.filter(Options => Options.value === this.vModel.list_format)
        return format[0].text
      } else {
        return ''
      }
    }
  },
  watch: {
    currentPage: function () {
      this.getBuilderList()
    },
    search: function (val) {
      if (val === '') {
        this.getBuilderList()
      }
    }
  }
}
</script>
