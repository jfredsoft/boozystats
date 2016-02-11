module
.service('Pages', function(){
	this.arr_pages = [
		{
			title: 'User',
			icon: 'user',
			desc: 'Manage Business Owners',
			route: '/'
		},
		{
			title: 'Area',
			icon: 'map-2',
			desc: 'Manage Areas',
			route: '/area'
		},
		{
			title: 'Business',
			icon: 'rocket',
			desc: 'Manage Businesses',
			route: '/business'
		},
		{
			title: 'Settings',
			icon: 'tools',
			desc: 'Global Board Settings',
			route: '/settings'
		}
	];
});