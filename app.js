var app = angular.module('app', ['ngMessages', 'ngCookies']);

app.run(function($rootScope, $http, PointsDisplayService) {
    //variables
    $rootScope.logged = false;
    $rootScope.username = undefined;
    $rootScope.points = new Array(); //all points for page!
    $rootScope.favorites = undefined;
    $rootScope.lastSavedPoints = new Array();
    $rootScope.countries = new Array(); //all posible counties
    $rootScope.categories = new Array(); //all posible categories
    getAllPoints($rootScope, $http, PointsDisplayService);
    getAllCountries($rootScope, $http);
    getAllCategories($rootScope, $http);
});

function getAllCountries($rootScope, $http) {
    var req = {
        method: 'GET',
        url: 'https://hw32.azurewebsites.net/api/getCountries',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {}
    }
    $http(req).then(function(response) {
            response.data.countries.forEach(element => {
                $rootScope.countries.push(element);
            });
        },
        function(response) {
            console.log("fail getAllCountries");
            //print incorrect login alert here
        }).catch(function() {
        console.log("getAllCountries error");
    });
}

function getAllCategories($rootScope, $http) {
    var req = {
        method: 'GET',
        url: 'https://hw32.azurewebsites.net/api/getCategories',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {}
    }
    $http(req).then(function(response) {
            response.data.categories.forEach(element => {
                $rootScope.categories.push(element);
            });
        },
        function(response) {
            console.log("fail getAllCategories");
            //print incorrect login alert here
        }).catch(function() {
        console.log("getAllCategories error");
    });
}


function getAllPoints($rootScope, $http, PointsDisplayService) {
    var req = {
        method: 'GET',
        url: 'https://hw32.azurewebsites.net/api/getAllPoints',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {}
    }
    $http(req).then(function(response) {
            response.data.points.forEach(element => {
                var point = new Point(element, $http);
                $rootScope.points.push(point);
            });
            PointsDisplayService.showPoints($rootScope.points);
            $rootScope.rPoints = randomPoints($rootScope.points);
            console.log($rootScope.rPoints);
        },
        function(response) {
            console.log("fail");

            //print incorrect login alert here
        }).catch(function(err) {
        console.log("getAllPoints error: " + err);
    });
}

function unUNICODE(input) {
    var result = new Array();
    for (var i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) > 256 || input.charCodeAt(i) == 63) {
            continue;
        }
        result.push(input[i]);
    }
    return result.join("");
}
const ad = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW5Vc2VyMzIiLCJpYXQiOjE1NjI3NjU4NzgsImV4cCI6MTU5Mzg2OTg3OH0.XMZvZWCHBRjTwmMH4MNAgr0v5j1ISytTIHojwqBNWD0"

function getValueFromDB(table, field, value) {
    var req = {
        method: 'GET',
        url: 'https://hw32.azurewebsites.net/api/admin/getByAnyField',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': ad,
        },
        data: {
            'table': table,
            'field': field,
            'value': value,
        }
    }
    $http(req).then(function(response) {
        return response
    }).catch(function(err) {
        console.log("geric pull error occured: " + err);
    });
}
var addCols = function(num) {
    for (var i = 1; i <= num; i++) {
        var myCol = $('<div class="col-sm-3 col-md-3 pb-2"></div>');
        var myPanel = $('<div class="card card-outline-info" id="' + i + 'Panel"><div class="card-block"><div class="card-title"><span>Card #' + i + '</span><button type="button" class="close" data-target="#' + i + 'Panel" data-dismiss="alert"><span class="float-right"><i class="fa fa-remove"></i></span></button></div><p>Some text in ' + i + ' </p><img src="//placehold.it/50/eeeeee" class="rounded rounded-circle"></div></div>');
        myPanel.appendTo(myCol);
        myCol.appendTo('#contentPanel');
    }


    $('.close').on('click', function(e) {
        e.stopPropagation();
        var $target = $(this).parents('.col-sm-3');
        $target.hide('slow', function() { $target.remove(); });
    });
};

$('#btnGen').click(function() {
    addCols($('#numPanels').val());
    return false;
});


/*app.controller('mid_search_screen', function($rootScope, $scope){
    $scope.items = new Array();
    /*for(i=0;i<$rootScope.points.lenght;i++){
        $scope.items.push({addr: "http://1", pic: "http://macarthur.physie.com.au/wp-content/uploads/sites/24/2016/11/250-x-90-logo-1.png",title:"item no 1",text:"some description here 1"});
    } 
    $scope.items.push({addr: "http://1", pic: "http://macarthur.physie.com.au/wp-content/uploads/sites/24/2016/11/250-x-90-logo-1.png",title:"item no 1",text:"some description here 1"});
    $scope.items.push({addr: "http://2", pic: "http://theentrance.physie.com.au/wp-content/uploads/sites/26/2016/11/250-x-90-logo-4.png",title:"item no 2",text:"some description here 2"});
    $scope.items.push({addr: "http://3", pic: "http://bunburycity.physie.com.au/wp-content/uploads/sites/25/2016/11/250-x-90-logo-2.jpg",title:"item no 3",text:"some description here 3"});
    $scope.items.push({addr: "http://4", pic: "http://ingleburnrsl.physie.com.au/wp-content/uploads/sites/29/2016/11/250-x-90-logo-6.png",title:"item no 4",text:"some description here 4"});
    $scope.additem=function() {
        $scope.items.push({addr: "http://4.5.com", pic: "http://ingleburnrsl.physie.com.au/wp-content/uploads/sites/29/2016/11/250-x-90-logo-6.png",title:"item no 4.5",text:"added picture"});
    }
});*/