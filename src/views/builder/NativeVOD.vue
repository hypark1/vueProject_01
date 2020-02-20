<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="response.format_name"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx>
        <b-card class="cf">
          <b-colxx class="col-7 float-left">
            <h3>Setting</h3>
            <div class="separator mt-4 mb-4"></div>
            <b-form @submit.prevent="submitBuilder">
              <template v-if="['ADMINISTRATOR', 'MANAGER'].includes(response.user_session.role) && resultAgent">
                <b-form-group label-cols="2" label-cols-horizontal label="대행사">
                  <b-form-select v-model="vModel.agency_id"
                                 :options="resultAgent"
                                 @change="changeAgentSelect"
                                 class="col-lg-12"
                                 plain required>
                    <option slot="first" value="">선택하세요</option>
                  </b-form-select>
                </b-form-group>
              </template>
              <template v-if="['ADMINISTRATOR', 'MANAGER', 'AGENCY'].includes(response.user_session.role)">
                <b-form-group label-cols="2" label-cols-horizontal label="영업 매니저">
                  <b-form-select v-model="vModel.agent_id"
                                 :options="resultManagers"
                                 @change="changeManagersSelect"
                                 class="col-lg-12"
                                 plain required>
                    <option slot="first" value="">선택하세요</option>
                  </b-form-select>
                </b-form-group>
              </template>
              <template v-if="['ADMINISTRATOR', 'MANAGER', 'AGENCY', 'AGENT'].includes(response.user_session.role)">
                <b-form-group label-cols="2" label-cols-horizontal label="광고주">
                  <b-form-select v-model="vModel.advertiser_id"
                                 :options="resultAdvertiser"
                                 class="col-lg-12"
                                 plain required>
                    <option slot="first" value="">선택하세요</option>
                  </b-form-select>
                </b-form-group>
              </template>
              <b-form-group label-cols-horizontal label-cols="2" label="Banner Name">
                <b-form-input v-model="vModel.banner_name"
                              placeholder="Banner Name 을 입력하세요."
                              :state="nameValidation" required></b-form-input>
                <b-form-invalid-feedback :state="nameValidation" class="text-left">
                  50자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols-horizontal label-cols="2" label="VOD File">
                <b-input-group>
                  <template v-if="response.vod">
                    <b-form-input v-model="vModel.fileName" :title="vModel.fileName" disabled class="col-12" style="padding-right:2rem;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;overflow:hidden;"/>
                  </template>
                  <template v-else>
                    <b-form-input placeholder="Drop file here" disabled required/>
                    <b-input-group-append>
                      <file-upload
                        class="btn btn-outline-secondary"
                        ref="nativeVOD_file"
                        v-model="File_vod"
                        name="file"
                        input-id="nativeVOD_file"
                        :post-action="`/api/builder/` + this.response.builder_id + `/videoUpload`"
                        :drop="true"
                        :drop-directory="true"
                        @input-file="inputFile"
                        @input-filter="inputFilter">
                        업로드
                      </file-upload>
                    </b-input-group-append>
                  </template>
                </b-input-group>
                <span v-if="!response.vod" class="d-block w-100 mt-2">* 업로드 가능한 동영상 비율은 16:9 입니다.</span>
              </b-form-group>
              <b-form-group label-cols="2" label-cols-horizontal label="Tap Bar Text">
                <b-form-select v-model="vModel.file.tapbarOption"
                               :options="resultTapbar"
                               class="col-lg-12"
                               plain required>
                  <option slot="first" value="">선택하세요</option>
                </b-form-select>
              </b-form-group>
              <b-form-group label-cols-horizontal label-cols="2" label="Description">
                <b-form-input v-model="vModel.file.desc"
                              :state="descValidation"
                              placeholder="Description 을 입력하세요." required></b-form-input>
                <b-form-invalid-feedback :state="descValidation" class="text-left">
                  60자 이하로 입력하세요.
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label-cols-horizontal label-cols="2" label="Title">
                <b-form-input v-model="vModel.file.title"
                              :state="titleValidation"
                              placeholder="Title 을 입력하세요." required></b-form-input>
              </b-form-group>
              <b-form-invalid-feedback :state="titleValidation" class="text-left">
                30자 이하로 입력하세요.
              </b-form-invalid-feedback>
              <b-form-group label-cols-horizontal label-cols="2" label="Destination URL">
                <b-form-input v-model="vModel.file.url"
                              placeholder="Destination URL 을 입력하세요." required></b-form-input>
              </b-form-group>
              <div class="mt-5 text-center">
                <template v-if="vModel.submit">
                  <b-button type="submit" class="mr-1" variant="primary">적용</b-button>
                </template>
                <template v-else>
                  <b-button type="submit" class="mr-1" variant="primary">저장</b-button>
                </template>
                <router-link tag="a" :to="{name: 'adBuilderHome'}">
                  <b-button variant="light">취소</b-button>
                </router-link>
              </div>
            </b-form>
          </b-colxx>
          <b-colxx class="col-5 float-right">
            <formatComponent :file="this.response.file" :text="this.vModel.file" :format="response.format_name"></formatComponent>
          </b-colxx>
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
import FileUpload from 'vue-upload-component'
import formatComponent from './formatComponent.vue'

