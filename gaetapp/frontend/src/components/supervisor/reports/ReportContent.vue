<!-- frontend/src/components/supervisor/reports/ReportContent.vue -->
<template>
  <div class="space-y-6">
    
    <!-- Productivity Report -->
    <productivity-report 
      v-if="report.type === 'productivity' && report.data"
      :data="report.data"
    />

    <!-- Client Report -->
    <client-report 
      v-else-if="report.type === 'clients' && report.data"
      :data="report.data"
    />
    
    <!-- Task Status Report -->
    <task-status-report 
      v-else-if="report.type === 'task-status' && report.data"
      :data="report.data"
    />

    <!-- Time Analysis Report -->
    <time-analysis-report 
      v-else-if="report.type === 'time-analysis' && report.data"
      :data="report.data"
    />

    <!-- Team Performance Report -->
    <team-performance-report 
      v-else-if="report.type === 'team-performance'"
    />

    <!-- Workload Analysis Report -->
    <workload-analysis-report 
      v-else-if="report.type === 'workload-analysis'"
    />

    <!-- Geographic Analysis Report -->
    <geographic-analysis-report 
      v-else-if="report.type === 'geographic-analysis'"
    />

    <!-- Revenue Analysis Report -->
    <revenue-analysis-report 
      v-else-if="report.type === 'revenue-analysis'"
    />

    <!-- Client Satisfaction Report -->
    <client-satisfaction-report 
      v-else-if="report.type === 'client-satisfaction'"
    />

    <!-- Generic/Placeholder Report -->
    <generic-report 
      v-else
      :report="report"
      @download="$emit('download', $event)"
    />
  </div>
</template>

<script>
// Import all report components
import ProductivityReport from './ProductivityReport.vue'
import ClientReport from './components/ClientReport.vue'
import TaskStatusReport from './TaskStatusReport.vue'
import TimeAnalysisReport from './components/TimeAnalysisReport.vue'
import TeamPerformanceReport from './components/TeamPerformanceReport.vue'
import WorkloadAnalysisReport from './components/WorkloadAnalysisReport.vue'
import GeographicAnalysisReport from './components/GeographicAnalysisReport.vue'
import RevenueAnalysisReport from './components/RevenueAnalysisReport.vue'
import ClientSatisfactionReport from './components/ClientSatisfactionReport.vue'
import GenericReport from './components/GenericReport.vue'


export default {
  name: 'ReportContent',
  components: {
    ProductivityReport,
    ClientReport,
    TaskStatusReport,
    TimeAnalysisReport,
    TeamPerformanceReport,
    WorkloadAnalysisReport,
    GeographicAnalysisReport, 
    RevenueAnalysisReport,
    ClientSatisfactionReport,
    GenericReport
  },
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  emits: ['download']
}
</script>
