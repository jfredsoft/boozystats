module
.service('Pages', function(){
	this.arr_pages = [
		{
			title: 'Dashboard',
			desc: 'Dashboard',
			icon: 'home',
			route: '/',
			main: true
		},
		{
			title: 'Growth',
			desc: 'Growth in Customer Engagement',
			icon: 'graph2',
			route: '/growth',
			main: true
		},
		{
			title: 'Demographics',
			desc: 'Demographic Analysis',
			icon: 'id',
			route: '/demograph',
			main: true
		},
		{
			title: 'Patterns',
			desc: 'Time-wise Behavior Patterns',
			icon: 'timer',
			route: '/pattern',
			main: true
		},
		{
			title: 'Settings',
			desc: 'Business Settings',
			icon: 'rocket',
			route: '/setting',
			main: false
		}
	];
})