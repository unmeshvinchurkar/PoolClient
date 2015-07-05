PROJECT.namespace("PROJECT.pool");

(function() {
	/* class declaration */
	PROJECT.pool.PoolCommands = PoolCommands;

	/**
	 * @class PROJECT.pool.PoolCommands
	 */
	function PoolCommands() {

		if (PoolCommands.caller != PoolCommands.getInstance) {
			throw new Error(
					"There is no public constructor for PoolCommands. Use PoolCommands.getInstance().");
		}

		var objRef = this;
		var _URL_PREFIX = "http://localhost:8080/PoolServer/rest/carpool/";

		/* imports */

		var PoolConstants = PROJECT.pool.PoolConstants;

		// var _componentId;
		objRef.execute = execute;
		objRef.fireCommand = fireCommand;

		function execute(commandId, arguments) {
			if (commandId == PoolConstants.LOGIN_COMMAND) {
				_login.apply(objRef, arguments);
			}

			else if (commandId == PoolConstants.CREATE_POOL_COMMAND) {
				arguments.unshift(commandId);
				_fireCommand.apply(objRef, arguments);
			}
		}

		function _login(params, successFun, errorFunc) {
			objRef.fireCommand(PoolConstants.LOGIN_COMMAND,
					_buildParamStr(params), successFun, errorFunc);
		}

		function _buildParamStr(params) {
			var paramStr = "";
			for ( var propt in params) {
				paramStr = paramStr + propt + "=" + params[propt] + "&";
			}
			paramStr = paramStr.substring(0, paramStr.length - 1);
			return paramStr;
		}

		function _fireCommand(commandName, params, successFun, errorFunc) {
			objRef.fireCommand(commandName, _buildParamStr(params), successFun,
					errorFunc);
		}

		function fireCommand(commandName, params, successFun, errorFun) {
			$.ajax({
				type : "POST",
				url : _URL_PREFIX + commandName,
				async : true,
				data : params,
				success : successFun,
				error : errorFun
			});
		}

	}

	/**
	 * This method creates the singleton object of PoolCommands.
	 * 
	 * @function {public PoolCommands} getInstance
	 * @return Returns object of PoolCommands class
	 */
	PoolCommands.getInstance = function() {
		if (!PoolCommands.instance) {
			PoolCommands.instance = new PoolCommands();
		}
		return PoolCommands.instance;
	};

})();