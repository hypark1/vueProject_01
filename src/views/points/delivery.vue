<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="포인트 전달"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <div class="col-lg-6 m-3">
            <b-alert show variant="secondary" class="p-3 mb-5">
              <template v-if="response.user_session.role === 'AGENCY'">
                선택한 영업 매니저에게 해당 포인트가 전달됩니다.
              </template>
              <template v-else-if="response.user_session.role === 'AGENT'">
                자신의 대행사에게 해당 포인트가 전달됩니다.
              </template>
            </b-alert>
            <b-form @submit.prevent="pointDeliverySubmit">
              <b-form-group label-cols="2" label-cols-horizontal label="보유 포인트">
                <p class="col-form-label">{{resultPoint}} point</p>
              </b-form-group>
              <template v-if="response.user_session.role === 'AGENCY'">
              <b-form-group label-cols="2" label-cols-horizontal label="영업 매니저">
                <b-form-select v-model="vModel.agentSelect"
                               :options="response.agentOptions"
                               plain required>
                  <option slot="first" value="">선택하세요.</option>
                </b-form-select>
              </b-form-group>
              </template>
              <b-form-group label-cols="2" label-cols-horizontal label="포인트">
                <b-form-input type="text" v-model="point" :state="pointValidation" required placeholder="포인트를 입력하세요."></b-form-input>
                <b-form-invalid-feedback :state="pointValidation">
                  {{vModel.validationTxt}}
                </b-form-invalid-feedback>
              </b-form-group>
              <b-button type="submit" variant="primary" class="d-block mt-4 ml-auto mr-auto">전달하기</b-button>
            </b-form>
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

export default {
  created () {
    this.getPointTotal()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_session: JSON.parse(localStorage.getItem('user')),
        searchList: null,
        total: null,
        agentOptions: []
      },
      vModel: {
        currentPoint: null,
        agentSelect: '',
        validation: '',
        validationTxt: ''
      },
      point: null
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getPointTotal: function (val) {
      this.xhttp({
        url: 'point/total',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.total = response.data
          if (!val) {
            this.getSearch()
          }
        }
      }).catch((error) => {
        this.response.total = error.response
        this.respError(error)
      })
    },
    getSearch: function () {
      let send = {
        agency_id: this.response.user_session.cid
      }
      this.xhttp({
        url: '/report/search',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.searchList = response.data
          if (this.response.searchList.data) {
            this.response.agentOptions = this.response.searchList.data.map(function ($value) {
              return { value: $value.id, text: $value.name }
            })
          }
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.searchList = error.response
        this.respError(error)
      })
    },
    pointDeliverySubmit () {
      let point = Number(this.point.replace(/,/g, ''))
      if (isNaN(point) === false && point <= Number(this.response.total.data) && point > 0) {
        let send = {
          point: point
        }
        if (this.vModel.agentSelect) {
          send.user_id = this.vModel.agentSelect
        }
        this.xhttp({
          url: '/point/givePoint',
          method: 'get',
          params: send
        }).then((response) => {
          if (response.status === 200) {
            if (response.data.success === true) {
              this.vModel.agentSelect = ''
              this.point = null
              this.$notify('primary', '전달 완료', '포인트 전달 완료되었습니다.')
              this.respSuccess()
              this.getPointTotal('0')
            }
          }
        }).catch((error) => {
          this.respError(error)
        })
      } else {
        this.vModel.validation = 'on'
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
    pointValidation () {
      if (this.vModel.validation === 'on') {
        let point = Number(this.point.replace(/,/g, ''))
        return isNaN(point) === false && point <= Number(this.response.total.data) && point > 0
      } else {
        return ''
      }
    },
    resultPoint () {
      if (this.response.total) {
        var point = this.response.total.data + ''
        const result = point.replace(/\D/g, '')
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return result
      } else {
        return ''
      }
    }
  },
  watch: {
    point: function (val) {
      let point = Number(val.replace(/,/g, ''))
      if (isNaN(point) === false) {
        // 숫자
        if (point > Number(this.response.total.data)) {
          // 환불포인트 > 현재포인트
          this.vModel.validationTxt = '보유 포인트보다 작거나 같은 금액을 입력하세요.'
        } else {
          this.vModel.validationTxt = ''
        }
        const result = val.replace(/\D/g, '')
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        this.point = result
      } else {
        // 문자포함
        this.vModel.validation = 'on'
        this.vModel.validationTxt = '숫자만 입력하세요.'
      }
    }
  }
}
</script>
