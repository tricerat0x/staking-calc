document.addEventListener('DOMContentLoaded', function () {
    new Vue({
        el: '#app',
        data: {
          strategies: [],
          selectedStrategy: null,
        },
        mounted() {
          axios.get('../../../models/strategy').then(response => {
            this.strategies = response.data;
            this.selectedStrategy = this.strategies[0];
            this.renderGraph();
          });
        },
        methods: {
          renderGraph() {
            // Example graph rendering logic
            var ctx = document.getElementById('strategyGraph').getContext('2d');
            var chart = new Chart(ctx, {
              // Chart configuration
            });
          }
        }
      });
});

