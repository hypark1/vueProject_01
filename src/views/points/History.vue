<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="포인트 이력"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="`보유 포인트 : ` + resultPointTotal + ` point`">
          <b-table class="text-center"
                   striped
                   show-empty
                   :items="resultHistory.data"
                   :fields="config.pointsField">
            <template slot="empty">
              포인트 이력이 없습니다.
            </template>
            <template slot="no" slot-scope="data">
              {{ resultHistory.total - (resultHistory.per_page * (resultHistory.current_page - 1)) - data.index}}
            </template>
            <template slot="point" slot-scope="data">
              <span v-if="data.value >= 0" style="color: royalblue;">
                {{numReplace(data.value)}}
              </span>
              <span v-else style="color: orangered;">
                -{{numReplace(data.value)}}
              </span>
            </template>
          </b-table>
          <b-pagination-nav
            size="sm"
            align="center"
            v-model="currentPage"
            :link-gen="linkGen"
            :number-of-pages="resultHistory.last_page">
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
    this.getPointHistory()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_session: JSON.parse(localStorage.getItem('user')),
        history: null,
        total: null
      },
      vModel: {
      },
      refund: 0,
      currentPage: 1,
      config: {
        pointsField: {
          no: { label: 'No', sortable: true },
          created_at: { label: '날짜' },
          'user.name': { label: '사용자' },
          point: { label: '포인트' },
          comment: { label: '내용' }
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    linkGen (pageNum) {
      return {
        name: 'pointHistory', query: { page: pageNum }
      }
    },
    getPointHistory: function () {
      this.vModel.currentPage = this.$route.query.page
      let send = {
        page: this.currentPage
      }
      this.xhttp({
        url: '/point/' + this.response.user_session.id + '/pointHistory',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.history = response.data
          this.getPointTotal()
        }
      }).catch((error) => {
        this.response.history = error.response
        this.respError(error)
      })
    },
    getPointTotal: function () {
      this.xhttp({
        url: 'point/total',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.total = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.total = error.response
        this.respError(error)
      })
    },
    numReplace: function (num) {
      num = num + ''
      const result = num.replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return result
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
    currentPage: function () {
      this.getPointHistory()
    }
  },
  computed: {
    resultPointTotal () {
      if (this.response.total) {
        return this.numReplace(this.response.total.data)
      } else {
        return ''
      }
    },
    resultHistory () {
      if (this.response.history && this.response.history.success === true && this.response.history.data.data.length > 0) {
        return this.response.history.data
      } else {
        return false
      }
    }
  }
}
</script>
