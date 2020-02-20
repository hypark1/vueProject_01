<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="애드빌더"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4 col-6 float-left">
          <b-table class="text-center"
                   striped
                   show-empty
                   :items="files1"
                   :fields="contactsField">
            <template slot="empty">
              리스트가 없습니다.
            </template>
            <template slot="thumb" slot-scope="data">
              <b-img :src="data.value"/>
            </template>
            <template slot="type" slot-scope="data">
              {{data.value.split('/')[1]}}
            </template>
            <template slot="size" slot-scope="data">
              {{byteToSize(data.value)}}
            </template>
          </b-table>
          <file-upload
            class="btn btn-primary"
            ref="upload"
            v-model="files1"
            input-id="file1"
            post-action="/api/builder/2/parallaxUpload/new"
            @input-file="inputFile1"
            @input-filter="inputFilter1"
          >
            파일 업로드
          </file-upload>
          <b-button variant="light" @click="files1 = []">취소</b-button>
          <b-button variant="success" @click.prevent="$refs.upload.active = true">업로드</b-button>
        </b-card>
        <b-card class="mb-4 col-6">
          <b-table class="text-center"
                   striped
                   show-empty
                   :items="files2"
                   :fields="contactsField">
            <template slot="empty">
              리스트가 없습니다.
            </template>
            <template slot="thumb" slot-scope="data">
              <b-img :src="data.value"/>
            </template>
            <template slot="type" slot-scope="data">
              {{data.value.split('/')[1]}}
            </template>
            <template slot="size" slot-scope="data">
              {{byteToSize(data.value)}}
            </template>
          </b-table>
          <file-upload
            class="btn btn-primary"
            ref="upload2"
            v-model="files2"
            input-id="file2"
            post-action="/api/builder/check"
            :drop="true"
            :drop-directory="true"
            @input-file="inputFile2"
            @input-filter="inputFilter2"
          >
            파일 업로드
          </file-upload>
          <b-button variant="light" @click="files2 = []">취소</b-button>
          <b-button variant="success" @click.prevent="$refs.upload2.active = true">업로드</b-button>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import FileUpload from 'vue-upload-component'

export default {
  components: {
    FileUpload
  },
  data () {
    return {
      files1: [],
      files2: [],
      contactsField: {
        name: { label: '파일명', sortable: true },
        thumb: { label: '이미지' },
        type: { label: '확장자' },
        size: { label: '크기' },
        width: { label: '가로' },
        height: { label: '세로' }
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    inputFile1: function (newFile, oldFile, prevent) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        console.log('response', newFile.response)
        if (newFile.xhr) {
          console.log('status', newFile.xhr.status)
        }
      }
    },
    inputFile2: function (newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        console.log('response', newFile.response)
        if (newFile.xhr) {
          console.log('status', newFile.xhr.status)
        }
        // Upload progress
        if (newFile.progress !== oldFile.progress) {
          console.log('progress', newFile.progress, newFile)
        }

        // Upload error
        if (newFile.error !== oldFile.error) {
          console.log('error', newFile.error, newFile)
        }

        // Uploaded successfully
        if (newFile.success !== oldFile.success) {
          console.log('success', newFile.success, newFile)
        }
      }
    },
    /**
     * Pretreatment
     * @param  Object|undefined   newFile   读写
     * @param  Object|undefined   oldFile   只读
     * @param  Function           prevent   阻止回调
     * @return undefined
     */
    inputFilter1: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(jpeg|jpg|png|mp4)$/i.test(newFile.name)) {
          return prevent()
        }

        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }

        // Thumbnails
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }

        // 이미지 width, height
        newFile.width = ''
        newFile.height = ''
        let img = new Image()
        img.src = newFile.thumb
        img.onload = function () {
          newFile.width = img.width
          newFile.height = img.height
        }
      }
    },
    inputFilter2: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(jpeg|jpe|jpg|gif|png|webp|mp4)$/i.test(newFile.name)) {
          return prevent()
        }
      }

      newFile.blob = ''
      let URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file)
      }

      // Thumbnails
      newFile.thumb = ''
      if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
        newFile.thumb = newFile.blob
      }

      // 이미지 width, height
      newFile.width = ''
      newFile.height = ''
      let img = new Image()
      img.src = newFile.thumb
      img.onload = function () {
        // here you got the width and height
        newFile.width = img.width
        newFile.height = img.height
      }
    },
    byteToSize (value) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (value === 0) return '0 Byte'
      var i = parseInt(Math.floor(Math.log(value) / Math.log(1024)))
      return (value / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
    }
  }
}
</script>
