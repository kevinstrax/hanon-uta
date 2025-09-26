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

const props = defineProps<{ allSongs: Song[], vtuber: string }>();
const { isDark } = storeToRefs(useColorModeStore())

// Reactive references
const selectedYear = ref<string>('all');
const selectedSeasonYear = ref<string>('all');
// Reactive reference for selected season (no 'all' option)
const selectedSeason = ref<string>('春');
const barChartRef = ref<HTMLCanvasElement>();
const lineChartRef = ref<HTMLCanvasElement>();
const pieChartRef = ref<HTMLCanvasElement>();
const doughnutChartRef = ref<HTMLCanvasElement>();
// Ref for Top 30 by Season chart
const seasonTop30ChartRef = ref<HTMLCanvasElement>();

// Chart instances
let barChart: Chart | null = null;
let lineChart: Chart | null = null;
let pieChart: Chart | null = null;
let doughnutChart: Chart | null = null;
// Instance for Top 30 by Season chart
let seasonTop30Chart: Chart | null = null;

// Available years for dropdown
const availableYears = computed(() => {
  const years = new Set<number>();
  props.allSongs.forEach(song => {
    const year = new Date(song.ref_video_publish_date_ts * 1000).getFullYear();
    years.add(year);
  });
  return Array.from(years).sort((a, b) => b - a);
});

// Fixed 4 seasons for Top 30 chart dropdown (no 'all' option)
const seasons = ref(['春', '夏', '秋', '冬']);

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

// 5. Top 30 songs by selected season (Bar Chart) - New Chart
const seasonTop30SongsData = computed(() => {
  // Filter songs that match the selected season
  const filteredSongs = props.allSongs.filter(song => {
    const publishDate = new Date(song.ref_video_publish_date_ts * 1000);
    const songMonth = publishDate.getMonth() + 1; // Convert to 1-12
    const songSeason = getSeason(songMonth);
    return songSeason === selectedSeason.value;
  });

  // Count play frequency for each song
  const songCounts: { [key: string]: number } = {};
  filteredSongs.forEach(song => {
    songCounts[song.song_title] = (songCounts[song.song_title] || 0) + 1;
  });

  // Sort by play count (descending) and take top 30
  const top30Songs = Object.entries(songCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 30);

  return {
    labels: top30Songs.map(([title]) => title), // Song titles
    counts: top30Songs.map(([, count]) => count) // Corresponding play counts
  };
});

// Initialize all charts (including new Top 30 chart)
const initializeCharts = async () => {
  await nextTick();

  // Guard clause: Ensure all canvas refs exist
  if (
      !barChartRef.value || !lineChartRef.value ||
      !pieChartRef.value || !doughnutChartRef.value ||
      !seasonTop30ChartRef.value
  ) return;

  // Destroy existing chart instances to prevent duplication
  if (barChart) barChart.destroy();
  if (lineChart) lineChart.destroy();
  if (pieChart) pieChart.destroy();
  if (doughnutChart) doughnutChart.destroy();
  if (seasonTop30Chart) seasonTop30Chart.destroy();

  // Get dark/light mode colors for consistent styling
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
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: { display: true, text: '歌唱回数', color: textColor },
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            autoSkip: false,
            maxRotation: 0,
            callback: function(value) {
              const label = this.getLabelForValue(value as number);
              return label.length > 20 ? label.substring(0, 20) + '...' : label;
            }
          }
        }
      }
    }
  });

  // 2. Line Chart - Monthly Song Counts
  const lineChartGradient = isDark.value
      ? 'rgba(255, 107, 107, 0.3)'
      : 'rgba(255, 107, 107, 0.2)';

  lineChart = new Chart(lineChartRef.value, {
    type: 'line',
    data: {
      labels: monthlyData.value.labels,
      datasets: [{
        label: '歌曲数',
        data: monthlyData.value.counts,
        borderColor: colorPalettes.lineChart,
        backgroundColor: lineChartGradient,
        tension: 0.4,
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
        title: { display: false },
        legend: { labels: { color: textColor, font: { size: 12 } } },
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
          title: { display: true, text: '年月', color: textColor },
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: '歌曲数', color: textColor },
          grid: { color: gridColor },
          ticks: { color: textColor }
        }
      },
      interaction: { intersect: false, mode: 'index' },
      elements: { line: { borderWidth: 3 } }
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
        title: { display: false },
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
        legend: { labels: { color: textColor, font: { size: 12 } } }
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
        title: { display: false },
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
        legend: { labels: { color: textColor, font: { size: 12 } } }
      }
    }
  });

  // 5. Bar Chart - Top 30 Songs by Season (New Chart with style matching first chart)
  seasonTop30Chart = new Chart(seasonTop30ChartRef.value, {
    type: 'bar',
    data: {
      labels: seasonTop30SongsData.value.labels,
      datasets: [{
        label: '歌唱回数',
        data: seasonTop30SongsData.value.counts,
        backgroundColor: colorPalettes.barChart.slice(0, seasonTop30SongsData.value.labels.length),
        borderColor: isDark.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y', // Same as first chart - horizontal bars
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }, // Match first chart - no legend
        title: { display: false },
        tooltip: {
          backgroundColor: isDark.value ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: isDark.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0,0,0,0.1)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: { display: true, text: '歌唱回数', color: textColor }, // Match first chart's x-axis title
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            autoSkip: false,
            maxRotation: 0,
            // Match first chart's label truncation logic
            callback: function(value) {
              const label = this.getLabelForValue(value as number);
              return label.length > 20 ? label.substring(0, 20) + '...' : label;
            }
          }
        }
      }
    }
  });
};

// Watch for data changes
watch(
    [
      topSongsData, monthlyData, yearlyData, seasonalData, seasonTop30SongsData,
      selectedYear, selectedSeasonYear, selectedSeason, isDark
    ],
    () => {
      initializeCharts();
    }
);

// Initialize all charts on component mount
onMounted(() => {
  initializeCharts();
});
</script>

<template>
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

  <!-- Charts Row 3 - Top 30 Songs by Season (style matched to first chart) -->
  <div class="row">
    <div class="col-12 mb-4">
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between">
          <h6 class="card-title mb-0">季節別トップ30曲</h6>
          <label class="form-label visually-hidden" for="seasonSelect">季節選択</label>
          <select id="seasonSelect" v-model="selectedSeason" class="form-select w-auto">
            <option v-for="season in seasons" :key="season" :value="season">
              {{ season }}
            </option>
          </select>
        </div>
        <div class="card-body">
          <div class="chart-container">
            <canvas ref="seasonTop30ChartRef"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  min-height: 422px;
}
</style>