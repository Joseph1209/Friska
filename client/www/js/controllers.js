angular.module('Friska.controllers', [])

.controller('LoginCtrl', function($rootScope, $scope, $location, $ionicPopup, UserFactory, AuthFactory, Loader){

  $rootScope.user = {};//user JSON
  $scope.state = {};
  $scope.error = {};
  $scope.viewLogin=true;//Login or Register
  $scope.viewFogot=false;//Fogot Interface view or hidden
  $scope.viewBack = true;

  //After click "Register" button
  $scope.prompt_reg = function() {
    //verifying JSON
    $scope.vcode={
      phonenumber: $rootScope.user.phonenumber,
      verifystring: ''
    }
  // reset app states
    $scope.state.cancel = false;
    $scope.state.success = false;
    // reset error messages
    $scope.error.empty = false;
    //$scope.error.invalid = false;
    var prompt = $ionicPopup.show({
      templateUrl: 'templates/reg_prompt.html',
      title: 'Enter Code to continue',
      scope: $scope,
      buttons: [{
        text: 'Cancel',
        onTap: function(e) {
          UserFactory.confirm_register($scope.vcode).success(function(res){
              $scope.state.success = true;
              $scope.viewLogin = false;
              $location.path('login');
            }).error(function(err, statusCode) {
                Loader.hideLoading();
            });
          $scope.state.cancel = true;
        }
        }, {
        text: '<b>OK</b>',
        type: 'button-royal',
        onTap: function(e) {
          $scope.error.empty = false;
          //$scope.error.invalid = false;
          if (!$scope.vcode.verifystring) {
            $scope.error.empty = true;
            e.preventDefault();
          } else {
            UserFactory.confirm_register($scope.vcode).success(function(res){
              $scope.state.success = true;
              console.log(res.data.token)
              $scope.viewLogin = true;
              $location.path('login');
            }).error(function(err, statusCode) {
                Loader.hideLoading();
                Loader.toggleLoadingWithMessage(err.message);
            });
          }
        }
      }]  
    });
  };

  $scope.prompt_fog = function() {
    $scope.fcode = {
      phonenumber: ''
    }
  // reset app states
    $scope.state.cancel = false;
    $scope.state.success = false;
    // reset error messages
    $scope.error.empty = false;
    var prompt = $ionicPopup.show({
      templateUrl: 'templates/fog_prompt.html',
      title: 'Enter PhoneNumber to continue',
      scope: $scope,
      buttons: [{
        text: 'Cancel',
        onTap: function(e) {
          $scope.state.cancel = true;
        }
        }, {
        text: '<b>Continue</b>',
        type: 'button-royal',
        onTap: function(e) {
          $scope.error.empty = false;
          if (!$scope.fcode.phonenumber) {
            $scope.error.empty = true;
            e.preventDefault();
          } else {
            UserFactory.forgot_password($scope.fcode).success(function(res){
              data = res.data;
              AuthFactory.setUser(data.user);
              AuthFactory.setToken({
                  token: data.token,
                  expires: data.expires
              });
              $scope.state.success = true;
              $scope.viewLogin=true;
              $scope.viewFogot=true;
              $location.path('login');
            }).error(function(err, statusCode) {
                Loader.hideLoading();
                Loader.toggleLoadingWithMessage(err.message);
                $scope.prompt_fog();
            });
          }
        }
      }]  
    });
  };

  $scope.switchTab = function(tab) {
      if (tab === 'login') {
          $scope.viewBack = false;
          $scope.viewLogin = true;
      } else {
          $scope.viewBack = false;
          $scope.viewLogin = false;
      }
  }

  $scope.hide = function(){
    $scope.viewFogot = false;
    $location.path('login');
  }

  $scope.back_start = function(){
    $scope.viewBack = true;
  }

  $scope.login = function() {
      Loader.showLoading('Authenticating...');
      UserFactory.login($rootScope.user).success(function(data) {
          data = data.data;
          AuthFactory.setUser(data.user);
          AuthFactory.setToken({
              token: data.token,
              expires: data.expires
          });
          Loader.hideLoading();
          $location.path('/app/home');
      }).error(function(err, statusCode) {
          Loader.hideLoading();
          Loader.toggleLoadingWithMessage(err.message);
      });
  }

  $scope.register = function() {
      Loader.showLoading('Registering...');
 //     var f = [{
   ///   f: "dfsfsda"
    ///}
      //];
      UserFactory.register($rootScope.user).success(function(res) {
          data = res.data;
          AuthFactory.setUser(data.user);
          AuthFactory.setToken({
              token: data.token,
              expires: data.expires
          });
          Loader.hideLoading();
          $scope.prompt_reg();
      }).error(function(err, statusCode) {
          Loader.hideLoading();
          Loader.toggleLoadingWithMessage(err.message);
      });
  }

  $scope.send_new = function(){
    $scope.fcodereturn = {
      password: $rootScope.user.password,
      phonenumber: $scope.fcode.phonenumber,
      verifystring: $scope.fcode.verifystring
    }
    UserFactory.forgot_return($scope.fcodereturn).success(function(res){
      $scope.viewFogot = false;
      $location.path('login');
    }).error(function(err, statusCode){
      Loader.hideLoading();
      Loader.toggleLoadingWithMessage(err.message);
    });
  }

})

