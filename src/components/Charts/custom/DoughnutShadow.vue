<script>
import Chart from 'chart.js'
import { generateChart } from 'vue-chartjs'
import { doughnutChartOptions } from '../config'
import { ThemeColors, chartTooltip, centerTextPlugin } from '@/utils'
const colors = ThemeColors()

Chart.defaults.doughnutWithShadow = Chart.defaults.doughnut
Chart.controllers.doughnutWithShadow = Chart.controllers.doughnut.extend({
  draw: function (ease) {
    Chart.controllers.doughnut.prototype.draw.call(this, ease)
    let ctx = this.chart.chart.ctx
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.15)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 10
    ctx.responsive = true
    Chart.controllers.doughnut.prototype.draw.apply(this, arguments)
    ctx.restore()
  }
})

const DoughnutShadow = generateChart('doughnut-with-shadow', 'doughnutWithShadow')

export default {
  extends: DoughnutShadow,
  props: ['data', 'chartLabels', 'chartValues'],
  data () {
    return {
      options: doughnutChartOptions
    }
  },
  methods: {
    renderCustomChart (labels, values) {
      this.addPlugin(centerTextPlugin)
      this.renderChart({
        labels: labels,
        datasets: [
          {
            data: values,
            borderWidth: 2,
            borderColor: [colors.themeColor1, colors.themeColor2, colors.themeColor3, colors.themeColor4, colors.themeColor5],
            backgroundColor: [
              colors.themeColor1_10,
              colors.themeColor2_10,
              colors.themeColor3_10,
              colors.themeColor4_10,
              colors.themeColor5_10
            ]
          }
        ]
      }, {
        legend: {
          position: 'bottom',
          labels: {
            padding: 30,
            usePointStyle: true,
            fontSize: 12
          },
          display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false
        },
        cutoutPercentage: 80,
        layout: {
          padding: {
            bottom: 20
          }
        },
        tooltips: chartTooltip
      })
    }
  },
  watch: {
    chartLabels () {
      this.renderCustomChart(this.chartLabels, this.chartValues)
    }
  }
}
</script>
