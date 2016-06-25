PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.LoginScreen = LoginScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(LoginScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * @class PROJECT.pool.map.LoginScreen
	 */
	function LoginScreen() {

		LoginScreen.superclass.constructor.call(this);
		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;

		var _container = null;

		/* Public Properties */
		objRef.render = render;

		function _fb_login() {

			var accessToken = _setCookie("accessToken", accessToken, 60);

			if (!accessToken) {

				FB
						.login(function(response) {

							if (response.authResponse) {
								var aToken = response.authResponse.accessToken;
								var user_id = response.authResponse.userID;
								_setCookie("accessToken", accessToken, 60);
								_fetchUserDetails(aToken);
							} else {
								// user hit cancel button
								console
										.log('User cancelled login or did not fully authorize.');
							}
						});
			} else {
				_fetchUserDetails(accessToken);
			}
		}

		function _fetchUserDetails(aToken) {
			FB.api('/me', 'get', {
				access_token : aToken,
				fields : 'picture,about,work,id,name,gender,email,birthday'
			}, function(response) {
				_saveUserDetails(response);

			});
		}

		function _isLoggedIn() {

			objRef.fetch("isLoggedIn",

			function(loggedInStatus) {

				if (loggedInStatus == "true") {
					_login();

				} else {
					_prepLoginPage();
				}
			});
		}

		function render() {
			if (!_isFbSdkLoaded()) {
				_loadFbSdk(function() {
					_isLoggedIn();
					//_prepLoginPage();
				});
			} else {
				_isLoggedIn();
			}
		}

		function _prepLoginPage() {
			SegmentLoader.getInstance().getSegment("loginSeg.xml", null,
					_initLoginPage);
		}

		function _loadFbSdk(callBackFun) {

			window.fbAsyncInit = function() {
				FB.init({
					appId : '145263072549453',
					oauth : true,
					status : true, // check login status
					cookie : true, // enable cookies to allow the server to
					xfbml : true, // parse XFBML
					version : 'v2.6'
				});

				callBackFun();
			};

			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {
					return;
				}
				js = d.createElement(s);
				js.id = id;
				js.src = "//connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));

		}

		function _isFbSdkLoaded() {
			return window.fbAsyncInit != null
					&& window.fbAsyncInit != undefined;
		}

		function _initLoginPage(data) {
			_container = $('#' + PoolConstants.GLOBAL_CONTAINER_DIV);
			_container.html("");
			_container.html(data);

			$("#loginId").click(_fb_login);
		}

		function _registerUser(e) {
			objRef.navigateTo(PoolConstants.USER_REGISTRATION_SCREEN);
		}

		function _saveUserDetails(response) {
			var params = {};
			params["email"] = response.email;
			params["birthday"] = response.birthday;
			params["gender"] = response.gender;
			params["facebookId"] = response.id;
			params["name"] = response.name;
			params["pictureUrl"] = response.picture.data.url;

			objRef.fireCommand(PoolConstants.LOGIN_COMMAND, [ params, _login,
					_loginFailed ]);
		}

		function _login() {
			objRef.navigateTo(PoolConstants.MAIN_SCREEN);
		}

		function _setCookie(cname, cvalue, mins) {
			var d = new Date();
			d.setTime(d.getTime() + (mins * 60 * 1000));
			var expires = "expires=" + d.toUTCString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		}

		function _getCookie(cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		}

		function _loginFailed() {
			$("#passwordId_error").remove();
			var $span = $('<small/>').attr("id", "passwordId_error").addClass(
					'help-block errorMessage').insertAfter($($("#passwordId")));

			$span.html("Login or password didn't match");
		}
	}
})();