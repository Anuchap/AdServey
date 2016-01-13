var loader = {
    show: function () {
        $.blockUI({
            css: {
                border: 'none',
                backgroundColor: '',
            },
            message: '<h1 style="color: white;">Data Verifying...</h1>'
        });

    },
    hide: function () {
        $.unblockUI();
    }
};

var myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'rzModule', 'checklist-model']);

myApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/landing');

    $stateProvider
        .state('landing', {
            url: '/landing/:uid',
            templateUrl: 'partials/landing.html',
            controller: 'landingCtrl'
        })
        .state('browse', {
            url: '/browse/:uid',
            templateUrl: 'partials/browse.html',
            controller: 'browseCtrl'
        })
        .state('summary', {
            url: '/summary/:uid',
            templateUrl: 'partials/summary.html',
            controller: 'summaryCtrl'
        })
        .state('thankyou', {
            url: '/thankyou/:uid',
            templateUrl: 'partials/thankyou.html',
            controller: 'thankyouCtrl'
        })
        .state('quest1', {
            url: '/quest1/:uid',
            templateUrl: 'partials/quest1.html',
            controller: 'questCtrl'
        })
        .state('quest2', {
            url: '/quest2/:uid',
            templateUrl: 'partials/quest2.html',
            controller: 'questCtrl'
        })
        .state('quest3', {
            url: '/quest3/:uid',
            templateUrl: 'partials/quest3.html',
            controller: 'questCtrl'
        })
        .state('quest4', {
            url: '/quest4/:uid',
            templateUrl: 'partials/quest4.html',
            controller: 'questCtrl'
        })
        .state('quest5', {
            url: '/quest5/:uid',
            templateUrl: 'partials/quest5.html',
            controller: 'questCtrl'
        })
        .state('thankyou2', {
            url: '/thankyou2/:uid',
            templateUrl: 'partials/thankyou2.html'
        })
        .state('table', {
            url: '/table',
            templateUrl: 'partials/table.html'
        });
});

myApp.factory('store', function () {
    return {};
});

myApp.directive('mypopover', function () {
    return {
        restrict: 'E',
        scope: {
            detail: '='
        },
        link: function (scope, element, attrs) {
            var type = parseInt(attrs.type);
            var d = scope.detail;

            if (type === 0)
                return;

            $(element).css('cursor', 'pointer');

            var table = '';
            switch (type) {
                case 1:
                    table = '<table class="table table-bordered" style="margin-bottom:0">\
                                <tr class="detail-header">\
                                    <td class="text-center">Direct(%)</td>\
                                    <td class="text-center">Ad Network(%)</td>\
                                    <td class="text-center">Programetic(%)</td>\
                                </tr>\
                                <tr class="' + (d.isvalid ? '' : 'text-danger') + '">\
                                    <td class="text-center">' + d.direct + '%</td>\
                                    <td class="text-center">' + d.adnetwork + '%</td>\
                                    <td class="text-center">' + d.programetic + '%</td>\
                                </tr>\
                            </table>';
                    break;
                case 2:
                    table = '<table class="table table-bordered" style="margin-bottom:0">\
                                <tr class="detail-header">\
                                    <td colspan="2" class="text-center">Display(%)</td>\
                                    <td colspan="2" class="text-center">Vedio(%)</td>\
                                </tr>\
                                <tr class="' + (d.display.isvalid ? '' : 'text-danger') + '">\
                                    <td colspan="2" class="text-center">' + d.display.value + '%</td>\
                                    <td colspan="2" class="text-center">' + d.video.value + '%</td>\
                                </tr>\
                                <tr class="detail-header">\
                                    <td class="text-center">Desktop(%)</td>\
                                    <td class="text-center">Mobile(%)</td>\
                                    <td class="text-center">Desktop(%)</td>\
                                    <td class="text-center">Mobile(%)</td>\
                                </tr>\
                                <tr>\
                                    <td class="text-center ' + (d.display.level2.isvalid ? '' : 'text-danger') + '">' + d.display.level2.desktop + '%</td>\
                                    <td class="text-center ' + (d.display.level2.isvalid ? '' : 'text-danger') + '">' + d.display.level2.mobile + '%</td>\
                                    <td class="text-center ' + (d.video.level2.isvalid ? '' : 'text-danger') + '">' + d.video.level2.desktop + '%</td>\
                                    <td class="text-center ' + (d.video.level2.isvalid ? '' : 'text-danger') + '">' + d.video.level2.mobile + '%</td>\
                                </tr>\
                            </table>';
                    break;
                case 3:
                    table = '<table class="table table-bordered" style="margin-bottom:0">\
                                <tr class="detail-header">\
                                    <td class="text-center">Display(%)</td>\
                                    <td class="text-center">Video(%)</td>\
                                </tr>\
                                <tr class="' + (d.isvalid ? '' : 'text-danger') + '">\
                                    <td class="text-center">' + d.display + '%</td>\
                                    <td class="text-center">' + d.video + '%</td>\
                                </tr>\
                            </table>';
                    break;
                case 4:
                    table = '<table class="table table-bordered" style="margin-bottom:0">\
                                <tr class="detail-header">\
                                    <td class="text-center">Online Video<br/>Production(%)</td>\
                                    <td class="text-center">Web Banner & App<br/>Production(%)</td>\
                                    <td class="text-center">Social Media Platform<br/>Management(%)</td>\
                                </tr>\
                                <tr class="' + (d.isvalid ? '' : 'text-danger') + '">\
                                    <td class="text-center">' + d.video + '%</td>\
                                    <td class="text-center">' + d.banner + '%</td>\
                                    <td class="text-center">' + d.social + '%</td>\
                                </tr>\
                            </table>';
                    break;
            }

            var settings = {
                trigger: 'hover',
                content: table,
                width: 'auto',
                //padding:true,
                backdrop: false,
                placement: 'right'
            };
            $(element).webuiPopover('destroy').webuiPopover(settings);
        }
    };
});

