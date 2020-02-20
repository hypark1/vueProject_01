<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="1:1 문의"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-form class="text-center" @submit.prevent="contactCreateEdit">
            <b-form-group label-cols="1" label-cols-horizontal label="카테고리">
              <b-form-select v-model="vModel.category"
                             :options="response.categoryOptions"
                             class="w-20 w-sm-100"
                             plain required>
                <option slot="first" value="">선택하세요</option>
              </b-form-select>
            </b-form-group>
            <b-form-group label-cols="1" label-cols-horizontal label="제목">
              <b-form-input type="text" v-model="vModel.title" placeholder="제목을 입력하세요." :state="titleValidation" required></b-form-input>
              <b-form-invalid-feedback :state="titleValidation" class="text-left">
                5자 이상 입력하세요.
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label-cols="1" label-cols-horizontal label="내용">
              <b-form-textarea rows="10" max-rows="10" v-model="vModel.content" placeholder="내용을 입력하세요." :state="contentValidation" no-resize required></b-form-textarea>
              <b-form-invalid-feedback :state="contentValidation" class="text-left">
                5자 이상 입력하세요.
              </b-form-invalid-feedback>
            </b-form-group>
          <!--글쓰기/수정-->
          <div class="mt-5 text-center">
            <b-button type="submit" class="mr-1" variant="primary">
              <template v-if="response.name == 'contactsCreate'">등록</template>
              <template v-else>수정</template>
            </b-button>
            <b-button variant="light" @click="contactPage()">취소</b-button>
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
import { mapActions } from 'vuex'

export default {
  created () {
    this.getContactsView()
    this.getCodesCategories()
  },
  data () {
    return {
      response: {
        spinner: true,
        contact_id: this.$route.params.contact_id,
        name: this.$route.name,
        categories: null,
        contactsCreate: null,
        contactsEdit: null,
        categoryOptions: [],
        contacts: ''
      },
      vModel: {
        category: '',
        title: '',
        content: '',
        validation: ''
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    contactPage () {
      if (this.response.name === 'contactsCreate') {
        this.$router.push('/customer/contacts')
      } else {
        this.$router.push('/customer/contacts/' + this.response.contact_id)
      }
    },
    contactCreateEdit () {
      this.vModel.validation = 'on'
      if (this.vModel.title.length > 4 && this.vModel.content.length > 4) {
        if (this.response.name === 'contactsCreate') {
          this.getContactsCreate()
        } else {
          this.putContactsEdit()
        }
      }
    },
    getContactsView: function () {
      if (this.response.name === 'contactsEdit') {
        this.xhttp({
          url: 'contacts/' + this.response.contact_id,
          method: 'get',
          params: null
        }).then((response) => {
          if (response.status === 200) {
            this.response.contacts = response.data
            if (response.data.data !== false) {
              this.vModel.category = response.data.data.category.id
              this.vModel.title = response.data.data.question_title
              this.vModel.content = response.data.data.question_content
            }
            this.respSuccess()
          }
        }).catch((error) => {
          this.response.contacts = error.response
          this.respError(error)
        })
      }
    },
    getCodesCategories: function () {
      this.xhttp({
        url: 'contacts/categories',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.categories = response.data
          if (response.data.data !== false) {
            this.response.categoryOptions = this.response.categories.data.map(function ($value) {
              return { value: $value.id, text: $value.name }
            })
          }
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.categories = error.response
        this.respError(error)
      })
    },
    getContactsCreate: function () {
      let send = {
        contact_category_id: this.vModel.category,
        question_title: this.vModel.title,
        question_content: this.vModel.content
      }
      this.xhttp({
        url: 'contacts/create',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.contactsCreate = response.data
          this.$notify('primary', '등록 완료', '등록 완료되었습니다.')
          this.$router.push('/customer/contacts')
        }
      }).catch((error) => {
        this.response.contactsCreate = error.response
        this.respError(error)
      })
    },
    putContactsEdit: function () {
      let send = {
        contact_category_id: this.vModel.category,
        question_title: this.vModel.title,
        question_content: this.vModel.content
      }
      this.xhttp({
        url: 'contacts/' + this.response.contact_id,
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.contactsEdit = response.data
          this.$notify('primary', '수정 완료', '수정 완료되었습니다.')
          this.$router.push('/customer/contacts/' + this.response.contact_id)
        }
      }).catch((error) => {
        this.response.contactsEdit = error.response
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
    titleValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.title.length > 4
      } else {
        return ''
      }
    },
    contentValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.content.length > 4
      } else {
        return ''
      }
    }
  }
}
</script>
