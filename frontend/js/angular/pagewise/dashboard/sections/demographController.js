module
.controller('demographCtrl', function($scope, $resource){
	$scope.nav_activity.current_page_index = 2;

	$scope.config = {gender:{}, age:{}, location:{}, education:{}};

	initConfig();
	loadData();

	function loadData(){
		$scope.config.gender.series.push({
	                name: 'Percentage',
	                innerSize: '60%',
	                colorByPoint: true,
	                data: [{
	                    name: 'Male',
	                    y: 47,
	                    color: '#59ADFD'
	                }, {
	                    name: 'Female',
	                    y: 53,
	                    color: '#FD4F9A'
	                }]
	            });
		$scope.config.age.series.push({
	                name: 'Percentage',
	                innerSize: '60%',
	                colorByPoint: true,
	                data: [{
	                    name: '10s',
	                    y: 11
	                }, {
	                    name: '20s',
	                    y: 39
	                }, {
	                    name: '30s',
	                    y: 25
	                },{
	                    name: '40s',
	                    y: 16
	                },{
	                	name: 'Others',
	                    y: 9
	                }
	                ]
	            });
		$scope.config.location.series.push({
	                name: 'Percentage',
	                innerSize: '60%',
	                colorByPoint: true,
	                data: [{
	                    name: 'New York',
	                    y: 25
	                }, {
	                    name: 'Washington',
	                    y: 37
	                }, {
	                    name: 'Boston',
	                    y: 24
	                }, {
	                    name: 'Others',
	                    y: 14
	                }]
	            });
		$scope.config.education.series.push({
	                name: 'Percentage',
	                innerSize: '60%',
	                colorByPoint: true,
	                data: [{
	                    name: 'Highschool',
	                    y: 34
	                }, {
	                    name: 'College',
	                    y: 23
	                }, {
	                    name: 'University',
	                    y: 17
	                }, {
	                    name: 'Unknown',
	                    y: 23
	                }]
	            });
	}
	function initConfig(){
		for (var key in $scope.config){
			$scope.config[key] = {
				options: {
					chart: {
		                plotBackgroundColor: null,
		                plotBorderWidth: null,
		                plotShadow: false,
		                type: 'pie'
	            	},
		            tooltip: {
		                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		            },
		            plotOptions: {
		                pie: {
		                    allowPointSelect: true,
		                    cursor: 'pointer',
		                    dataLabels: {
		                        enabled: false
		                    },
		                    showInLegend: true
		                }
		            }
				}
				,
	            title: {
	                text: key
	            },	            
	            series: []
			};
		}
	}
});