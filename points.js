class Point {
    constructor(json, service) {
        this.pointID = unUNICODE(json.pointID);
        this.image = json.image_url.split("\\+\\");;
        this.viewCount = json.view_count;
        this.desc = json.descr.replace("#", "\n#");
        this.ratePercent = json.rate_percent;
        this.ratesCount = json.raters_count;
        this.lastReviews = json.last_reviews;
        this.userOrder = Math.floor(Math.random() * 10);
        this.reviews = new Array();
        this.saved = false;
        this.service = service;
        this.upViewvers = function() {
            if (!logged)
                return;
            this.viewCount += 1;
            var req = {
                method: 'PUT',
                url: 'https://hw32.azurewebsites.net/api/secure/addPointViewer',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                data: {
                    "pointid": this.pointID,
                }
            }
            this.service(req).then(function(response) {
                debugger;
            }).catch(function(res) {
                console.log("up view failed " + res);
            });
        }
        this.toggleSaved = function($rootScope) {
            if (!logged) {
                alert("Not logged, please log in!")
                return;
            }
            if (!this.saved) {
                var req = {
                    method: 'PUT',
                    url: 'https://hw32.azurewebsites.net/api/secure/addToFavorites',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                    data: {
                        'pointid': this.pointID.trim(),
                    }
                }
                this.service(req).then(function(response) {
                    this.saved = !this.saved;
                    return;
                }.bind(this)).catch(function(res) {
                    console.log("flip failed: put")
                    console.log(res);
                });
            } else {
                var req = {
                    method: 'DELETE',
                    url: 'https://hw32.azurewebsites.net/api/secure/removeFromFavorites',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                    data: {
                        'pointid': this.pointID.trim(),
                    }
                }
                this.service(req).then(function(response) {
                    this.saved = !this.saved;
                    return;
                }.bind(this)).catch(function(res) {
                    console.log("flip failed: remove");
                    console.log(res);
                });
            }
        }
        this.updateUserDetails = function() {
            var req = {
                method: 'GET',
                url: 'https://hw32.azurewebsites.net/api/admin/getByAnyField',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': ad,
                },
                data: {
                    "table": "favorite",
                    "field": "pointID",
                    "value": this.pointID
                }
            }
            this.service(req).then(function(response) {
                debugger;
            }, function() { debugger }).catch(function(res) {
                console.log("up view failed " + res);
            });
        }
        this.saveUserOrder = function() {

        }
    }
}

randomPoints = function(points) {
    if (points === this.undefined) {
        return;
    }
    var randoms = new Array();
    while (true) {
        var rand1 = Math.floor(Math.random() * (points.length - 1));
        var rand2 = Math.floor(Math.random() * (points.length - 1));
        var rand3 = Math.floor(Math.random() * (points.length - 1));
        if (rand1 != rand2 && rand2 != rand3 && rand1 != rand3) {
            if (points[rand1].ratePercent > 2 && points[rand2].ratePercent > 2 && points[rand3].ratePercent > 2) {

                randoms.push(points[rand1]);
                randoms.push(points[rand2]);
                randoms.push(points[rand3]);
                return randoms;
            }
        }
    }
};
angular.module('app').service("PointsDisplayService", function($rootScope) {
    this.showPoints = function(points) {
        $rootScope.recomendedItems = new Array();
        points.forEach(element => {
            $rootScope.recomendedItems.push(element);
        });
    }
});

angular.module('app').controller('PointsDisplay', function($scope, $rootScope, ModalUpdateService) {
    $rootScope.recomendedItems = new Array();
    $scope.setCurrentItemToModal = function(item) {
        ModalUpdateService.setPoint(item);
    }
    $scope.refreshUserOrder = function() {
        debugger;
        $rootScope.points.forEach(element => {
            element.userOrder = element.userOrder;
        })
    }
});

angular.module('app').service("ModalUpdateService", function($rootScope) {
    this.setPoint = function(point) {
        $rootScope.modalItem = point;
        console.log(point);
    }
});

angular.module('app').controller('ModalDisplay', function($scope, $rootScope, $http) {
    $rootScope.modalItem = undefined;
    $scope.num_rating = 3;
    $scope.text_rating = "";
    $scope.saveRating = function() {
        if (!logged) {
            alert("Can`t leave rating, please log in or register.")
            return;
        }
        console.log("Rated! " + $scope.num_rating + "  " + $scope.text_rating); //TODO remove this
        var req = {
            method: 'POST',
            url: 'https://hw32.azurewebsites.net/api/secure/ratePoint',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            data: {
                "pointid": $scope.modalItem.pointID,
                "rating": $scope.num_rating,
                "desc": $scope.text_rating,
            }
        }
        $http(req).then(function(response) {
            $scope.num_rating = 3;
            $scope.text_rating = "";

        }, function(response) {
            if (response.status == 400) {
                alert("Already sent feedback!");
            }
        }).catch(function(err) {
            console.log("Error adding feedback: " + err)
        });
    }
    $scope.changeValue = function(num) {
        $scope.num_rating = num;
    }
});

angular.module('app').controller('footerDisplay', function($rootScope, ModalUpdateService, $scope) {
    $rootScope.rPoints = undefined;
    $scope.setCurrentItemToModalsetPoint = function(point) {
        $rootScope.modalItem = point;
        console.log(point);
    }
});