myApp.controller('landingCtrl', function ($scope, $state, $stateParams, $http, $modal) {

    $scope.goToBrowse = function () {
        $http.get('checkstatus.php?uid=' + $stateParams.uid).success(function (status) {
            if (status === 'submitted') {
                $state.go('thankyou', {
                    uid: $stateParams.uid
                });
            } else if (status === 'finished') {
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'modalInstanceCtrl',
                    resolve: {
                        data: function () {
                            return {};
                        }
                    }
                });
            } else {
                $http.get('started.php?uid=' + $stateParams.uid).success(function () {
                    $state.go('browse', {
                        uid: $stateParams.uid
                    });
                });
            }
        });
    };
});

myApp.controller('browseCtrl', function ($scope, $state, $http, $stateParams) {

    $scope.setFile = function (element) {
        $scope.$apply(function () {
            $scope.currentFile = element.files[0];
        });
    };

    $scope.uploadFile = function () {
        loader.show();
        var formData = new FormData();
        formData.append("file", $scope.currentFile);
        formData.append("uid", $stateParams.uid);
        $http.post("upload.php", formData, {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).success(function (res) {
            loader.hide();
            if (res.indexOf('Sorry') === -1) {
                $state.go('summary', {
                    uid: $stateParams.uid
                });
            } else {
                $scope.errorMessage = res;
            }
        });
    };
});

myApp.controller('summaryCtrl', function ($scope, $state, $http, $modal, $stateParams, $timeout) {

    loader.show();
    $http.get('summary.php?uid=' + $stateParams.uid).success(function (data) {
        loader.hide();
        if (data === 'FILE_NOT_FOUND') {
            $state.go('browse', {
                uid: $stateParams.uid
            });
        }
        $scope.data = data;
        $scope.total15 = 0;
        _.each(data, function (item) {
            $scope.total15 += item.y15.total
        });
        $scope.total16 = 0;
        _.each(data, function (item) {
            $scope.total16 += item.y16.total
        });

        $timeout(function () {
            $scope.submitBtn = $('td > span.glyphicon-exclamation-sign').length > 0;
            $scope.submitMessage = $scope.submitBtn ? 'Cannot submit. Incorrect data found!' : '';
        });
    });

    $scope.verify = function (disciplines) {
        return !_.find(disciplines, function (item) {
            return !item.isvalid;
        });
    };

    $scope.showDetail = function (name, data) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'modalInstanceCtrl',
            resolve: {
                data: function () {
                    return {
                        name: name,
                        data: data
                    };
                }
            }
        });
    };

    $scope.backToBrowse = function () {
        $http.get('back.php?uid=' + $stateParams.uid).success(function () {
            $state.go('browse', {
                uid: $stateParams.uid
            });
        });
    };

    $scope.goToThankYou = function () {
        $http.get('submitted.php?uid=' + $stateParams.uid).success(function () {
            $state.go('thankyou', {
                uid: $stateParams.uid
            });
        });
    };
});

