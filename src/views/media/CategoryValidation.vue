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
                <div class="col-lg-12">
                  <h5 class="mb-4 card-title font-weight-bold">작업</h5>
                  <div class="col-lg-12">
                    <div class="row">
                      <div class="col-lg-2">
                        <b-form-group label-cols="4" label-cols-horizontal label="카테고리">
                          <b-form-select v-model="work_category"
                                         :options="work_category_list"
                                         class="col-lg-12"
                                         plain>
                            <option slot="first" value="">선택하세요</option>
                          </b-form-select>
                        </b-form-group>
                      </div>
                      <div class="col-lg-1"><b-button variant="primary default" @click="getNews()" class="mb-1" size="xs">재갱신</b-button></div>
                      <div class="col-lg-1"><b-form-group label-rows="4" label-cols-horizontal label="분류 기사">
                        <span class="font-weight-bold">{{vModel.count.total}}</span>
                      </b-form-group></div>
                      <div class="col-lg-1"><b-form-group label-rows="4" label-cols-horizontal label="검증전">
                        <span class="font-weight-bold" style="color:#1d50de">{{vModel.count.before}}</span>
                      </b-form-group></div>
                      <div class="col-lg-1"><b-form-group label-rows="4" label-cols-horizontal label="검증완료">
                        <span class="font-weight-bold" style="color:#008a00">{{vModel.count.after}}</span>
                      </b-form-group></div>
                      <div class="col-lg-2"><b-form-group label-rows="4" label-cols-horizontal label="전체">
                        <span class="font-weight-bold">{{vModel.status.run}} / {{vModel.status.total}} ({{vModel.status.percent}}%)</span>
                      </b-form-group></div>
                      <div class="col-lg-1"><b-form-group label-rows="4" label-cols-horizontal label="합격">
                        <span class="font-weight-bold" style="color:#008a00">{{vModel.status.success}} ({{Math.round(vModel.status.success / (vModel.status.success + vModel.status.modify) * 100)}}%)</span>
                      </b-form-group></div>
                      <div class="col-lg-1"><b-form-group label-rows="4" label-cols-horizontal label="수정">
                        <span class="font-weight-bold" style="color:#1d50de">{{vModel.status.modify}} ({{Math.round(vModel.status.modify / (vModel.status.success + vModel.status.modify) * 100)}}%)</span>
                      </b-form-group></div>
                      <div class="mb-2 col-lg-1"><b-form-group label-rows="4" label-cols-horizontal label="완료된 수">
                        <span class="font-weight-bold" style="color:#e78c45">{{vModel.status.complete}}</span>
                      </b-form-group></div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 float-left">
                  <h5 class="mb-4 card-title font-weight-bold">컨텐츠</h5>
                  <b-form-group label-cols="2" label-cols-horizontal label="기사 아이디">
                    <b-form-input type="text" :value="'ObjectId(\'' + vModel.news._id + '\')'" required class="col-lg-12 d-inline" disabled></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="카테고리">
                    <b-form-input type="text" v-model="vModel.news.cate_string" required class="col-lg-12 d-inline" disabled></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="제목">
                    <b-form-input type="text" v-model="vModel.news.title" required class="col-lg-12 d-inline" disabled></b-form-input>
                  </b-form-group>
                  <b-form-textarea rows="23" max-rows="23" v-model="vModel.news.text" no-resize></b-form-textarea>
                  <b-form-group label-cols="2" label-cols-horizontal label="키워드" class="mt-2">
                    <v-select multiple
                              taggable
                              v-model="vModel.news.noun"
                              placeholder="키워드 입력"
                              max-height="300"
                              ref="keywords" class="col-lg-12 p-0 mb-2 d-inline-block"/>
                  </b-form-group>
                </div>
                <div class="col-lg-6 float-right">
                  <h5 class="mb-4 card-title font-weight-bold">작업</h5>
                  <b-form-group>
                    <b-button variant="primary default" class="mb-1 col-lg-3" @click="newsValidate(1)" :disabled="(! vModel.news._id)">합격</b-button>
                    <b-button variant="info default" class="mb-1 col-lg-3" :disabled="(! selectCategory) || (! vModel.news._id)" @click="newsValidate(-1)">수정</b-button>
                    <b-button variant="danger default" class="mb-1 col-lg-3 float-md-right" @click="newsValidate(0)" :disabled="(! vModel.news._id)">삭제</b-button>
                  </b-form-group>
                  <h5 class="mb-4 card-title font-weight-bold">카테고리</h5>
                  <div class="col-lg-12">
                    <b-form-group>
                      <b-form-input type="text" v-model="selectString" required class="col-lg-12 d-inline" disabled></b-form-input>
                    </b-form-group>
                    <div class="row">
                      <div class="col-lg-4">
                        <b-form-select v-model="selectCategory"
                                       :options="resource.dom.step1"
                                       class="col-lg-12"
                                       :select-size="25"
                                       plain required>
                        </b-form-select>
                      </div>
                      <div class="col-lg-4">
                        <b-form-select v-model="selectCategory"
                                       :options="resource.dom.step2"
                                       class="col-lg-12"
                                       :select-size="25"
                                       plain required>
                        </b-form-select>
                      </div>
                      <div class="col-lg-4">
                        <b-form-select v-model="selectCategory"
                                       :options="resource.dom.step3"
                                       class="col-lg-12"
                                       :select-size="25"
                                       plain required>
                        </b-form-select>
                      </div>
                    </div>
                  </div>
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
import vSelect from 'vue-select'

