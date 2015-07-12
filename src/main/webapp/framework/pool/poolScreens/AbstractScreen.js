PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.AbstractScreen = AbstractScreen;

	/**
	 * @class PROJECT.pool.poolScreens.AbstractScreen
	 */
	function AbstractScreen() {
		var objRef = this;

		var PoolConstants = PROJECT.pool.PoolConstants;
		var ScreenNavigator = PROJECT.pool.ScreenNavigator;

		var _URL_PREFIX = "http://localhost:8080/PoolServer/rest/carpool/";

		/* Public Properties */
		objRef.render = render;
		objRef.getJsonData = getJsonData;
		objRef.fireCommand = fireCommand;
		objRef.navigateTo = navigateTo;

		function navigateTo(screenId, data) {
			var navigator = ScreenNavigator.getInstance();
			navigator.navigateTo(screenId, data);
		}

		function render() {

		}

		function fireCommand(commandName, arguments) {
			arguments.unshift(commandName);
			_fireCommand.apply(objRef, arguments);
		}

		function _fireCommand(commandName, params, successFun, errorFun) {
			var paramStr = _buildParamStr(params);

			$.ajax({
				type : "POST",
				url : _URL_PREFIX + commandName,
				async : true,
				data : paramStr,
				success : successFun,
				error : errorFun
			});
		}

		function getJsonData(jsonDataStr) {
			var jsonData;
			jsonData = $.parseJSON(jsonDataStr);
			return jsonData;
		}

		function _buildParamStr(params) {
			var paramStr = "";
			for ( var propt in params) {
				paramStr = paramStr + propt + "=" + params[propt] + "&";
			}
			paramStr = paramStr.substring(0, paramStr.length - 1);
			return paramStr;
		}
	}

})();