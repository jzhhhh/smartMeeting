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
    this.getEmployer = function () {
        return this.employer;
    }
    this.setEmployer = function (employer) {
        this.employer =  employer;
    }
    this.getDepartment = function(){
        return this.department;
    }
    this.setDepartment = function(department){
        this.department = department
    }
    this.getEmail = function(){
        return this.email;
    }
    this.setEmail = function(email){
        this.email = email;
    }
});