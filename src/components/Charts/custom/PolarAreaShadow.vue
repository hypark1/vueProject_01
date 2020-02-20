<script>
import Chart from 'chart.js'
import { generateChart } from 'vue-chartjs'

import { polarAreaChartOptions } from '../config'
import { ThemeColors } from '@/utils'
const colors = ThemeColors()

Chart.defaults.polarWithShadow = Chart.defaults.polarArea
Chart.controllers.polarWithShadow = Chart.controllers.polarArea.extend({
  draw: function (ease) {
    Chart.controllers.radar.prototype.draw.call(this, ease)
    let ctx = this.chart.chart.ctx
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.2)'
    ctx.shadowBlur = 7
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 7
    ctx.responsive = true
    Chart.controllers.radar.prototype.draw.apply(this, arguments)
    ctx.restore()
  }
})

const PolarAreaShadow = generateChart('polar-with-shadow', 'polarWithShadow')

export default {
  extends: PolarAreaShadow,
  props: ['data', 'chartLabels', 'chartValues'],
  data () {
    return {
      options: polarAreaChartOptions
    }
  },
  methods: {
    renderCustomChart(labels, values) {
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
      }, this.options)
    }
  },
  watch: {
    chartLabels () {
      this.renderCustomChart(this.chartLabels, this.chartValues)
    }
  }
}
</script>
