module
.service('Userstore', function(){
	this.arr_users = [];
	this.synched = false;
	this.pushUser = function(obj_user){
		this.arr_users.push(obj_user);
		this.synched = true;
	};
	this.getUser = function(index){
		if (index == null)
			return this.arr_users;
		else
			return this.arr_users[index];

	};
	this.removeUser = function(index){
		this.arr_users.splice(index, 1);
	}
	this.getUserById = function(id){
		for (var i in this.arr_users){
			if (this.arr_users[i].id == id)
				return this.arr_users[i];
		}
	}
	this.getUserCount = function(){
		return this.arr_users.length;
	}
});