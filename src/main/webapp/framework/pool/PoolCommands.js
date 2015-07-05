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