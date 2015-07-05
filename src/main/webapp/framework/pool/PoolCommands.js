PROJECT.namespace("PROJECT.pool");

(function() {
	/* class declaration */
	PROJECT.pool.PoolCommands = PoolCommands;

	/**
	 * @class PROJECT.pool.PoolCommands
	 */
	function PoolCommands() {

		var objRef = this;

		/* imports */
		// var RmaAction = FICO.base.http.RmaAction;
		// var _componentId;
		objRef.execute = execute;

		function execute(commandId, arguments) {
			if (commandId == NdRmaRuleFlowConstants.COMMAND_COPY_FLOW_ELEMENT) {
				if (_canExecuteCommand()) {
					objRef.copyVO.apply(objRef, arguments);
				}
			} else if (commandId == NdRmaRuleFlowConstants.COMMAND_DELETE_FLOW_ELEMENT) {
				if (_canExecuteCommand()) {
					objRef.deleteVO.apply(objRef, arguments);
				}
			}
		}

	}
})();