<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <template v-if="response.name == 'manager'">
          <piaf-breadcrumb heading="영업 매니저 추가"/>
        </template>
        <template v-else-if="response.name == 'advertiser'">
          <piaf-breadcrumb heading="광고주 추가"/>
        </template>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4 cf">
          <div class="col-lg-6">
            <h2 class="mb-4">정보</h2>
            <b-form @submit.prevent="userCreateSubmit">
              <template v-if="['ADMINISTRATOR', 'MANAGER'].includes(response.user_session.role) && resultAgent">
              <b-form-group label-cols="3" label-cols-horizontal label="대행사">
                <b-form-select v-model="vModel.agency_id"
                               :options="resultAgent"
                               @change="changeAgent"
                               class="col-lg-12"
                               plain required>
                  <option slot="first" value="">선택하세요</option>
                </b-form-select>
              </b-form-group>
              </template>
              <template v-if="['ADMINISTRATOR', 'MANAGER', 'AGENCY'].includes(response.user_session.role)
              && response.name == 'advertiser'">
              <b-form-group label-cols="3" label-cols-horizontal label="영업 매니저">
                <b-form-select v-model="vModel.agent_id"
                               :options="resultManagers"
                               class="col-lg-12"
                               plain required>
                  <option slot="first" value="">선택하세요</option>
                </b-form-select>
              </b-form-group>
              </template>
              <b-form-group label-cols="3" label-cols-horizontal label="이름">
                <b-form-input type="text" v-model="vModel.name" required placeholder="이름을 입력하세요." class="col-lg-12"></b-form-input>
              </b-form-group>
              <b-form-group label-cols="3" label-cols-horizontal label="E-mail">
                <b-form-input type="email" v-model="vModel.email" required placeholder="E-mail을 입력하세요." class="col-lg-12" @blur="emailCheck"></b-form-input>
                <p class="text-left" :style="style">이미 사용중인 이메일입니다.</p>
              </b-form-group>
              <template v-if="response.name == 'manager'">
                <b-form-group label-cols="3" label-cols-horizontal label="Password">
                  <b-form-input type="password" required v-model="vModel.password" ref="password" :state="passwordValidation" placeholder="Password를 입력하세요."></b-form-input>
                  <b-form-invalid-feedback :state="passwordValidation" class="text-left">
                    비밀번호를 6자 이상 입력하세요.
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label-cols="3" label-cols-horizontal label="Password Confirm">
                  <b-form-input type="password" required v-model="vModel.passwordConfirm" :state="passwordConfirmValidation" placeholder="Password Confirm을 입력하세요."></b-form-input>
                  <b-form-invalid-feedback :state="passwordConfirmValidation" class="text-left">
                    동일한 비밀번호를 입력하세요.
                  </b-form-invalid-feedback>
                </b-form-group>
              </template>
              <b-form-group label-cols="3" label-cols-horizontal label="휴대폰 번호">
                <b-form-input type="number" onwheel="this.blur()" v-model="vModel.mobile" class="col-lg-12" placeholder="하이픈(-)을 제외한 휴대폰 번호를 입력하세요." :state="mobileValidation"></b-form-input>
                <b-form-invalid-feedback :state="mobileValidation" class="text-left">
                  하이픈(-)을 제외한 휴대폰 번호를 올바르게 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <div class="text-center mt-4">
                <b-button type="submit" variant="primary">저장</b-button>
                <template v-if="['manager', 'advertiser'].includes(response.name)">
                  <b-button type="button" variant="light" @click="userCreateBack()" class="ml-2">취소</b-button>
                </template>
              </div>
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
    this.getAgentList()
  },
  data () {
    return {
      response: {
        spinner: true,
        name: this.$route.path.split('/')[2],
        userCreate: null,
        user_session: JSON.parse(localStorage.getItem('user')),
        agent: null,
        managers: null,
        user: null
      },
      vModel: {
        agency_id: '',
        agent_id: '',
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        mobile: '',
        validation: ''
      },
      style: {
        display: 'none',
        marginTop: '.25rem',
        marginBottom: '0',
        fontSize: '80%',
        color: '#dc3545'
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getAgentList: function () {
      if (['ADMINISTRATOR', 'MANAGER'].includes(this.response.user_session.role)) {
        this.response.spinner = true
        this.xhttp({
          url: '/user/agencyList',
          method: 'get',
          params: null
        }).then((response) => {
          if (response.status === 200) {
            this.response.agent = response.data
            this.respSuccess()
          }
        }).catch((error) => {
          this.response.agent = error.response
          this.respError(error)
        })
      } else {
        this.getManagerList(this.response.user_session.cid)
      }
    },
    changeAgent () {
      if (this.response.name === 'advertiser') {
        this.getManagerList(this.vModel.agency_id)
      }
    },
    getManagerList: function (id) {
      this.response.spinner = true
      this.xhttp({
        url: 'user/' + id + '/agentList',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.managers = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.managers = error.response
        this.respError(error)
      })
    },
    userCreateSubmit () {
      this.vModel.validation = 'on'
      if (this.vModel.password === this.vModel.passwordConfirm) {
        if (this.vModel.mobile) {
          if (this.vModel.mobile.length > 9 && this.vModel.mobile.length < 12) {
            this.userCreateDom()
          }
        } else {
          this.userCreateDom()
        }
      }
    },
    userCreateDom () {
      this.response.spinner = true
      if (['ADMINISTRATOR', 'MANAGER'].includes(this.response.user_session.role)) {
        if (this.response.name === 'manager') {
          this.getManagerCreate(this.vModel.agency_id)
        } else if (this.response.name === 'advertiser') {
          this.getAdvertiserCreate(this.vModel.agency_id)
        }
      } else {
        if (this.response.name === 'manager') {
          this.getManagerCreate(this.response.user_session.cid)
        } else if (this.response.name === 'advertiser') {
          this.getAdvertiserCreate(this.response.user_session.cid)
        }
      }
    },
    getManagerCreate: function (id) {
      let send = {
        name: this.vModel.name,
        email: this.vModel.email,
        password: this.vModel.password
      }
      if (this.vModel.mobile) {
        send.mobile = this.vModel.mobile
      }
      this.xhttp({
        url: 'user/' + id + '/createMember',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.userCreate = response.data
          this.respSuccess()
          this.$notify('primary', '추가 완료', '추가 완료했습니다.')
          this.vModel.validation = ''
          this.$router.push({ name: 'managerIndex' })
        }
      }).catch((error) => {
        this.response.userCreate = error.response
        this.respError(error)
      })
    },
    getAdvertiserCreate: function (id) {
      let send = {
        name: this.vModel.name,
        email: this.vModel.email
      }
      if (this.vModel.mobile) {
        send.mobile = this.vModel.mobile
      }
      if (this.vModel.agent_id) {
        send.agent_id = this.vModel.agent_id
      }
      if (this.response.user_session.role === 'AGENT') {
        send.agent_id = this.response.user_session.id
      }
      this.xhttp({
        url: 'user/' + id + '/createMember',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.userCreate = response.data
          this.respSuccess()
          this.$notify('primary', '추가 완료', '추가 완료했습니다.')
          this.vModel.validation = ''
          this.$router.push({ name: 'advertiserIndex' })
        }
      }).catch((error) => {
        this.response.userCreate = error.response
        this.respError(error)
      })
    },
    userCreateBack () {
      if (this.response.name === 'manager') {
        this.$router.push({ name: 'managerIndex' })
      } else if (this.response.name === 'advertiser') {
        this.$router.push({ name: 'advertiserIndex' })
      }
    },
    emailCheck () {
      let send = {
        email: this.vModel.email
      }
      if (send.email) {
        this.xhttp({
          url: 'user/email',
          method: 'get',
          params: send
        }).then((response) => {
          if (response.status === 200) {
            if (response.data.data === true) {
              this.style.display = 'block'
            } else {
              this.style.display = 'none'
            }
          }
          this.respSuccess()
        }).catch((error) => {
          this.response.emailResponse = error.response
          this.respError(error)
        })
      }
    },
    respSuccess: function () {
      this.$Progress.finish()
      this.response.spinner = false
    },
    respError: function (error) {
      let message = error.response.data.messages.message
      if (message) {
        this.$notify('error', '오류', message)
      } else {
        this.$notify('error', '오류', '관리자에게 문의바랍니다.')
      }
      this.$Progress.fail()
      this.response.spinner = false
    }
  },
  computed: {
    resultAgent () {
      if (this.response.agent && this.response.agent.success === true && this.response.agent.data.length > 0) {
        return this.response.agent.data
      } else {
        return []
      }
    },
    resultManagers () {
      if (this.response.managers && this.response.managers.success === true && this.response.managers.data.length > 0) {
        return this.response.managers.data
      } else {
        return []
      }
    },
    passwordValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.password.length > 5 && this.vModel.password.length < 255
      } else {
        return ''
      }
    },
    passwordConfirmValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.password === this.vModel.passwordConfirm
      } else {
        return ''
      }
    },
    mobileValidation () {
      if (this.vModel.validation === 'on' && this.vModel.mobile) {
        return this.vModel.mobile.length > 9 && this.vModel.mobile.length < 12
      } else {
        return ''
      }
    }
  }
}
</script>
