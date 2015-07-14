PROJECT.namespace("PROJECT.pool");

(function() {
	/* class declaration */
	PROJECT.pool.ScreenNavigator = ScreenNavigator;

	/**
	 * @class PROJECT.pool.PoolCommands
	 */
	function ScreenNavigator() {

		if (ScreenNavigator.caller != ScreenNavigator.getInstance) {
			throw new Error(
					"There is no public constructor for PoolCommands. Use PoolCommands.getInstance().");
		}

		var objRef = this;

		/* imports */
		var PoolConstants = PROJECT.pool.PoolConstants;
		var CreateUpdatePoolScreen = PROJECT.pool.poolScreens.CreateUpdatePoolScreen;
		var MyPoolScreen = PROJECT.pool.poolScreens.MyPoolScreen;

		// var _componentId;
		objRef.navigateTo = navigateTo;

		function navigateTo(screenId, params) {

			if (screenId == PoolConstants.MAIN_SCREEN) {
				var mainScreen = new PROJECT.pool.poolScreens.MainScreen(params);
				mainScreen.render();
			} else if (screenId == PoolConstants.LOGIN_SCREEN) {
				var login = new PROJECT.pool.poolScreens.LoginScreen();
				login.render();
			} else if (screenId == PoolConstants.MY_POOLS_SCREEN) {
				var myPoolScreen = new MyPoolScreen(PoolConstants.RIGHT_CONTENT);
				myPoolScreen.render();
			} else if (screenId == PoolConstants.CREATE_UPDATE_POOL_SCREEN) {
				var screen = new CreateUpdatePoolScreen(
						PoolConstants.RIGHT_CONTENT, params);
				screen.render();
			}
		}
	}

	/**
	 * This method creates the singleton object of PoolCommands.
	 * 
	 * @function {public PoolCommands} getInstance
	 * @return Returns object of PoolCommands class
	 */
	ScreenNavigator.getInstance = function() {
		if (!ScreenNavigator.instance) {
			ScreenNavigator.instance = new ScreenNavigator();
		}
		return ScreenNavigator.instance;
	};

})();