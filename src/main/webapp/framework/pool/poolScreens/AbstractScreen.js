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
		objRef.post = post;
		objRef.get = get;
		objRef.fireCommand = post;
		objRef.fetch = fetch;
		objRef.navigateTo = navigateTo;

		function navigateTo(screenId, data) {
			var navigator = ScreenNavigator.getInstance();
			navigator.navigateTo(screenId, data);
		}

		function render() {

		}

		function fetch(path, callBack) {

			if (!callBack) {
				callBack = function() {
				}
			}

			$.get(_URL_PREFIX + path, function(data) {
				callBack(data);
			});
		}

		function get(commandName, arguments) {
			if (!arguments) {
				arguments = [];
			}
			arguments.unshift(commandName);
			arguments.unshift("GET");
			_fireCommand.apply(objRef, arguments);
		}

		function post(commandName, arguments) {
			if (!arguments) {
				arguments = [];
			}
			arguments.unshift(commandName);
			arguments.unshift("POST");
			_fireCommand.apply(objRef, arguments);
		}

		function _fireCommand(type, commandName, params, successFun, errorFun) {
			var paramStr = _buildParamStr(params);

			$.ajax({
				type : type,
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

			if (params) {
				for ( var propt in params) {
					paramStr = paramStr + propt + "=" + params[propt] + "&";
				}
				paramStr = paramStr.substring(0, paramStr.length - 1);
			}
			return paramStr;
		}
	}

})();