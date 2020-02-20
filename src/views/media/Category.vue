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
                <div class="col-lg-6 float-left">
                  <h5 class="mb-4 card-title font-weight-bold">카테고리 ({{categoryCount}})</h5>
                  <div class="col-lg-12">
                    <div class="row">
                      <div class="col-lg-4">
                        <b-form-select v-model="select"
                                       :options="resource.dom.step1"
                                       class="col-lg-12"
                                       :select-size="25"
                                       plain required>
                        </b-form-select>
                      </div>
                      <div class="col-lg-4">
                        <b-form-select v-model="select"
                                       :options="resource.dom.step2"
                                       class="col-lg-12"
                                       :select-size="25"
                                       plain required>
                        </b-form-select>
                      </div>
                      <div class="col-lg-4">
                        <b-form-select v-model="select"
                                       :options="resource.dom.step3"
                                       class="col-lg-12"
                                       :select-size="25"
                                       plain required>
                        </b-form-select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 float-right mb-4">
                  <h5 class="mb-4 card-title font-weight-bold">편집기</h5>
                  <h6>기본 정보</h6>
                  <b-form-group label-cols="2" label-cols-horizontal label="작업">
                    <b-button variant="primary default" @click="setAction('add')" class="mb-1" :disabled="action.add">신규 카테고리 추가</b-button>
                    <b-button variant="secondary default" @click="setAction('child')" class="mb-1" :disabled="action.child">하위 카테고리 추가</b-button>
                    <b-button variant="danger default" @click="setAction('del')" class="mb-1" :disabled="action.del">카테고리 삭제</b-button>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="상위 카테고리">
                    <b-form-input type="text" :value="getParent(vModel.parent)" required class="col-lg-12 d-inline" disabled></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="카테고리 ID">
                    <b-form-input type="text" v-model="vModel._id" required class="col-lg-12 d-inline" disabled></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-cols-horizontal label="카테고리 이름">
                    <b-form-input type="text" v-model="vModel.name" required class="col-lg-12 d-inline"></b-form-input>
                  </b-form-group>
                  <hr/>
                  <h6>옵션</h6>
                  <div class="row">
                    <div class="col-md-4">
                      <b-form-group label-cols="4" label-cols-horizontal label="활성화">
                        <switches v-model="vModel.use" theme="custom" color="primary"  class="mt-2"></switches>
                      </b-form-group>
                    </div>
                    <div class="col-md-8">
                      <b-form-group label-cols="2" label-cols-horizontal label="성별">
                        <b-form-select v-model="vModel.options.gender"
                                       class="col-lg-9"
                                       plain>
                          <option slot="first" value="null">전체</option>
                          <option value="true">남자</option>
                          <option value="false">여자</option>
                        </b-form-select>
                      </b-form-group>
                    </div>
                  </div>
                  <b-form-group label-cols="2" label-cols-horizontal label="연령대">
                    <b-form-checkbox v-model="vModel.options.age[10]" class="mt-1 mr-3 d-inline-block">
                      10대
                    </b-form-checkbox>
                    <b-form-checkbox v-model="vModel.options.age[20]" class="mt-1 mr-3 d-inline-block">
                      20대
                    </b-form-checkbox>
                    <b-form-checkbox v-model="vModel.options.age[30]" class="mt-1 mr-3 d-inline-block">
                      30대
                    </b-form-checkbox>
                    <b-form-checkbox v-model="vModel.options.age[40]" class="mt-1 mr-3 d-inline-block">
                      40대
                    </b-form-checkbox>
                    <b-form-checkbox v-model="vModel.options.age[50]" class="mt-1 mr-3 d-inline-block">
                      50대
                    </b-form-checkbox>
                    <b-form-checkbox v-model="vModel.options.age[60]" class="mt-1 mr-3 d-inline-block">
                      60대
                    </b-form-checkbox>
                  </b-form-group>
                  <hr/>
                  <b-form-group label-cols="2" label-cols-horizontal label="작업">
                    <b-button variant="primary default" @click="setAction('save')" class="mb-1" :disabled="action.save">저장</b-button>
                    <b-button variant="danger default" @click="setAction('cancel')" class="mb-1" :disabled="action.cancel">취소</b-button>
                  </b-form-group>
                </div>
              </div>
              <div class="col-lg-12 mt-4 cf">
                <h6>키워드 ({{vModel.keywords.length}})</h6>
                <div class="row">
                  <div class="col-lg-10">
                    <b-form-group label-rows="1" label-cols-horizontal>
                      <b-form-textarea rows="1" max-rows="1" class="m-0 p-0" placeholder="삽입할 키워드를 붙여넣기 하세요" no-resize v-model="addKeywords"></b-form-textarea>
                    </b-form-group>
                  </div>
                  <div class="col-lg-2">
                    <b-form-group label-rows="2" label-cols-horizontal>
                      <b-button variant="primary default" @click="insertKeywords(addKeywords)">삽입</b-button>
                    </b-form-group>
                  </div>
                </div>

                <v-select multiple
                          taggable
                          v-model="vModel.keywords"
                          placeholder="키워드 입력"
                          ref="keywords" class="col-lg-12 p-0 mb-2 d-inline-block"/>
              </div>
            </b-form>
          </b-card>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import Switches from 'vue-switches'
import { mapActions } from 'vuex'
import vSelect from 'vue-select'

