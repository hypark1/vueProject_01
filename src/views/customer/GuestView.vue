<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="비회원 문의 답변"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-form class="text-center col-8" @submit.prevent="submitGuestEdit">
            <b-form-group label-cols="2" label-cols-horizontal label="카테고리">
              <b-input :value="resultGuest.category" readonly style="background:#fff;"></b-input>
            </b-form-group>
            <b-form-group label-cols="2" label-cols-horizontal label="이름">
              <b-input :value="resultGuest.name" readonly style="background:#fff;"></b-input>
            </b-form-group>
            <b-form-group label-cols="2" label-cols-horizontal label="번호">
              <b-input :value="resultGuest.mobile" readonly style="background:#fff;"></b-input>
            </b-form-group>
            <b-form-group label-cols="2" label-cols-horizontal label="이메일">
              <b-input :value="resultGuest.email" readonly style="background:#fff;"></b-input>
            </b-form-group>
            <b-form-group label-cols="2" label-cols-horizontal label="작성일시">
              <b-input :value="resultGuest.created_at" readonly style="background:#fff;"></b-input>
            </b-form-group>
            <b-form-group label-cols="2" label-cols-horizontal label="문의 내용">
              <b-input :value="resultGuest.question_content" readonly style="background:#fff;"></b-input>
            </b-form-group>
            <b-form-group label-cols="2" label-cols-horizontal label="답변">
              <b-form-textarea rows="10" max-rows="10"
                               v-model="vModel.content"
                               placeholder="답변을 입력하세요."
                               no-resize required>
              </b-form-textarea>
            </b-form-group>
            <div class="mt-5 text-center">
              <b-button type="submit" class="mr-1" variant="primary">등록</b-button>
              <b-button variant="light" @click="guestPage()">취소</b-button>
            </div>
          </b-form>
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
    this.getGuestView()
  },
  data () {
    return {
      response: {
        spinner: true,
        guest_id: this.$route.params.guest_id,
        guest: null,
        guestEdit: null
      },
      vModel: {
        content: '',
        validation: ''
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getGuestView: function () {
      if (this.response.guest_id) {
        this.xhttp({
          url: 'guest/' + this.response.guest_id,
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
      } else {
        this.$router.push({ name: 'guestIndex' })
      }
    },
    submitGuestEdit () {
      if (confirm('답변 완료 시 다시 답변할 수 없습니다. 답변 완료하시겠습니까?')) {
        this.getGuestEdit()
      }
    },
    getGuestEdit: function () {
      let send = {
        answer: this.vModel.content
      }
      this.xhttp({
        url: 'guest/' + this.response.guest_id + '/edit',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.guestEdit = response.data
          this.$notify('primary', '답변 완료', '답변 완료되었습니다.')
          this.$router.push({ name: 'guestIndex' })
        }
      }).catch((error) => {
        this.response.guestEdit = error.response
        this.respError(error)
      })
    },
    guestPage () {
      this.$router.push({ name: 'guestIndex' })
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
      if (this.response.guest && this.response.guest.success === true && this.response.guest.data) {
        return this.response.guest.data
      } else {
        return false
      }
    }
  }
}
</script>
