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
          <template v-if="response.name == 'SiteShow'">
            <div class="col-lg-12 cf">
              <template v-if="response.user_session.role != 'PUBLISHER'">
                <div class="col-6 text-center float-left">
                  <router-link tag="a" :to="({ name: 'SiteShow', params: { user_id: response.user_id, site_id: response.site_id } })" class="w-100 d-inline-block p-3" style="color:#f18024">
                    사이트 정보({{vModel.name}}-{{domain}})
                  </router-link>
                  <span class="w-100 d-inline-block" style="position:absolute;top:0;left:0;height:5px;background:#f18024"></span>
                </div>
                <div class="col-6 text-center float-left">
                  <router-link tag="a" :to="({ name: 'GroupIndex', params: { user_id: response.user_id, site_id: response.site_id } })" class="w-100 d-inline-block p-3">
                    그룹 목록
                  </router-link>
                </div>
              </template>
              <template v-else-if="response.user_session.role == 'PUBLISHER'">
                <div class="col-6 text-center float-left">
                  <router-link tag="a" :to="({ name: 'SiteShowAll', params: { user_id: response.user_id, site_id: response.site_id } })" class="w-100 d-inline-block p-3" style="color:#f18024">
                    사이트 정보({{vModel.name}}-{{domain}})
                  </router-link>
                  <span class="w-100 d-inline-block" style="position:absolute;top:0;left:0;height:5px;background:#f18024"></span>
                </div>
                <div class="col-6 text-center float-left">
                  <router-link tag="a" :to="({ name: 'GroupIndexAll', params: { user_id: response.user_id, site_id: response.site_id } })" class="w-100 d-inline-block p-3">
                    그룹 목록
                  </router-link>
                </div>
              </template>
            </div>
          </template>
          <b-card class="shadow-none">
            <b-form @submit.prevent="siteShowSubmit">
              <div class="col-lg-12 mt-4 cf">
                <div class="col-lg-6 float-left">
                  <h5 class="mb-4 card-title font-weight-bold">기본 정보</h5>
                  <b-form-group label-cols="2" label-cols-horizontal label="아이디">
                    <b-form-input type="text" v-model="vModel.id" required class="col-lg-9" disabled></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="사이트명">
                    <b-form-input type="text" v-model="vModel.name" required placeholder="사이트명을 입력하세요." class="col-lg-9"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="로고">
                    <b-form-input type="text" v-model="vModel.logo" required placeholder="이미지 주소를 입력하세요." class="col-lg-9"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="도메인">
                    <template v-if="response.name == 'SiteCreate'">
                      <b-form-input type="text" v-model="domain" required placeholder="도메인을 입력하세요." class="col-lg-9" ref="domain" :state="domainValidation"></b-form-input>
                      <b-form-invalid-feedback :state="domainValidation" class="text-left">
                        도메인 중복 체크를 완료하세요.
                      </b-form-invalid-feedback>
                      <b-button @click="domainChk" variant="info" size="sm" class="mt-2">중복 체크</b-button>
                    </template>
                    <template v-else><b-form-input type="text" v-model="domain" class="col-lg-9"></b-form-input>
                    </template>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="사이트 코드">
                    <b-form-input type="text" v-model="vModel.code" class="col-lg-9" disabled></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="애널리틱스">
                    <b-form-input type="text" v-model="vModel.analytics" required placeholder="애널리틱스 코드를 입력하세요." class="col-lg-9"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="광고 활성화">
                    <switches v-model="vModel.status" theme="custom" color="primary"  class="mt-2"></switches>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="수익 쉐어">
                    <b-form-input type="text" v-model="vModel.share" class="col-lg-3 d-inline"></b-form-input>
                    <span>설명) 10% = 0.1, >>> 100% = 1 >>> 35% = 0.35</span>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="관리 메모">
                    <b-form-textarea rows="2" max-rows="6" v-model="vModel.memo" no-resize></b-form-textarea>
                  </b-form-group>
                </div>
                <div class="col-lg-6 float-left mt-4 mt-lg-0">
                  <h5 class="mb-4 card-title font-weight-bold">URI 관리</h5>
                  <h6 class="font-weight-bold">PC</h6>
                  <div class="ml-lg-3">
                    <b-form-group label-cols="2" label-cols-horizontal label="컨텐츠 url">
                      <b-form-textarea rows="2" max-rows="6" v-model="vModel.uri_pc_value" placeholder="컨텐츠 url을 입력하세요." class="col-lg-9"></b-form-textarea>
                    </b-form-group>
                  </div>
                  <h6 class="font-weight-bold mt-5">Mobile</h6>
                  <div class="ml-lg-3">
                    <b-form-group label-cols="2" label-cols-horizontal label="컨텐츠 url">
                      <b-form-textarea rows="2" max-rows="6" v-model="vModel.uri_mobile_value" placeholder="컨텐츠 url을 입력하세요." class="col-lg-9"></b-form-textarea>
                    </b-form-group>
                  </div>
                </div>
              </div>
              <div class="m-3 text-center">
                <b-button type="submit" class="mr-2" variant="primary">
                  <template v-if="response.name == 'SiteCreate'">등록</template>
                  <template v-else>저장</template>
                </b-button>
                <b-button variant="light" @click="beforePage()">취소</b-button>
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
import Switches from 'vue-switches'
import { mapActions } from 'vuex'

