/*!
 * Roots v 2.0.0
 * Follow me @adanarchila at Codecanyon.net
 * URL: http://codecanyon.net/item/roots-phonegapcordova-multipurpose-hybrid-app/9525999
 * Don't forget to rate Roots if you like it! :)
 */

// In this file we are goint to include all the Controllers our app it's going to need

(function() {
  'use strict';

  var app = angular.module('app', ['onsen', 'angular-images-loaded', 'ngMap', 'angular-carousel']);

  // Filter to convert HTML content to string by removing all HTML tags
  app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  });

  app.controller('networkController', function($scope) {

  });

  // This functions will help us save the JSON in the localStorage to read the website content offline

  Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
  }

  Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
  }

  // This directive will allow us to cache all the images that have the img-cache attribute in the <img> tag
  app.directive('imgCache', ['$document', function ($document) {
    return {
      link: function (scope, ele, attrs) {
        var target = $(ele);

        scope.$on('ImgCacheReady', function () {

          ImgCache.isCached(attrs.src, function(path, success){
            if(success){
              ImgCache.useCachedFile(target);
            } else {
              ImgCache.cacheFile(attrs.src, function(){
                ImgCache.useCachedFile(target);
              });
            }
          });
        }, false);

      }
    };
  }]);

  app.controller('newsController', ['$http', '$scope', '$rootScope', function($http, $scope, $rootScope) {

    $scope.yourAPI = 'https://bougetafrance.fr/api/get_recent_posts/';
    $scope.items = [];
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.pageNumber = 1;
    $scope.isFetching = true;
    $scope.lastSavedPage = 0;


    $scope.pullContent = function() {
      $http.jsonp($scope.yourAPI+'/?page='+$scope.pageNumber)
        .error(function(jqXHR, textStatus, errorThrown){
          alert("### ERROR ###");
          alert(textStatus +' // '+ errorThrown);
          alert($scope.yourAPI+'?page='+$scope.pageNumber);
        }).success(function(response) {

        if($scope.pageNumber > response.pages){

          // hide the more news button
          $('#moreButton').fadeOut('fast');

        } else {

          $scope.items = $scope.items.concat(response.posts);
          window.localStorage.setObject('rootsPosts', $scope.items); // we save the posts in localStorage
          window.localStorage.setItem('rootsDate', new Date());
          window.localStorage.setItem("rootsLastPage", $scope.currentPage);
          window.localStorage.setItem("rootsTotalPages", response.pages);

          // For dev purposes you can remove the comment for the line below to check on the console the size of your JSON in local Storage
          // for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");

          $scope.totalPages = response.pages;
          $scope.isFetching = false;

          if($scope.pageNumber == response.pages){

            // hide the more news button
            $('#moreButton').fadeOut('fast');

          }

        }

      });

      // $.ajax({
      //   url: $scope.yourAPI+'?page='+$scope.pageNumber,
      //   dataType: 'json',
      //   success: function(response){
      //
      //     if($scope.pageNumber > response.pages){
      //
      //       // hide the more news button
      //       $('#moreButton').fadeOut('fast');
      //
      //     } else {
      //
      //       $scope.items = $scope.items.concat(response.posts);
      //       window.localStorage.setObject('rootsPosts', $scope.items); // we save the posts in localStorage
      //       window.localStorage.setItem('rootsDate', new Date());
      //       window.localStorage.setItem("rootsLastPage", $scope.currentPage);
      //       window.localStorage.setItem("rootsTotalPages", response.pages);
      //
      //       // For dev purposes you can remove the comment for the line below to check on the console the size of your JSON in local Storage
      //       // for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");
      //
      //       $scope.totalPages = response.pages;
      //       $scope.isFetching = false;
      //
      //       if($scope.pageNumber == response.pages){
      //
      //         // hide the more news button
      //         $('#moreButton').fadeOut('fast');
      //
      //       }
      //
      //     }
      //   },
      //   error: function(jqXHR, textStatus, errorThrown){
      //     alert("### ERROR ###");
      //     alert(textStatus +' // '+ errorThrown);
      //     alert($scope.yourAPI+'?page='+$scope.pageNumber);
      //   }
      // });

    }

    $scope.getAllRecords = function(pageNumber) {
      $scope.isFetching = true;
      if (window.localStorage.getItem("rootsLastPage") == null ) {
        $scope.pullContent();
      } else {
        var now = new Date();
        var saved = new Date(window.localStorage.getItem("rootsDate"));
        var difference = Math.abs( now.getTime() - saved.getTime() ) / 3600000;
        // Lets compare the current dateTime with the one we saved when we got the posts.
        // If the difference between the dates is more than 24 hours I think is time to get fresh content
        // You can change the 24 to something shorter or longer
        if(difference > 1){
          // Let's reset everything and get new content from the site.
          $scope.currentPage = 1;
          $scope.pageNumber = 1;
          $scope.lastSavedPage = 0;
          window.localStorage.removeItem("rootsLastPage");
          window.localStorage.removeItem("rootsPosts");
          window.localStorage.removeItem("rootsTotalPages");
          window.localStorage.removeItem("rootsDate");
          $scope.pullContent();
        } else {
          $scope.lastSavedPage = window.localStorage.getItem("rootsLastPage");
          // If the page we want is greater than the last saved page, we need to pull content from the web
          if($scope.currentPage > $scope.lastSavedPage){
            $scope.pullContent();
          // else if the page we want is lower than the last saved page, we have it on local Storage, so just show it.
          } else {
            $scope.items = window.localStorage.getObject('rootsPosts');
            $scope.currentPage = $scope.lastSavedPage;
            $scope.totalPages = window.localStorage.getItem("rootsTotalPages");
            $scope.isFetching = false;
          }
        }
      }
    };

    $scope.imgLoadedEvents = {
      done: function(instance) {
        angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
      }
    };

    $scope.showPost = function(index) {
      $rootScope.postContent = $scope.items[index];
      $scope.ons.navigator.pushPage('post.html');
    };

    $scope.nextPage = function() {
      $scope.currentPage++;
      $scope.pageNumber = $scope.currentPage;
      $scope.getAllRecords($scope.pageNumber);
    }

  }]);

  app.controller('speakersController', ['$http', '$scope', '$rootScope', function($http, $scope, $rootScope) {

    $scope.showSpeaker = function(page) {
      console.log(page);
      $scope.menu.setMainPage(page);
    };

  }]);

  app.controller('postController', ['$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce) {

    $scope.item = $rootScope.postContent;

    $scope.renderHtml = function(htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };

    $scope.imgLoadedEvents = {
      done: function(instance) {
        angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
      }
    };

  }]);

  app.controller('mediasController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {

    $scope.yourAPI = "https://bougetafrance.fr/api/get_page/?slug=mediatheque"

    $scope.getPage = function() {
      $.ajax({
        url: $scope.yourAPI,
        dataType: 'json',
        success: function(response){
          console.log(response);
          $scope.item =response.page;
        }
      });
    }
    $scope.renderHtml = function(htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };

  }]);

  app.controller('contactController', ['$scope', function($scope) {
    document.addEventListener('deviceready', function() {
      $scope.sendEmail = function() {
        var data = {
          "email" : $('#email').val(),
          "name" : $('#name').val(),
          "subject" : $('#subject').val(),
          "message" : $('#message').val()
        };

        $('#email').val("");
        $('#name').val("");
        $('#subject').val("");
        $('#message').val("");

        $.ajax({
          url: "https://bougetafrance.fr/send_email/sending.php",
          method: 'POST',
          data: data,
          success: function(data) {
            console.log(data);
            alert("Votre message a été envoyé. Nous vous répondrons dans les meilleurs délais")
          },
          error: function() {
            alert("Impossible d'envoyer le message !");
          }
        });
      }
    }, false);
  }]);

  app.controller('markersController', function($scope, $compile) {

    $scope.infoWindow = {
      title: 'title',
      content: 'content'
    };

    $scope.markers = [{
      'title': 'Stade Océanne - Le Havre',
      'content': 'Lieu du rassemlement <br> <b>"Bouge Ta France 2017"</b>',
      'location': [49.499377, 0.169593]
    }];

    $scope.showMarker = function(event) {
      $scope.marker = $scope.markers[this.id];
      $scope.infoWindow = {
        title: $scope.marker.title,
        content: $scope.marker.content,
        animation: google.maps.Animation.BOUNCE,
        icon: '/images/icon.png'
      };
      $scope.$apply();
      $scope.showInfoWindow(event, 'marker-info', this.getPosition());

    }

  });

  app.controller('homeController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.init = function() {
      init_countdown();
      setInterval(init_countdown, 1000);
      new WOW().init();
    }
  }]);
})();