.controller('AppCtrl', function($scope, $location, $rootScope) {
  $scope.logout = function(){
    $rootScope.user.phonenumber = "";
    $rootScope.user.password = "";
    $location.path('/login');
  }
})

.controller('ChatCtrl', ['$scope', '$rootScope', 'DoctorsFactory', 'LSFactory', 'Loader',
    function($scope, $rootScope, DoctorsFactory, LSFactory, Loader) {
        /*$scope.doctors1={
            id: 2.3333,
            image: 'img/video_chat_background.jpg',
            title: 'Dr.Wuster',
            short_description: 'He is a physician.',
            rating: 4,
            message: [{
              time: '[Wed Oct 26 2016 10:33:50 GMT+0900 (Korea Standard Time)]',
              content: 'hello'
            },
            {
              time: '[Wed Oct 26 2016 10:33:50 GMT+0900 (Korea Standard Time)]',
              content: 'Ok'
            }]
          };

          $scope.doctors2={
            id: 5.4432,
            image: 'img/video_chat_background.jpg',
            title: 'Dr.Jack',
            short_description: 'He is a urologist.',
            rating: 3,
            message: [{
              time: '[Wed Oct 26 2016 10:33:50 GMT+0900 (Korea Standard Time)]',
              content: 'hello'
            },
            {
              time: '[Wed Oct 26 2016 10:33:50 GMT+0900 (Korea Standard Time)]',
              content: 'Ok'
            }]
          };
          $scope.doctors3={
            id: 8.2234,
            image: 'img/video_chat_background.jpg',
            title: 'Dr.Alis',
            short_description: 'He is a nutritionist.',
            rating: 5,
            message: [{
              time: '[Wed Oct 26 2016 10:33:50 GMT+0900 (Korea Standard Time)]',
              content: 'hello'
            },
            {
              time: '[Wed Oct 26 2016 10:33:50 GMT+0900 (Korea Standard Time)]',
              content: 'Ok'
            }]
          };
        window.localStorage['2.3333'] = angular.toJson($scope.doctors1);
        window.localStorage['5.4432'] = angular.toJson($scope.doctors2);
        window.localStorage['8.2234'] = angular.toJson($scope.doctors3);*/
        /*Loader.showLoading();
        var page = 1;
        $scope.doctors = [];
        var doctors = LSFactory.getAll();
        if (doctors.length > 0) {
            $scope.doctors = doctors;
            Loader.hideLoading();
        } else {
            DoctorsFactory.get(page).success(function(data) {
                processDoctors(data.data.doctors);
                $rootScope.doctors = data.data.doctors;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                Loader.hideLoading();
            }).error(function(err, statusCode) {
                Loader.hideLoading();
                Loader.toggleLoadingWithMessage(err.message);
            });
        }

        function processDoctors(doctors) {
            LSFactory.clear();
            // we want to save each book individually
            // this way we can access each book info. by it's _id
            for (var i = 0; i < doctors.length; i++) {
                LSFactory.set(doctors[i]._id, doctors[i]);
            };
        }*/

    }
])

