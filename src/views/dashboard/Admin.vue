<template>
  <div v-if="response.Admin">
    <b-row>
      <b-colxx xxs="12">
        <h5 class="mb-4 card-title"># 요청 현황</h5>
        <b-row class="icon-cards-row mb-3">
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectOrder('DRAFT')">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="iconsminds-scale"></i>
                  <p class="card-text font-weight-semibold mb-0">광고 그룹 미승인 건수</p>
                  <p class="lead text-center">{{this.numReplace(response.Admin.data.requests.waitApproveOrderCount)}}</p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectOrder('LI_DRAFT')">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="iconsminds-scale"></i>
                  <p class="card-text font-weight-semibold mb-0">광고 미승인 건수</p>
                  <p class="lead text-center">{{this.numReplace(response.Admin.data.requests.waitApproveLineItemCount)}}</p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectOrder('LI_END_SOON')"
                    v-b-tooltip.html title="<b>종료 예정 광고 건수</b><br />: 광고 종료일이 5일내에 있는 광고 건수 ">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="iconsminds-scale"></i>
                  <p class="card-text font-weight-semibold mb-0">종료 예정 광고 건수</p>
                  <p class="lead text-center text-danger">{{this.numReplace(response.Admin.data.requests.endSoonLineItemCount)}}</p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectRefunds">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="iconsminds-money-bag"></i>
                  <p class="card-text font-weight-semibold mb-0">포인트 환불 요청 건수</p>
                  <p class="lead text-center">{{this.numReplace(response.Admin.data.requests.waitRefundCount)}}</p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectContacts">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="simple-icon-question"></i>
                  <p class="card-text font-weight-semibold mb-0">1:1 문의 미답변 건수</p>
                  <p class="lead text-center">{{this.numReplace(response.Admin.data.requests.waitContactCount)}}</p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
        </b-row>
      </b-colxx>
    </b-row>

    <b-row>
      <b-colxx xxs="12">
        <h5 class="mb-4 card-title"># 운영 현황</h5>
        <b-row class="icon-cards-row mb-3">
          <b-colxx xxs="6" sm="4" md="3" lg="2"
                   v-b-tooltip.html title="<b>광고 '게재 중' 건수</b><br />: 금일 현재까지 보고서 실적이 발생한 광고의 수(금일 신규 게재 중인 광고 수) / 광고가 승인되어 현재 게재가 가능한 광고의 수">
            <b-link @click.prevent="redirectOrder('LI_DELIVERING')">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="iconsminds-scale"></i>
                  <p class="card-text font-weight-semibold mb-0">광고 '게재 중' 건수</p>
                  <p class="lead text-center">
                    {{this.numReplace(response.Admin.data.lineItemDelivery.today.totalDeliveryCount)}}({{parseInt(response.Admin.data.lineItemDelivery.today.newDeliveryCount)}})
                    / {{parseInt(response.Admin.data.lineItemDelivery.today.totalDeliveryCount) + parseInt(response.Admin.data.lineItemDelivery.today.completedCount)}}
                  </p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectReportCreativeIndex"
                    v-b-tooltip.html title="<b>금일 집행 포인트 = 수익</b><br />: 금일 현재까지 집행되 소진된 포인트의 합">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="iconsminds-money-bag"></i>
                  <p class="card-text font-weight-semibold mb-0">금일 집행 포인트</p>
                  <p class="lead text-center">{{this.numReplace(response.Admin.data.points.today.revenue)}}</p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2"
                   v-b-tooltip.html title="<b>금일 사용 포인트</b><br />: 금일 현재까지 광고에 신규 혹은 추가로 할당된 포인트의 합 ">
            <div class="icon-row-item text-center">
              <b-card>
                <i class="iconsminds-money-bag"></i>
                <p class="card-text font-weight-semibold mb-0">금일 사용 포인트</p>
                <p class="lead text-center">{{this.numReplace(response.Admin.data.points.today.point_usese)}}</p>
              </b-card>
            </div>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2"
            v-b-tooltip.html title="<b>금일 결제 금액 = 포인트 충전</b><br />: 금일 현재까지 실제 결제(=가상계좌)가 발생한 금액의 합" >
            <div class="icon-row-item text-center">
              <b-card>
                <i class="iconsminds-money-bag"></i>
                <p class="card-text font-weight-semibold mb-0">금일 결제 금액</p>
                <p class="lead text-center">{{this.numReplace(response.Admin.data.points.today.cash_charges)}}</p>
              </b-card>
            </div>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectRefundHistory">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="simple-icon-refresh"></i>
                  <p class="card-text font-weight-semibold mb-0">금일 환불 금액</p>
                  <p class="lead text-center">{{this.numReplace(response.Admin.data.points.today.cash_refunds)}}</p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
        </b-row>

        <b-row class="icon-cards-row mb-3">
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectOrder('LI_READY')">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="iconsminds-scale"></i>
                  <p class="card-text font-weight-semibold mb-0">광고 '준비' 건수</p>
                    <p class="lead text-center">
                      <template v-if="response.Admin.data.adBuying.lineItems.READY">
                        {{this.numReplace(response.Admin.data.adBuying.lineItems.READY)}}
                      </template>
                      <template v-else>0</template>
                    </p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectOrder('LI_COMPLETED_TODAY')">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="iconsminds-scale"></i>
                  <p class="card-text font-weight-semibold mb-0">광고 '완료' 건수</p>
                  <p class="lead text-center">{{this.numReplace(response.Admin.data.lineItemDelivery.today.completedCount)}}</p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectOrder('LI_DELIVERING_VIDEO')">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="iconsminds-scale"></i>
                  <p class="card-text font-weight-semibold mb-0">동영상 광고 '게재 중' 건수</p>
                  <p class="lead text-center">{{this.numReplace(response.Admin.data.requests.videoLineItemCount)}}</p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
        </b-row>

        <b-row class="icon-cards-row mb-3 mt-4">
          <b-colxx xxs="9" lg="6" class="mb-4">
            <h6 class="card-subtitle">* 최근 7일간 인벤토리 크기별 노출 평균 비율(%)</h6>
            <div class="chart-container">
              <doughnut-chart :data="impressionPctChartData" :height="300"/>
            </div>
          </b-colxx>

          <b-colxx xxs="9" lg="6" class="mb-4">
            <h6 class="card-subtitle">* 최근 7일간 인벤토리 크기별 클릭 평균 비율(%)</h6>
            <div class="chart-container">
              <doughnut-chart :data="clickPctChartData" :height="300"/>
            </div>
          </b-colxx>
        </b-row>
      </b-colxx>
    </b-row>

    <b-row v-if="response.Admin">
      <b-colxx xxs="12">
        <h5 class="mb-4 card-title"># 전일 요약</h5>
        <b-row class="icon-cards-row mb-3">
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectOrder('LI_DELIVERING')"
                    v-b-tooltip.html title="<b>전일 광고 게재 건수</b><br />: 보고서 실적이 발생한 광고의 건수(전일 신규 게재한 광고 건수)">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="iconsminds-scale"></i>
                  <p class="card-text font-weight-semibold mb-0">전일 광고 게재 건수</p>
                  <p class="lead text-center">
                    {{this.numReplace(response.Admin.data.lineItemDelivery.yesterday.totalDeliveryCount)}}({{parseInt(response.Admin.data.lineItemDelivery.yesterday.newDeliveryCount)}})
                  </p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectOrder('LI_COMPLETED')">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="iconsminds-scale"></i>
                  <p class="card-text font-weight-semibold mb-0">전일 광고 완료 건수</p>
                  <p class="lead text-center">
                    {{this.numReplace(response.Admin.data.lineItemDelivery.yesterday.completedCount)}}
                  </p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectReportCreativeIndex"
              v-b-tooltip.html title="<b>전일 집행 포인트 = 수익</b><br />: 전일 집행되 소진된 포인트의 합">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="iconsminds-money-bag"></i>
                  <p class="card-text font-weight-semibold mb-0">전일 집행 포인트</p>
                  <p class="lead text-center">{{this.numReplace(response.Admin.data.points.yesterday.revenue)}}</p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2"
                   v-b-tooltip.html title="<b>전일 사용 포인트</b><br />: 전일 광고에 신규 혹은 추가로 할당된 포인트의 합 ">
            <div class="icon-row-item text-center">
              <b-card>
                <i class="iconsminds-money-bag"></i>
                <p class="card-text font-weight-semibold mb-0">전일 사용 포인트</p>
                <p class="lead text-center">{{this.numReplace(response.Admin.data.points.yesterday.point_usese)}}</p>
              </b-card>
            </div>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2"
                   v-b-tooltip.html title="<b>전일 결제 금액 = 포인트 충전</b><br />: 전일 실제 결제(=가상계좌)가 발생한 금액의 합">
            <div class="icon-row-item text-center">
              <b-card>
                <i class="iconsminds-money-bag"></i>
                <p class="card-text font-weight-semibold mb-0">전일 결제 금액</p>
                <p class="lead text-center">{{this.numReplace(response.Admin.data.points.yesterday.cash_charges)}}</p>
              </b-card>
            </div>
          </b-colxx>
          <b-colxx xxs="6" sm="4" md="3" lg="2">
            <b-link @click.prevent="redirectRefundHistory">
              <div class="icon-row-item text-center">
                <b-card>
                  <i class="simple-icon-refresh"></i>
                  <p class="card-text font-weight-semibold mb-0">전일 환불 금액</p>
                  <p class="lead text-center">{{this.numReplace(response.Admin.data.points.yesterday.cash_refunds)}}</p>
                </b-card>
              </div>
            </b-link>
          </b-colxx>
        </b-row>
      </b-colxx>
    </b-row>
    <div class="spinner-background" v-show="response.spinner">
      <b-spinner variant="info"></b-spinner>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import DoughnutChart from '@/components/Charts/Doughnut'

