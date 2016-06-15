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
		var _validator = null;

		objRef.render = render;

		function render() {
			SegmentLoader.getInstance().getSegment("userRegistration.xml",
					null, _init);
		}

		function _init(data) {
			
			$("#dialogId").remove();

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
				defaultDate : new Date(),
				yearRange:"1920:2016"
			});

			
			$("#save").click(_handleSave);
			$("#refresh").click(_handleRefresh);
			$("#capchaContainer").find("img").attr("src",
					"/PoolServer/simpleImg");
			
			setTimeout(function(){ $("#capchaContainer").find("img").attr("src",
			"/PoolServer/simpleImg"); }, 2000);
			

			_validator = new FormValidator('registrationForm', [ {
				name : 'email',
				display : 'Email',
				rules : 'required|valid_email'
			}, {
				name : 'contactNo',
				display : 'Contact No',
				rules : 'required|exact_length[10]|integer'
			}, {
				name : 'password',
				display : 'Password',
				rules : 'required|min_length[6]|max_length[20]'
			}, {
				name : 'password_confirm',
				display : 'password confirmation',
				rules : 'required|matches[password]'
			}, {
				name : 'firstname',
				rules : 'required|alpha|max_length[30]'
			}, {
				name : 'lastname',
				rules : 'required|alpha|max_length[30]'
			}, {
				name : 'birthDay',
				rules : 'required'
			}, {
				name : 'streetAddress',
				rules : 'required|max_length[50]'
			}, {
				name : 'city',
				rules : 'required|alpha|max_length[50]'
			}, {
				name : 'state',
				rules : 'required|alpha|max_length[50]'
			}, {
				name : 'country',
				rules : 'required|alpha|max_length[50]'
			}, {
				name : 'pin',
				rules : 'required|integer|max_length[10]'
			}, {
				name : 'answer',
				rules : 'required|alpha_numeric'
			}, {
				name : 'rePassword',
				display : 'Confirm password',
				rules : 'required'
			}, {
				name : 'sex',
				display : 'Gender',
				rules : 'required|alpha'
			} ], function(errors, event) {

				$("small[id$='_error']").remove();

				if (errors.length > 0) {
					for (var i = 0; i < errors.length; i++) {
						var $span = $('<small/>').attr("id",
								errors[i].id + "_error").addClass(
								'help-block errorMessage').insertAfter(
								$(errors[i].element)).html(errors[i].message);
					}

				} else {
					_saveForm()
				}
			});

		}

		

		function _handleRefresh(e) {
			$("#capchaContainer").find("img").attr("src",
					"/PoolServer/simpleImg");
		}

		function _handleSave(e) {
			_validator.form.onsubmit();
		}

		function _saveForm() {

			var params = {};

			if ($("#password").val() == $("#rePassword").val()) {

				params["city"] = $("#city").val();
				params["username"] = $("#email").val();
				params["firstName"] = $("#firstname").val();
				params["lastName"] = $("#lastname").val();
				params["gender"] = $("#sex").val();
				params["vehicleId"] = $("#email").val();
				params["password"] = $("#password").val();
				params["streetAddress"] = $("#streetAddress").val();
				params["answer"] = $("#answer").val();
				params["pin"] = $("#pin").val();
				params["email"] = $("#email").val();
				params["state"] = $("#state").val();
				params["country"] = $("#country").val();
				params["sex"] = $("#sex").val();

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