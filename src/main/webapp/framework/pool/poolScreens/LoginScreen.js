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

			FB
					.login(function(response) {

						if (response.authResponse) {
							var aToken = response.authResponse.accessToken;
							var user_id = response.authResponse.userID;
							_fetchUserDetails(aToken);
						} else {
							// user hit cancel button
							console
									.log('User cancelled login or did not fully authorize.');
						}
					});
		}

		function _fetchUserDetails(aToken) {
			FB.api('/me', 'get', {
				access_token : aToken,
				fields : 'picture,about,work,id,name,gender,email,birthday'
			}, function(response) {
				_saveUserDetails(response);

			});
		}

		function render() {

			if (!window.fbAsyncInit) {
				window.fbAsyncInit = function() {
					FB.init({
						appId : '145263072549453',
						oauth : true,
						status : true, // check login status
						cookie : true, // enable cookies to allow the server to
						xfbml : true, // parse XFBML
						version : 'v2.6'
					});

					SegmentLoader.getInstance().getSegment("loginSeg.xml",
							null, _init);
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
			} else {
				SegmentLoader.getInstance().getSegment("loginSeg.xml", null,
						_init);
			}

		}

		function _init(data) {
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

		function _loginFailed() {
			$("#passwordId_error").remove();
			var $span = $('<small/>').attr("id", "passwordId_error").addClass(
					'help-block errorMessage').insertAfter($($("#passwordId")));

			$span.html("Login or password didn't match");
		}
	}
})();