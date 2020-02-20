<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="그룹 관리" :depth="depth"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" no-body>
          <template v-if="response.name != 'create'">
          <div class="col-lg-12 cf">
            <template v-if="response.user_session.role != 'PUBLISHER'">
              <div class="col-6 text-center float-left">
                <router-link tag="a" :to="({ name: 'GroupShow', params: { user_id: response.user_id, site_id: response.site_id, group_id: response.group_id } })" class="w-100 d-inline-block p-3" style="color:#f18024">
                  사이트 정보({{response.siteInfo.name}}) > 그룹 정보({{vModel.name}}-{{deviceToString(vModel.device)}})
                </router-link>
                <span class="w-100 d-inline-block" style="position:absolute;top:0;left:0;height:5px;background:#f18024"></span>
              </div>
              <div class="col-6 text-center float-left">
                <router-link tag="a" :to="({ name: 'AdUnitIndex', params: { user_id: response.user_id, site_id: response.site_id, group_id: response.group_id }, query: { page: 1, adType: 0 } })" class="w-100 d-inline-block p-3">
                  인벤토리 목록
                </router-link>
              </div>
            </template>
            <template v-else-if="response.user_session.role == 'PUBLISHER'">
              <div class="col-6 text-center float-left">
                <router-link tag="a" :to="({ name: 'GroupShowAll', params: { user_id: response.user_id, site_id: response.site_id, group_id: response.group_id } })" class="w-100 d-inline-block p-3" style="color:#f18024">
                  사이트 정보({{response.siteInfo.name}}) > 그룹 정보({{vModel.name}}-{{deviceToString(vModel.device)}})
                </router-link>
                <span class="w-100 d-inline-block" style="position:absolute;top:0;left:0;height:5px;background:#f18024"></span>
              </div>
              <div class="col-6 text-center float-left">
                <router-link tag="a" :to="({ name: 'AdUnitIndexAll', params: { user_id: response.user_id, site_id: response.site_id, group_id: response.group_id } })" class="w-100 d-inline-block p-3">
                  인벤토리 목록
                </router-link>
              </div>
            </template>
          </div>
          </template>
          <b-card class="shadow-none">
            <b-form @submit.prevent="groupShowSubmit">
              <div class="col-lg-12 mt-4 cf">
                <div class="col-lg-12 float-left">
                  <h5 class="mb-4 card-title font-weight-bold">기본 정보</h5>
                  <b-form-group label-cols="2" label-cols-horizontal label="아이디">
                    <b-form-input type="text" v-model="vModel.id" required class="col-lg-9" disabled></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="그룹명">
                    <b-form-input type="text" v-model="vModel.name" required placeholder="그룹명을 입력하세요." class="col-lg-9"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="그룹 코드">
                    <b-form-input type="text" v-model="vModel.code" required placeholder="그룹 코드를 입력하세요." class="col-lg-9" disabled></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="디바이스">
                    <b-form-radio-group :options="startData.deviceTypeOptions" required v-model="vModel.device" />
                  </b-form-group>
                  <b-form-group v-if="vModel.device === 1" label-cols="2" label-cols-horizontal label="플로팅">
                    <b-form-radio-group :options="startData.deviceTypeOptions_p" required v-model="vModel.floating" />
                  </b-form-group>
                  <b-form-group v-else-if="vModel.device === 2" label-cols="2" label-cols-horizontal label="플로팅">
                    <b-form-radio-group :options="startData.deviceTypeOptions_m" required v-model="vModel.floating" />
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="광고 활성화">
                    <switches v-model="vModel.status" theme="custom" color="primary"  class="mt-2"></switches>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="스크립트 코드">
                    <b-form-textarea rows="2" max-rows="6" v-model="vModel.script" no-resize readonly></b-form-textarea>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="스크립트 코드2">
                    <b-form-textarea rows="2" max-rows="6" v-model="vModel.script2" no-resize readonly></b-form-textarea>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="커스텀 head">
                    <b-form-textarea rows="4" max-rows="8" v-model="vModel.custom" no-resize></b-form-textarea>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="관리 메모">
                    <b-form-textarea rows="2" max-rows="6" v-model="vModel.memo" no-resize></b-form-textarea>
                  </b-form-group>
                </div>
              </div>
              <div class="m-3 text-center">
                <b-button type="submit" class="mr-2" variant="primary">
                  <template v-if="response.name == 'create'">등록</template>
                  <template v-else>저장</template>
                </b-button>
                <b-button variant="light" @click="beforePage()">취소</b-button>
              </div>
            </b-form>
          </b-card>
        </b-card>
      </b-colxx>
    </b-row>
    <div class="spinner-background" v-show="response.spinner">
      <b-spinner variant="info"></b-spinner>
    </div>
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
    this.getDevice()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_id: this.$route.params.user_id,
        site_id: this.$route.params.site_id,
        group_id: this.$route.params.group_id,
        type: this.$route.params.type,
        name: this.$route.path.split('/')[7],
        user_session: JSON.parse(localStorage.getItem('user')),
        groupShowCreate: null,
        groupShowEdit: null,
        siteInfo: {
          name: null,
          domain: null
        }
      },
      startData: {
        deviceTypeOptions: [{ value: 0, text: '선택하세요' }],
        deviceTypeOptions_m: [
          { value: '', text: '없음' },
          { value: 'm_1', text: '상단' },
          { value: 'm_2', text: '하단' }
        ],
        deviceTypeOptions_p: [
          { value: '', text: '없음' },
          { value: 'p_1', text: '좌측 상단' },
          { value: 'p_2', text: '우측 하단' },
          { value: 'p_3', text: '좌측 하단' },
          { value: 'p_4', text: '우측 하단' }
        ],
        groupShow: null
      },
      vModel: {
        id: '',
        name: '',
        code: '',
        device: 0,
        custom: '',
        status: false,
        script: '',
        script2: '',
        memo: '',
        floating: ''
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getSiteShowList () {
      if (this.response.name !== 'create') {
        this.xhttp({
          url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id,
          method: 'get',
          params: null
        }).then((response) => {
          if (response.status === 200) {
            this.response.siteShow = response.data
            var resp = response.data.data
            this.response.siteInfo = resp
          }
        }).catch((error) => {
          this.response.siteShow = error.response
          this.respError(error)
        })
      } else {
        this.response.spinner = false
      }
    },
    getGroupShowList () {
      if (this.response.name !== 'create') {
        this.xhttp({
          url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id + '/groups/' + this.response.group_id,
          method: 'get',
          params: null
        }).then((response) => {
          if (response.status === 200) {
            this.startData.groupShow = response.data
            var resp = response.data.data
            this.vModel.id = resp.id
            this.vModel.name = resp.name
            this.vModel.code = resp.code
            this.vModel.device = resp.device
            this.vModel.status = resp.status
            this.vModel.script = resp.script
            this.vModel.script2 = resp.script2
            this.vModel.custom = resp.custom
            this.vModel.memo = resp.memo
            this.vModel.floating = resp.floating ? resp.floating : ''
            this.respSuccess()
          }
        }).catch((error) => {
          this.startData.groupShow = error.response
          this.respError(error)
        })
      }
    },
    getDevice: function () {
      this.xhttp({
        url: 'resources/devices',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.startData.deviceTypeOptions = response.data.data.map(function ($value) {
            return { value: $value.id, text: $value.name }
          })
          this.getGroupShowList()
        }
      }).catch((error) => {
        this.startData.deviceTypeOptions = error.response
        this.respError(error)
      })
    },
    groupShowSubmit () {
      let send = {
        name: this.vModel.name,
        device: this.vModel.device,
        status: this.vModel.status,
        memo: this.vModel.memo,
        custom: this.vModel.custom,
        floating: this.vModel.floating
      }
      this.response.spinner = true
      if (this.response.name === 'create') {
        this.postGroupShowCreate(send)
      } else {
        this.putGroupShowEdit(send)
      }
    },
    postGroupShowCreate (send) {
      this.xhttp({
        url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id + '/groups',
        method: 'post',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.groupShowCreate = response
          this.$notify('primary', '등록 완료', '등록 완료되었습니다.')
          this.$router.push({ name: 'GroupIndex', params: { user_id: this.response.user_id, site_id: this.response.site_id }, query: { page: 1 } })
        }
      }).catch((error) => {
        this.response.groupShowCreate = error.response
        this.respError(error)
      })
    },
    putGroupShowEdit (send) {
      this.xhttp({
        url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id + '/groups/' + this.response.group_id,
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.groupShowEdit = response.data
          this.respSuccess()
          this.$notify('primary', '수정', '수정 완료되었습니다.')
        }
      }).catch((error) => {
        this.response.groupShowEdit = error.response
        this.respError(error)
      })
    },
    deviceToString (id) {
      return id === 1 ? 'PC' : 'Mobile'
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
  watch: {
    vModel: {
      handler (val) {
        /*
        console.log(val.device)
        if (typeof val.device === 'undefined') {
          this.vModel.floating = 0
        } else if (val.device === 1) {
          if (! this.vModel.floating || this.vModel.floating.charAt(0) === 'm') {
            this.vModel.floating = 'p_1'
          }
        } else if (val.device === 2) {
          if (! this.vModel.floating || this.vModel.floating.charAt(0) === 'p') {
            this.vModel.floating = 'm_1'
          }
        }
        */
      },
      deep: true
    }
  }
}
</script>
