<template>
  <div>
    <b-row>
      <b-colxx class="col-6">
        <b-card>
          <b-alert show variant="primary" style="font-size:1.2rem">가상 계좌 번호 : {{response.account}}</b-alert>
          <b-form @submit.prevent="pointSubmit" class="mt-4">
            <b-form-group label-cols="2" label-cols-horizontal label="충전금액">
              <b-form-input type="number" onwheel="this.blur()" v-model.number="vModel.number" required placeholder="충전금액을 입력하세요."></b-form-input>
            </b-form-group>
            <div class="text-center mt-5">
            <b-button type="submit" variant="primary">충전</b-button>
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
    this.getPoint()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_session: JSON.parse(localStorage.getItem('user')),
        account: null,
        pointSend: null
      },
      vModel: {
        number: null
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getPoint: function () {
      this.xhttp({
        url: 'point/' + this.response.user_session.cid,
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          if (response.data === null) {
            this.response.account = '-'
          } else {
            this.response.account = response.data
          }
        }
      }).catch((error) => {
        this.response.account = error.response
      })
    },
    pointSubmit: function () {
      let send = {
        tr_amt: this.vModel.number
      }
      this.xhttp({
        url: 'point',
        method: 'post',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.pointSend = response.data
          this.vModel.number = ''
          this.addNotification('secondary', '충전 완료', '충전 완료되었습니다.')
          this.$Progress.finish()
        }
      }).catch((error) => {
        this.response.pointSend = error.response
        this.$Progress.fail()
      })
    },
    addNotification (type, title, message) {
      this.$notify(type, title, message, { duration: 3000, permanent: false })
    }
  },
  watch: {
    response: {
      handler (val) {
        if (val.account) {
          this.$Progress.finish()
        } else {
          this.$Progress.fail()
        }
        this.response.spinner = false
      },
      deep: true
    }
  }
}
</script>
