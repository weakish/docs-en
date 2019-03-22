angular.module('app').controller('DemoCtrl', ['$http', '$scope', '$rootScope', '$timeout',
  function($http, $scope, $rootScope, $timeout) {
    function setByHash() {
      var hash = location.hash.slice(2);
      if (!$scope.plats[hash]) {
        $scope.currentSDKType = 'all';
      } else {
        $scope.currentSDKType = location.hash.slice(2);
      }

    }
    $scope.keys = function(obj){
      return obj? Object.keys(obj) : [];
    }

    $scope.hasChildren = function(plat){
      return $scope.demos[plat]? $scope.demos[plat].length : 0;
    }

    $scope.plats = {
      'ios': 'iOS',
      'android': 'Android',
      'unity': 'Unity',
      'python': 'Python',
      'winphone': 'Windows Phone',
      'web': 'Web',
      'node': 'Node.js',
      'php': 'PHP',
      'weapp': 'WeChat Mini Program',
      'reactnative': 'React Native'
    }
    $scope.demos = {
      'ios': [],
      'android': [],
      'python': [],
      'web': [],
      'php': [],
      'weapp': [],
      'reactnative': [],
      'node': []
    }
    $scope.$watch('currentSDKType',function(){
      $scope.displayDemos = [];
      var arr = [];
      if($scope.currentSDKType == 'all'){
        angular.forEach($scope.demos, function(v,k){
          arr = arr.concat(v) ;
        });
        $scope.displayDemos = arr;
      }else{
        $scope.displayDemos = $scope.demos[$scope.currentSDKType]
      }
    })

    $scope.setCurrentType = function(type) {
      $scope.currentSDKType = type;
    }
    setByHash();
    $(window).on('hashchange', function() {
      $timeout(function() {
        setByHash();
      })
    });


  }
  ]);
