<template>
  <div ref="chartContainer" class="cart-chart"></div>
</template>

<script setup>
/**
 * 购物车数据可视化组件
 * [CONCEPT] 使用 ECharts 绘制饼图展示商品数量分布
 * [PATTERN] 组合式API，响应式更新
 * [PERF] 使用防抖优化窗口resize事件处理
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useCartStore } from '../stores/cart'
import * as echarts from 'echarts'
import debounce from 'lodash/debounce'

// 图表容器引用
const chartContainer = ref(null)
// 图表实例
let chartInstance = null

// 购物车 store
const cartStore = useCartStore()

/**
 * 初始化图表
 */
const initChart = () => {
  if (!chartContainer.value) return
  
  // 创建图表实例
  chartInstance = echarts.init(chartContainer.value)
  
  // 更新图表数据
  updateChart()
  
  // 监听窗口大小变化，自适应调整图表大小
  window.addEventListener('resize', handleResize)
}

/**
 * 处理窗口大小变化
 * [PERF] 使用防抖优化resize事件处理
 */
const handleResize = debounce(() => {
  chartInstance?.resize()
}, 100)

/**
 * 更新图表数据和配置
 */
const updateChart = () => {
  if (!chartInstance) return
  
  // 准备图表数据
  const chartData = cartStore.items.map(item => ({
    name: item.name,
    value: item.quantity
  }))
  
  // 设置图表配置项
  const options = {
    title: {
      text: '购物车商品数量分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '商品数量',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}件 ({d}%)'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        data: chartData
      }
    ]
  }
  
  // 更新图表
  chartInstance.setOption(options)
}

// 监听购物车数据变化
watch(
  () => cartStore.items,
  () => updateChart(),
  { deep: true }
)

// 组件挂载时初始化图表
onMounted(() => {
  initChart()
})

// 组件卸载时清理资源
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.cart-chart {
  width: 100%;
  height: 400px;
}
</style>