export default {
  components: {
    DoughnutChart
  },
  created () {
    this.getDashboard()
  },
  data () {
    return {
      response: {
        spinner: true,
        Admin: null
      },
      chartDataTemplate: {
        labels: ['Cakes', 'Cupcakes', 'Desserts'],
        datasets: [
          {
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2,
            data: [15, 25, 20]
          }
        ]
      },
      impressionPctChartData: { },
      clickPctChartData: { }
    }
  },
  methods: {
    ...mapActions(['xhttp']),
    numReplace: function (num) {
      num = (num + '').split('.')
      const result = num[0].replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      if (num[1]) {
        return result + '.' + num[1]
      } else {
        return result
      }
    },
    getDashboard: function () {
      this.xhttp({
        url: 'report/admin',
        method: 'get',
        params: null
      }).then((response) => {
        if (response.status === 200) {
          this.response.Admin = response.data
          if (response.data.data === null) {
            this.response.Admin = null
            this.$notify('error', '데이터 없음', '데이터가 없습니다.')
          }

          // Chart data bind!
          this.impressionPctChartData = JSON.parse(JSON.stringify(this.chartDataTemplate))
          this.impressionPctChartData.labels = this.response.Admin.data.charts.impressionPctByInventorySizese.labels
          this.impressionPctChartData.datasets[0].data = this.response.Admin.data.charts.impressionPctByInventorySizese.data

          this.clickPctChartData = JSON.parse(JSON.stringify(this.chartDataTemplate))
          this.clickPctChartData.labels = this.response.Admin.data.charts.clickPctByInventorySizese.labels
          this.clickPctChartData.datasets[0].data = this.response.Admin.data.charts.clickPctByInventorySizese.data

          this.response.spinner = false
          this.$Progress.finish()
        }
      // eslint-disable-next-line handle-callback-err
      }).catch((error) => {
        // this.response.Admin = error.response
        this.response.spinner = false
        this.$Progress.finish()
        this.$router.go(-1)
      })
    },
    redirectOrder (status) {
      this.$router.push({ name: 'orderIndex', params: { advertiser_id: 'me' }, query: { search_status: status } })
    },
    redirectRefunds () {
      this.$router.push({ name: 'pointRefundIndex' })
    },
    redirectRefundHistory () {
      this.$router.push({ name: 'pointRefundHistory' })
    },
    redirectContacts () {
      this.$router.push({ name: 'contactsIndex', query: { contact_status_id: 1 } })
    },
    redirectReportCreativeIndex () {
      this.$router.push({ name: 'reportCreativeIndex' })
    },
    /**
     * 숫자 값 콤마 포멧팅
     * @param value
     * @returns {string|number}
     */
    toNumberFormat (value) {
      let num = parseFloat(value)
      if (isNaN(num) || num === 0) {
        return 0
      }

      let reg = /(^[+-]?\d+)(\d{3})/
      let n = (num + '')

      while (reg.test(n)) {
        n = n.replace(reg, '$1' + ',' + '$2')
      }

      return n
    }
  }
}
</script>
