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
		objRef.handleClick = handleClick;

		function render() {
			SegmentLoader.getInstance().getSegment("loginSeg.xml", null, _init);
		}

		function _init(data) {
			_container = $('#' + PoolConstants.GLOBAL_CONTAINER_DIV);
			_container.html("");
			_container.html(data);

			$("#registerUser").click(_registerUser);
			$("#loginId").click(handleClick);
		}

		function _registerUser(e) {
			objRef.navigateTo(PoolConstants.USER_REGISTRATION_SCREEN);
		}

		function handleClick(e) {
			var params = {};
			params["username"] = $("#usernameId").val();
			params["password"] = $("#passwordId").val();

			objRef.fireCommand(PoolConstants.LOGIN_COMMAND, [ params, _login,
					_loginFailed ]);
		}

		function _login() {
			objRef.navigateTo(PoolConstants.MAIN_SCREEN);
		}

		function _loginFailed() {
			var $span = $('<small/>').attr("id", "passwordId_error").addClass(
					'help-block errorMessage').insertAfter(
					$($("#passwordId")).html("Login or password didn't match"));
		}
	}
})();