.controller('DetailChatCtrl', function($scope, $state, $rootScope, $ionicModal, DoctorsFactory, LSFactory, ChatService, Loader){

  $scope.inputMessage = '';
  $scope.messages = [];
  $scope.show_con = true;
  var chat_doctor;
  var chatID = $state.params.chatID ;
  if(chatID !=""){
    chat_doctor = LSFactory.get(chatID);
  }
  $scope.chat_doctor = chat_doctor;
  //var time = '[' + new Date().toString() + ']';
  //console.log(time)
  //console.log($scope.chat_doctor.title);
  //document.getElementById('dd').value = chat_doctor.title;
    //alert(document.getElementById('dd').value)
  /*$rootScope.$on('showRatingModal', function($event, scope, cancelCallback, callback) {
            $scope = scope || $scope;

            $scope.ratingArr = [{
                value: 1,
                icon: 'ion-ios-star-outline'
                }, {
                value: 2,
                icon: 'ion-ios-star-outline'
                }, {
                value: 3,
                icon: 'ion-ios-star-outline'
                }, {
                value: 4,
                icon: 'ion-ios-star-outline'
                }, {
                value: 5,
                icon: 'ion-ios-star-outline'
              }];

            $ionicModal.fromTemplateUrl('templates/menu_content/rate_chat.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();

                $scope.hide = function() {
                    $scope.modal.hide();
                    if (typeof cancelCallback === 'function') {
                        cancelCallback();
                    }
                }

                $scope.rate_ok = function(val){
                  var rtgs = $scope.ratingArr;
                  Loader.showLoading('Please wait...');
                  DoctorsFactory.rate(val).success(function(res){
                    //res.data.
                    for (var i = 0; i < rtgs.length; i++) {
                    if (i < val) {
                      rtgs[i].icon = 'ion-ios-star';
                    } else {
                      rtgs[i].icon = 'ion-ios-star-outline';
                    }
                  };
                  }).error(function(err, statusCode){
                    Loader.hideLoading();
                    Loader.toggleLoadingWithMessage(err.message);
                  })
                }
            });
        });

  $scope.send_chat = function(){
    if(!$scope.chat.message){
      Loader.toggleLoadingWithMessage('Empty Messagebox!');
    }
    else{
      $scope.chat.todoctor = $scope.chat_doctor.id;
      $scope.chat.time = '[' + new Date().toString() + ']';
      Loader.showLoading('Sending Your Message...');
      DoctorsFactory.send_chat($scope.chat).success(function(res){
        Loader.hideLoading();
        
      }).error(function(err, statusCode){
        Loader.hideLoading();
        Loader.toggleLoadingWithMessage(err.message);
      });
    }
  }

  $rootScope.rate_chat = function(){
    //$rootScope.$broadcast('showRatingModal', $scope, null, null);
    //console.log(document.getElementById("ddd").value)
  }
*/

    
    // Notify whenever a new user connects
    ChatService.on.userConnected(function (user) {
        $scope.show_con = false;
        $scope.messages.push({
            name: 'Chat Bot',
            text: 'A new user has connected!'
        });
        $state.go('chat.detail_chat');
    });

    // Whenever a new message appears, append it
    ChatService.on.messageReceived(function (message) {
        $scope.show_con = false;
        $scope.messages.push($rootScope.message);
        $state.go('chat.detail_chat');
    });

    $scope.send_chat = function () {
      $scope.show_con = true;
      $scope.inputMessage = document.getElementById("inputMessage").value;
        console.log(document.getElementById("inputMessage").value)
        $scope.messages.push({
            name: 'Me',
            text: $scope.inputMessage
        });

        // Send the message to the server
        ChatService.emit({
            name: 'Anonymous',
            text: $scope.inputMessage
        });
        // Clear the chatbox
        document.getElementById("inputMessage").value = '';
    }
  })
.controller('ProfileCtrl', function($scope, $location, UserFactory, Loader) {

  $scope.prof = [];
  var id = '';

  Loader.showLoading('Please wait...');
  UserFactory.get_profile_info().success(function(res){
    data = res.data[0];
    $scope.prof.name = data.name;
    $scope.prof.phonenumber = data.phonenumber;
    $scope.prof.email = data.email;
    $scope.prof.birthday = data.birthday;
    $scope.prof.city = data.addresses[0].city.name;
    $scope.prof.address = data.addresses[0].address;
    $scope.prof.street = data.addresses[0].streetName;
    $scope.prof.country = data.addresses[0].country.name;
    $scope.prof.state = data.addresses[0].state.name;
    $scope.prof.district = data.addresses[0].district.name;
    console.log($scope.prof.district)
    $scope.prof.zipcode = data.addresses[0].zipcode;
    id = data.accountId;
    Loader.hideLoading();
  }).error(function(err, statusCode){
    Loader.hideLoading();
    Loader.toggleLoadingWithMessage(err.message);
  });

  $scope.save_profile = function(){
    console.log($scope.prof.city)
    console.log($scope.prof.district)
    console.log($scope.prof.state)
    console.log($scope.prof.country)
    $scope.profile={
      name: $scope.prof.name,
      email: $scope.prof.email,
      phonenumber: $scope.prof.phonenumber,
      birthday: $scope.prof.birthday,
      addresses: [{
        address: $scope.prof.address,
        street: $scope.prof.street,
        zipcode: $scope.prof.zipcode,
        city: {
          name: $scope.prof.city
        },
        district: {
          name: $scope.prof.district
        },
        state: {
          name: $scope.prof.state
        },
        country: {
          name: $scope.prof.country
        }
      }],
      accountId: id
    };
    console.log($scope.profile)
    Loader.showLoading('Uploading Your Profile...');
      UserFactory.send_profile_info($scope.profile).success(function(res) {
          
          console.log("OK")
          data = res.data;
          //console.log(data.token)
          Loader.hideLoading();
      }).error(function(err, statusCode) {
        console.log("No")
          Loader.hideLoading();
          Loader.toggleLoadingWithMessage(err.message);
      });
  }
})