export default {
  props: ['depth'],
  components: {
    Switches, vSelect
  },
  created () {
    this.getCategoryCount()
    this.getCategories(1)
  },
  data () {
    return {
      categoryCount: 0,
      select: null,
      status: null,
      statusString: '',
      addKeywords: '',
      action: {
        add: false,
        child: true,
        del: true,
        save: true,
        cancel: true
      },
      resource: {
        data: {},
        dom: {
          step1: [],
          step2: [],
          step3: []
        }
      },
      vModel: {
        _id: null,
        name: null,
        options: {
          gender: null,
          age: {
            10: true,
            20: true,
            30: true,
            40: true,
            50: true,
            60: true
          }
        },
        keywords: [],
        child: {
          cnt: 0
        },
        parent: null,
        step: 1,
        use: true
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    getCategoryCount () {
      this.xhttp({
        url: '/contents/categoryCount',
        method: 'get'
      }).then((response) => {
        if (response.status === 200) {
          this.categoryCount = response.data.data
        }
      })
    },
    vModelReset () {
      this.vModel = {
        _id: null,
        name: null,
        options: {
          gender: null,
          age: {
            10: true,
            20: true,
            30: true,
            40: true,
            50: true,
            60: true
          }
        },
        parent: null,
        child: {
          cnt: 0
        },
        keywords: [],
        step: 1,
        use: true
      }
    },
    insertKeywords (text) {
      text = text.replace(/^\s+|\s+$/g, '')
      if (text) {
        let keywords = text.split('\n')
        for (let i = 0; i < keywords.length; i++) {
          if (keywords[i] && this.vModel.keywords.indexOf(keywords[i]) === -1) {
            this.vModel.keywords.push(keywords[i])
          }
        }
        this.addKeywords = ''
      }
    },
    getParent (_id) {
      if (_id) {
        return this.resource.data[_id].name
      } else {
        return null
      }
    },
    categoryDelete () {
      let send = {
        _id: this.vModel._id
      }
      if (send._id && confirm('삭제하면 해당 카테고리의 모든 정보가 제거됩니다. 계속 진행하시겠습니까?')) {
        this.xhttp({
          url: '/category',
          method: 'post',
          data: send
        }).then((response) => {
          if (response.status === 200) {
            this.$Progress.finish()
            delete this.resource.data[send._id]
            for (let i = 0; i < this.resource.dom['step' + this.vModel.step].length; i++) {
              if (this.resource.dom['step' + this.vModel.step][i].value === send._id) {
                this.resource.dom['step' + this.vModel.step].splice(i, 1)
                if (this.vModel.step > 1) {
                  this.resource.data[this.vModel.parent].child.cnt--
                }
              }
            }
            this.select = null
            this.setAction(null)
          }
        })
      }
    },
    categorySave () {
      let send = {
        _id: this.vModel._id,
        name: this.vModel.name,
        options: {
          gender: this.vModel.gender
        },
        parent: this.vModel.parent,
        keywords: this.vModel.keywords,
        use: this.vModel.use
      }
      if (send.options.gender === 'true') {
        send.options.gender = true
      } else if (send.options.gender === 'false') {
        send.options.gender = false
      } else {
        send.options.gender = null
      }
      let ages = Object.keys(this.vModel.options.age)
      let age = []
      for (let i = 0; i < ages.length; i++) {
        if (this.vModel.options.age[ages[i]] === true) {
          age.push(Number(ages[i]))
        }
      }
      send.options.age = age
      this.xhttp({
        url: '/category',
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.$Progress.finish()
          response.data.data.step = this.vModel.step
          response.data.data.child = this.vModel.child
          if (typeof this.resource.data[response.data.data._id] === 'undefined') {
            this.resource.dom['step' + this.vModel.step.toString()].push(this.makeCategories(response.data.data, this.vModel.step))
          } else {
            this.makeCategories(response.data.data, this.vModel.step)
          }
          if (this.vModel.step > 1) {
            this.resource.data[this.vModel.parent].child.cnt++
          }
          if (response.data.data._id) {
            this.select = response.data.data._id
          } else {
            this.select = send._id
          }
          this.setAction(null)
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
        _id: this.select
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
    },
    setAction (work) {
      this.status = work
      switch (work) {
        case 'add':
          this.statusString = '신규 추가'
          this.action = {
            add: true,
            child: true,
            del: true,
            save: false,
            cancel: false
          }
          this.vModelReset()
          break
        case 'child':
          this.statusString = '하위 추가'
          if (this.vModel._id) {
            let parent = this.vModel._id
            let step = this.vModel.step + 1
            this.action = {
              add: true,
              child: true,
              del: true,
              save: false,
              cancel: false
            }
            this.vModelReset()
            this.vModel.parent = parent
            this.vModel.step = step
          }
          break
        case 'del':
          this.statusString = '삭제'
          this.categoryDelete()
          break
        case 'save':
          this.statusString = '저장'
          this.categorySave()
          break
        case 'cancel':
          this.statusString = '편집 모드'
          this.setAction(null)
          break
        case null:
          this.statusString = '편집 모드'
          this.action = {
            add: false,
            save: false,
            cancel: true
          }
          if (this.vModel.child.cnt > 0) {
            this.action.del = true
          } else {
            this.action.del = false
          }
          if (this.vModel._id && this.vModel.step < 3) {
            this.action.child = false
          } else {
            this.action.child = true
          }
          break
      }
    }
  },
  computed: {
  },
  watch: {
    select (val) {
      if (val) {
        let category = this.resource.data[val]
        if (category.step === 1 && category.parent === null) {
          this.getCategories(2)
        } else if (category.step === 2 && category.parent !== null) {
          this.getCategories(3)
        }
        this.vModelReset()
        this.vModel = category
        this.setAction(null)
      }
    }
  }
}
</script>
