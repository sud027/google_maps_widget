# -*- coding: utf-8 -*-

from odoo import models, fields, api


class MapLocation(models.Model):
    _name = 'map.location'
    _description = 'Map Location'

    @api.model
    def get_configuration(self):
        Config = self.env['ir.config_parameter']
        maps_key = Config.sudo().get_param('maps_key')
        return {'key': maps_key}
