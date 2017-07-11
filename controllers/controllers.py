# -*- coding: utf-8 -*-
from odoo import http

# class GoogleMapsWidget(http.Controller):
#     @http.route('/google_maps_widget/google_maps_widget/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/google_maps_widget/google_maps_widget/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('google_maps_widget.listing', {
#             'root': '/google_maps_widget/google_maps_widget',
#             'objects': http.request.env['google_maps_widget.google_maps_widget'].search([]),
#         })

#     @http.route('/google_maps_widget/google_maps_widget/objects/<model("google_maps_widget.google_maps_widget"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('google_maps_widget.object', {
#             'object': obj
#         })