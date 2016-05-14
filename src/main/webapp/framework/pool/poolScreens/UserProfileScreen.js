PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.UserProfileScreen = UserProfileScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(UserProfileScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * @class PROJECT.pool.poolScreens.UserProfileScreen
	 */
	function UserProfileScreen(containerId, userId) {

		UserProfileScreen.superclass.constructor.call(this);

		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;
		var _container = null;
		var _containerElemId = containerId;
		var _userId = userId;
		var _validator = null;

		/* Public Properties */
		objRef.render = render;

		function render() {
			SegmentLoader.getInstance().getSegment("userDetails.xml", null,
					_init);
		}

		function _init(data) {
			_container = $('#' + _containerElemId);
			_container.html(data);

			if (_userId) {
				objRef.get(PoolConstants.GET_USER_DETAILS_COMMAND + "/"
						+ _userId, [ {}, _renderUserDetails, _fetchingFailed ]);
			} else {
				objRef.get(PoolConstants.GET_CURRENT_USER_DETAILS_COMMAND, [
						{}, _renderUserDetails, _fetchingFailed ]);
			}
		}

		function _renderUserDetails(data) {
			$("#name").val(data["firstName"] + " " + data["lastName"]);
			$("#email").val(data["email"]);
			$("#gender").val(data["gender"]);
			$("#drivingLicenseNo").val(data["drivingLicense"]);
			$("#contactNo").val(data["contactNo"]);
			$("#city").val(data["city"]);
			$("#state").val(data["state"]);
			$("#country").val(data["country"]);
			$("#address").val(data["address"]);
			$("#birthday").val(data["birthday"]);

			$("#editDetails").click(_handleUserDetails);
		}

		function _handleUserDetails(e) {

			var readonly = $("#contactNo").attr("readonly");
			var editedFields = $("#address, #pin, #contactNo, #streetAddress, #city, #state, #country");
			$("small[id$='_error']").remove();

			if (readonly == "readonly") {

				editedFields.removeAttr("readonly");

				_validator = new FormValidator('userDetailsForm', [ {
					name : 'contactNo',
					display : 'Contact No',
					rules : 'required|exact_length[10]|integer'
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
				} ], function(errors, event) {

					$("small[id$='_error']").remove();

					if (errors.length > 0) {
						for (var i = 0; i < errors.length; i++) {
							var $span = $('<small/>').attr("id",
									errors[i].id + "_error").addClass(
									'help-block errorMessage').insertAfter(
									$(errors[i].element)).html(
									errors[i].message);
						}

					} else {
						_saveUser();
					}
				});

				$("#editDetails").html("Cancel Edit");

				$("#userDetailsForm").append(
						'<input type="button" id="save" class="btn btn-custom btn-lg btn-block"'
								+ 'value="Save" />');

				$("#save").click(function(e) {
					_validator.form.onsubmit();
				});

				$("#uploadTrigger").on('click', function(event) {
					$("#file-id").trigger('click');
				});
				$(":file").on('change', _onFilechange);

			} else {
				editedFields.attr("readonly", true);
				$("#editDetails").html("Edit Details");
				$("#save").remove();

				$("#uploadTrigger").off();
				$(":file").off();
			}
		}

		function _onFilechange() {

			var file = this.files[0], name = file.name, size = file.size, type = file.type;

			// validation
			var imageType = new Array("image/png", "image/jpeg", "image/gif",
					"image/bmp");

			if (name.length < 1) {
				$("#status_msg").html("Invalid file").css('color', '#F00000');
				return false;
			} else if (size > 10000000) {
				$("#status_msg").html("The file is too big").css('color',
						'#F00000');
				return false;
			}
			else if (jQuery.inArray(type, imageType) == -1) {
				$("#status_msg").html(
						"Valid file formats are: jpg, jpeg,png, gif").css(
						'color', '#F00000');
				return false;
			} else {
				$("#status_msg").html(" ");
				if ($("#file-id").val() !== '') {

					var formData = new FormData();
					formData.append('file', file);

					$('#profileImg').addClass('profile-image-loading')
							.removeClass('profile-image').attr('src',
									'framework/style/images/fb_loading.gif');

					objRef.upload(PoolConstants.UPLOAD_PROFILE_IMAGE, _success,
							_error, formData);

					function _error() {
						$("#status_msg").html("Uploading file failed").css(
								'color', '#F00000');
					}

					function _success(data) {

						var reader = new FileReader();
						reader.onload = function(e) {
							$('.profile-image-loading').addClass(
									'profile-image').removeClass(
									'profile-image-loading').attr('src',
									e.target.result);
							return false;
						}
						reader.readAsDataURL(file);
						$("#status_msg").html(data['msg']).css('color',
								'#009900');

					}
				} else {
					alert("Please select valid image.");
					return false;
				}
			}
		}

		function _saveUser() {

			var params = {};

			params["city"] = $("#city").val();
			params["streetAddress"] = $("#address").val();
			params["contactNo"] = $("#contactNo").val();
			params["pin"] = $("#pin").val();
			params["state"] = $("#state").val();
			params["country"] = $("#country").val();

			objRef.fireCommand(PoolConstants.EDIT_USER_COMMAND, [ params,
					_saveSuccess, _saveError ]);
		}

		function _saveSuccess() {
		}
		function _saveError() {
		}

		function _fetchingFailed() {
		}
	}

})();