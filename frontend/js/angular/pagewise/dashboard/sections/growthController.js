module
.controller('growthCtrl', function($scope, $resource, URL, Action){
	$scope.nav_activity.current_page_index = 1;

	$scope.date_activity = {from: moment().subtract(30, 'days').format('YYYY-MM-DD'), to: moment().format('YYYY-MM-DD'), init_start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'), init_end_date: moment().format('YYYY-MM-DD')};
	$scope.chart_activity = {config: {
		options: {
            rangeSelector: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            legend: {
            	enabled: true
            }
        },
        useHighStocks: true,
        yAxis: {
        	labels: {
        		align: 'left'
        	},
        	tickPosition: 'outside'
        },
        series: []
	}, data_ready: false};
	$scope.data_activity = {arr_all:[], arr_views:[], arr_clicks:[], loading:false};
	$scope.widget_activity = {dict_total:{view: 0, click:0}, dict_change:{view: 10, click: 30}, dict_growth:{view:100, click: -20}};
	$scope.user_info = $scope.globals.user_info;

	

	$scope.$watch('date_activity', function(newVal, oldVal){
		var st_unix = new Date($scope.date_activity.from).getTime() / 1000;
		var en_unix = new Date($scope.date_activity.to).getTime() / 1000;
		if (st_unix > en_unix) $scope.date_activity.to = $scope.date_activity.from;
	}, true);

	$scope.generateStats = function(){
		var st_unix = new Date($scope.date_activity.from).getTime() / 1000;
		var en_unix = new Date($scope.date_activity.to).getTime() / 1000;
		loadData(st_unix, en_unix);
	}

	$scope.generateStats();

	function loadData(st_unix, en_unix){
		$scope.chart_activity.data_ready = false;
		$scope.data_activity.loading = true;
		Action.get({biz_code: $scope.user_info.bussiness_code, start_unix: st_unix, end_unix: en_unix + 3600 * 24 - 1}, function(obj){
			processData(obj.actions, st_unix, en_unix + 3600 * 24 - 1);
			$scope.data_activity.loading = false;
		});
	}
	function processData(arr, st_unix, en_unix){
		var converge_interval = 3600 * 24;
		var daily_view_count = 0;
		var daily_click_count = 0;
		var current_unix = st_unix;

		var tmp_view_dict = {};
		var tmp_click_dict = {};
		var tmp_current_unix = st_unix;
		while (tmp_current_unix < en_unix){
			tmp_view_dict[tmp_current_unix] = 0;
			tmp_click_dict[tmp_current_unix] = 0;
			tmp_current_unix += converge_interval;
		}

		$scope.data_activity.arr_views = [];
		$scope.data_activity.arr_clicks = [];

		$scope.widget_activity.dict_total.view = 0;
		$scope.widget_activity.dict_total.click = 0;
		for (var i in arr){
			var obj_action = arr[i];

			if (obj_action.time > current_unix + converge_interval){
				tmp_view_dict[current_unix] = daily_view_count;
				tmp_click_dict[current_unix] = daily_click_count;

				$scope.widget_activity.dict_total.view += daily_view_count;
				$scope.widget_activity.dict_total.click += daily_click_count;

				current_unix = current_unix + converge_interval;
				daily_view_count = 0;
				daily_click_count = 0;
			}

			if (obj_action.type == 'view'){
				daily_view_count ++;
			}else{
				daily_click_count ++;
			}
		}
		tmp_view_dict[current_unix] = daily_view_count;
		tmp_click_dict[current_unix] = daily_click_count;

		for (var timestamp in tmp_view_dict){
			$scope.data_activity.arr_views.push([timestamp * 1000, tmp_view_dict[timestamp]]);
			$scope.data_activity.arr_clicks.push([timestamp * 1000, tmp_click_dict[timestamp]]);
		}
		//Handling some metrics
		var start_view = $scope.data_activity.arr_views[0][1];
		var end_view =  $scope.data_activity.arr_views[$scope.data_activity.arr_views.length-1][1] * 1;
		var diff_view = end_view - start_view;

		var start_click = $scope.data_activity.arr_clicks[0][1];
		var end_click =  $scope.data_activity.arr_clicks[$scope.data_activity.arr_clicks.length-1][1] * 1;
		var diff_click = end_click - start_click;

		$scope.widget_activity.dict_change.view = ((diff_view>0)?'+':'') + diff_view;
		$scope.widget_activity.dict_change.click = ((diff_click>0)?'+':'') + diff_click;

		var growth_view = (diff_view / ((start_view==0)?1:start_view)) * 100;
		var growth_click = (diff_click / ((start_click==0)?1:start_click)) * 100;

		$scope.widget_activity.dict_growth.view = ((growth_view>0)?'+':'') + growth_view.toFixed() + '%';
		$scope.widget_activity.dict_growth.click = ((growth_click>0)?'+':'') + growth_click.toFixed() + '%';

		configureChart();
	}
	function configureChart(){
		$scope.chart_activity.data_ready = true;

		$scope.chart_activity.config.series = [
			{
				name: 'Views',
				data: $scope.data_activity.arr_views,
				marker: {
					enabled: true,
					radius: 3
				},
				shadow: true,
				color: '#35B955'
			},
			{
				name: 'Clicks',
				data: $scope.data_activity.arr_clicks,
				marker: {
					enabled: true,
					radius: 3
				},
				shadow: true,
				color: '#C5862B'
		}];
	}
});