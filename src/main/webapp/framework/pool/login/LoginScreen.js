PROJECT.namespace("PROJECT.pool.login");

(function() {

	/* Class Declaration */
	PROJECT.pool.login.LoginScreen = LoginScreen;

	/**
	 * @class PROJECT.pool.map.GooglePoolMap
	 */
	function LoginScreen() {
		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;
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
			params["username"] = objRef.userName;
			params["password"] = objRef.password;

			PoolCommands.getInstance().execute(PoolConstants.LOGIN_COMMAND,
					[ params, _login, _loginFailed ]);
		}

		function _login() {
			var gMap = new PROJECT.pool.map.GooglePoolMap();
			gMap.render();
		}

		function _loginFailed() {
			alert("login failed");
		}

	}

})();