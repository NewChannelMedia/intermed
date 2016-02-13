var suscripcioncancelar = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "﻿<section id=\"pagos\">\r\n    <div class=\"container\">\r\n        <div class=\"row\">\r\n            <div class=\"panel\">\r\n                <div class=\"panel-body\">\r\n                    <h4>"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h4>\r\n\r\n                    <form action=\"suscripcioncancelar\" method=\"POST\" id=\"frm\" name=\"frm\">\r\n                        <input type=\"hidden\" id=\"idUsuario\" name=\"idUsuario\" value=\""
    + alias3(((helper = (helper = helpers.idUsuario || (depth0 != null ? depth0.idUsuario : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idUsuario","hash":{},"data":data}) : helper)))
    + "\" />\r\n                        <div>\r\n                            <br />\r\n                            <button type=\"submit\" id=\"enviar\" name=\"enviar\">Cancelar Suscripcion</button>\r\n                        </div>\r\n                    </form>\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</section>\r\n\r\n\r\n\r\n\r\n\r\n";
},"useData":true});