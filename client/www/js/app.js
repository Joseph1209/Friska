angular.module('Friska', ['ionic', 'Friska.factory', 'Friska.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).run(['$rootScope', 'AuthFactory',
    function($rootScope, AuthFactory) {
        $rootScope.getNumber = function(num) {
            return new Array(num);
        }

    }
])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');
  
  $stateProvider
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/home.html",
      }
    }
  })

  .state('app.appointment', {
    url: "/appointment",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/appointment.html"
      }
    }
  })

  .state('app.record', {
    url: "/record",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/record.html"
      }
    }
  })

  .state('app.medication', {
    url: "/medication",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/medication.html"
      }
    }
  })

  .state('app.subscription', {
    url: "/subscription",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/subscription.html"
      }
    }
  })

  .state('app.vitaltracker', {
    url: "/vitaltracker",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/vitaltracker.html"
      }
    }
  })

  .state('app.setting', {
    url: "/setting",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/setting.html"
      }
    }
  })

  .state('app.feedback', {
    url: "/feedback",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/feedback.html"
      }
    }
  })

  .state('app.legal', {
    url: "/legal",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/legal.html"
      }
    }
  })

  .state('app.rate', {
    url: "/rate",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/rate.html"
      }
    }
  })

  .state('app.profile', {
    url: "/profile",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/profile.html",
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('app.share', {
    url: "/share",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/share.html"
      }
    }
  })

  .state('app.callus', {
    url: "/callus",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/callus.html"
      }
    }
  })

  .state('app.help', {
    url: "/help",
    views: {
      'menuContent': {
        templateUrl: "templates/menu/help.html"
      }
    }
  })

  .state('chat', {
    url: "/chat",
    abstract: true,
    templateUrl: "templates/menu_content/chat_doctor_free.html",
    controller: 'ChatCtrl'
  })

  .state('chat.detail_chat', {
    url: "/detail_chat/:chatID",
    views: {
      'chatContent': {
        templateUrl: "templates/menu_content/detail_chat.html",
        controller: 'DetailChatCtrl'
      }
    }
  })

  .state('visit', {
    url: "/visit",
    templateUrl: "templates/visit.html",
    //controller: 'ChatCtrl'
  })

  .state('new_address', {
    url: "/new_address",
    templateUrl: "templates/new_address.html",
    //controller: 'ChatCtrl'
  })

  .state('appointment_date', {
    url: "/appointment_date",
    templateUrl: "templates/appointment_date.html",
    //controller: 'ChatCtrl'
  })

  $urlRouterProvider.otherwise('login');
});
