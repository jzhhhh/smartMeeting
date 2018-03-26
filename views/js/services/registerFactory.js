app.factory('registerService', function($http, $location){
    return{
        signup: function(user){
            $http({
                method: "POST",
                url: "/signup",
                data: {
                    'email': user.email,
                    'username': user.username,
                    'password': user.password,
                    'employer': user.employer,
                    'department': user.department,
                    'team': user.team,
                }
            }).then(function(response) {
                var res = JSON.parse(JSON.stringify(response.data)).result;
                console.log(res);
                if (res == "pass") {
                    $location.path('/selectRoom');
                    console.log("signup success");
                } else {
                    console.log("signup failed");
                }
            }, function (err) {
                console.log(err);
            });
        },

        signin: function(user){
            $http({
                method: "POST",
                url: "/signin",
                json: {
                    'email': user.email,
                    'password': user.password,
                }
            }).then(function(response) {
                var res = JSON.parse(JSON.stringify(response.data)).result
                if (res == "true") {
                    $scope.signinshow  = $scope.signinshow === true ? false : true;
    
                    check = false;
    
                    $location.path('/selectRoom');
                } else {
                    console.log("signin failed");
                }
            }),
            function(err) {
                console.log(err);
            };
        }
    }
});