export default {
  props: ['depth'],
  components: {
    Switches
  },
  created () {
    this.getSiteShowList()
  },
  data () {
    return {
      response: {
        spinner: true,
        type: this.$route.params.type,
        name: this.$route.name,
        user_id: this.$route.params.user_id,
        site_id: this.$route.params.site_id,
        user_session: JSON.parse(localStorage.getItem('user')),
        siteShowEdit: null,
        siteShowCreate: null,
        siteShowDomain: null
      },
      siteShow: null,
      vModel: {
        id: '',
        name: '',
        logo: '',
        analytics: null,
        memo: '',
        status: false,
        domainDone: '',
        domainVal: '',
        domainCheck: false,
        uri_pc_value: '',
        uri_mobile_value: '',
        share: 0
      },
      domain: ''
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getSiteShowList () {
      if (this.response.name === 'SiteShow') {
        this.xhttp({
          url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id,
          method: 'get',
          params: null
        }).then((response) => {
          if (response.status === 200) {
            this.siteShow = response.data
            var resp = response.data.data
            this.vModel.id = resp.id
            this.vModel.name = resp.name
            this.vModel.status = resp.status
            this.vModel.code = resp.code
            this.vModel.logo = resp.logo
            this.vModel.share = resp.share
            this.domain = resp.domain
            this.vModel.memo = resp.memo
            if (resp.uri.pc !== null) {
              if (Array.isArray(resp.uri.pc)) {
                let input = []
                for (let i = 0; i < resp.uri.pc.length; i++) {
                  input.push(resp.uri.pc[i].input)
                }
                this.vModel.uri_pc_value = input.join(',')
              } else {
                this.vModel.uri_pc_value = resp.uri.pc.input
              }
            }
            if (resp.uri.mobile !== null) {
              if (Array.isArray(resp.uri.mobile)) {
                let input = []
                for (let i = 0; i < resp.uri.mobile.length; i++) {
                  input.push(resp.uri.mobile[i].input)
                }
                this.vModel.uri_mobile_value = input.join(',')
              } else {
                this.vModel.uri_mobile_value = resp.uri.mobile.input
              }
            }
            if (resp.analytics) {
              this.vModel.analytics = resp.analytics
            } else {
              this.vModel.analytics = null
            }
            this.respSuccess()
          }
        }).catch((error) => {
          this.siteShow = error.response
          this.respError(error)
        })
      } else {
        this.response.spinner = false
      }
    },
    siteShowSubmit () {
      if (this.response.name === 'SiteCreate' && this.vModel.domainCheck === false) {
        this.vModel.domainVal = 'on'
      } else {
        let send = {
          name: this.vModel.name,
          domain: this.domain,
          status: this.vModel.status,
          share: Number(this.vModel.share),
          logo: this.vModel.logo,
          memo: this.vModel.memo,
          check: this.vModel.domainCheck,
          analytics: this.vModel.analytics
        }
        if (this.vModel.uri_pc_value) {
          send.uri_pc_value = this.vModel.uri_pc_value
        }
        if (this.vModel.uri_mobile_value) {
          send.uri_mobile_value = this.vModel.uri_mobile_value
        }
        this.response.spinner = true
        if (this.response.name === 'SiteCreate') {
          this.postSiteShowCreate(send)
        } else if (this.response.name === 'SiteShow') {
          this.putSiteShowEdit(send)
        }
      }
    },
    postSiteShowCreate (send) {
      this.xhttp({
        url: 'publishers/' + this.response.user_id + '/sites',
        method: 'post',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.siteShowCreate = response.data
          this.$notify('primary', '등록 완료', '등록 완료되었습니다.')
          if (this.response.user_session.role !== 'PUBLISHER') {
            this.$router.push({ name: 'SiteIndex', params: { user_id: this.response.user_id }, query: { page: 1 } })
          } else {
            this.$router.push({ name: 'SiteIndexPublisher', params: { user_id: this.response.user_id } })
          }
        }
      }).catch((error) => {
        this.response.siteShowCreate = error.response
        this.respError(error)
      })
    },
    putSiteShowEdit (send) {
      this.xhttp({
        url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id,
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.siteShowEdit = response.data
          this.respSuccess()
          this.$notify('primary', '수정 완료', '수정 완료되었습니다.')
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
    beforePage () {
      this.$router.go(-1)
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
    }
  }
}
</script>
