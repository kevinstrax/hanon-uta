<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Song } from "@/types/song";
import Chart from 'chart.js/auto'; // Chart.js 4.5.0 导入方式

// Define props to receive song data
const props = defineProps<{
  allSongs: Song[]
}>();

// Chart instances references
const topSongsChart = ref<Chart | null>(null);
const monthlyChart = ref<Chart | null>(null);
const yearlyPieChart = ref<Chart | null>(null);
const seasonChart = ref<Chart | null>(null);

// State for year selection dropdown
const selectedYear = ref<string>('all');
const availableYears = ref<string[]>([]);

/**
 * Processes raw song data to extract year, month, and season information
 * @param songs - Array of Song objects
 * @returns Processed songs with additional time-related properties
 */
const processSongs = (songs: Song[]) => {
  return songs.map(song => {
    // Convert timestamp to Date object (multiply by 1000 as it's in seconds)
    const date = new Date(song.ref_video_publish_date_ts * 1000);
    const year = date.getFullYear().toString();
    const month = date.getMonth() + 1; // Months are 0-based in JS
    const monthStr = `${year}-${month.toString().padStart(2, '0')}`;

    // Determine season (based on Northern Hemisphere)
    let season = '';
    if (month >= 3 && month <= 5) season = '春';
    else if (month >= 6 && month <= 8) season = '夏';
    else if (month >= 9 && month <= 11) season = '秋';
    else season = '冬';

    return {
      ...song,
      year,
      month,
      monthStr,
      season
    };
  });
};

/**
 * Gets processed song data from props
 * @returns Processed songs array
 */
const getProcessedSongs = () => {
  return processSongs(props.allSongs);
};

/**
 * Extracts unique years from song data for dropdown
 * @param processedSongs - Array of processed songs
 * @returns Array of years including 'all' for all time
 */
const getAvailableYears = (processedSongs: any[]) => {
  const years = [...new Set(processedSongs.map(song => song.year))].sort();
  return ['all', ...years];
};

/**
 * Prepares data for top 10 songs chart
 * @param processedSongs - Array of processed songs
 * @param year - Selected year or 'all' for all time
 * @returns Array of [song identifier, count] entries sorted by count
 */
