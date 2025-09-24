<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import type { Song } from "@/types/song";
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  PointElement,
  LineElement,
  PieController,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend
} from 'chart.js';
import { useColorModeStore } from "@/stores/color-mode.ts";
import { storeToRefs } from "pinia";

// Register Chart.js components
Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  PointElement,
  LineElement,
  PieController,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend
);

const props = defineProps<{ allSongs: Song[] }>();
const { isDark } = storeToRefs(useColorModeStore())

// Reactive references
const selectedYear = ref<string>('all');
const selectedSeasonYear = ref<string>('all');
const barChartRef = ref<HTMLCanvasElement>();
const lineChartRef = ref<HTMLCanvasElement>();
const pieChartRef = ref<HTMLCanvasElement>();
const doughnutChartRef = ref<HTMLCanvasElement>();

// Chart instances
let barChart: Chart | null = null;
let lineChart: Chart | null = null;
let pieChart: Chart | null = null;
let doughnutChart: Chart | null = null;

// Available years for dropdown
const availableYears = computed(() => {
  const years = new Set<number>();
  props.allSongs.forEach(song => {
    const year = new Date(song.ref_video_publish_date_ts * 1000).getFullYear();
    years.add(year);
  });
  return Array.from(years).sort((a, b) => b - a);
});

// Function to get season from month
const getSeason = (month: number): string => {
  if (month >= 3 && month <= 5) return '春';
  if (month >= 6 && month <= 8) return '夏';
  if (month >= 9 && month <= 11) return '秋';
  return '冬';
};

// Predefined color palettes to avoid color clashes
const colorPalettes = {
  barChart: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#A3CB38', '#ED4C67', '#B53471', '#EE5A24', '#C4E538',
    '#12CBC4', '#FDA7DF', '#D980FA', '#9980FA', '#5758BB',
    '#F79F1F', '#A3CB38', '#1289A7', '#D980FA', '#B53471',
    '#FFC312', '#C4E538', '#12CBC4', '#FDA7DF', '#ED4C67'
  ],
  seasonal: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'], // Spring, Summer, Autumn, Winter
  yearly: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
  ],
  lineChart: '#FF6B6B'
};

// 1. Top 30 songs by year (Bar Chart)
const topSongsData = computed(() => {
  const filteredSongs = selectedYear.value === 'all'
    ? props.allSongs
    : props.allSongs.filter(song => {
      const year = new Date(song.ref_video_publish_date_ts * 1000).getFullYear();
      return year.toString() === selectedYear.value;
    });

  // Count songs by title
  const songCounts: { [key: string]: number } = {};
  filteredSongs.forEach(song => {
    songCounts[song.song_title] = (songCounts[song.song_title] || 0) + 1;
  });

  // Get top 30
  const topSongs = Object.entries(songCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 30);

  return {
    labels: topSongs.map(([title]) => title),
    counts: topSongs.map(([, count]) => count)
  };
});

// 2. Monthly song counts (Line Chart)
const monthlyData = computed(() => {
  const monthlyCounts: { [key: string]: number } = {};

  props.allSongs.forEach(song => {
    const date = new Date(song.ref_video_publish_date_ts * 1000);
    const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    monthlyCounts[yearMonth] = (monthlyCounts[yearMonth] || 0) + 1;
  });

  const sortedMonths = Object.keys(monthlyCounts).sort();

  return {
    labels: sortedMonths,
    counts: sortedMonths.map(month => monthlyCounts[month])
  };
});

// 3. Yearly song counts comparison (Pie Chart)
const yearlyData = computed(() => {
  const yearlyCounts: { [key: string]: number } = {};

  props.allSongs.forEach(song => {
    const year = new Date(song.ref_video_publish_date_ts * 1000).getFullYear().toString();
    yearlyCounts[year] = (yearlyCounts[year] || 0) + 1;
  });

  const years = Object.keys(yearlyCounts).sort((a, b) => parseInt(a) - parseInt(b));

  return {
    labels: years,
    counts: years.map(year => yearlyCounts[year])
  };
});

// 4. Seasonal song counts (Doughnut Chart)
const seasonalData = computed(() => {
  const filteredSongs = selectedSeasonYear.value === 'all'
    ? props.allSongs
    : props.allSongs.filter(song => {
      const year = new Date(song.ref_video_publish_date_ts * 1000).getFullYear();
      return year.toString() === selectedSeasonYear.value;
    });

  const seasonCounts : { [key: string]: number } = { '春': 0, '夏': 0, '秋': 0, '冬': 0 };

  filteredSongs.forEach(song => {
    const month = new Date(song.ref_video_publish_date_ts * 1000).getMonth() + 1;
    const season = getSeason(month);
    seasonCounts[season]++;
  });

  return {
    labels: ['春', '夏', '秋', '冬'],
    counts: [seasonCounts['春'], seasonCounts['夏'], seasonCounts['秋'], seasonCounts['冬']]
  };
});

// Initialize charts
const initializeCharts = async () => {
  await nextTick();

  if (!barChartRef.value || !lineChartRef.value || !pieChartRef.value || !doughnutChartRef.value) return;

  // Destroy existing charts
  if (barChart) barChart.destroy();
  if (lineChart) lineChart.destroy();
  if (pieChart) pieChart.destroy();
  if (doughnutChart) doughnutChart.destroy();

  // Dark mode text and grid colors
  const textColor = isDark.value ? '#dee2e6' : '#666666';
  const gridColor = isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  // 1. Bar Chart - Top 30 Songs
  barChart = new Chart(barChartRef.value, {
    type: 'bar',
    data: {
      labels: topSongsData.value.labels,
      datasets: [{
        label: '歌唱回数',
        data: topSongsData.value.counts,
        backgroundColor: colorPalettes.barChart.slice(0, topSongsData.value.labels.length),
        borderColor: isDark.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: '歌唱回数',
            color: textColor
          },
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          }
        },
        y: {
          title: {
            display: true,
            text: '曲名',
            color: textColor
          },
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor,
            autoSkip: false,
            maxRotation: 0,
            callback: function(value, _) {
              const label = this.getLabelForValue(value as number);
              return label.length > 20 ? label.substring(0, 20) + '...' : label;
            }
          }
        }
      }
    }
  });

