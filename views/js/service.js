app.service('userInfo', function() {
    this.user = 'myUser';
    this.room = 'myRoom';
    this.employer;
    this.department;
    this.email;
    this.password;
    
    this.getUser = function () {
        return this.user;
    }
    this.setUser = function (name) {
        this.user = name;
    }
    this.getRoom = function(){
        return this.room;
    }
    this.setRoom = function (name) {
        this.room = name;
    }
});