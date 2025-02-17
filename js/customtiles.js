var map = L.map('map').setView([0, 0], 3);

L.tileLayer('https://api.mapbox.com/styles/v1/rabeky/cm79nyymn000f01r6al586n6t/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFiZWt5IiwiYSI6ImNtNnpkbzFwNTAzcDUyc3EwaDNkNmI5MWEifQ.6fUC9p0L22ftNmMzZAXJVQ', {
    maxZoom: 19,
}).addTo(map);

// I used ChatGPT and past labs to help with the below stuff

var info = L.control();

info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this._div.style.padding = '6px 8px';
    this._div.style.background = 'rgba(255, 255, 255, 0.7)';
    this._div.style.border = '2px solid black';
    this._div.style.borderRadius = '5px';
    this._div.style.fontSize = '16px';
    this._div.style.fontFamily = 'Arial, sans-serif';
    this._div.style.zIndex = '1000';
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = props ? `<strong>Timezone:</strong> ${props.time_zone}` : 'Hover over a timezone';
};

info.addTo(map);

var timezoneGroups = {};

fetch('./data/TimeZones.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function () {
                return {
                    color: "transparent",  
                    weight: 1,
                    fillOpacity: 0,  
                    fillColor: "transparent"
                };
            },
            onEachFeature: function (feature, layer) {
                const tz = feature.properties.time_zone;

                if (!timezoneGroups[tz]) {
                    timezoneGroups[tz] = [];
                }
                timezoneGroups[tz].push(layer);

                layer.on('mouseover', () => {
                    timezoneGroups[tz].forEach(l => {
                        l.setStyle({
                            color: '#39ff14', 
                            weight: 2,
                            fillOpacity: 0.4, 
                            fillColor: '#39ff14'
                        });
                    });
                    info.update(feature.properties);
                });

                layer.on('mouseout', () => {
                    timezoneGroups[tz].forEach(l => {
                        l.setStyle({
                            color: 'transparent',
                            weight: 1,
                            fillOpacity: 0,
                            fillColor: 'transparent'
                        });
                    });
                    info.update();
                });
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading TimeZones.geojson:', error));