// 2. Line Chart - Monthly Song Counts - 淡红色填充
  const lineChartGradient = isDark.value
    ? 'rgba(255, 107, 107, 0.3)'  // 暗黑模式下稍深的淡红色
    : 'rgba(255, 107, 107, 0.2)'; // 明亮模式下的淡红色

  lineChart = new Chart(lineChartRef.value, {
    type: 'line',
    data: {
      labels: monthlyData.value.labels,
      datasets: [{
        label: '歌曲数',
        data: monthlyData.value.counts,
        borderColor: colorPalettes.lineChart, // 主线条保持红色
        backgroundColor: lineChartGradient,
        tension: 0.4, // 稍微增加曲率让线条更平滑
        fill: true,
        pointBackgroundColor: colorPalettes.lineChart,
        pointBorderColor: isDark.value ? '#000000' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: colorPalettes.lineChart,
        pointHoverBorderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false
        },
        legend: {
          labels: {
            color: textColor,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: isDark.value ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: colorPalettes.lineChart,
          borderWidth: 1
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: '年月',
            color: textColor
          },
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '歌曲数',
            color: textColor
          },
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      elements: {
        line: {
          borderWidth: 3 // 增加线条宽度让红色更明显
        }
      }
    }
  });

  // 3. Pie Chart - Yearly Comparison
  pieChart = new Chart(pieChartRef.value, {
    type: 'pie',
    data: {
      labels: yearlyData.value.labels.map(year => `${year}年`),
      datasets: [{
        data: yearlyData.value.counts,
        backgroundColor: colorPalettes.yearly.slice(0, yearlyData.value.labels.length),
        borderColor: isDark.value ? 'rgba(255, 255, 255, 0.3)' : 'white',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw as number;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value}回 (${percentage}%)`;
            }
          }
        },
        legend: {
          labels: {
            color: textColor,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });

  // 4. Doughnut Chart - Seasonal Distribution
  doughnutChart = new Chart(doughnutChartRef.value, {
    type: 'doughnut',
    data: {
      labels: seasonalData.value.labels,
      datasets: [{
        data: seasonalData.value.counts,
        backgroundColor: colorPalettes.seasonal,
        borderColor: isDark.value ? 'rgba(255, 255, 255, 0.3)' : 'white',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw as number;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value}回 (${percentage}%)`;
            }
          }
        },
        legend: {
          labels: {
            color: textColor,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
};

// Watch for data changes and update charts
watch([topSongsData, monthlyData, yearlyData, seasonalData, selectedYear, selectedSeasonYear, isDark], () => {
  initializeCharts();
});

// Initialize when component mounts
onMounted(() => {
  initializeCharts();
});
</script>

<template>
  <div id="exampleModal2" aria-hidden="true" aria-labelledby="exampleModalLabel2" class="modal fade" tabindex="-2">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="exampleModalLabel2" class="modal-title fs-5">VTuber歌唱統計</h1>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <!-- Charts Row 1 -->
          <div class="row">
            <div class="col-12 mb-4">
              <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between">
                  <h6 class="card-title mb-0">トップ30曲</h6>
                  <label class="form-label visually-hidden" for="yearSelect">年度選択</label>
                  <select id="yearSelect" v-model="selectedYear" class="form-select w-auto">
                    <option value="all">全期間</option>
                    <option v-for="year in availableYears" :key="year" :value="year.toString()">
                      {{ year }}年
                    </option>
                  </select>
                </div>
                <div class="card-body">
                  <div class="chart-container">
                    <canvas ref="barChartRef"></canvas>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 mb-4">
              <div class="card">
                <div class="card-header">
                  <h6 class="card-title mb-0 py-2" style="margin: 3px 0 3px 0">月別歌曲数推移</h6>
                </div>
                <div class="card-body">
                  <div class="chart-container">
                    <canvas ref="lineChartRef"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Row 2 -->
          <div class="row">
            <div class="col-xl-6 col-lg-12 mb-4">
              <div class="card">
                <div class="card-header">
                  <h6 class="card-title mb-0 py-2" style="margin: 3px 0 3px 0">年間歌曲数比較</h6>
                </div>
                <div class="card-body">
                  <div class="chart-container">
                    <canvas ref="pieChartRef"></canvas>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-12 mb-4">
              <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between">
                  <h6 class="card-title mb-0 d-inline-block">季節別歌曲数分布</h6>
                  <label class="form-label visually-hidden" for="seasonYearSelect">年度選択</label>
                  <select id="seasonYearSelect" v-model="selectedSeasonYear" class="form-select w-auto">
                    <option value="all">全期間</option>
                    <option v-for="year in availableYears" :key="year" :value="year.toString()">
                      {{ year }}年
                    </option>
                  </select>
                </div>
                <div class="card-body">
                  <div class="chart-container">
                    <canvas ref="doughnutChartRef"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
<!--        <div class="modal-footer">-->
<!--          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">閉じる</button>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  min-height: 422px;
}
</style>