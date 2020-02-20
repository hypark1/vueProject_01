<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="사이트 관리" :depth="depth"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" no-body>
          <b-card class="shadow-none">
            <b-form @submit.prevent="siteShowSubmit">
              <div class="col-lg-12 mt-4 cf">
                <div class="col-lg-6 float-left">
                  <h5 class="mb-4 card-title font-weight-bold">기본 정보</h5>
                  <b-form-group label-cols="2" label-cols-horizontal label="사이트명">
                    <b-form-input type="text" v-model="vModel.name" required placeholder="사이트명을 입력하세요." class="col-lg-9"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="도메인">
                    <template v-if="response.name == 'SiteCreateSupply'">
                      <b-form-input type="text" v-model="domain" required placeholder="도메인을 입력하세요." class="col-lg-9" ref="domain" :state="domainValidation"></b-form-input>
                      <b-form-invalid-feedback :state="domainValidation" class="text-left">
                        도메인 중복 체크를 완료하세요.
                      </b-form-invalid-feedback>
                      <b-button @click="domainChk" variant="info" size="sm" class="mt-2">중복 체크</b-button>
                    </template>
                    <template v-else>
                      <b-form-input type="text" v-model="domain" class="col-lg-9" disabled></b-form-input>
                    </template>
                  </b-form-group>
                </div>
              </div>
              <div class="m-3 text-center">
                <b-button type="submit" class="mr-2" variant="primary">
                  <template v-if="response.name == 'SiteCreateSupply'">등록</template>
                  <template v-else>저장</template>
                </b-button>
                <router-link tag="a" :to="({ name: 'SiteIndexPublisher' })">
                  <b-button variant="light">취소</b-button>
                </router-link>
              </div>
            </b-form>
          </b-card>
        </b-card>
        <div class="spinner-background" v-show="response.spinner">
          <b-spinner variant="info"></b-spinner>
        </div>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['depth'],
  created () {
    this.getSiteShowList()
  },
  data () {
    return {
      response: {
        spinner: true,
        name: this.$route.name,
        user_id: this.$route.params.user_id,
        site_id: this.$route.params.site_id,
        user_session: JSON.parse(localStorage.getItem('user')),
        uriTypeOptions: [
          { value: 1, text: 'PATH' },
          { value: 2, text: 'QUERYSTRING' }
        ],
        siteShow: null,
        siteShowEdit: null,
        siteShowCreateSupply: null,
        siteShowDomain: null
      },
      vModel: {
        name: '',
        status: false,
        domainDone: '',
        domainVal: '',
        domainCheck: false
      },
      domain: ''
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getSiteShowList () {
      if (this.response.name !== 'SiteCreateSupply') {
        this.xhttp({
          url: 'publishers/' + this.response.user_session.id + '/sites/' + this.response.site_id,
          method: 'get',
          params: null
        }).then((response) => {
          if (response.status === 200) {
            this.response.siteShow = response.data
            var resp = response.data.data
            this.vModel.name = resp.name
            this.vModel.status = resp.status
            this.domain = resp.domain
            this.respSuccess()
          }
        }).catch((error) => {
          this.response.siteShow = error.response
          this.respError(error)
        })
      } else {
        this.response.spinner = false
      }
    },
    siteShowSubmit () {
      if (this.response.name === 'SiteCreateSupply' && this.vModel.domainCheck === false) {
        this.vModel.domainVal = 'on'
      } else {
        let send = {
          name: this.vModel.name,
          domain: this.domain,
          status: this.vModel.status,
          check: this.vModel.domainCheck
        }
        if (this.response.name === 'SiteCreateSupply') {
          this.postSiteShowCreate(send)
        } else {
          this.putSiteShowEdit(send)
        }
      }
    },
    postSiteShowCreate (send) {
      this.xhttp({
        url: 'publishers/' + this.response.user_session.id + '/sites',
        method: 'post',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.siteShowCreateSupply = response.data
          this.$notify('primary', '등록 완료', '등록 완료되었습니다.')
          this.$router.push({ name: 'SiteIndexPublisher' })
        }
      }).catch((error) => {
        this.response.siteShowCreateSupply = error.response
        this.respError(error)
      })
    },
    putSiteShowEdit (send) {
      this.xhttp({
        url: 'publishers/' + this.response.user_session.id + '/sites/' + this.response.site_id,
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.siteShowEdit = response.data
          this.respSuccess()
          this.$notify('primary', '수정', '수정 완료되었습니다.')
        }
      }).catch((error) => {
        this.response.siteShowEdit = error.response
        this.respError(error)
      })
    },
    domainChk () {
      if (this.domain && this.vModel.domainCheck === false) {
        this.$notify('primary', '성공', '사용 가능한 도메인입니다.')
        this.postPublisherCheck()
      } else {
        if (this.domain) {
          this.$notify('warning', '실패', '이미 사용중인 도메인입니다.')
        } else {
          this.$notify('warning', '실패', '도메인을 올바르게 입력하세요.')
        }
        this.$refs.domain.focus()
      }
    },
    postPublisherCheck () {
      let send = {
        domain: this.domain
      }
      this.xhttp({
        url: 'publishers/sites/check',
        method: 'post',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.siteShowDomain = response.data
          this.vModel.domainCheck = response.data.data
          this.respSuccess()
          this.vModel.domainVal = 'on'
          this.vModel.domainDone = this.domain
        }
      }).catch((error) => {
        this.response.siteShowDomain = error.response
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
    domainValidation () {
      if (this.vModel.domainVal === 'on') {
        return this.domain.length > 0 && this.vModel.domainCheck === true
      } else {
        return ''
      }
    }
  },
  watch: {
    domain: function () {
      if (this.vModel.domainDone) {
        if (this.domain === this.vModel.domainDone) {
          this.vModel.domainCheck = true
        } else {
          this.vModel.domainCheck = false
        }
      }
    },
    response: {
      handler (val) {
        if (val.siteShow && !val.siteShowCreateSupply && !val.siteShowEdit) {
          if (val.siteShow.success === true) {
            this.$Progress.finish()
          } else {
            this.$notify('error', '오류', '관리자에게 문의바랍니다.')
            this.$Progress.fail()
          }
          this.response.spinner = false
        }
      },
      deep: true
    }
  }
}
</script>
