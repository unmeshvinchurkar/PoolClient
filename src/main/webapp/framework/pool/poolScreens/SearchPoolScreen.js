PROJECT.namespace("PROJECT.pool.poolScreens");

(function() {

	/* Class Declaration */
	PROJECT.pool.poolScreens.SearchPoolScreen = SearchPoolScreen;

	/* extends */
	PROJECT.pool.util.Lang.extend(SearchPoolScreen,
			PROJECT.pool.poolScreens.AbstractScreen);

	/**
	 * 
	 * 
	 * @class PROJECT.pool.map.GooglePoolMap
	 */
	function SearchPoolScreen(containerElemId, params) {

		SearchPoolScreen.superclass.constructor.call(this);

		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var PoolCommands = PROJECT.pool.PoolCommands;

		var _containerElemId = containerElemId

		var _container = null;
		var _geocoder = null;

		/* Public Properties */
		objRef.render = render;

		var _map;
		var _directionsService;
		var _directionsDisplay;
		var _markers = [];

		var _autocomplete = null;
		var _srcMarker = null;
		var _destMarker = null;
		var _infowindow = null;

		var _fromDateElem = null;
		var _toDateElem = null;
		var _startTimeElem = null;
		var _route = null;
		var _srcAddress = null;
		var _destAddress = null;
		var _poolPath = null;

		function render() {
			SegmentLoader.getInstance().getSegment("searchPoolSeg.xml", null,
					_init);
		}

		function _init(data) {

			_container = $('#' + _containerElemId);
			_container.html(data);

			$("#searchPoolsButton").click(_handleSearch);

			_fromDateElem = $("#fromDate");
			_toDateElem = $("#toDate");
			_startTimeElem = $('#startTime');

			$(_fromDateElem).datepicker({
				// dateFormat: 'yyyy-mm-dd',
				showOtherMonths : true,
				selectOtherMonths : true,
				changeYear : true
			// ,defaultDate: new Date()
			});

			$(_toDateElem).datepicker({
				// dateFormat: 'yyyy-mm-dd',
				showOtherMonths : true,
				selectOtherMonths : true,
				changeYear : true
			});

			$(_startTimeElem).timepicker({
				'step' : 15,
				'disableTextInput' : true,
				'forceRoundTime' : true
			});

			_directionsDisplay = new google.maps.DirectionsRenderer({
				suppressMarkers : true
			});

			var rendererOptions = {
				draggable : true
			};

			_geocoder = new google.maps.Geocoder();
			_directionsService = new google.maps.DirectionsService();

			var mapOptions = {
				zoom : 13,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			};
			_map = new google.maps.Map(document.getElementById('map-canvas'),
					mapOptions);
			_directionsDisplay.setMap(_map);
			
			$.get("http://ipinfo.io", function(response) {
				var latLngArry = response.loc.split(",");
				var latLng = new google.maps.LatLng(latLngArry[0],
						latLngArry[1]);
				_map.setCenter(latLng);
			}, "jsonp");

			// Create the search box and link it to the UI element.
			var input = (document.getElementById('pac-input'));
			_map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

			_autocomplete = new google.maps.places.Autocomplete(input);
			_autocomplete.bindTo('bounds', _map);

			_infowindow = new google.maps.InfoWindow();

			google.maps.event.addListener(_map, 'click', function(event) {
				_placeMarker(event.latLng);
			});

			google.maps.event.addListener(_autocomplete, 'place_changed',
					_navToPlace);

		}

		function _placeMarker(location) {

			var marker = new google.maps.Marker({
				position : location,
				map : _map
			});

			if (!_srcMarker) {
				_srcMarker = marker;
			} else if (!_destMarker) {
				_destMarker = marker;
				_calcRoute(_srcMarker.getPosition(), _destMarker.getPosition());
			} else if (!_srcMarker && !_destMarker) {
				_srcMarker = marker;
				_destMarker = null;
			} else if (_srcMarker && _destMarker) {
				_srcMarker.setMap(null);
				_destMarker.setMap(null);
				_srcMarker = null;
				_destMarker = null;
				marker.setMap(null);
				// Remove existing route(polyline) on the map
				_directionsDisplay.set('directions', null);

				if (_poolPath) {
					_poolPath.setMap(null);
				}
			}
		}

		function _calcRoute(startPos, destpos) {
			var request = {
				origin : startPos,
				destination : destpos,
				travelMode : google.maps.TravelMode.DRIVING,
				unitSystem : google.maps.UnitSystem.METRIC
			// ,key:"AIzaSyDM9TTxSkYXKz6F1XtOod-Nr8Q_wlRaNs4"
			};

			_directionsService
					.route(
							request,
							function(response, status) {
								if (status == google.maps.DirectionsStatus.OK) {

									_route = response.routes[0];

									// Place new markers on the MAP
									var route = response.routes[0];
									var legs = route.legs;
									var startLeg = legs[0];
									var endLeg = legs[legs.length - 1];

									var startStep = startLeg.steps[0];
									var endStep = endLeg.steps[endLeg.steps.length - 1];

									var startLoc = startStep["start_location"];
									var endLoc = endStep["end_location"];

									// Re-create src and dest markers
									_srcMarker.setMap(null);
									_destMarker.setMap(null);

									_srcMarker = new google.maps.Marker({
										position : startLoc,
										map : _map
									});

									_destMarker = new google.maps.Marker({
										position : endLoc,
										map : _map
									});

									_directionsDisplay.setDirections(response);

									_srcAddress = _route.legs[0].start_address;
									_destAddress = _route.legs[_route.legs.length - 1].end_address;

								} else {
									_route = null;
								}
							});

		}

		function _handleSearch(e) {
			var startDate = $(_fromDateElem).datepicker("getDate");
			var endDate = $(_toDateElem).datepicker("getDate");
			var timeinSeconds = $(_startTimeElem).timepicker(
					'getSecondsFromMidnight');
			var route = _route;

			var params = {};
			params["srcLat"] = _srcMarker.getPosition().lat();
			params["srcLng"] = _srcMarker.getPosition().lng();
			params["destLat"] = _destMarker.getPosition().lat();
			params["destLng"] = _destMarker.getPosition().lng();
			params["startTime"] = timeinSeconds;

			objRef.get(PoolConstants.SEARCH_POOL_COMMAND, [ params,
					_searchSuccess, _searchFailed ]);
		}

		function _searchSuccess(result) {

			var poolResults = [];

			if (result) {

				for (var i = 0; i < result.length; i++) {
					var data = result[i];

					var details = {};

					poolResults.push(details);
					var carpool = data["carpool"];
					var user = data["owner"];

					details["srcArea"] = carpool["srcArea"];
					details["destArea"] = carpool["destArea"];
					details["startTime"] = carpool["startTime"];
					details["carPoolId"] = carpool["carPoolId"];
					details["vehicleId"] = carpool["vehicleId"];
					details["pickupTime"] = carpool["pickupTime"];
					details["pickupLattitude"] = carpool["pickupLattitude"];
					details["pickupLongitude"] = carpool["pickupLongitude"];
					details["srcLattitude"] = carpool["srcLattitude"];
					details["srcLongitude"] = carpool["srcLongitude"];
					details["destLattitude"] = carpool["destLattitude"];
					details["destLongitude"] = carpool["destLongitude"];
					details["requestReceived"] = carpool["requestReceived"];
					details["username"] = user["username"];
					details["firstName"] = user["firstName"];
					details["lastName"] = user["lastName"];
					details["ownerId"] = user["userId"];
					details["gender"] = user["gender"];
					details["ownerName"] = user["firstName"] + " "
							+ user["lastName"];
				}
			}

			if (poolResults.length > 0) {
				objRef.navigateTo(PoolConstants.SEARCH_POOL_RESULT_SCREEN,
						poolResults);
			} else {
				alert("No Pools found");
			}
		}

		function _searchFailed() {
			alert("search failed");
		}

		function _navToPlace() {

			var place = _autocomplete.getPlace();
			if (!place.geometry) {
				window
						.alert("Autocomplete's returned place contains no geometry");
				return;
			}

			// If the place has a geometry, then present it
			// on a map.
			if (place.geometry.viewport) {
				_map.fitBounds(place.geometry.viewport);
			} else {
				_map.setCenter(place.geometry.location);
				_map.setZoom(17); // Why 17? Because it
				// looks good.
			}
		}

	}

})();