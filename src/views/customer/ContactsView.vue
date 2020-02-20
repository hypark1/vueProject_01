/* eslint-disable vue/no-unused-components */
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
        <b-card class="mb-5">
          <template v-if="resultContacts">
          <div class="mr-2 ml-2 mt-2 mb-3">
            <div class="d-inline-block ">
              <b-badge class="mb-1 align-middle" pill variant="secondary">
                {{ resultContacts.state.name }}
              </b-badge>
              <h3 class="d-inline-block ml-2" style="letter-spacing: -2px;vertical-align: sub">
                {{ resultContacts.question_title }}
              </h3>
            </div>
            <div class="float-md-right d-inline-block mt-1">
              {{ resultContacts.question_user.name }} ({{ resultContacts.question_user.email }})/ {{ resultContacts.created_at }}
            </div>
          </div>
          <div class="separator mt-2 mb-5"></div>
          <div class="mr-2 ml-2 mb-4">
            <p style="white-space: pre-line">{{resultContacts.question_content}}</p>
            <!--답변없고
                본인것만-->
            <router-link :to="{ name: 'contactsEdit',
                                params: {contact_id: response.contact_id, type: 'edit'}}"
                         v-if="!resultContacts.answer_user_id && currentUser.title == resultContacts.question_user.name">
              <b-button class="mt-2 mr-1 mb-1"
                        size="xs"
                        variant="outline-info">수정
              </b-button>
            </router-link>
            <b-button size="sm"
                      class="mb-1"
                      variant="success default"
                      v-if="currentUser.level > 99 && resultContacts.state.id === 1"
                      @click="putContactStatuses()">
                      문의 접수
            </b-button>
          </div>
          <!--답변리스트-->
          <template v-if="resultContacts.answer_content">
          <div class="separator mt-4 mb-3"></div>
          <table cellpadding="0" cellspacing="0" class="w-100">
            <colgroup>
              <col width="80" />
              <col width="" />
            </colgroup>
            <tbody>
            <tr>
              <td class="align-top pr-3">
                <b-badge class="float-right" size="xs" pill variant="primary">답변</b-badge>
              </td>
              <td class="pr-3 pb-1">
                <!--답변내용-->
                <template v-if="vModel.repliesState !== 'edit'">
                <span class="d-inline-block mb-2 font-weight-semibold">
                  {{ resultContacts.answer_user.name }} / {{ resultContacts.updated_at }}
                </span>
                <p style="white-space: pre-line">{{resultContacts.answer_content}}</p>
                <!--관리자만 && 댓글없을때 && 본인것만-->
                <b-button v-if="currentUser.level > 99 && resultContacts.comments.length == 0 && currentUser.title == resultContacts.answer_user.name"
                          class="mr-1 mb-1"
                          size="xs"
                          variant="outline-info"
                          @click="modifyReplies()">수정
                </b-button>
                </template>
                <!--답변수정클릭시-->
                <template v-else>
                  <b-form @submit.prevent="doneReplies">
                    <b-form-radio-group class="mb-1"
                                        v-model="vModel.contactViewState"
                                        :options="response.contactStateOptions"
                    ></b-form-radio-group>
                    <b-form-textarea rows="2"
                                     max-rows="6"
                                     v-model="vModel.repliesEdit"
                                     no-resize
                                     required
                                     :state="repliesEditValidation">
                    </b-form-textarea>
                    <b-form-invalid-feedback :state="repliesEditValidation" class="text-left">
                      3자 이상 입력하세요.
                    </b-form-invalid-feedback>
                    <b-button size="xs" variant="outline-info" class="mr-1 mt-3" type="submit">수정</b-button>
                    <b-button size="xs" variant="outline-secondary" class="mt-3" @click="cancelReplies()">취소</b-button>
                  </b-form>
                </template>
              </td>
            </tr>
            <!--댓글리스트-->
            <template v-if="resultContacts.comments">
              <template v-for="(comment, idx) in resultContacts.comments">
                <tr style="border-top:1px solid #d7d7d7" :key="comment.id">
                  <td class="align-top pr-3 pt-3">
                    <b-badge class="float-right" size="xs" pill variant="success" v-if="comment.type === 0">재문의</b-badge>
                    <b-badge class="float-right" size="xs" pill variant="primary" v-if="comment.type === 1">재답변</b-badge>
                  </td>
                  <td class="pr-3 pt-3 pb-1">
                    <!--마지막을 제외한 댓글-->
                    <template v-if="idx < resultContacts.comments.length -1">
                      <span class="d-inline-block mb-2 font-weight-semibold">
                        {{ comment.user.name }} / {{ comment.updated_at }}
                      </span>
                      <p style="white-space: pre-line">{{comment.content}}</p>
                    </template>
                    <!--마지막 댓글-->
                    <template v-else-if="idx == resultContacts.comments.length -1">
                      <!--댓글수정클릭시-->
                      <template v-if="vModel.commentState == 'edit'">
                        <b-form @submit.prevent="doneComments(comment.id)">
                          <b-form-textarea rows="2"
                                           max-rows="6"
                                           v-model="vModel.commentEdit"
                                           no-resize
                                           required
                                           :state="commentEditValidation">
                          </b-form-textarea>
                          <b-form-invalid-feedback :state="commentEditValidation" class="text-left">
                            3자 이상 입력하세요.
                          </b-form-invalid-feedback>
                          <b-button size="xs" variant="outline-info" class="mr-1 mt-3" type="submit">수정</b-button>
                          <b-button size="xs" variant="outline-secondary" class="mt-3" @click="cancelComments()">취소</b-button>
                        </b-form>
                      </template>
                      <!--댓글수정아닐때-->
                      <template v-else>
                        <span class="d-inline-block mb-2 font-weight-semibold">
                          {{ comment.user.name }} / {{ comment.updated_at }}
                        </span>
                        <p style="white-space: pre-line">{{comment.content}}</p>
                        <!--본인댓글만-->
                        <b-button v-if="currentUser.title == comment.user.name"
                                  class="mr-1"
                                  size="xs"
                                  variant="outline-info"
                                  @click="modifyComments()">수정
                        </b-button>
                        <!--관리자가쓴글만-->
                        <b-button v-if="currentUser.level > 199 && comment.type == 1"
                                  size="xs"
                                  variant="outline-danger"
                                  @click="deleteComments(comment.id)">삭제
                        </b-button>
                      </template>
                    </template>
                  </td>
                </tr>
              </template>
            </template>
            </tbody>
          </table>
          </template>
          <table cellpadding="0" cellspacing="0" class="w-100 mt-3">
            <colgroup>
              <col width="80" />
              <col width="" />
            </colgroup>
            <tbody>
            <!--답변쓰기
                답변없고 관리자만-->
            <tr v-if="resultContacts.answer_content == null && currentUser.level > 99"
                style="border-top:1px solid #d7d7d7">
              <td class="align-top pr-3 pt-3">
                <p class="float-right" style="margin-top:4px">답변</p>
              </td>
              <td class="pr-3 pt-3">
                <b-form @submit.prevent="createReplies">
                  <b-form-radio-group class="mb-1"
                                      v-model="vModel.contactViewState"
                                      :options="response.contactStateOptions"
                                      required
                  ></b-form-radio-group>
                  <b-form-textarea rows="2"
                                   max-rows="6"
                                   v-model="vModel.repliesForm"
                                   no-resize
                                   required
                                   :state="repliesValidation">
                  </b-form-textarea>
                    <b-form-invalid-feedback :state="repliesValidation" class="text-left">
                      3자 이상 입력하세요.
                    </b-form-invalid-feedback>
                  <b-button class="mt-3" size="xs" variant="outline-info" type="submit">등록</b-button>
                </b-form>
              </td>
            </tr>
            <!--일반계정댓글쓰기
                답변있고 일반계정만-->
            <tr v-if="resultContacts.answer_user_id && currentUser.level < 100"
                style="border-top:1px solid #d7d7d7">
              <td class="align-top pr-3 pt-3">
                <p class="float-right">재문의</p>
              </td>
              <td class="pr-3 pt-3">
                <b-form @submit.prevent="createComments">
                  <b-form-textarea rows="2"
                                   max-rows="6"
                                   v-model="vModel.commentForm"
                                   no-resize
                                   required
                                   :state="commentValidation">
                  </b-form-textarea>
                  <b-form-invalid-feedback :state="commentValidation" class="text-left">
                    3자 이상 입력하세요.
                  </b-form-invalid-feedback>
                  <b-button class="mt-3" size="xs" variant="outline-info" type="submit">등록</b-button>
                </b-form>
              </td>
            </tr>
            <!--관리자댓글쓰기
                댓글있고 관리자만-->
            <tr v-if="resultContacts.comments.length > 0 && currentUser.level > 99"
                style="border-top:1px solid #d7d7d7">
              <td class="align-top pr-3 pt-3">
                <p class="float-right">재답변</p>
              </td>
              <td class="pr-3 pt-3">
                <b-form @submit.prevent="createComments">
                  <b-form-textarea rows="2"
                                   max-rows="6"
                                   v-model="vModel.commentForm"
                                   no-resize
                                   required
                                   :state="commentValidation">
                  </b-form-textarea>
                  <b-form-invalid-feedback :state="commentValidation" class="text-left">
                    3자 이상 입력하세요.
                  </b-form-invalid-feedback>
                  <b-button class="mt-3" size="xs" variant="outline-info" type="submit">등록</b-button>
                </b-form>
              </td>
            </tr>
            </tbody>
          </table>
          </template>
        </b-card>
        <div class="text-center">
          <b-button variant="outline-danger" @click="beforePage()">목록으로</b-button>
        </div>
      </b-colxx>
    </b-row>
    <div class="spinner-background" v-show="response.spinner">
      <b-spinner variant="info"></b-spinner>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      response: {
        spinner: true,
        contact_id: this.$route.params.contact_id,
        contacts: null,
        statuses: null,
        contactsStatuses: null,
        contactsReplies: null,
        contactsComments: null,
        contactStateOptions: []
      },
      vModel: {
        contactViewState: null,
        repliesEdit: '',
        repliesForm: '',
        repliesState: '',
        commentEdit: '',
        commentForm: '',
        commentState: '',
        validation: '',
        commentVal: '',
        commentEditVal: ''
      }
    }
  },
  created () {
    this.contactsPath()
    this.getContactViews()
    this.getCodesStatuses()
  },
  methods: {
    ...mapActions(['xhttp']),
    contactsPath: function () {
      if (this.$route.path === '/customer/contacts/create') {
        this.$router.push('/customer/contacts')
      }
    },
    getContactViews: function () {
      this.response.spinner = true
      this.xhttp({
        url: 'contacts/' + this.response.contact_id,
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.contacts = response.data
          // 상태가 접수일때 답변 radio 처리중 디폴트값
          if (response.data.data.state.id === 2) {
            this.vModel.contactViewState = 3
          }
          // 답변있으면
          if (response.data.data.answer_content) {
            this.vModel.repliesEdit = response.data.data.answer_content
            this.vModel.contactViewState = response.data.data.state.id
            // 댓글있으면
            if (response.data.data.comments.length > 0) {
              var commentLastNum = response.data.data.comments.length - 1
              this.vModel.commentEdit = response.data.data.comments[commentLastNum].content
            }
          }
          this.respSuccess()
        }
      }).catch((error) => {
        this.response.contacts = error.response
        this.respError(error)
      })
    },
    getCodesStatuses: function () {
      this.xhttp({
        url: 'contacts/statuses',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.statuses = response.data
          for (var i = 2; i < response.data.length; i++) {
            this.response.contactStateOptions.push(
              { text: response.data[i].name, value: response.data[i].id }
            )
          }
        }
      }).catch((error) => {
        this.response.statuses = error.response
        this.respError(error)
      })
    },
    putContactStatuses: function () {
      let send = {
        contact_status_id: 2
      }
      this.xhttp({
        url: 'contacts/' + this.response.contact_id + '/statuses',
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.contactsStatuses = response.data
          this.getContactViews()
          this.$Progress.finish()
        }
      }).catch((error) => {
        this.response.contactsStatuses = error.response
        this.respError(error)
      })
    },
    createReplies () {
      this.vModel.validation = 'on'
      if (this.vModel.contactViewState !== null && this.vModel.repliesForm.length > 2) {
        this.vModel.repliesEdit = this.vModel.repliesForm
        this.vModel.repliesState = 'done'
        this.postContactsReplies()
      } else if (this.vModel.contactViewState === null) {
        this.$notify('error', '오류', '문의 접수 후 답변 등록하세요.')
      }
    },
    modifyReplies () {
      this.vModel.repliesState = 'edit'
    },
    doneReplies () {
      this.vModel.validation = 'on'
      if (this.vModel.repliesEdit.length > 2) {
        this.vModel.repliesState = 'done'
        this.postContactsReplies()
      }
    },
    cancelReplies () {
      this.vModel.repliesEdit = this.response.contacts.data.answer_content
      this.vModel.repliesState = 'done'
      this.vModel.validation = ''
    },
    createComments () {
      this.vModel.commentVal = 'on'
      if (this.vModel.commentForm.length > 2) {
        this.vModel.commentEdit = this.vModel.commentForm
        this.vModel.commentState = 'done'
        this.getCommentCreate()
      }
    },
    modifyComments () {
      this.vModel.commentState = 'edit'
    },
    doneComments (id) {
      this.vModel.commentEditVal = 'on'
      if (this.vModel.commentEdit.length > 2) {
        this.vModel.commentState = 'done'
        this.putContactsCommentsEdit(id)
      }
    },
    cancelComments () {
      var comment = this.resultContacts.comments
      this.vModel.commentEdit = comment[comment.length - 1].content
      this.vModel.commentState = 'done'
      this.vModel.commentEditVal = ''
    },
    deleteComments (id) {
      if (confirm('삭제 하겠습니까?')) {
        this.deleteContactsComments(id)
      }
    },
    postContactsReplies: function () {
      let send = {
        answer_content: this.vModel.repliesEdit,
        contact_status_id: this.vModel.contactViewState
      }
      this.xhttp({
        url: 'contacts/' + this.response.contact_id + '/replies',
        method: 'post',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.contactsReplies = response.data
          this.$notify('primary', '등록 완료', '등록 완료되었습니다.')
          this.getContactViews()
        }
      }).catch((error) => {
        this.response.contactsReplies = error.response
        this.respError(error)
      })
    },
    getCommentCreate: function () {
      let send = {
        content: this.vModel.commentEdit
      }
      this.xhttp({
        url: 'contacts/' + this.response.contact_id + '/comments/create',
        method: 'get',
        params: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.contactsComments = response.data
          this.$notify('primary', '등록 완료', '등록 완료되었습니다.')
          this.getContactViews()
          this.vModel.commentForm = ''
          this.vModel.commentVal = ''
        }
      }).catch((error) => {
        this.response.contactsComments = error.response
        this.respError(error)
      })
    },
    putContactsCommentsEdit: function (id) {
      let send = {
        content: this.vModel.commentEdit
      }
      this.xhttp({
        url: 'contacts/' + this.response.contact_id + '/comments/' + id,
        method: 'put',
        data: send
      }).then((response) => {
        if (response.status === 200) {
          this.response.contactsComments = response.data
          this.$notify('primary', '수정 완료', '수정 완료되었습니다.')
          this.getContactViews()
        }
      }).catch((error) => {
        this.response.contactsComments = error.response
        this.respError(error)
      })
    },
    deleteContactsComments: function (id) {
      this.xhttp({
        url: 'contacts/' + this.response.contact_id + '/comments/' + id,
        method: 'delete',
        data: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.contactsComments = response.data
          this.$notify('primary', '삭제 완료', '삭제 완료되었습니다.')
          this.getContactViews()
        }
      }).catch((error) => {
        this.response.contactsComments = error.response
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
  computed: { // 처음에 뿌려주는 값
    resultContacts () {
      if (this.response.contacts && this.response.contacts.success === true && this.response.contacts.data) {
        return this.response.contacts.data
      } else {
        return false
      }
    },
    resultStatuses () {
      if (this.response.statuses && this.response.statuses.success === true && this.response.statuses.data.length > 0) {
        return this.response.statuses.data
      } else {
        return false
      }
    },
    repliesValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.repliesForm.length > 2
      } else {
        return ''
      }
    },
    repliesEditValidation () {
      if (this.vModel.validation === 'on') {
        return this.vModel.repliesEdit.length > 2
      } else {
        return ''
      }
    },
    commentValidation () {
      if (this.vModel.commentVal === 'on') {
        return this.vModel.commentForm.length > 2
      } else {
        return ''
      }
    },
    commentEditValidation () {
      if (this.vModel.commentEditVal === 'on') {
        return this.vModel.commentEdit.length > 2
      } else {
        return ''
      }
    },
    ...mapGetters({
      currentUser: 'currentUser'
    })
  }
}
</script>
