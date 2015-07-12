PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.LoginScreen = LoginScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(LoginScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * @class PROJECT.pool.map.GooglePoolMap
	 */
	function LoginScreen() {

		LoginScreen.superclass.constructor.call(this);
		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;

		var _container = null;

		objRef.userName = ko.observable("");
		objRef.password = ko.observable("");

		/* Public Properties */
		objRef.render = render;
		objRef.handleClick = handleClick;

		function render() {
			SegmentLoader.getInstance().getSegment("loginSeg.xml", null, _init);
		}

		function _init(data) {
			_container = $('#' + PoolConstants.GLOBAL_CONTAINER_DIV);
			_container.html(data);
			ko.applyBindings(objRef);
		}

		function handleClick(e) {
			var params = {};
			params["username"] = objRef.userName();
			params["password"] = objRef.password();

			objRef.fireCommand(PoolConstants.LOGIN_COMMAND, [ params, _login,
					_loginFailed ]);
		}

		function _login() {
			objRef.navigateTo(PoolConstants.MAIN_SCREEN);
		}

		function _loginFailed() {
			alert("login failed");
		}
	}
})();