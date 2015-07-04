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
		var _container = null;

		/* Public Properties */
		objRef.render = render;

		function render() {
			SegmentLoader.getInstance().getSegment("loginSeg.xml", null, _init);
		}

		function _init(data) {
			_container = $('#' + PoolConstants.GLOBAL_CONTAINER_DIV);
			_container.html(data);
			$("#loginId").click(_handleClick);
		}

		function _handleClick(e) {
			var username = $("#usernameId").val();
			var passwd = $("#passwordId").val();

			var params = "username=" + username + "&password=" + passwd;

			$.ajax({
				type : "POST",
				url : "http://localhost:8080/PoolServer/rest/carpool/login",
				async : true,
				data : params,
				success : _login,
				error : _loginFailed
			});
		}

		function _login() {
			// alert("login successful");
			var gMap = new PROJECT.pool.map.GooglePoolMap();
			gMap.render();
		}

		function _loginFailed() {
			alert("login failed");
		}

	}

})();