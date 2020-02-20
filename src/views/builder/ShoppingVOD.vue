<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="VOD & Shopping Box"/>
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
                    <b-form-input v-model="vModel.vodName" :title="vModel.vodName" disabled class="col-12" style="padding-right:2rem;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;overflow:hidden;"/>
                  </template>
                  <template v-else>
                    <b-form-input placeholder="Drop file here" disabled required/>
                    <b-input-group-append>
                      <file-upload
                        class="btn btn-outline-secondary"
                        ref="shopping_vod"
                        v-model="File_vod"
                        name="file"
                        input-id="shopping_vod"
                        :post-action="`/api/builder/` + this.response.builder_id + `/videoUpload`"
                        :drop="true"
                        :drop-directory="true"
                        @input-file="inputFile_vod"
                        @input-filter="inputFilter_vod">
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
              <b-form-group label-cols-horizontal label-cols="2" label="Destination URL">
                <b-form-input v-model="vModel.file.url"
                              placeholder="Destination URL 을 입력하세요." required></b-form-input>
              </b-form-group>
              <div class="separator mt-4 mb-4"></div>
              <span class="d-block w-100 mb-3">* 업로드 가능한 이미지 비율은 3:2 입니다.</span>
              <h5 class="pb-2">Item Box 01</h5>
              <b-form-group label-cols-horizontal label-cols="2" label="Image File">
                <b-input-group>
                  <template v-if="response.item[0]">
                    <b-form-input v-model="activeItemList[0].name" :title="activeItemList[0].name" disabled class="col-12" style="padding-right:2rem;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;overflow:hidden;"/>
                    <b-link class="col-12 position-absolute top left p-0" @click="fileDelete(0)">
                      <i class="simple-icon-close position-absolute" style="font-size:1rem;right:2rem;top:0.75rem;"></i>
                    </b-link>
                  </template>
                  <template v-else>
                    <b-form-input placeholder="Drop file here" disabled required/>
                    <b-input-group-append>
                      <file-upload
                        class="btn btn-outline-secondary"
                        :ref="`shopping_item_` + 0"
                        v-model="File_item0"
                        name="file"
                        :input-id="`shopping_item_` + 0"
                        :post-action="postItem"
                        :drop="true"
                        :drop-directory="true"
                        @input-file="inputFile_item0"
                        @input-filter="inputFilter">
                        업로드
                      </file-upload>
                    </b-input-group-append>
                  </template>
                </b-input-group>
              </b-form-group>
              <b-form-group label-cols-horizontal label-cols="2" label="text">
                <b-form-textarea rows="2"
                                 max-rows="2"
                                 v-model="vModel.item[0].text"
                                 placeholder="text 을 입력하세요."
                                 required no-resize></b-form-textarea>
              </b-form-group>
              <b-form-group label-cols-horizontal label-cols="2" label="Destination URL">
                <b-form-input v-model="vModel.item[0].url"
                              placeholder="Destination URL 을 입력하세요." required></b-form-input>
              </b-form-group>
              <div class="separator mt-4 mb-4"></div>
              <h5 class="pb-2">Item Box 02</h5>
              <b-form-group label-cols-horizontal label-cols="2" label="Image File">
                <b-input-group>
                  <template v-if="response.item[1]">
                    <b-form-input v-model="activeItemList[1].name" :title="activeItemList[1].name" disabled class="col-12" style="padding-right:2rem;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;overflow:hidden;"/>
                    <b-link class="col-12 position-absolute top left p-0" @click="fileDelete(1)">
                      <i class="simple-icon-close position-absolute" style="font-size:1rem;right:2rem;top:0.75rem;"></i>
                    </b-link>
                  </template>
                  <template v-else>
                    <b-form-input placeholder="Drop file here" disabled required/>
                    <b-input-group-append>
                      <file-upload
                        class="btn btn-outline-secondary"
                        :ref="`shopping_item_` + 1"
                        v-model="File_item1"
                        name="file"
                        :input-id="`shopping_item_` + 1"
                        :post-action="postItem"
                        :drop="true"
                        :drop-directory="true"
                        @input-file="inputFile_item1"
                        @input-filter="inputFilter">
                        업로드
                      </file-upload>
                    </b-input-group-append>
                  </template>
                </b-input-group>
              </b-form-group>
              <b-form-group label-cols-horizontal label-cols="2" label="text">
                <b-form-textarea rows="2"
                                 max-rows="2"
                                 v-model="vModel.item[1].text"
                                 placeholder="text 을 입력하세요."
                                 required no-resize></b-form-textarea>
              </b-form-group>
              <b-form-group label-cols-horizontal label-cols="2" label="Destination URL">
                <b-form-input v-model="vModel.item[1].url"
                              placeholder="Destination URL 을 입력하세요." required></b-form-input>
              </b-form-group>
              <div class="separator mt-4 mb-4"></div>
              <h5 class="pb-2">Item Box 03</h5>
              <b-form-group label-cols-horizontal label-cols="2" label="Image File">
                <b-input-group>
                  <template v-if="response.item[2]">
                    <b-form-input v-model="activeItemList[2].name" :title="activeItemList[2].name" disabled class="col-12" style="padding-right:2rem;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;overflow:hidden;"/>
                    <b-link class="col-12 position-absolute top left p-0" @click="fileDelete(2)">
                      <i class="simple-icon-close position-absolute" style="font-size:1rem;right:2rem;top:0.75rem;"></i>
                    </b-link>
                  </template>
                  <template v-else>
                    <b-form-input placeholder="Drop file here" disabled required/>
                    <b-input-group-append>
                      <file-upload
                        class="btn btn-outline-secondary"
                        :ref="`shopping_item_` + 2"
                        v-model="File_item2"
                        name="file"
                        :input-id="`shopping_item_` + 2"
                        :post-action="postItem"
                        :drop="true"
                        :drop-directory="true"
                        @input-file="inputFile_item2"
                        @input-filter="inputFilter">
                        업로드
                      </file-upload>
                    </b-input-group-append>
                  </template>
                </b-input-group>
              </b-form-group>
              <b-form-group label-cols-horizontal label-cols="2" label="text">
                <b-form-textarea rows="2"
                                 max-rows="2"
                                 v-model="vModel.item[2].text"
                                 placeholder="text 을 입력하세요."
                                 required no-resize></b-form-textarea>
              </b-form-group>
              <b-form-group label-cols-horizontal label-cols="2" label="Destination URL">
                <b-form-input v-model="vModel.item[2].url"
                              placeholder="Destination URL 을 입력하세요." required></b-form-input>
              </b-form-group>
              <template v-if="activeItemList[3]">
              <div class="separator mt-4 mb-4"></div>
              <h5 class="pb-2">Item Box 04</h5>
              <b-form-group label-cols-horizontal label-cols="2" label="Image File">
                <b-input-group>
                  <template v-if="response.item[3]">
                    <b-form-input v-model="activeItemList[3].name" :title="activeItemList[3].name" disabled class="col-12" style="padding-right:2rem;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;overflow:hidden;"/>
                    <b-link class="col-12 position-absolute top left p-0" @click="fileDelete(3)">
                      <i class="simple-icon-close position-absolute" style="font-size:1rem;right:2rem;top:0.75rem;"></i>
                    </b-link>
                  </template>
                  <template v-else>
                    <b-form-input placeholder="Drop file here" disabled required/>
                    <b-input-group-append>
                      <file-upload
                        class="btn btn-outline-secondary"
                        :ref="`shopping_item_` + 3"
                        v-model="File_item3"
                        name="file"
                        :input-id="`shopping_item_` + 3"
                        :post-action="postItem"
                        :drop="true"
                        :drop-directory="true"
                        @input-file="inputFile_item3"
                        @input-filter="inputFilter">
                        업로드
                      </file-upload>
                    </b-input-group-append>
                  </template>
                </b-input-group>
              </b-form-group>
                <b-form-group label-cols-horizontal label-cols="2" label="text">
                  <b-form-textarea rows="2"
                                   max-rows="2"
                                   v-model="vModel.item[3].text"
                                   placeholder="text 을 입력하세요."
                                   required no-resize></b-form-textarea>
                </b-form-group>
              <b-form-group label-cols-horizontal label-cols="2" label="Destination URL">
                <b-form-input v-model="vModel.item[3].url"
                              placeholder="Destination URL 을 입력하세요." required></b-form-input>
              </b-form-group>
              </template>
              <template v-if="activeItemList[4]">
              <div class="separator mt-4 mb-4"></div>
              <h5 class="pb-2">Item Box 05</h5>
              <b-form-group label-cols-horizontal label-cols="2" label="Image File">
                <b-input-group>
                  <template v-if="response.item[4]">
                    <b-form-input v-model="activeItemList[4].name" :title="activeItemList[4].name" disabled class="col-12" style="padding-right:2rem;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;overflow:hidden;"/>
                    <b-link class="col-12 position-absolute top left p-0" @click="fileDelete(4)">
                      <i class="simple-icon-close position-absolute" style="font-size:1rem;right:2rem;top:0.75rem;"></i>
                    </b-link>
                  </template>
                  <template v-else>
                    <b-form-input placeholder="Drop file here" disabled required/>
                    <b-input-group-append>
                      <file-upload
                        class="btn btn-outline-secondary"
                        :ref="`shopping_item_` + 4"
                        v-model="File_item4"
                        name="file"
                        :input-id="`shopping_item_` + 4"
                        :post-action="postItem"
                        :drop="true"
                        :drop-directory="true"
                        @input-file="inputFile_item4"
                        @input-filter="inputFilter">
                        업로드
                      </file-upload>
                    </b-input-group-append>
                  </template>
                </b-input-group>
              </b-form-group>
                <b-form-group label-cols-horizontal label-cols="2" label="text">
                  <b-form-textarea rows="2"
                                   max-rows="2"
                                   v-model="vModel.item[4].text"
                                   placeholder="text 을 입력하세요."
                                   required no-resize></b-form-textarea>
                </b-form-group>
              <b-form-group label-cols-horizontal label-cols="2" label="Destination URL">
                <b-form-input v-model="vModel.item[4].url"
                              placeholder="Destination URL 을 입력하세요." required></b-form-input>
              </b-form-group>
              </template>
                <b-button size="xs" variant="info" class="mt-2" @click="shopping_item()">이미지 추가 (최대 5개)</b-button>
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
            <formatComponent
              :file="response.file"
              :text="vModel.file"
              :format="response.format_name">
            </formatComponent>
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
        item: ['', '', ''],
        save: null,
        show: null,
        imgDelete: null
      },
      vModel: {
        agency_id: '',
        agent_id: '',
        advertiser_id: '',
        banner_name: null,
        file: {
          tapbarOption: '',
          tapbar: null,
          desc: null,
          url: null
        },
        vodName: '',
        item: [
          {
            name: '',
            url: '',
            text: '',
            state: 'active'
          },
          {
            name: '',
            url: '',
            text: '',
            state: 'active'
          },
          {
            name: '',
            url: '',
            text: '',
            state: 'active'
          }
        ],
        validation: '',
        submit: true
      },
      File_vod: [],
      File_item0: [],
      File_item1: [],
      File_item2: [],
      File_item3: [],
      File_item4: []
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
    inputFile_vod: function (newFile, oldFile) {
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
    inputFile_item0: function (newFile, oldFile) {
      this.inputFile_Dom(newFile, oldFile, 0)
    },
    inputFile_item1: function (newFile, oldFile) {
      this.inputFile_Dom(newFile, oldFile, 1)
    },
    inputFile_item2: function (newFile, oldFile) {
      this.inputFile_Dom(newFile, oldFile, 2)
    },
    inputFile_item3: function (newFile, oldFile) {
      this.inputFile_Dom(newFile, oldFile, 3)
    },
    inputFile_item4: function (newFile, oldFile) {
      this.inputFile_Dom(newFile, oldFile, 4)
    },
    inputFile_Dom: function (newFile, oldFile, idx) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        if (newFile.response.success === true) {
          this.response.item[idx] = newFile.response.data
          this.$notify('primary', '업로드 완료', '파일 업로드가 완료되었습니다.')
        } else {
          if (this.response.vod) {
            this.$notify('error', '업로드 실패', '파일 업로드가 실패했습니다.')
          } else {
            this.$notify('primary', '업로드 실패', '영상을 먼저 업로드하세요.')
          }
        }
        this.response.spinner = false
      }
    },
    inputFilter_vod: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(mp4|wmv|mkv|avi)$/i.test(newFile.name)) {
          this.$notify('error', '업로드 실패', '동영상 파일을 업로드하세요.')
          return prevent()
        } else {
          this.response.spinner = true
        }
      }
    },
    inputFilter: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (this.response.vod) {
          if (!/\.(jpeg|jpg|png)$/i.test(newFile.name)) {
            this.$notify('error', '업로드 실패', '이미지 파일을 업로드하세요.')
            return prevent()
          } else {
            this.response.spinner = true
          }
        }
      }
    },
    fileDelete (val) {
      if (val === 'vod') {
        this.vModel.vodName = ''
        this.File_vod = []
        this.response.vod = null
      } else {
        this.getImgDelete('item', val)
        if (val === 0) {
          this.vModel.item[0].name = ''
          this.response.item[0] = ''
          this.File_item0 = []
        } else if (val === 1) {
          this.vModel.item[1].name = ''
          this.response.item[1] = ''
          this.File_item1 = []
        } else if (val === 2) {
          this.vModel.item[2].name = ''
          this.response.item[2] = ''
          this.File_item2 = []
        } else if (val === 3) {
          this.vModel.item[3].name = ''
          if (this.vModel.item[4]) {
            this.response.item[3] = ''
          } else {
            this.response.item.splice(3, 1)
            this.vModel.item[3].state = 'false'
          }
          this.File_item3 = []
        } else if (val === 4) {
          this.vModel.item[4].name = ''
          this.response.item.splice(4, 1)
          this.vModel.item[4].state = 'false'
          this.File_item4 = []
        }
        this.vModel.item = this.vModel.item.filter(item => item.state === 'active')
      }
    },
    getImgDelete (val, num) {
      this.response.spinner = true
      let send = {
        key: val
      }
      if (num) {
        send.no = num
      }
      this.xhttp({
        url: '/builder/' + this.response.builder_id + '/imgDelete',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.imgDelete = response.data
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.imgDelete = error.response
        this.respError(error)
      })
    },
    submitBuilder () {
      if (this.File_vod.length > 0 &&
        this.vModel.item[0].name &&
        this.vModel.item[1].name &&
        this.vModel.item[2].name &&
        this.vModel.banner_name.length <= 50 &&
          this.vModel.file.desc.length <= 60) {
        if (this.vModel.item.length > 3) {
          if (this.vModel.item[3].name) {
            if (this.vModel.item.length === 4) {
              this.confirmBuilder()
            } else {
              if (this.vModel.item[4].name) {
                this.confirmBuilder()
              } else {
                this.$notify('error', '파일 업로드', 'Item Box Image05 파일을 업로드하세요.')
              }
            }
          } else {
            this.$notify('error', '파일 업로드', 'Item Box Image04 파일을 업로드하세요.')
          }
        } else {
          this.confirmBuilder()
        }
      } else {
        if (!(this.File_vod.length > 0)) {
          this.$notify('error', '파일 업로드', 'VOD Image 파일을 업로드하세요.')
        } else if (!this.vModel.item[0].name || !this.vModel.item[1].name || !this.vModel.item[2].name) {
          this.$notify('error', '파일 업로드', 'Item Box Image 파일을 업로드하세요.')
        } else {
          this.vModel.validation = 'on'
        }
      }
    },
    confirmBuilder () {
      for (let index in this.vModel.item) {
        let text = this.vModel.item[index].text
        text = text.replace('\n', '<br>')
        this.vModel.item[index].text = text
      }
      let option = this.vModel.file.tapbarOption
      let tap = this.resultTapbar.filter(function (val) {
        return val.value === option
      })
      this.vModel.file.tapbar = tap[0].text
      if (this.vModel.submit) {
        if (confirm('적용하시겠습니까?')) {
          this.response.file = {
            vimeo_id: this.response.vod.vimeo_id,
            item: this.response.item,
            itemData: this.vModel.item,
            url: this.vModel.file.url,
            desc: this.vModel.file.desc,
            tapbar: this.vModel.file.tapbar,
            title: this.vModel.file.title
          }
          this.vModel.submit = false
        }
      } else {
        if (confirm('저장하시겠습니까?')) {
          this.putBuilder()
        }
      }
    },
    putBuilder () {
      this.response.spinner = true
      let send = {
        data: {
          url: this.vModel.file.url,
          tapbar: this.vModel.file.tapbar,
          item: this.response.item,
          itemData: this.vModel.item
        },
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
    shopping_item () {
      let length = this.vModel.item.length
      if (length > 4) {
        this.$notify('error', '이미지 업로드', '최대 5개까지 업로드 할 수 있습니다.')
      }
      if (this.vModel.item[0].name === '' ||
        this.vModel.item[1].name === '' ||
        this.vModel.item[2].name === '' ||
        this.vModel.item[length - 1].name === '') {
        this.$notify('error', '이미지 업로드', '이미지 업로드 후 추가하세요.')
      } else {
        this.vModel.item.push({
          name: '',
          url: '',
          text: '',
          state: 'active'
        })
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
  watch: {
    File_vod: function (val) {
      if (val[0]) {
        this.vModel.vodName = val[0].name
        this.$refs.shopping_vod.active = true
      }
    },
    File_item0: function (val) {
      if (val[0]) {
        this.vModel.item[0].name = val[0].name
        this.$refs.shopping_item_0.active = true
      }
    },
    File_item1: function (val) {
      if (val[0]) {
        this.vModel.item[1].name = val[0].name
        this.$refs.shopping_item_1.active = true
      }
    },
    File_item2: function (val) {
      if (val[0]) {
        this.vModel.item[2].name = val[0].name
        this.$refs.shopping_item_2.active = true
      }
    },
    File_item3: function (val) {
      if (val[0]) {
        this.vModel.item[3].name = val[0].name
        this.$refs.shopping_item_3.active = true
      }
    },
    File_item4: function (val) {
      if (val[0]) {
        this.vModel.item[4].name = val[0].name
        this.$refs.shopping_item_4.active = true
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
    descValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.file.desc.length <= 60
      } else {
        return ''
      }
    },
    activeItemList () {
      return this.vModel.item.filter(item => item.state === 'active')
    },
    postItem () {
      if (this.response.vod) {
        return '/api/builder/' + this.response.builder_id + '/imgUpload/item'
      } else {
        return ''
      }
    }
  }
}
</script>
