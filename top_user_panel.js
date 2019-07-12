var token = undefined;
var logged = false;
angular.module('app').controller('top_user_panel', function($rootScope, $scope, $http, $cookies, $compile) {
    //variables
    $scope.username = undefined;
    $scope.password = undefined;
    $rootScope.showRegister = false;
    $rootScope.showFavorite = false;
    $rootScope.showMain = true;
    $scope.regUsername = undefined;
    $scope.currIndex = 0;
    $scope.favor = false;
    $scope.recoveryUsername = undefined; //to check if username has changed
    $scope.setPage = function(num) {
        switch (num) {
            case 0:
                $rootScope.showMain = true;
                $rootScope.showRegister = false;
                $rootScope.showFavorite = false;
                debugger;
                break;
            case 1:
                $rootScope.showMain = false;
                $rootScope.showRegister = true;
                $rootScope.showFavorite = false;
                break;
            case 2:
                $rootScope.showMain = false;
                $rootScope.showRegister = false;
                $rootScope.showFavorite = true;
                break;
        }
        console.log("register: " + $rootScope.showRegister + "  favorite: " + $rootScope.showFavorite);
    }
    $scope.createPasswordRecovery = function($event) {
        if ($scope.username != undefined) { //check if name as changed!
            var Element = document.getElementById(`passwordRecovery`);
            debugger;
            console.log($scope.username);
            var req = {
                method: 'GET',
                url: 'https://hw32.azurewebsites.net/api/getSecretQ',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    "username": "test_user",
                }
            }
            $http(req).then(function(response) {
                    $rootScope.recoveryQueries = response.data.Q;
                    $scope.recoveryUsername = $scope.username;
                    for (var i = response.data.Q.length - 1; i >= 0; i--) {
                        var elements;
                        console.log(response.data.Q[i]);
                        if (i == response.data.Q.length - 1) {
                            elements = `<div class="form-group">
                            <p>` + response.data.Q[i] + `</p>
                            <input type="text" ng-model="questionToRecovery` + i + `" class="form-control" placeholder="enter your answer"/>
                            <button id="passwordRecovery" class="btn btn-link" ng-model="passwordRecovery"
                            ng-click="recoverPassword()">Recover password</button> 
                            </div>`;
                        } else {
                            elements = `<div class="form-group">
                            <p>` + response.data.Q[i] + `</p>
                            <input type="text" ng-model="questionToRecovery` + i + `" class="form-control" placeholder="enter your answer"/> 
                            </div>`;
                        }
                        var newElement = angular.element(elements);
                        $compile(newElement.contents())($scope);
                        Element.parentNode.insertBefore(newElement[0], Element.nextSibling);
                        $event.preventDefault();
                    }
                },
                function(response) {
                    console.log("fail getAllSecretQueries");
                    //print incorrect login alert here
                }).catch(function() {
                console.log("getAllSecretQueries error");
                //alert the user!
            });
        } else {
            //show login error!
        }
    }

    $scope.submit = function() {
        interestcheckbox = document.getElementsByName("interestCheckbox");
        listInterests = [];
        for (var i = 0; i < interestcheckbox.length; i++) {
            if (interestcheckbox[i].checked) {
                listInterests[i] = interestcheckbox[i].value;
            }
        }
        if (listInterests.length < 2) {
            alert("must choose at least 2 categories");
            return;
        }
        if ($scope.regPassword != $scope.regPasswordRepeat) {
            alert("please fix the password to be the same");
            return;
        }
        questions = [];
        answers = [];
        var numQuestions = 0;

        if (document.getElementsByName("firstQuestion")[0].value != "") {
            if (document.getElementsByName("firstAnswer")[0].value != "") {
                questions[numQuestions] = document.getElementsByName("firstQuestion")[0].value;
                answers[numQuestions] = document.getElementsByName("firstAnswer")[0].value;
                numQuestions += 1;
            }
        }
        for (var i = 0; i <= $scope.currIndex; i++) {
            if (document.getElementsByName("regNewQuestion" + i)[0].value != "" &&
                document.getElementsByName("regNewAnswer" + i)[0].value != "") {
                questions[numQuestions] = document.getElementsByName("regNewQuestion" + i)[0].value;
                answers[numQuestions] = document.getElementsByName("regNewAnswer" + i)[0].value;
                numQuestions++;
            }
        }
        var req = {
            method: 'POST',
            url: 'https://hw32.azurewebsites.net/api/registerUser',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                "first_name": $scope.regUsername,
                "last_name": $scope.regLastName,
                "city": $scope.regCity,
                "country": $scope.regCountry,
                "email": $scope.regEmail,
                "username": $scope.regUsername,
                "password": $scope.regPassword,
                "secretQ": questions,
                "secretA": answers,
                "categories": listInterests
            }
        }
        $http(req).then(function(response) {
                $scope.setPage(0);
                console.log("submited!")
            },
            function(response) {
                alert("please try use a different username, this one is taken");
                console.log("registeration error");
                return;
                //print incorrect login alert here
            }).catch(function() {
            console.log("registeration error");
        });
    }

    $scope.flipFavorites = function() {
        $scope.favor = !$scope.favor;
    }
    $scope.addQuestion = function($event) {
        var Element = document.getElementById(`regAddQuestion` + $scope.currIndex + ``);
        $scope.currIndex = $scope.currIndex + 1;
        var newElement = angular.element(`<div id="regAddQuestion` + $scope.currIndex + `" class="form-group" style="align-content: center">
        <input name = "regNewQuestion` + $scope.currIndex + `" type="text" class="form-control" placeholder="Question" style="width: 70%"
            ng-model="regNewQuestion` + $scope.currIndex + `" required>
        <span ng-show="registerForm.questionValidation.regNewQuestion` + $scope.currIndex + `.$error.required && registerForm.questionValidation.regNewQuestion` + $scope.currIndex + `.$dirty">This is required! </span>
        <input name= "regNewAnswer` + $scope.currIndex + `" type="text" class="form-control" placeholder="Answer" ng-model="regNewAnswer` + $scope.currIndex + `" required>
        <span ng-show="registerForm.questionValidation.regNewAnswer` + $scope.currIndex + `.$error.required && registerForm.questionValidation.regNewAnswer` + $scope.currIndex + `.$dirty">This is required! </span>
        <button id="addQuestionButton` + $scope.currIndex + `" class="btn btn-link" ng-model="button` + $scope.currIndex + `" ng-show="currIndex==` + $scope.currIndex + `"ng-disabled="registerForm.questionValidation.$invalid"
          ng-click="addQuestion($event)">Add question</button>
        </div>`);

        $compile(newElement.contents())($scope);
        Element.parentNode.insertBefore(newElement[0], Element.nextSibling);
        $event.preventDefault();
    }

    $scope.login = function() { //login call
        $rootScope.username = $scope.username;
        var req = {
            method: 'POST',
            url: 'https://hw32.azurewebsites.net/api/loginUser',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                "username": $scope.username,
                "password": $scope.password
            }
        }
        $http(req).then(function(response) {
                $cookies.put("Token", response.data);
                token = response.data;
                $scope.showLogin = true;
                logged = true;
                $rootScope.logged = true;
                console.log("cookied: " + ($cookies.get("Token") === response.data));
                getPointOfInterest($rootScope, $http, $cookies);
                getLastSavedPoints($rootScope, $http, $cookies);
                $scope.setSaved();
                $rootScope.points.forEach(element => {
                    element.updateUserDetails();
                })
            },
            function(response) {
                console.log("fail");
                //print incorrect login alert here
            }).catch(function(err) {
            console.log("login error " + err);
        });

    };
    $scope.setSaved = function() {
        debugger;
        var req = {
            method: 'GET',
            url: 'https://hw32.azurewebsites.net/api/secure/getAllFavorites',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': $cookies.get("Token"),
            },
            data: {}
        }
        $http(req).then(function(response) {
            buffer = new Object();
            response.data.pointid.forEach(element => {
                element = element.replace("?", "");
                element = element.replace("?", "")
                buffer[element] = true;

            });
            console.log($rootScope.points);
            var points = $rootScope.points
            for (var i = 0; i < points.length; i++) {
                if (buffer[points[i].pointID] != undefined) {
                    points[i].saved = true;
                }
            }

        }).catch(function() {

        });

    }

    $scope.createPasswordRecovery = function($event) {
        if ($scope.username != undefined) { //check if name as changed!
            var Element = document.getElementById(`passwordRecovery`);
            debugger;
            console.log($scope.username);
            var req = {
                method: 'GET',
                url: 'localhost:3000/api/getSecretQ',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    "username": 'arielkam'
                }
            }
            $http(req).then(function(response) {
                    debugger;
                    $rootScope.recoveryQueries = response.data.Q;
                    $scope.recoveryUsername = $scope.username;
                    debugger;
                    for (var i = response.data.Q.length - 1; i >= 0; i--) {
                        var elements;
                        console.log(response.data.Q[i]);
                        if (i == response.data.Q.length - 1) {
                            elements = `<div class="form-group">
                            <p>` + response.data.Q[i] + `</p>
                            <input type="text" ng-model="questionToRecovery` + i + `" class="form-control" placeholder="enter your answer"/>
                            <button id="passwordRecovery" class="btn btn-link" ng-model="passwordRecovery"
                            ng-click="recoverPassword()">Recover password</button> 
                            </div>`;
                        } else {
                            elements = `<div class="form-group">
                            <p>` + response.data.Q[i] + `</p>
                            <input type="text" ng-model="questionToRecovery` + i + `" class="form-control" placeholder="enter your answer"/> 
                            </div>`;
                        }
                        var newElement = angular.element(elements);
                        $compile(newElement.contents())($scope);
                        Element.parentNode.insertBefore(newElement[0], Element.nextSibling);
                        $event.preventDefault();
                    }
                },
                function(response) {
                    debugger;
                    console.log("fail getAllSecretQueries");
                    //print incorrect login alert here
                }).catch(function() {
                console.log("getAllSecretQueries error");
                //alert the user!
            });
        } else {
            //show login error!
        }
    }

    function getPointOfInterest($rootScope, $http, $cookies) {
        if ($rootScope.username === "undefined") {
            console.log("not connected");
            return;
        }
        var req = {
            method: 'GET',
            url: 'https://hw32.azurewebsites.net/api/secure/getAllFavorites',
            headers: {

                'Content-Type': 'application/json',
                'x-auth-token': $cookies.get("Token"),
            },
            data: {}
        }
        $http(req).then(function(response) {
                $rootScope.favorites = response.data.pointid;
            },
            function(response) {
                console.log("fail getPointOfInterest");
                //print incorrect login alert here
            }).catch(function() {
            console.log("fail getPointOfInterest");
        });
        //presentPoints($rootScope, $scope) 
    }

    function getLastSavedPoints() {
        if ($rootScope.username === "undefined") {
            console.log("not connected");
            return;
        }
        var req = {
            method: 'GET',
            url: 'https://hw32.azurewebsites.net/api/secure/getLastSavedPoints',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': $cookies.get("Token"),
            },
            data: {}
        }
        $http(req).then(function(response) {
            $rootScope.lastSavedPoints = new Array();
            var len = $rootScope.points.length;
            var temp1 = unUNICODE(response.data.p1);
            var temp2 = unUNICODE(response.data.p2);
            for (var i = 0; i < len; i++) {
                if ($rootScope.points[i].pointID == temp1) {
                    $rootScope.lastSavedPoints.push($rootScope.points[i]);
                } else if ($rootScope.points[i].pointID == temp2) {
                    $rootScope.lastSavedPoints.push($rootScope.points[i]);
                }
            }
        }).catch(function() {
            console.log("fail getLastSavedPoints");
        });
        //presentPoints($rootScope, $scope)
    }

    function getUserCategories() {
        if ($rootScope.username === "undefined") {
            console.log("not connected");
            return;
        }
        debugger;
        var req = {
            method: 'GET',
            url: 'https://hw32.azurewebsites.net/api/admin/getByAnyField',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': ad,
            },
            data: {
                'table': "user_categories",
                'field': "username",
                'value': $rootScope.username,
            }
        }
        $http(req).then(function(response) {
            debugger;
            return response
        }).catch(function(err) {
            console.log("geric pull error occured: " + err);
        });
    }

});