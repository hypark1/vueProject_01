<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="비회원 문의"/>
        <div class="separator mt-2 mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-table class="text-center"
                   hover
                   show-empty
                   :items="resultGuest.data"
                   :fields="config.guestField"
                   @row-clicked="guestRowClick">
            <template slot="empty">
              문의가 없습니다.
            </template>
            <template slot="no" slot-scope="data">
              {{data.index + 1}}
            </template>
          </b-table>
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
    this.getGuest()
  },
  data () {
    return {
      response: {
        spinner: true,
        guest: null
      },
      vModel: {
        currentPage: 1
      },
      config: {
        guestField: {
          no: { label: 'No', sortable: true },
          category: { label: '카테고리' },
          name: { label: '이름' },
          mobile: { label: '번호' },
          email: { label: '이메일' },
          question_content: { label: '문의 내역' },
          created_at: { label: '날짜' }
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    guestRowClick (data, index) {
      this.$router.push({ name: 'guestView', params: { guest_id: data.id } })
    },
    getGuest: function () {
      this.xhttp({
        url: 'guest',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.guest = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.guest = error.response
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
    resultGuest () {
      if (this.response.guest && this.response.guest.success === true && this.response.guest.data.length > 0) {
        return this.response.guest
      } else {
        return false
      }
    }
  }
}
</script>
