var base = 'http://localhost:3000';
//var base = 'http://localhost:3000';
//var base = 'https://ionic-book-store.herokuapp.com';

angular.module('Friska.factory', [])

.factory('Loader', ['$ionicLoading', '$timeout', function($ionicLoading, $timeout) {

    var LOADERAPI = {

        showLoading: function(text) {
            text = text || 'Loading...';
            $ionicLoading.show({
                template: text
            });
        },

        hideLoading: function() {
            $ionicLoading.hide();
        },

        toggleLoadingWithMessage: function(text, timeout) {
            var self = this;

            self.showLoading(text);

            $timeout(function() {
                self.hideLoading();
            }, timeout || 3000);
        }

    };
    return LOADERAPI;
}])

.factory('TokenInterceptor', ['$q', 'AuthFactory', function($q, AuthFactory) {

    return {
        request: function(config) {
            config.headers = config.headers || {};
            var token = AuthFactory.getToken();
            var user = AuthFactory.getUser();
            //console.log(config);
            if (token && user) {
                config.headers['X-Access-Token'] = token.token;
                config.headers['X-Key'] = user.email;
                config.headers['Content-Type'] = "application/json";
                //console.log('config headers:'+config.headers);
            }
            return config || $q.when(config);
        },

        response: function(response) {
            return response || $q.when(response);
            //console.log('response:'+response);
            //console.log('q:'+$q);
        }
    };

}])

.factory('LSFactory', [function() {

    var LSAPI = {

        clear: function() {
            return localStorage.clear();
        },

        get: function(key) {
            ///console.log(JSON.parse(localStorage.getItem(key)))
            return JSON.parse(localStorage.getItem(key));
        },

        set: function(key, data) {
            return localStorage.setItem(key, JSON.stringify(data));
        },

        delete: function(key) {
            return localStorage.removeItem(key);
        },

        getAll: function() {
            var doctors = [];
            var items = Object.keys(localStorage);
            //console.log(items);
            //doctors = angular.fromJson(window.localStorage['doctors']);
            for (var i = 0; i < items.length; i++) {
                if (items[i] !== 'user' && items[i] != 'token' && items[i] != 'debug' && items[i] != 'messages' && items[i] != 'firebase:previous_websocket_failure') {
                    doctors.push(JSON.parse(localStorage[items[i]]));
                }
            }
            return doctors;
        }

    };

    return LSAPI;

}])

.factory('AuthFactory', ['LSFactory', function(LSFactory) {

    var userKey = 'user';
    var tokenKey = 'token';

    var AuthAPI = {

        isLoggedIn: function() {
            return this.getUser() === null ? false : true;
        },

        getUser: function() {
            return LSFactory.get(tokenKey);
        },

        setUser: function(user) {
            return LSFactory.set(userKey, user);
        },

        getToken: function() {
            return LSFactory.get(tokenKey);
        },

        setToken: function(token) {
            return LSFactory.set(tokenKey, token);
        },

        deleteAuth: function() {
            LSFactory.delete(userKey);
            LSFactory.delete(tokenKey);
        }

    };

    return AuthAPI;

}])

.factory('UserFactory', ['$http', 'AuthFactory',
    function($http, AuthFactory) {

        var UserAPI = {

            login: function(user) {
                return $http.post(base + '/login', user);
            },

            register: function(user) {
                alert('asdf');
               return $http.post(base + '/register', user);
                //return $http.get(base + '/api/products/?_id=57a9ea7ad552d72095a6327d');

            },

            confirm_register: function(code){
                return $http.post(base + '/verifyCode', code);
            },

            forgot_password: function(phonenumber){
                return $http.post(base + '/forgot-password/request', phonenumber);
            },

            forgot_return: function(data){
                return $http.post(base + '/forgot-password', data);
            },

            get_profile_info: function(){
                var userID = AuthFactory.getUser().token;
                console.log(userID)
                return $http.get(base + '/profile/' + userID);
            },

            send_profile_info: function(profile){
                return $http.post(base + '/profile', profile);
            },

            logout: function() {
                AuthFactory.deleteAuth();
            },

            getCartItems: function() {
                var userId = AuthFactory.getUser()._id;
                return $http.get(base + '/api/v1/users/' + userId + '/cart');
            },

            addToCart: function(book) {
                var userId = AuthFactory.getUser()._id;
                return $http.post(base + '/api/v1/users/' + userId + '/cart', book);
            },

            getPurchases: function() {
                var userId = AuthFactory.getUser()._id;
                return $http.get(base + '/api/v1/users/' + userId + '/purchases');
            },

            addPurchase: function(cart) {
                var userId = AuthFactory.getUser()._id;
                return $http.post(base + '/api/v1/users/' + userId + '/purchases', cart);
            }

        };

        return UserAPI;
    }
])

.factory('DoctorsFactory', ['$http', function($http) {

    var perPage = 30;

    var API = {
        get: function(page) {
            return $http.get(base + '/doctors/' + page + '/' + perPage);
        },
        send_chat: function(val){
            return $http.post(base + '/doctors/send-chat', val);
        },
        rate: function(val){
            return $http.post(base + '/api/doctors/' + val);
        }
    };

    return API;
}])

.service('ChatService', function ChatService($rootScope) {
        $rootScope.message=[];
        // Init the Websocket connection
        var socket = io.connect('http://localhost:3000');
        console.log(socket)

        console.log('asdf');

        // Bridge events from the Websocket connection to the rootScope
        socket.on('UserConnectedEvent', function(user) {
           socket.emit('UserConnectedEvent', user);
           //console.log(user)
        });

        /**
         * Send a message to the server.
         * @param message
         */
        socket.on('MessageReceivedEvent', function(message) {
            socket.emit('MessageReceivedEvent', message);
            $rootScope.message=message;
            //console.log($rootScope.message)
        });
        this.emit = function (message) {
            console.log(message.text)
            socket.emit('MessageSentEvent', message);
        };

        this.on = {
            userConnected: function (callback) {
                socket.on('UserConnectedEvent', function (event, user) {
                    callback(user);
                })
            },
            messageReceived: function (callback) {
                socket.on('MessageReceivedEvent', function (event, message) {
                    callback(message);
                })
            }
        }
    });