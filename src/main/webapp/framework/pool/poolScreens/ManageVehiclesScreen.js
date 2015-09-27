PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.ManageVehiclesScreen = ManageVehiclesScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(ManageVehiclesScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * @class PROJECT.pool.map.ManageVehiclesScreen
	 */
	function ManageVehiclesScreen(containerElemId, params) {

		ManageVehiclesScreen.superclass.constructor.call(this);

		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;

		var _containerElemId = containerElemId

		var _container = null;

		/* Public Properties */
		objRef.render = render;

		function render() {
			SegmentLoader.getInstance().getSegment("manageVehiclesSeg.xml",
					null, _init);
		}

		function _init(data) {
			_container = $('#' + _containerElemId);
			_container.html(data);
			_loadVehicleData();

			$("#submit").click(_handleClick);
		}

		function _loadVehicleData() {

			objRef.fetch("getVehicle", fillData);

			function fillData(data) {
				if (data) {
					$("#VehicledetailManufacturer").val(data.manufacturer);
					$("#VehicledetailModelname").val(data.model);
					$("#VehicledetailFueltype").val(data.fuelType);
					$("#VehicledetailColour").val(data.color);
					$("#VehicledetailRegistrationNumber").val(
							data.registrationNo);
					$("#VehicledetailDrivingLicense").val(data.drivingLicense);
				}
			}
		}

		function _handleClick(e) {
			var params = {};
			params["manufacturer"] = $("#VehicledetailManufacturer").val();
			params["model"] = $("#VehicledetailModelname").val();
			params["fuelType"] = $("#VehicledetailFueltype").val();
			params["color"] = $("#VehicledetailColour").val();
			params["registrationNumber"] = $("#VehicledetailRegistrationNumber")
					.val();
			params["drivingLicense"] = $("#VehicledetailDrivingLicense").val();

			objRef.fireCommand("addVehicle",
					[ params, _saveSuccess, _saveError ]);

		}

		function _saveSuccess(data) {
			alert("saved");
		}

		function _saveError(data) {
			alert("save failed");
		}
	}
})();