<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="인벤토리 관리" :depth="depth"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card>
          <b-form @submit.prevent="adUnitShowSubmit">
            <div class="col-lg-12 mt-4 cf">
              <div class="col-lg-6 float-left">
                <h5 class="mb-4 card-title font-weight-bold">기본 정보</h5>
                <b-form-group label-cols="2" label-cols-horizontal label="아이디">
                  <b-form-input type="text" v-model="vModel.id" required class="col-lg-9" disabled></b-form-input>
                </b-form-group>
                <b-form-group label-cols="2" label-cols-horizontal label="인벤토리명">
                  <b-form-input type="text" v-model="vModel.name" required placeholder="인벤토리명을 입력하세요." class="col-lg-9"></b-form-input>
                </b-form-group>
                <b-form-group label-cols="2" label-cols-horizontal label="인벤토리 코드">
                  <b-form-input type="text" v-model="vModel.code" required placeholder="인벤토리 코드를 입력하세요." class="col-lg-9" disabled></b-form-input>
                </b-form-group>
                <b-form-group label-cols="2" label-cols-horizontal label="광고 활성화">
                  <switches v-model="vModel.status" theme="custom" color="primary"  class="mt-2"></switches>
                </b-form-group>
                <b-form-group label-cols="2" label-cols-horizontal label="관리 메모">
                  <b-form-textarea rows="2" max-rows="6" v-model="vModel.memo" no-resize></b-form-textarea>
                </b-form-group>
                <h5 class="mb-3 card-title font-weight-bold">인벤토리 코드</h5>
                <b-form-textarea rows="8" max-rows="8" v-model="vModel.script" no-resize readonly></b-form-textarea>
                <h5 class="mb-3 mt-3 card-title font-weight-bold">인벤토리 코드2</h5>
                <b-form-textarea rows="8" max-rows="8" v-model="vModel.script2" no-resize readonly></b-form-textarea>
                <h5 class="mb-3 mt-5 card-title font-weight-bold">외부 소스코드</h5>
                <b-form-textarea rows="12" max-rows="12" v-model="vModel.passback1" no-resize></b-form-textarea>
              </div>
              <div class="col-lg-6 float-left">
                <h5 class="mb-4 card-title font-weight-bold">광고 관리</h5>
                <b-form-group label-cols="2" label-cols-horizontal label="광고 종류">
                  <b-form-select
                                multiple
                                :options="response.adTypeOptions"
                                 v-model="adType"
                                 class="col-lg-9"
                                 plain required
                  style="height:200px;">
                  </b-form-select>
                </b-form-group>
                <b-form-group label-cols="2" label-cols-horizontal label="광고 크기">
                  <b-form-select :options="response.adSizeOptions"
                                 multiple
                                 v-model="vModel.size"
                                 class="col-lg-9"
                                 :state="adSizeValidation"
                                 plain
                                 style="height:200px;">
                  </b-form-select>
                  <b-form-invalid-feedback :state="adSizeValidation" class="text-left">
                    광고 사이즈를 선택하세요.
                  </b-form-invalid-feedback>
                </b-form-group>
                <!--
                <b-form-group label-cols="2" label-cols-horizontal label="선택 크기">
                  <v-select multiple
                            taggable
                            :items="vModel.size"
                            ref="keywords" class="col-lg-12 p-0 mb-2 d-inline-block"/>
                </b-form-group>
                -->
                <b-form-group label-cols="2" label-cols-horizontal label="광고 서비스">
                  <b-form-checkbox v-model="vModel.targeting.keyword" class="mt-1 mr-3 d-inline-block">
                    키워드 타겟팅
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.targeting.page" class="mt-1 mr-3 d-inline-block">
                    페이지 타겟팅
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.targeting.visit" class="mt-1 mr-3 d-inline-block">
                    리타겟팅
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.targeting.category" class="mt-1 mr-3 d-inline-block">
                    카테고리
                  </b-form-checkbox>
                </b-form-group>
                <b-form-group label-cols="2" label-cols-horizontal label="브라우저 제외">
                  <b-form-checkbox v-model="vModel.ignore.browser.chrome" class="mt-1 mr-3 d-inline-block">
                    Chrome(크롬)
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.ignore.browser.msie" class="mt-1 mr-3 d-inline-block">
                    Internet Explorer(인터넷 익스플로러)
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.ignore.browser.firefox" class="mt-1 mr-3 d-inline-block">
                    Firefox(파이어 폭스)
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.ignore.browser.safari" class="mt-1 mr-3 d-inline-block">
                    Safari(사파리)
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.ignore.browser.opera" class="mt-1 mr-3 d-inline-block">
                    Opera(오페라)
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.ignore.browser.etc" class="mt-1 mr-3 d-inline-block">
                    ETC(기타 전체)
                  </b-form-checkbox>
                </b-form-group>
                <b-form-group label-cols="2" label-cols-horizontal label="유입경로 제외">
                  <b-form-checkbox v-model="vModel.ignore.route.naver" class="mt-1 mr-3 d-inline-block">
                    Naver(네이버)
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.ignore.route.daum" class="mt-1 mr-3 d-inline-block">
                    Daum(다음)
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.ignore.route.google" class="mt-1 mr-3 d-inline-block">
                    Google(구글)
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.ignore.route.zum" class="mt-1 mr-3 d-inline-block">
                    Zum(줌)
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.ignore.route.bing" class="mt-1 mr-3 d-inline-block">
                    Bing(빙)
                  </b-form-checkbox>
                  <b-form-checkbox v-model="vModel.ignore.route.etc" class="mt-1 mr-3 d-inline-block">
                    ETC(기타 전체)
                  </b-form-checkbox>
                </b-form-group>
                <div class="mt-4" v-if="adType && adType.indexOf('NATIVE_CONTENTS') !== -1">
                  <span class="d-block mb-1"><h5 class="mb-4 card-title font-weight-bold d-inline">상세 설정</h5> - 네이티브 컨텐츠</span>
                  <div class="row">
                    <div class="col-md-6">
                      <b-form-group label-cols="5" label-cols-horizontal label="컨텐츠 갯수">
                        <b-form-input type="number" v-model="display.items" required class="col-lg-6"></b-form-input>
                      </b-form-group>
                    </div>
                    <div class="col-md-6">
                      <b-form-group label-cols="5" label-cols-horizontal label="광고당 컨텐츠 수">
                        <b-form-input type="number" v-model="display.ads" required class="col-lg-6"></b-form-input>
                      </b-form-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-3">
                      <b-form-group label-cols="6" label-cols-horizontal label="무한 스크롤">
                        <switches v-model="display.infinity" theme="custom" color="primary"  class="mt-2"></switches>
                      </b-form-group>
                    </div>
                    <div class="col-md-9">
                      <b-form-group label-cols="2" label-cols-horizontal label="디자인">
                        <b-form-select v-model="display.design"
                                       :options="response.adDesignOptions"
                                       class="col-lg-9"
                                       plain
                                       :required="(adType === 10) ? true : false">
                          <option slot="first" value="">선택하세요</option>
                        </b-form-select>
                      </b-form-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-3">
                      <b-form-checkbox v-model="display.items_inner" class="mt-1 mr-3 d-inline-block">내부 컨텐츠</b-form-checkbox>
                    </div>
                    <div class="col-lg-9">
                      <b-form-group label-cols="0" label-cols-vertical label="">
                        <b-form-select v-model="display.contents"
                                       class="col-lg-9"
                                       plain
                                       :required="(adType === 10) ? true : false">
                          <option slot="first" value="">선택하세요</option>
                          <option value="category">관련 카테고리</option>
                          <option value="type2_day">오늘의 이슈</option>
                          <option value="type2_week">주간 이슈</option>
                        </b-form-select>
                      </b-form-group>
                    </div>
                  </div>
                  <b-form-group label-cols="3" label-cols-horizontal label="외부 컨텐츠">
                    <b-form-checkbox v-model="display.items_issue" class="mt-1 mr-3 d-inline-block">
                      이슈
                    </b-form-checkbox>
                    <b-form-checkbox v-model="display.items_popular" class="mt-1 mr-3 d-inline-block">
                      커뮤니티 인기
                    </b-form-checkbox>
                    <b-form-checkbox v-model="display.items_youtube" class="mt-1 mr-3 d-inline-block">
                      유튜브
                    </b-form-checkbox>
                  </b-form-group>
                </div>
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
    this.getAdType()
    this.getAdSizes()
    this.getAdDesign()
    this.getAdUnitsList()
    this.getGroupShowList()
    this.getAdUnitShowList()
  },
  data () {
    return {
      response: {
        spinner: true,
        user_id: this.$route.params.user_id,
        site_id: this.$route.params.site_id,
        group_id: this.$route.params.group_id,
        ad_unit_id: this.$route.params.ad_unit_id,
        type: this.$route.params.type,
        name: this.$route.path.split('/')[9],
        user_session: JSON.parse(localStorage.getItem('user')),
        adTypeFilter: [],
        adTypeOptions: [],
        sizeOptions: [],
        adDesignOptions: [],
        adUnitShowCreate: null,
        adUnitShowEdit: null,
        adSizeOptions: []
      },
      startData: {
        adUnitIndex: null,
        adUnitShow: null,
        deviceType: null,
        adType: null
      },
      vModel: {
        id: '',
        name: '',
        code: '',
        status: true,
        script: '',
        script2: '',
        size: [],
        sizeVal: '',
        memo: '',
        targeting: { keyword: true, page: true, visit: true, category: true },
        ignore: {
          browser: {
            chrome: false,
            msie: false,
            firefox: false,
            safari: false,
            opera: false,
            etc: false
          },
          route: {
            naver: false,
            daum: false,
            google: false,
            zum: false,
            bing: false,
            etc: false
          }
        },
        passback1: null
      },
      display: {
        items: 48,
        ads: 3,
        infinity: false,
        design: '',
        contents: '',
        items_inner: true,
        items_issue: true,
        items_popular: true,
        items_youtube: true
      },
      adType: [],
      adTypes: {},
      adDesigns: {},
      native_sample: '',
      selectType: '',
      selectSize: ''
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getGroupShowList () {
      this.xhttp({
        url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id + '/groups/' + this.response.group_id,
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.startData.deviceType = response.data.data.device
        }
      }).catch((error) => {
        this.startData.deviceType = error.response
        this.respError(error)
      })
    },
    getAdUnitsList () {
      let send = {
        page: 1
      }
      this.xhttp({
        url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id + '/groups/' + this.response.group_id + '/AdUnits',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.startData.adUnitIndex = response.data
          if (response.data.data !== false) {
            this.startData.adUnitIndex = response.data.data.items.map(function ($value) {
              return $value.adType
            })
          }
        }
      }).catch((error) => {
        this.startData.adUnitIndex = error.response
        this.respError(error)
      })
    },
    getAdUnitShowList () {
      if (this.response.name !== 'create') {
        this.xhttp({
          url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id + '/groups/' + this.response.group_id + '/AdUnits/' + this.response.ad_unit_id,
          method: 'get',
          params: null
        }).then((response) => {
          if (response.status === 200) {
            this.startData.adUnitShow = response.data
            if (response.data.data !== false) {
              var resp = response.data.data
              this.vModel.id = resp.id
              this.vModel.name = resp.name
              this.vModel.code = resp.code
              this.vModel.status = resp.status
              this.vModel.script = resp.script
              this.vModel.script2 = resp.script2
              this.vModel.memo = resp.memo
              this.vModel.size = resp.size
              if (Array.isArray(resp.adType) === false) {
                this.adType = [resp.adType]
              } else {
                this.adType = resp.adType
              }
              this.vModel.targeting.keyword = resp.targeting.keyword
              this.vModel.targeting.page = resp.targeting.page
              this.vModel.targeting.visit = resp.targeting.visit
              this.vModel.targeting.category = resp.targeting.category
              this.vModel.ignore.browser.chrome = resp.ignore.browser.chrome
              this.vModel.ignore.browser.msie = resp.ignore.browser.msie
              this.vModel.ignore.browser.firefox = resp.ignore.browser.firefox
              this.vModel.ignore.browser.safari = resp.ignore.browser.safari
              this.vModel.ignore.browser.opera = resp.ignore.browser.opera
              this.vModel.ignore.browser.etc = resp.ignore.browser.etc
              this.vModel.ignore.route.naver = resp.ignore.route.naver
              this.vModel.ignore.route.daum = resp.ignore.route.daum
              this.vModel.ignore.route.google = resp.ignore.route.google
              this.vModel.ignore.route.zum = resp.ignore.route.zum
              this.vModel.ignore.route.bing = resp.ignore.route.bing
              this.vModel.ignore.route.etc = resp.ignore.route.etc
              this.vModel.passback1 = resp.passback.passback1.code
              if (resp.display) {
                this.display.items = resp.display.items
                this.display.ads = resp.display.ads
                this.display.infinity = resp.display.infinity
                this.display.design = resp.display.design ? resp.display.design : ''
                this.display.contents = resp.display.contents ? resp.display.contents : ''
                this.display.items_inner = resp.display.items_inner !== null && typeof resp.display.items_inner !== 'undefined' ? resp.display.items_inner : true
                this.display.items_issue = resp.display.items_issue !== null && typeof resp.display.items_issue !== 'undefined' ? resp.display.items_issue : true
                this.display.items_popular = resp.display.items_popular !== null && typeof resp.display.items_popular !== 'undefined' ? resp.display.items_popular : true
                this.display.items_youtube = resp.display.items_youtube !== null && typeof resp.display.items_youtube !== 'undefined' ? resp.display.items_youtube : true
              }
            }
            this.respSuccess()
          }
        }).catch((error) => {
          this.startData.adUnitShow = error.response
          this.respError(error)
        })
      }
    },
    /*
    adTypeTrace: function (id) {
      let dis = []
      if (this.startData.adUnitIndex) {
        dis = this.startData.adUnitIndex
      }
      dis = dis.filter((el, index, arr) => {
        return index === arr.indexOf(el)
      })
      let index = dis.indexOf(1)
      index !== -1 && dis.splice(index, 1)
      if (this.adType) {
        let index = dis.indexOf(this.adType)
        index !== -1 && dis.splice(index, 1)
      }
      for (let i = 0; i < this.startData.adType.data.length; i++) {
        if (dis.indexOf(this.startData.adType.data[i].id) === -1) {
          this.response.adTypeOptions.push({ value: this.startData.adType.data[i].code, text: this.startData.adType.data[i].name })
        }
      }
    },
    */
    getAdDesign: function () {
      this.xhttp({
        url: 'resources/adDesigns',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          let adDesigns = response.data.data.native
          for (let i = 0; i < adDesigns.length; i++) {
            this.adDesigns[adDesigns[i].value] = adDesigns[i]
          }
          this.response.adDesignOptions = response.data.data.native
        }
      })
    },
    getAdSizes: function () {
      this.xhttp({
        url: 'resources/adSizes',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.adSizeOptions = response.data.data.map((val) => {
            if (typeof val[0] === 'undefined') {
              return { value: val, text: '반응형' }
            } else {
              return { value: val, text: val[0] + ' x ' + val[1] }
            }
          })
        }
      })
    },
    getAdType: function () {
      this.xhttp({
        url: 'resources/adTypes',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.startData.adType = response.data
          let adTypes = response.data.data
          for (let i = 0; i < adTypes.length; i++) {
            this.adTypes[adTypes[i].code] = adTypes[i]
            let sizes = adTypes[i].size.map((val) => {
              if (typeof val[0] !== 'undefined') {
                return val[0] + ' x ' + val[1]
              }
            })
            this.response.adTypeOptions.push({ value: adTypes[i].code, text: adTypes[i].name + (sizes.length ? ' [' + sizes.join(', ') + ']' : '') })
          }
        }
      }).catch((error) => {
        this.response.adTypeOptions = error.response
        this.respError(error)
      })
    },
    adUnitShowSubmit () {
      if (this.adType === 1 && this.vModel.size === '') {
        this.vModel.sizeVal = 'on'
      } else {
        let send = {
          id: this.vModel.id,
          name: this.vModel.name,
          status: this.vModel.status,
          adType: this.adType,
          size: this.vModel.size,
          targeting_keyword: this.vModel.targeting.keyword,
          targeting_page: this.vModel.targeting.page,
          targeting_visit: this.vModel.targeting.visit,
          targeting_category: this.vModel.targeting.category,
          ignore_browser_chrome: this.vModel.ignore.browser.chrome,
          ignore_browser_msie: this.vModel.ignore.browser.msie,
          ignore_browser_firefox: this.vModel.ignore.browser.firefox,
          ignore_browser_safari: this.vModel.ignore.browser.safari,
          ignore_browser_opera: this.vModel.ignore.browser.opera,
          ignore_browser_etc: this.vModel.ignore.browser.etc,
          ignore_route_naver: this.vModel.ignore.route.naver,
          ignore_route_daum: this.vModel.ignore.route.daum,
          ignore_route_google: this.vModel.ignore.route.google,
          ignore_route_zum: this.vModel.ignore.route.zum,
          ignore_route_bing: this.vModel.ignore.route.bing,
          ignore_route_etc: this.vModel.ignore.route.etc,
          display_items: null,
          display_ads: null,
          display_infinity: null,
          display_design: null,
          display_contents: null,
          display_items_inner: null,
          display_items_issue: null,
          display_items_popular: null,
          display_items_youtube: null,
          passback1: this.vModel.passback1,
          memo: this.vModel.memo
        }
        if (send.adType.indexOf('NATIVE_CONTENTS') !== -1) {
          send.display_design = Number(this.display.design)
          send.size = this.adDesigns[this.display.design].size
          send.display_items = Number(this.display.items)
          send.display_ads = Number(this.display.ads)
          send.display_infinity = this.display.infinity
          send.display_contents = this.display.contents
          send.display_items_inner = this.display.items_inner
          send.display_items_issue = this.display.items_issue
          send.display_items_popular = this.display.items_popular
          send.display_items_youtube = this.display.items_youtube
        }
        this.response.spinner = true
        if (this.response.name === 'create') {
          this.postAdUnitShowCreate(send)
        } else {
          this.putAdUnitShowEdit(send)
        }
      }
    },
    postAdUnitShowCreate (send) {
      this.xhttp({
        url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id + '/groups/' + this.response.group_id + '/AdUnits',
        method: 'post',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.adUnitShowCreate = response
          this.$notify('primary', '등록 완료', '등록 완료되었습니다.')
          this.$router.push({ name: 'AdUnitIndex', params: { user_id: this.response.user_id, site_id: this.response.site_id, group_id: this.response.group_id } })
        }
      }).catch((error) => {
        this.response.adUnitShowCreate = error.response
        this.respError(error)
      })
    },
    putAdUnitShowEdit (send) {
      this.xhttp({
        url: 'publishers/' + this.response.user_id + '/sites/' + this.response.site_id + '/groups/' + this.response.group_id + '/AdUnits/' + this.response.ad_unit_id,
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.adUnitShowEdit = response
          this.$notify('primary', '수정', '수정 완료되었습니다.')
          this.getAdUnitShowList()
        }
      }).catch((error) => {
        this.response.adUnitShowEdit = error.response
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
    },
    arrayCompare (md1, md2) {
      let result = []
      for (let x = 0; x < md1.length; x++) {
        for (let y = 0; y < md2.length; y++) {
          if ((md1[x][0] === md2[y][0] && md1[x][1] === md2[y][1]) === false) {
            result.push(md2[y])
          }
        }
      }
      return result
    }
  },
  computed: {
    adSizeValidation () {
      if (this.vModel.sizeVal === 'on') {
        return this.vModel.size !== ''
      } else {
        return ''
      }
    }
  },
  watch: {
    startData: {
      handler (val) {
        if (val.adUnitIndex && val.deviceType && val.adUnitShow && val.adType) {
          if (val.adUnitIndex.length > 0 && val.deviceType > 0 && val.adUnitShow.success === true && val.adType.success === true) {
            this.$Progress.finish()
            this.response.spinner = false
          }
        } else if (this.response.name === 'create' && val.adType) {
          if (val.adType.success === true) {
            this.$Progress.finish()
            this.response.spinner = false
          }
        }
      },
      deep: true
    },
    display: {
      handler (val) {
        if (val.design && val.items > 0 && val.ads > 0) {
          let src = 'http://send.mci1.co.kr/tg/nativeSample/'
          let value = []
          if (val.infinity && val.items < 30) {
            val.items = 30
          }
          value.push(this.response.site_id)
          value.push(val.design)
          value.push(val.items)
          value.push(val.ads)
          val.infinity && value.push(val.infinity)
          let url = src + value.join('/')
          this.native_sample = url
        }
      },
      deep: true
    },
    adType: {
      handler (val) {
        /*
        console.log(val)
        for (let adi = 0; adi < val.length; adi++) {
          let ad = this.adTypes[val[adi]]
          if (ad) {
            if (typeof ad.size[0] !== 'undefined' && Array.isArray(ad.size[0]) === true) {
              let size = ad.size
              let listSize = this.vModel.size
              let result = this.arrayCompare(listSize, size)
              for (let i = 0; i < result.length; i++) {
                this.vModel.size.push(result[i])
              }
            }
          }
        }
        */
      }
    }
  }
}
</script>
