app.controller('roomController', function($scope, $http, $location, userInfo) {
    $http({
        method : "GET",
        url : "/rooms"
    }).then(function(response) {
        //console.log(JSON.parse(JSON.stringify(response.data)).rooms);
        $scope.rooms = JSON.parse(JSON.stringify(response.data)).rooms;
        $scope.user =JSON.parse(JSON.stringify(response.data)).username;
        $scope.goToChatRoom = function(id){
            userInfo.setRoom(id);
            userInfo.setUser($scope.user);
            $location.url('/myRoom');
        }
    }, function (err) {
        console.log(err);
    });
});

app.controller('chatController', function($scope, $http, userInfo){
    
    $scope.room = userInfo.getRoom();
    $scope.user = userInfo.getUser();
    
    $scope.pastChats = ["Good Morning", "How are you"]

    $scope.sendMessage = function(){
        $http({
            method: 'POST',
            url: '/analyzeChat',
            data: {'message': $scope.message}
            }).then(function(response) {
                var msg = JSON.parse(JSON.stringify(response.data));
                $scope.pastChats.push($scope.user + ": " + msg);
                $scope.message = '';
            }, function (err) {
                console.log(err);
            });
    }

    
   
})