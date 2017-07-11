# -*- coding: utf-8 -*-
{
    'name': "Google Maps Widget",

    'summary': """
        """,

    'description': """

    """,

    'author': "Navyug Infosolutions",
    'website': "http://www.navyuginfo.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/master/odoo/addons/base/module/module_data.xml
    # for the full list
    'category': 'Widget',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/views.xml',
    ],
    'qweb':[
        'static/src/xml/template.xml',
    ],
}