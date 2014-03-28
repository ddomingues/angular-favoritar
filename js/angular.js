angular.module("desafio", [])
    .factory("ReditService", function($http) {

        return {
            listAll: function(callback) {
                $http.get('http://www.reddit.com/.json').success(callback);
            }
        }

    })
    .controller("Index", function($scope, ReditService, $interval) {

        var atualicacaoAutomatica;

        $scope.favoritos = [];
        $scope.exibir = 30;
        $scope.interval = 0;
        $scope.desc = false;

        $scope.listAll = function() {
            ReditService.listAll(function(result) {
                $scope.posts = result.data.children;
            });
        };

        $scope.configurarAtualizacaoAutomatica = function() {

            if (angular.isDefined(atualicacaoAutomatica)) {
                $interval.cancel(atualicacaoAutomatica);
                atualicacaoAutomatica = undefined;
            }

            if ($scope.interval > 0)
                atualicacaoAutomatica = $interval(function() {
                    $scope.listAll();
                }, $scope.interval);
        };

        $scope.listAll();
    })
    .directive('postDetail', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                post: '=',
                favorito: '='
            },
            templateUrl: 'post-detail.html',
            link: function(scope, element, attrs) {

                function trocaLista(from, to, post) {
                    scope.$parent[to].push(post);

                    var indexPost = scope.$parent[from].indexOf(post);

                    scope.$parent[from].splice(indexPost, 1);
                }

                scope.favoritar = function() {
                    trocaLista('posts', 'favoritos', scope.post);
                }

                scope.desfavoritar = function() {
                    trocaLista('favoritos', 'posts', scope.post);
                }

                $('.panel button').tooltip();
            }
        };
    });;






