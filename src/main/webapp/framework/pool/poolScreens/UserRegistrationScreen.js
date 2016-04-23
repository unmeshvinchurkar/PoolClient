PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.UserRegistrationScreen = UserRegistrationScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(UserRegistrationScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * @class PROJECT.pool.poolScreens.UserRegistrationScreen
	 */
	function UserRegistrationScreen() {

		UserRegistrationScreen.superclass.constructor.call(this);

		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;
		var _container = null;
		var _birthDay = null;
		var _dialog = null;

		objRef.render = render;

		function render() {
			SegmentLoader.getInstance().getSegment("userRegistration.xml",
					null, _init);
		}

		function _init(data) {

			$("body").append(data);
			var dialogId = "dialogId";

			_dialog = $("#dialogId").dialog({
				height : 550,
				width : 700,
				draggable : false,
				modal : true,
				open : function() {
					$('.ui-widget-overlay').addClass('custom-overlay');
				},
				close : function() {
					_closeDialog($(this));
				}
			});

			_birthDay = $("#birthDay").datepicker({
				showOtherMonths : true,
				selectOtherMonths : true,
				changeYear : true,
				defaultDate : new Date()
			});

			$("#save").click(_handleSave);
			$("#refresh").click(_handleRefresh);
			$("#capchaContainer").find("img").attr("src",
					"/PoolServer/simpleImg");
		}

		function _handleRefresh(e) {
			$("#capchaContainer").find("img").attr("src",
					"/PoolServer/simpleImg");
		}

		function _handleSave(e) {
			var params = {};

			if ($("#password").val() == $("#rePassword").val()) {

				params["city"] = $("#city").val();
				params["username"] = $("#email").val();
				params["firstName"] = $("#firstName").val();
				params["lastName"] = $("#lastName").val();
				params["gender"] = $("#sex").val();
				params["vehicleId"] = $("#email").val();
				params["password"] = $("#password").val();
				params["streetAddress"] = $("#streetAddress").val();
				params["answer"] = $("#answer").val();
				params["pin"] = $("#pin").val();
				params["email"] = $("#email").val();
				params["state"] = $("#state").val();
				params["country"] = $("#country").val();

				var birthDay = $("#birthDay").datepicker("getDate");

				if (birthDay) {
					params["birthDate"] = birthDay.getTime();
				}

				objRef.fireCommand(PoolConstants.SIGN_UP_COMMAND, [ params,
						_saveSuccess, _saveError ]);
			}
		}

		function _saveSuccess(e) {
			_closeDialog(_dialog);
		}

		function _saveError(e) {

		}

		function _closeDialog(dialog) {
			$('.ui-widget-overlay').removeClass('custom-overlay');
			$(dialog).dialog('close');
			$(dialog).remove();
			$("#dialogId").remove();
		}
	}
})();