myApp.controller('modalInstanceCtrl', function ($scope, $modalInstance, data) {

    $scope.data = data;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

myApp.controller('thankyouCtrl', function ($scope, $stateParams) {
    $scope.uid_ = $stateParams.uid;
});

myApp.controller('questCtrl', function ($scope, $http, $state, $stateParams, store) {
    // all quest
    $scope.uid_ = $stateParams.uid;

    $scope.ans1 = store.a1;

    //quest2
    $scope.slider = {
        value: store.a2 | 0,
        options: {
            floor: -100,
            ceil: 100,
            step: 1,
            hideLimitLabels: true,
            translate: function (value) {
                return value + '%';
            }
        }
    };

    $scope.ans3 = store.a3;
    $scope.ans3other = store.a3o;
    $scope.ans4 = store.a4;

    // quest5
    $scope.slider2 = {
        value: store.a5 | 50,
        value2: 50,
        options: {
            floor: 0,
            ceil: 100,
            step: 1,
            hideLimitLabels: true,
            onChange: function () {
                $scope.slider2.value2 = 100 - $scope.slider2.value;
            },
        }
    };

    $scope.goToQuest2 = function () {
        if (!$scope.ans1) {
            alert('Please, select one answer choice.');
            return;
        }
        $http.post('answer.php', {
            uid: $stateParams.uid,
            qno: 1,
            answer: $scope.ans1,
            optional: null
        }).success(function () {
            store.a1 = $scope.ans1;
            $state.go('quest2', {
                uid: $stateParams.uid
            });
        });
    };

    $scope.goToQuest3 = function () {
        $http.post('answer.php', {
            uid: $stateParams.uid,
            qno: 2,
            answer: $scope.slider.value,
            optional: null
        }).success(function () {
            store.a2 = $scope.slider.value;
            $state.go('quest3', {
                uid: $stateParams.uid
            });
        });
    };

    $scope.goToQuest4 = function () {
        if ($scope.ans3 == undefined || $scope.ans3.length === 0) {
            alert('Please, select one or more answer choices.');
            return;
        }
        $http.post('answer.php', {
            uid: $stateParams.uid,
            qno: 3,
            answer: $scope.ans3 + '',
            optional: $scope.ans3other
        }).success(function () {
            store.a3 = $scope.ans3;
            store.a3o = $scope.ans3other;
            $state.go('quest4', {
                uid: $stateParams.uid
            });
        });
    };

    $scope.goToQuest5 = function () {
        if ($scope.ans4 == undefined || $scope.ans4.length === 0) {
            alert('Please, select one or more answer choices.');
            return;
        }
        $http.post('answer.php', {
            uid: $stateParams.uid,
            qno: 4,
            answer: $scope.ans4 + '',
            optional: null
        }).success(function () {
            store.a4 = $scope.ans4;
            $state.go('quest5', {
                uid: $stateParams.uid
            });
        });
    };

    $scope.goToThankYou2 = function () {
        $http.post('answer.php', {
            uid: $stateParams.uid,
            qno: 5,
            answer: $scope.slider2.value,
            optional: null
        }).success(function () {
            $http.get('finished.php?uid=' + $stateParams.uid).success(function () {
                store.a5 = $scope.slider2.value;
                $state.go('thankyou2', {
                    uid: $stateParams.uid
                });
            });
        });
    };
});

myApp.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);
