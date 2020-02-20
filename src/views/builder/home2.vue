<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Home"/>
        <div class="mb-2 mt-2">
          <div class="separator mb-5"></div>
        </div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx>
        <b-card>
          <div class="col-8 float-left">
            <table class="table b-table text-center table-bordered" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <th>형태</th>
                  <td>
                    <b-form-group class="m-0">
                      <b-form-select v-model="vModel.format_type"
                                     :options="response.formatOptions"
                                     style="width:200px"
                                     class="mr-2"
                                     plain required>
                      </b-form-select>
                    </b-form-group>
                  </td>
                </tr>
                <tr>
                  <th>미리보기</th>
                  <td class="text-left">
                    <div class="adBuilder_mobile d-inline-block">
                    </div>
                    <div class="d-inline-block ml-4 mt-4 align-top">
                      <div v-html="format.NativeBanner"></div>
                      <b-button variant="info" class="mt-3" @click="startBuild()">Start Building</b-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      response: {
        formatOptions: [
          { text: 'Native Banner', value: '1' }
        ]
      },
      vModel: {
        format_type: '1'
      },
      search: '',
      format: {
        NativeBanner: `<h5>Main Image Spec</h5>
                      <p>- Image formats: JPG, JPEG, GIF, PNG<br>
                        - Image height: 458 pixels<br>
                        - Image width: 720 pixels<br>
                        - Max image file size: 200KB<br>
                        - Image set: Maximum 5er
                      </p>
                      <h5>Text Box</h5>
                      <p>- Title Limit: 30 Characters (Korean)<br>
                        - Summary Limit: 60 Characters (Korean)
                      </p>
                      <h5>CTA Destination URL</h5>
                      <p>- Required</p>`
      }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    startBuild () {
      this.$router.push({ name: 'adBuilderNativeVOD' })
    }
  }
}
</script>
