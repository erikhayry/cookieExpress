'use strict'

var bodyEl = document.body;

var popUpTmpl = '<div ng-app="cookieExpressApp" ng-csp>' + 
					'<div ng-controller="appController" class="is-{{state}}" accesskey="h">' +
						'<input class="m-form-name" ng-model="cookieName" placeholder="Name" toggle-focus autofocus enter-submit>' +
						'<input class="m-form-value" ng-model="cookieValue" placeholder="Value" enter-submit>' +
						'<h2>Add cookie</h2>' + 
						'<ol class="m-cookie-list">' +
							'<li class="m-cookie-list-item" ng-repeat="lCookie in localStorageCookies | filter:filterByKey">{{lCookie.html}}</li>' +
						'</ol>' +
						'<h2>Delete cookie</h2>' + 
						'<ol class="m-cookie-list">' +
							'<li class="m-cookie-list-item"ng-repeat="dCookie in documentCookies | filter:filterByName">{{dCookie.html}}</li>' +
						'</ol>' +
					'</div>' +
				'</div>';				

var string = '__gads=ID=6cb82ec241ab79f8:T=1379088797:S=ALNI_MZVCQ5H7-xipU8jn1xO1TMk0P8xZQ; emailSignupPopup=1; channel=intl; country_iso=GB; _wt.user-325889=WT3w7iKZFDm-06c2FGHFX85w0Zjj1ipJFNnzcSBdGmkPN68NlAxE7IX5ho3JpolJaK2LZuZW7JLFYk04bV02g_RuF4aUksUhKfIpv9KGfiExxw~; shopping_basket=164273078; napIPadApp=true; currentSession=2A8433574DDED3BB0C3B55EC4BEA970B; remembered_7070=ZXJpay5wb3J0aW5AbmV0LWEtcG9ydGVyLmNvbToxMzg0MTc3MzEzMDIzOjBlNDRhMDIzM2ZjMmFhNWM1MmY1OTQyOGRlNGIxNzZl; napIPadApp=true; mobileAppName=Givenchy_Women; recentlyViewedProducts="[385412]"; wishlistPopup=null; _wt.mode-325889=WT3ERK8Ic8CDag~; JSESSIONID_INTL=2A8433574DDED3BB0C3B55EC4BEA970B.nap-intl-gs2-11; lang_time=1379668576682; lang_iso=en; deviceType=Desktop; navHistory="PRODUCT_DETAILS[385412]HOME[]"; __utma=228472450.813223861.1379088796.1379607424.1379668577.6; __utmb=228472450.2.10.1379668577; __utmc=228472450; __utmz=228472450.1379088796.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); cookiePrivacyPolicy=true; s_cc=true; s_fid=4916C35D715BDCCA-11E56FA1FF18AEFA; s_nr=1379668577495-Repeat; s_vnum=1380582000125%26vn%3D10; s_invisit=true; prevPage=HOME%20PAGE; s_sq=%5B%5BB%5D%5D; s_vi=[CS]v1|29199CCE85309191-60000303800B5AB7[CE]; fsr.s=%7B%22v2%22%3A-2%2C%22v1%22%3A1%2C%22rid%22%3A%22def5436-92969792-66de-37a7-60d74%22%2C%22to%22%3A5%2C%22c%22%3A%22http%3A%2F%2Fwww.net-a-porter.com%2F%22%2C%22pv%22%3A71%2C%22lc%22%3A%7B%22d0%22%3A%7B%2…2C%22Region%22%3A%22intl%22%7D%2C%22f%22%3A1379520115359%2C%22sd%22%3A0%7D; s_ppv=-%2C35%2C35%2C933';

function _stringToNode(tmplString){
	var div = document.createElement('div');
	div.innerHTML = tmplString;
	return div.childNodes[0];
}