const getTopSongsData = (processedSongs: any[], year: string) => {
  // Filter songs based on selected year
  const filteredSongs = year === 'all'
      ? processedSongs
      : processedSongs.filter(song => song.year === year);

  // Count occurrences of each song
  const songCounts: Record<string, number> = {};
  filteredSongs.forEach(song => {
    // Use combined title and artist as unique identifier
    const key = `${song.song_title}`;
    songCounts[key] = (songCounts[key] || 0) + 1;
  });

  // Sort by count descending and take top 10
  return Object.entries(songCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
};

/**
 * Prepares data for monthly song count chart
 * @param processedSongs - Array of processed songs
 * @returns Array of [year-month, count] entries sorted by date
 */
const getMonthlyData = (processedSongs: any[]) => {
  const monthlyCounts: Record<string, number> = {};

  processedSongs.forEach(song => {
    monthlyCounts[song.monthStr] = (monthlyCounts[song.monthStr] || 0) + 1;
  });

  // Sort by month
  return Object.entries(monthlyCounts).sort((a, b) => a[0].localeCompare(b[0]));
};

/**
 * Prepares data for yearly comparison pie chart
 * @param processedSongs - Array of processed songs
 * @returns Array of [year, count] entries sorted by year
 */
const getYearlyData = (processedSongs: any[]) => {
  const yearlyCounts: Record<string, number> = {};

  processedSongs.forEach(song => {
    yearlyCounts[song.year] = (yearlyCounts[song.year] || 0) + 1;
  });

  return Object.entries(yearlyCounts).sort((a, b) => a[0].localeCompare(b[0]));
};

/**
 * Prepares data for seasonal comparison chart
 * @param processedSongs - Array of processed songs
 * @returns Array of [season, count] entries
 */
const getSeasonalData = (processedSongs: any[]) => {
  const seasonCounts: Record<string, number> = {
    '春': 0,
    '夏': 0,
    '秋': 0,
    '冬': 0
  };

  processedSongs.forEach(song => {
    seasonCounts[song.season]++;
  });

  return Object.entries(seasonCounts);
};

/**
 * Initializes or updates all charts based on current data and selections
 */
const initCharts = () => {
  const processedSongs = getProcessedSongs();

  // Update available years in dropdown
  availableYears.value = getAvailableYears(processedSongs);

  // Destroy existing charts if they exist to prevent duplicates
  if (topSongsChart.value) topSongsChart.value.destroy();
  if (monthlyChart.value) monthlyChart.value.destroy();
  if (yearlyPieChart.value) yearlyPieChart.value.destroy();
  if (seasonChart.value) seasonChart.value.destroy();

  // Create Top 10 Songs Chart (Bar Chart)
  const topSongsData = getTopSongsData(processedSongs, selectedYear.value);
  const topSongsCtx = document.getElementById('topSongsChart') as HTMLCanvasElement;
  if (topSongsCtx) {
    topSongsChart.value = new Chart(topSongsCtx, {
      type: 'bar', // 指定图表类型
      data: {
        labels: topSongsData.map(item => item[0]),
        datasets: [{
          label: '演奏回数',
          data: topSongsData.map(item => item[1]),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // Horizontal bar chart
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: '演奏回数'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: selectedYear.value === 'all' ? '全期間の人気曲TOP10' : `${selectedYear.value}年の人気曲TOP10`
          },
          legend: {
            display: false
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Create Monthly Songs Chart (Line Chart)
  const monthlyData = getMonthlyData(processedSongs);
  const monthlyCtx = document.getElementById('monthlyChart') as HTMLCanvasElement;
  if (monthlyCtx) {
    monthlyChart.value = new Chart(monthlyCtx, {
      type: 'line', // 指定图表类型
      data: {
        labels: monthlyData.map(item => item[0]),
        datasets: [{
          label: '曲数',
          data: monthlyData.map(item => item[1]),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          pointBackgroundColor: 'rgb(75, 192, 192)'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '曲数'
            },
            ticks: {
              precision: 0
            }
          },
          x: {
            title: {
              display: true,
              text: '年月'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: '各月の曲数統計'
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Create Yearly Comparison Chart (Pie Chart)
  const yearlyData = getYearlyData(processedSongs);
  const yearlyCtx = document.getElementById('yearlyPieChart') as HTMLCanvasElement;
  if (yearlyCtx) {
    yearlyPieChart.value = new Chart(yearlyCtx, {
      type: 'pie', // 指定图表类型
      data: {
        labels: yearlyData.map(item => item[0]),
        datasets: [{
          data: yearlyData.map(item => item[1]),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: '各年の曲数比較'
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Create Seasonal Chart (Doughnut Chart)
  const seasonalData = getSeasonalData(processedSongs);
  const seasonCtx = document.getElementById('seasonChart') as HTMLCanvasElement;
  if (seasonCtx) {
    seasonChart.value = new Chart(seasonCtx, {
      type: 'doughnut', // 指定图表类型
      data: {
        labels: seasonalData.map(item => item[0]),
        datasets: [{
          data: seasonalData.map(item => item[1]),
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)', // Spring - teal
            'rgba(255, 206, 86, 0.7)', // Summer - yellow
            'rgba(255, 159, 64, 0.7)', // Autumn - orange
            'rgba(54, 162, 235, 0.7)'  // Winter - blue
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: '季節別の曲数分布'
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%'
      }
    });
  }
};

// Watch for changes in selected year or song data to update charts
watch([() => selectedYear.value, () => props.allSongs], () => {
  initCharts();
});

// Initialize charts when component mounts
onMounted(() => {
  initCharts();
});
</script>

<template>
  <!-- Statistics Modal -->
  <div class="modal fade" id="exampleModal2" tabindex="-2" aria-labelledby="exampleModalLabel2" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel2">曲の統計情報</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
        </div>
        <div class="modal-body">
          <!-- Year selection dropdown for top songs chart -->
          <div class="mb-4">
            <label for="yearSelect" class="form-label">年を選択:</label>
            <select
                id="yearSelect"
                class="form-select"
                v-model="selectedYear"
            >
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year === 'all' ? '全期間' : `${year}年` }}
              </option>
            </select>
          </div>

          <!-- Charts Grid Layout -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Top 10 Songs Chart -->
            <div class="card h-100">
              <div class="card-body">
                <canvas id="topSongsChart" class="chart-canvas"></canvas>
              </div>
            </div>

            <!-- Monthly Songs Count Chart -->
            <div class="card h-100">
              <div class="card-body">
                <canvas id="monthlyChart" class="chart-canvas"></canvas>
              </div>
            </div>

            <!-- Yearly Comparison Chart -->
            <div class="card h-100">
              <div class="card-body">
                <canvas id="yearlyPieChart" class="chart-canvas"></canvas>
              </div>
            </div>

            <!-- Seasonal Distribution Chart -->
            <div class="card h-100">
              <div class="card-body">
                <canvas id="seasonChart" class="chart-canvas"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
          <button type="button" class="btn btn-primary">変更を保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-body {
  overflow-y: auto;
  max-height: calc(100vh - 160px);
  padding: 1.5rem;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border-radius: 0.5rem;
}

.chart-canvas {
  width: 100% !important;
  height: 350px !important;
}

.form-select {
  max-width: 200px;
}
</style>