export default {
  components: {
    FileUpload,
    formatComponent
  },
  created () {
    this.paramsIdChk()
  },
  data () {
    return {
      resultTapbar: [
        { value: '1', text: '자세히보기' },
        { value: '2', text: '더보기' }
      ],
      response: {
        spinner: false,
        user_session: JSON.parse(localStorage.getItem('user')),
        builder_id: this.$route.params.builder_id,
        format_name: this.$route.params.format_name,
        agent: null,
        managers: null,
        advertiser: null,
        file: null,
        vod: null,
        save: null,
        show: null
      },
      vModel: {
        agency_id: '',
        agent_id: '',
        advertiser_id: '',
        banner_name: null,
        file: {
          tapbarOption: '',
          tapbar: null,
          title: null,
          desc: null,
          url: null
        },
        fileName: '',
        validation: '',
        submit: true
      },
      File_vod: []
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    paramsIdChk () {
      if (!this.response.builder_id) {
        this.$router.push({ name: 'adBuilderHome' })
      } else {
        this.getAgentList()
      }
    },
    changeAgentSelect () {
      if (this.vModel.agency_id === '') {
        this.vModel.agent_id = ''
        this.response.managers = { value: '', text: '선택하세요' }
      } else {
        this.getManagerList(this.vModel.agency_id)
      }
    },
    changeManagersSelect () {
      if (this.vModel.agent_id === '') {
        this.vModel.advertiser_id = ''
        this.response.advertiser = { value: '', text: '선택하세요' }
      } else {
        this.getAdvertiserList(this.vModel.agent_id)
      }
    },
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
      } else if (['AGENCY'].includes(this.response.user_session.role)) {
        this.getManagerList(this.response.user_session.cid)
      } else if (['AGENT'].includes(this.response.user_session.role)) {
        this.getAdvertiserList(this.response.user_session.id)
      } else if (['ADVERTISER'].includes(this.response.user_session.role)) {
        this.vModel.advertiser_id = this.response.user_session.id
      }
    },
    getManagerList: function (id) {
      if (id) {
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
      }
    },
    getAdvertiserList: function (id) {
      if (id) {
        this.response.spinner = true
        this.xhttp({
          url: 'user/' + id + '/advertiserList',
          method: 'get',
          params: null
        }).then((response) => {
          if (response.status === 200) {
            this.response.advertiser = response.data
            this.respSuccess()
          }
        }).catch((error) => {
          this.response.advertiser = error.response
          this.respError(error)
        })
      }
    },
    inputFile: function (newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        if (newFile.response.success === true) {
          this.response.vod = newFile.response.data
          this.$notify('primary', '업로드 완료', '파일 업로드가 완료되었습니다.')
        } else {
          this.$notify('error', '업로드 실패', newFile.response.messages.message)
          this.vModel.vodName = ''
          this.File_vod = []
        }
        this.response.spinner = false
      }
    },
    inputFilter: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(mp4|wmv|mkv|avi)$/i.test(newFile.name)) {
          this.$notify('error', '업로드 실패', '동영상 파일을 업로드하세요.')
          return prevent()
        } else {
          this.response.spinner = true
        }
      }
    },
    fileDelete () {
      this.vModel.fileName = ''
      this.response.vod = null
      this.File_vod = []
    },
    submitBuilder () {
      if (this.File_vod.length > 0 &&
          this.vModel.banner_name.length <= 50 &&
          this.vModel.file.title.length <= 30 &&
          this.vModel.file.desc.length <= 60) {
        let option = this.vModel.file.tapbarOption
        let tap = this.resultTapbar.filter(function (val) {
          return val.value === option
        })
        this.vModel.file.tapbar = tap[0].text
        if (this.vModel.submit) {
          if (confirm('적용하시겠습니까?')) {
            this.response.file = {
              video_link: this.response.vod.video_link,
              vimeo_id: this.response.vod.vimeo_id,
              url: this.vModel.file.url,
              tapbar: this.vModel.file.tapbar,
              desc: this.vModel.file.desc,
              title: this.vModel.file.title
            }
            this.vModel.submit = false
          }
        } else {
          if (confirm('저장하시겠습니까?')) {
            this.putBuilder()
          }
        }
      } else {
        if (!(this.File_vod.length > 0)) {
          this.$notify('error', '파일 업로드', 'VOD 파일을 업로드하세요.')
        } else {
          this.vModel.validation = 'on'
        }
      }
    },
    putBuilder () {
      this.response.spinner = true
      let send = {
        data: this.vModel.file,
        banner_name: this.vModel.banner_name
      }
      if (this.vModel.agency_id) {
        send.company_id = this.vModel.agency_id
      }
      if (this.vModel.agent_id) {
        send.agent_id = this.vModel.agent_id
      }
      if (this.vModel.advertiser_id) {
        send.advertiser_id = this.vModel.advertiser_id
      }
      this.xhttp({
        url: '/builder/' + this.response.builder_id,
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.save = response.data
          this.$notify('primary', '등록 완료', '등록 완료되었습니다.')
          this.$router.push({ name: 'adBuilderHome' })
        }
      }).catch((error) => {
        this.response.save = error.response
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
  watch: {
    File_vod: function (val) {
      if (val[0]) {
        this.vModel.fileName = val[0].name
        this.$refs.nativeVOD_file.active = true
      }
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
    resultAdvertiser () {
      if (this.response.advertiser && this.response.advertiser.success === true && this.response.advertiser.data.length > 0) {
        return this.response.advertiser.data
      } else {
        return []
      }
    },
    nameValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.banner_name.length <= 50
      } else {
        return ''
      }
    },
    titleValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.file.title.length <= 30
      } else {
        return ''
      }
    },
    descValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.file.desc.length <= 60
      } else {
        return ''
      }
    }
  }
}
</script>
