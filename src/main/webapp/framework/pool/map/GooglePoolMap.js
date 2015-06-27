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
		var _container = $("#" + PoolConstants.GLOBAL_CONTAINER_DIV);

		/* Public Properties */
		objRef.render = render;

		var _map;
		var _directionsService;
		var _directionsDisplay;
		var _markers = [];
		var _searchBox = null;

		function render() {
			_init();
		}

		function _init() {

			_container = $('#' + PoolConstants.GLOBAL_CONTAINER_DIV);
			_container.html(SegmentLoader.getInstance().getSegment(
					"createPoolSeg.xml"));

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

			var defaultBounds = new google.maps.LatLngBounds(
					new google.maps.LatLng(-33.8902, 151.1759),
					new google.maps.LatLng(-33.8474, 151.2631));
			_map.fitBounds(defaultBounds);

			// Create the search box and link it to the UI element.
			var input = (document.getElementById('pac-input'));
			_map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

			_searchBox = new google.maps.places.SearchBox(input);

			google.maps.event.addListener(_searchBox, 'places_changed',
					_drawMarkers);

			// Bias the SearchBox results towards places that are within the
			// bounds of the
			// current map's viewport.
			google.maps.event.addListener(_map, 'bounds_changed', function() {
				var bounds = _map.getBounds();
				_searchBox.setBounds(bounds);
			});

			// calcRoute();

		}

		function _drawMarkers() {
			var places = _searchBox.getPlaces();

			if (places.length == 0) {
				return;
			}
			for (var i = 0, marker; marker = _markers[i]; i++) {
				marker.setMap(null);
			}

			// For each place, get the icon, place name, and location.
			markers = [];
			var bounds = new google.maps.LatLngBounds();
			for (var i = 0, place; place = places[i]; i++) {
				var image = {
					url : place.icon,
					size : new google.maps.Size(71, 71),
					origin : new google.maps.Point(0, 0),
					anchor : new google.maps.Point(17, 34),
					scaledSize : new google.maps.Size(25, 25)
				};

				// Create a marker for each place.
				var marker = new google.maps.Marker({
					map : map,
					icon : image,
					title : place.name,
					position : place.geometry.location
				});

				_markers.push(marker);

				bounds.extend(place.geometry.location);
			}

			_map.fitBounds(bounds);
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