export default {
  props: ['depth'],
  components: {
    vSelect
  },
  created () {
    this.getWorkCategories()
    this.getCategories(1)
  },
  data () {
    return {
      selectCategory: null,
      selectString: '',
      category: null,
      work_category: '',
      work_category_list: [],
      resource: {
        data: {},
        dom: {
          step1: [],
          step2: [],
          step3: []
        }
      },
      vModel: {
        news: {
          _id: null,
          title: null,
          text: null,
          category: [],
          noun: [],
          cate_string: null
        },
        status: {
          modify: 0,
          percent: 0,
          run: 0,
          success: 0,
          total: 0
        },
        count: {
          total: 0,
          before: 0,
          after: 0
        }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    vModelReset () {
      this.vModel = {
        news: {
          _id: null,
          title: null,
          text: null,
          regDate: null,
          category: [],
          best_words: []
        },
        status: {
          modify: 0,
          percent: 0,
          run: 0,
          success: 0,
          total: 0
        },
        count: {
          total: 0,
          before: 0,
          after: 0
        }
      }
    },
    getNews () {
      let send = {
        category: this.work_category
      }
      this.xhttp({
        url: '/contents/news',
        method: 'post',
        data: send
      }).then((response) => {
        if (response.status === 200 && response.data.data.news) {
          this.$Progress.finish()
          let data = response.data.data
          this.vModel.news = data.news
          this.vModel.news.noun = this.vModel.news.noun.split(' ')
          this.vModel.status = data.status
          this.vModel.count = data.count
        } else {
          this.$Progress.fail()
          this.work_category = ''
          this.getWorkCategories()
          this.$notify('error', '오류', '해당 카테고리에 기사가 없습니다. 다른 카테고리를 선택하세요.')
        }
      })
    },
    getWorkCategories () {
      this.xhttp({
        url: '/contents/workCategories',
        method: 'get'
      }).then((response) => {
        if (response.status === 200) {
          this.work_category_list = []
          response.data.data.map((val) => {
            this.work_category_list.push({ value: val._id, text: val.name })
          })
          if (this.work_category) {
            this.getNews()
          }
        }
      })
    },
    getCategoryString (category) {
      if (category.length > 0) {
        return category.map((val) => {
          return val.name
        }).join(' + ')
      }
    },
    newsValidate (work) {
      let send = {
        _id: this.vModel.news._id,
        work: work
      }
      if (send.work === -1) {
        send.category = {
          _id: this.category._id
        }
      }
      this.vModelReset()
      this.xhttp({
        url: '/contents/news',
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.$Progress.finish()
          this.getNews()
          this.selectCategory = null
          this.selectString = ''
          this.category = null
          this.categoryString = ''
        }
      })
    },
    makeCategories (val, step) {
      val.step = step
      let ages = {
        10: false,
        20: false,
        30: false,
        40: false,
        50: false,
        60: false
      }
      val.options.age.map((age) => {
        ages[age] = true
      })
      switch (val.options.gender) {
        case null:
          val.options.gender = 'null'
          break
        case true:
          val.options.gender = 'true'
          break
        case false:
          val.options.gender = 'false'
          break
      }
      val.options.age = ages
      this.resource.data[val._id] = val
      return { value: val._id, text: val.name }
    },
    getCategories (step) {
      let send = {
        _id: this.selectCategory
      }
      this.xhttp({
        url: '/categories',
        method: 'post',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.$Progress.finish()
          this.resource.dom['step' + step.toString()] = response.data.data.map((val) => {
            return this.makeCategories(val, step)
          })
        }
      })
    }
  },
  computed: {
  },
  watch: {
    selectCategory (val) {
      if (val) {
        let category = this.resource.data[val]
        if (category.step === 1 && category.parent === null) {
          this.getCategories(2)
        } else if (category.step === 2 && category.parent !== null) {
          this.getCategories(3)
        }
        this.category = category
        this.selectString = category.name
      }
    },
    work_category (val) {
      if (val) {
        this.getNews()
      }
    }
  }
}
</script>
