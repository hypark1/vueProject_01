<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="관리자 메뉴" :depth="depth"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" no-body>
          <b-card class="shadow-none">
            <b-form onsubmit="return false;">
              <div class="col-lg-12 mt-4 cf">
                <h5 class="mb-4 card-title font-weight-bold">컨텐츠 관리</h5>
                <div clas="row">
                  <b-form-group label-cols="1" label-cols-horizontal label="URL">
                    <template>
                      <b-form-input type="text" v-model="url" required placeholder="기사 URL을 입력하세요." class="col-lg-9 d-inline"></b-form-input>
                      <b-button @click="getNews" variant="primary default">검색</b-button>
                    </template>
                  </b-form-group>
                </div>
                <div v-if="vModel.id && search === true" class="row">
                  <div class="col-lg-5 float-left">
                    <h5 class="mb-4 card-title font-weight-bold">컨텐츠 정보</h5>
                    <b-form-group label-cols="2" label-cols-horizontal label="매체사" >
                      <b-form-input type="text" v-model="vModel.name" required class="col-lg-10" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="2" label-cols-horizontal label="도메인">
                      <b-form-input type="text" v-model="vModel.host" required class="col-lg-10" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="2" label-cols-horizontal label="기사 번호">
                      <b-form-input type="text" v-model="vModel.id" required class="col-lg-10" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="2" label-cols-horizontal label="등록 일자">
                      <b-form-input type="text" v-model="vModel.regDate" required class="col-lg-10" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="2" label-cols-horizontal label="갱신 일자">
                      <b-form-input type="text" v-model="vModel.checkDate" required class="col-lg-10" disabled></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="col-lg-7 float-right">
                    <h5 class="mb-4 card-title font-weight-bold">컨텐츠 상태</h5>
                    <b-form-group label-cols="2" label-cols-horizontal label="적용">
                      <b-button variant="success" id="id" size="xs" class="mb-1" :disabled="(! vModel.id)">URL 등록</b-button>
                      <b-popover target="id" title="컨텐츠 ID">
                        <b-form-input type="text" v-model="vModel.id" required class="col-lg-12" disabled></b-form-input>
                      </b-popover>
                      <b-button variant="success" id="title" size="xs" class="mb-1" :disabled="(! vModel.title)">제목수집</b-button>
                      <b-popover target="title" title="컨텐츠 제목">
                        <b-form-input type="text" v-model="vModel.title" required class="col-lg-12" disabled></b-form-input>
                      </b-popover>
                      <b-button variant="success" id="text" size="xs" class="mb-1" :disabled="(! vModel.text)">내용수집</b-button>
                      <b-popover target="text" title="컨텐츠 내용">
                        <textarea style="max-height:500px;min-height:300px;height:auto;overflow-y:auto;width:100%" class="border p-2" :value="vModel.text"></textarea>
                      </b-popover>
                      <b-button variant="success" id="meta_img" size="xs" class="mb-1" :disabled="(! vModel.meta_img)">썸네일</b-button>
                      <b-popover target="meta_img" title="썸네일">
                        <div class="preview-container">
                          <img data-dz-thumbnail class="img-thumbnail border-0" :src="vModel.meta_img"/>
                        </div>
                      </b-popover>
                      <b-button variant="success" id="noun" size="xs" class="mb-1" :disabled="(! vModel.noun || vModel.noun.length < 1)">형태소분석</b-button>
                      <b-popover target="noun" title="형태소 분석">
                        <textarea style="max-height:500px;min-height:300px;height:auto;overflow-y:auto;width:100%" class="border p-2" v-if="vModel.noun && vModel.noun.length > 0" :value="vModel.noun.join(', ')"></textarea>
                      </b-popover>
                      <b-button variant="success" id="category" size="xs" class="mb-1" :disabled="(! vModel.category || vModel.category.length < 1)">카테고리</b-button>
                      <b-popover target="category" title="카테고리">
                        <b-form-input type="text" v-if="vModel.category && vModel.category.length > 0" v-model="category"  required class="col-lg-12" disabled></b-form-input>
                        <template slot="label" label-cols="2" breakpoint="sm">
                          <div v-b-tooltip.html title="<b>컨텐츠 카테고리 타겟팅</b><br />: 사용자가 접속한 페이지의 (컨텐츠) 카테고리를 대상으로 타겟팅 합니다.">
                            컨텐츠 카테고리 타겟팅 <span class="glyph-icon simple-icon-question"></span>
                          </div>
                        </template>

                        <treeselect v-model="selectCategory"
                                    placeholder="수정할 컨텐츠 카테고리를 선택하세요."
                                    :multiple="false"
                                    :show-count="true"
                                    :max-height="300"
                                    :options="categories"/>
                        <b-button variant="info default" class="mb-1" @click="setCategory(vModel.id, vModel.host, selectCategory)" :disabled="(! selectCategory)">수정</b-button>
                      </b-popover>
                    </b-form-group>
                    <b-form-group label-cols="2" label-cols-horizontal label="상태">
                      <b-form-input type="text" v-model="status" required class="col-lg-10" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="2" label-cols-horizontal label="타겟팅">
                      <b-button variant="warning" size="xs" class="mb-1" :disabled="(! vModel.id)">페이지 타겟팅</b-button>
                      <b-button variant="warning" id="keywords" size="xs" class="mb-1" :disabled="(! vModel.text)">키워드 타겟팅</b-button>
                      <b-popover target="keywords" title="키워드 타겟팅">
                        <textarea style="max-height:500px;min-height:300px;height:auto;overflow-y:auto;width:100%" class="border p-2" v-if="vModel.keywords && vModel.keywords.length > 0" :value="vModel.keywords.join(', ')"></textarea>
                      </b-popover>
                      <b-button variant="warning" size="xs" class="mb-1" :disabled="(! vModel.category || vModel.category.length < 1)">카테고리 타겟팅</b-button>
                    </b-form-group>
                    <b-form-group label-cols="2" label-cols-horizontal label="매칭">
                      <b-button variant="info" id="match-pages" size="xs" class="mb-1" :disabled="(! vModel.id)">페이지</b-button>
                      <b-popover target="match-pages" title="키워드 타겟팅 매칭 광고ID">
                        <textarea style="max-height:500px;min-height:300px;height:auto;overflow-y:auto;width:100%" class="border p-2" v-if="vModel.match_pages && vModel.match_pages.length > 0" :value="vModel.match_pages.join(', ')"></textarea>
                      </b-popover>
                      <b-button variant="info" id="match-keywords" size="xs" class="mb-1" :disabled="(! vModel.text)">키워드</b-button>
                      <b-popover target="match-keywords" title="키워드 타겟팅 매칭 광고ID">
                        <textarea style="max-height:500px;min-height:300px;height:auto;overflow-y:auto;width:100%" class="border p-2" v-if="vModel.match_keywords && vModel.match_keywords.length > 0" :value="vModel.match_keywords.join(', ')"></textarea>
                      </b-popover>
                      <b-button variant="info" size="xs" class="mb-1" :disabled="(! vModel.category || vModel.category.length < 1)">카테고리</b-button>
                    </b-form-group>
                    <b-form-group label-cols="2" label-cols-horizontal label="작업">
                      <b-button variant="danger default" @click="putNews('del')" class="mb-1">컨텐츠 삭제</b-button>
                      <b-button variant="primary default" @click="putNews('after')" class="mb-1">컨텐츠 재갱신</b-button>
                    </b-form-group>
                  </div>
                </div>
                <div v-else-if="vModel.id === null && search === true">
                  <b-form-group label-cols="1" label-cols-horizontal label="상태">
                    <b-form-input type="text" v-model="status" required class="col-lg-8 d-inline" disabled></b-form-input>
                    <b-button variant="info default" class="mb-1" @click="putNews('add')" :disabled="(! add)">컨텐츠 등록</b-button>
                  </b-form-group>
                </div>
              </div>
            </b-form>
          </b-card>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: {
    Treeselect
  },
  props: ['depth'],
  created () {
    this.getCategories()
  },
  data () {
    return {
      url: null,
      status: null,
      search: false,
      add: false,
      category: '',
      selectCategory: null,
      categories: [],
      vModel: {
        _id: null,
        id: null,
        name: null,
        host: null,
        input: [],
        meta_img: null,
        title: null,
        text: null,
        noun: [],
        regDate: null,
        checkDate: null,
        category: [],
        keywords: [],
        match_keywords: [],
        match_pages: []
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    vModelReset () {
      this.vModel = {
        _id: null,
        id: null,
        name: null,
        host: null,
        input: [],
        meta_img: null,
        title: null,
        text: null,
        noun: [],
        regDate: null,
        checkDate: null,
        category: []
      }
    },
    getNews () {
      if (this.url) {
        let send = {
          url: encodeURIComponent(this.url)
        }
        this.xhttp({
          url: '/resources/content',
          method: 'post',
          data: send
        }).then((response) => {
          if (response.status === 200) {
            this.$Progress.finish()
            this.search = true
            if (response.data.data === null) {
              this.vModelReset()
              this.status = '뉴스 URL이 등록되지 않았습니다. 컨텐츠 등록버튼으로 등록 가능합니다.'
              this.add = true
            } else if (response.data.data === false) {
              this.vModelReset()
              this.status = '인벤토리에 등록되지않은 컨텐츠 도메인입니다. 다시 확인해주세요.'
              this.add = false
            } else if (response.data.data === -1) {
              this.vModelReset()
              this.status = '잘못된 형식의 주소체계입니다. "인벤토리 > 사이트관리" 에서 해당 사이트의 uri를 확인하세요.'
              this.add = false
            } else {
              this.vModel = response.data.data
              this.add = false
            }
          }
        }).catch((error) => {
          this.$Progress.fail()
          this.siteShow = error.response
        })
      }
    },
    getCategories () {
      this.xhttp({
        url: '/categories',
        method: 'get'
      }).then((response) => {
        this.categories = response.data.data
        this.$Progress.finish()
      }).catch((error) => {
        this.$Progress.fail()
        this.siteShow = error.response
      })
    },
    setCategory (id, host, category) {
      let send = {
        'id': id,
        'host': host,
        'category': category
      }
      this.xhttp({
        url: '/category',
        method: 'put',
        data: send
      }).then((response) => {
        this.$Progress.finish()
        if (response.status === 200) {
          this.getNews()
        }
        this.$Progress.finish()
      }).catch((error) => {
        this.$Progress.fail()
        this.siteShow = error.response
      })
    },
    putNews (action) {
      if (this.url) {
        let send = {
          url: encodeURIComponent(this.url),
          action: action
        }
        this.xhttp({
          url: '/resources/content',
          method: 'put',
          data: send
        }).then((response) => {
          this.$Progress.finish()
          if (response.status === 200) {
            this.getNews()
          }
          this.$Progress.finish()
        }).catch((error) => {
          this.$Progress.fail()
          this.siteShow = error.response
        })
      }
    },
    categoryString (category) {
      return category[0].delivery
    }
  },
  computed: {

  },
  watch: {
    vModel: {
      handler (val) {
        if (val.id) {
          this.status = '[1/4] 기사 등록상태 & 기사 수집 대기중'
          if (val.text) {
            this.status = '[2/4] 기사 수집 완료 형태소 분석 대기중'
            if (val.noun && val.noun.length > 0) {
              this.status = '[3/4] 기사 형태소 분석 완료'
              if (val.category && val.category.length > 0) {
                this.category = this.categoryString(val.category)
                this.status = '[4/4] 카테고리 적용 완료'
              }
            }
          }
        }
      },
      deep: true
    }
  }
}
</script>