function showPopup(){
	console.log('show popup')
	console.log(_stringToNode(popUpTmpl))
	bodyEl.appendChild(_stringToNode(popUpTmpl));

	var App = angular.module('cookieExpressApp', []);

	App.controller('appController', function($scope, cookieFactory) {
		console.log('appController')
		function _updateCookies(){
			$scope.localStorageCookies = cookieFactory.getCookiesFromStorage();
		  	$scope.documentCookies = cookieFactory.getCookies();
		}

		function _init(){
			_updateCookies()
			$scope.state = 'delete';
		}
	  	
		_init();

	  	$scope.filterByName = function(cookie){
		    return cookie.name.search($scope.cookieName) != -1;
		}

		$scope.addCookie = function(name, value){
			cookieFactory.setCookieToStorage(name, value);
			_updateCookies();
			console.log('adding ' + name + ' : ' + value);
		}
		
		$scope.deleteCookie = function(name){
			cookieFactory.deleteCookieFromStorage(name);
			_updateCookies();
			console.log('deleting ' + name);

		}

		$scope.submit = function(){

		}

		$scope.$watch('state', function(newVal, oldVal) {
			console.log('state changed ' + oldVal + ' to ' + newVal )
		    $scope.state = newVal;
		});

		Mousetrap.bind('alt+shift+a', function(e) {
			console.log('add state')
		    $scope.$apply(function(){
		      $scope.state = 'add';
		    });
		    return false;
		});

		Mousetrap.bind('alt+shift+d', function(e) {
		    $scope.$apply(function(){
		      $scope.state = 'delete';
		    });
		    return false;
		});
	});

	App.directive('toggleFocus', function(){
		return {
			restrict : 'A',
			link : function (scope, elem, attrs) {
				elem[0].onkeypress = function(e){
					if(e.altKey && e.shiftKey && e.keyCode === 200){
						e.preventDefault();
						elem[0].blur();
					} 
				}	

				Mousetrap.bind('alt+shift+i', function(e) {
				    elem[0].focus();
					return false;
				});
	      	}
		}
	});

	App.directive('enterSubmit', function(){
		return {
			restrict : 'A',
			link : function (scope, elem, attrs) {
				for(var i = 0; i < elem.length; i++){
					elem[i].onkeydown = function(e){
						if(e.keyCode == 13){
							e.preventDefault();
							scope.submit();
						} 
					}					
				}
	      	}
		}
	});


	App.service('cookieFactory', function(){
		function _toCookie(name, value){
			return {'name' : name, 'value' : value, 'html' : name + ' : ' + value}
		} 

		var cookieFactory = {
			getCookies : function() {
				console.log('read cookies')
				var cookies = string.split(';'),
					ret = [];
				for(var i = 0; i < cookies.length; i++) {
					var c = cookies[i];
					while (c.charAt(0)==' ') c = c.substring(1,c.length);
					var name = c.substring(0,c.indexOf('=')),
						value = c.substring(c.indexOf('=') + 1,c.length);

					ret.push(_toCookie(name, value));
				}
				return ret;

			},

			getCookiesFromStorage : function(){
				var cookies = JSON.parse(localStorage.getItem('cookieExpressData')) || [];
				return cookies;
			},

			setCookieToStorage : function(name, value){
				var newItem = _toCookie(name, value),
					cookies = getCookiesFromStorage();
				cookies.push(newItem);
				localStorage.setItem('cookieExpressData', JSON.stringify(cookies));
			},

			deleteCookieFromStorage : function(name){
				var cookies = getCookiesFromStorage()
				for(var i = 0; i < cookies.length; i++){
					if(cookies[i].name === name) cookies.splice(i, 1)
				}		
				localStorage.setItem('cookieExpressData', JSON.stringify(cookies));
			}
		}
		return cookieFactory;
	})

	//angular.bootstrap(bodyEl, ['cookieExpressApp']);

}

function downAction(){
	console.log('down')
}

showPopup();

Mousetrap.bind('command+shift+k', function(e) {
    //showPopup();
    return false;
});


Mousetrap.bind('down', downAction);

console.log('content ');


