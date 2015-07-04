PROJECT.namespace("PROJECT.pool.map");

(function() {

	/* Class Declaration */
	PROJECT.pool.map.GooglePoolMap = GooglePoolMap;

	/**
	 * 
	 * 
	 * @class PROJECT.pool.map.GooglePoolMap
	 */
	function GooglePoolMap() {
		var objRef = this;

		var SegmentLoader = PROJECT.pool.util.SegmentLoader;
		var PoolConstants = PROJECT.pool.PoolConstants;
		var _container = null;

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

		function render() {
			SegmentLoader.getInstance().getSegment("createPoolSeg.xml", null,
					_init);
		}

		function _init(data) {

			_container = $('#' + PoolConstants.GLOBAL_CONTAINER_DIV);
			_container.html(data);

			$("#fromDate").datepicker({
				showOtherMonths : true,
				selectOtherMonths : true
			});

			$("#toDate").datepicker({
				showOtherMonths : true,
				selectOtherMonths : true
			});
			
			$('#startTime').timepicker();

			_directionsService = new google.maps.DirectionsService();
			_directionsDisplay = new google.maps.DirectionsRenderer({
				suppressMarkers : true
			});

			var rendererOptions = {
				draggable : true
			};

			_directionsService = new google.maps.DirectionsService();

			var mapOptions = {
				zoom : 7,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			};
			_map = new google.maps.Map(document.getElementById('map-canvas'),
					mapOptions);
			_directionsDisplay.setMap(_map);

			var defaultBounds = new google.maps.LatLngBounds(
					new google.maps.LatLng(-33.8902, 151.1759),
					new google.maps.LatLng(-33.8474, 151.2631));
			_map.fitBounds(defaultBounds);

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
			}
		}

		function _calcRoute(startPos, destpos) {
			var request = {
				origin : startPos,
				destination : destpos,
				travelMode : google.maps.TravelMode.DRIVING
			};

			_directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {

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
				}
			});
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

		function calcRoute() {

			var request = {
				origin : 'Sydney, NSW',
				destination : 'Sydney, NSW',
				waypoints : [ {
					location : 'Bourke, NSW'
				}, {
					location : 'Broken Hill, NSW'
				} ],
				travelMode : google.maps.TravelMode.DRIVING
			};
			_directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					// _directionsDisplay.setDirections(response);
				}
			});
		}

		function computeTotalDistance(result) {
			var total = 0;
			var myroute = result.routes[0];
			for (var i = 0; i < myroute.legs.length; i++) {
				total += myroute.legs[i].distance.value;
			}
			total = total / 1000.0;
			document.getElementById('total').innerHTML = total + ' km';
		}

	}

})();