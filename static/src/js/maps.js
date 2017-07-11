odoo.define('google_maps_widget.maps_widget', function (require) {
    "use strict";

    var core = require('web.core');
    var common = require('web.form_common');
    var data = require('web.data');

    var QWeb = core.qweb;

    var MapsField = common.AbstractField.extend(common.CompletionFieldMixin, common.ReinitializeFieldMixin,{
        template: "FieldGoogleMaps",
        init: function(field_manager, node) {
            var self = this;
            self._super(field_manager, node);
            self.map_options = {
                zoom: 16
            };
            self.marker = null;
            self.map=null;
            if(!('google' in window)) {
                self.load_configuration_data().then(function(data){
                    self.initialize_map(data);
                })
            }
            self.on("change:value", this, function() {
                if(!('google' in window)) return;
                self.render_view();
            });
        },
        start: function(){
            this._super.apply(this, arguments);
            if(!('google' in window)) return;
            var self = this;
            self.render_view();
        },
        set_geocode_location: function(){
            var self = this;
            var location = new google.maps.LatLng(28.6926337,77.217407);
            var title = 'Default Title';
            var geocoder = new google.maps.Geocoder();
            var value = self.get_value() || null;
            var address = self.create_address();

            if(value){
                value = value.split(',');
                location = new google.maps.LatLng(parseFloat(value[0]), parseFloat(value[1]));
                setTimeout(function(){
                    google.maps.event.trigger(self.map, 'resize');
                    self.map.setCenter(location);
                    self.set_marker(location, self.get_value());
                }, 100);
            }else{
                geocoder.geocode({'address': address}, function(result, status){

                    if(status == google.maps.GeocoderStatus.OK){
                        location = _.first(result).geometry.location;
                        title = _.first(result).formatted_address;
                    }
                    google.maps.event.trigger(self.map, 'resize');
                    self.map.setCenter(location);
                    self.set_marker(location, title);
                });
            }
        },
        update_value: function(latLng){
            var self = this;
            if((self.view.get('actual_mode') == 'view')) return;
            var value = [latLng.lat(), latLng.lng()].toString();
            this.internal_set_value(value);
        },
        render_view: function(){
            var self = this;
            if(!self.$el.parent().find('#map')[0]) return;
            if(self.map == null){
                self.map = new google.maps.Map(self.$el.parent().find('#map')[0], self.map_options);
                self.append_update_button();
            }
            self.set_geocode_location();
            self.map.addListener('click', function(e) {
                self.update_value.apply(self, [e.latLng]);
            });
        },
        update_marker: function(latLng){
            var self = this;
            self.marker.setPosition(latLng);
            self.update_value(latLng);
        },
        set_marker: function(location, title){
            var self = this;
            if(self.marker){
                self.marker.setPosition(location);
                self.marker.setTitle(title);
            }else{
                self.marker = new google.maps.Marker({
                    position: location,
                    title: title,
                });
                self.marker.setMap(self.map);

            }
        },
        append_update_button: function(){
            var self = this;
            var button_ele = $(QWeb.render('UpdateButton'));
            button_ele.on('click', function(e){
                self.render_view.apply(self);
            });
            $(self.$el.parent()[0]).append(button_ele);
        },
        create_address: function(){
            var self = this;
            var address_fields = self.node.attrs['address_fields'];
            if(!address_fields) return false;
            var address = [];
            address_fields.split(',').forEach(function(ele){
                var value = self.field_manager.datarecord[ele];
                if(value) address.push(value);
            });
            return address.join(',');
        },
        load_configuration_data: function(){
            var ds = new data.DataSet(self, 'map.location');
            return ds.call('get_configuration');
        },
        initialize_map: function(data){
            var params = [];
            var self = this;
            if('key' in data){
                params.push('key='+data['key']);
            }
            var source = 'https://maps.googleapis.com/maps/api/js?'+params.join('&');
            $.getScript(source).done(function(script, status){
                self.render_view();
            }).fail(function(jqxhr, settings, exception){
                console.log(exception);
                alert('Unable to load maps');
            });
        }
    });
    core.form_widget_registry.add('maps', MapsField)
});