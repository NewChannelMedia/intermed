var plandecargo = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                                    <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.nombre || (depth0 != null ? depth0.nombre : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"nombre","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression, alias2=this.lambda;

  return "﻿<script>\r\n\r\n    \r\n    $(document).ready(function () {\r\n        $(\"#intervalocargo_id option\").each(function () {\r\n            if ($(this).val() == $(\"#idIntervalo\").val()) {\r\n                $(this).attr(\"selected\", true);\r\n            }\r\n        });\r\n    });\r\n\r\n</script>\r\n<section id=\"planes\">\r\n    <div class=\"container\">\r\n        <div class=\"row\">\r\n            <div class=\"panel\">\r\n                <div class=\"panel-body\">\r\n                    <h4>"
    + alias1(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h4>\r\n                    <form action=\"registrarplancargo\" method=\"POST\" id=\"plancargo\" name=\"plancargo\">\r\n                        <input type=\"hidden\" id=\"idPlan\" name=\"idPlan\" value=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plan : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" />\r\n                        <input type=\"hidden\" id=\"idIntervalo\" name=\"idIntervalo\" value=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plan : depth0)) != null ? stack1.intervalocargo_id : stack1), depth0))
    + "\" />\r\n                        <div class=\"form-row\">\r\n                            <label>\r\n                                <span>Nombre plan de cobro</span>\r\n                                <input type=\"text\" size=\"20\" id=\"nombre\" name=\"nombre\" value=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plan : depth0)) != null ? stack1.nombre : stack1), depth0))
    + "\" required />\r\n                            </label>\r\n                        </div>\r\n                        <div class=\"form-row\">\r\n                            <label>\r\n                                <span>monto</span>\r\n                                <input type=\"text\" size=\"20\" id=\"monto\" name=\"monto\" required value=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plan : depth0)) != null ? stack1.monto : stack1), depth0))
    + "\" />\r\n                            </label>\r\n                        </div>\r\n                        <div class=\"form-row\">\r\n                            <label>\r\n                                <span>intervalo</span>\r\n                                <select class=\"form-control\" name=\"intervalocargo_id\" id=\"intervalocargo_id\" required=\"required\">\r\n                                    <option value=\"0\">Intervalo</option>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.intervalo : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                </select>\r\n                            </label>\r\n                        </div>\r\n                        <div class=\"form-row\">\r\n                            <label>\r\n                                <span>frecuencia de cobro</span>\r\n                                <input type=\"text\" size=\"2\" id=\"frecuencia\" name=\"frecuencia\" required value=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plan : depth0)) != null ? stack1.frecuencia : stack1), depth0))
    + "\" />\r\n                            </label>\r\n                        </div>\r\n                        <div class=\"form-row\">\r\n                            <label>\r\n                                <span>periodo de prueba(dias)</span>\r\n                                <input type=\"text\" size=\"2\" id=\"periodoprueba\" name=\"periodoprueba\" required value=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plan : depth0)) != null ? stack1.periodoprueba : stack1), depth0))
    + "\" />\r\n                            </label>\r\n                        </div>\r\n                        <button type=\"submit\" id=\"enviar\" name=\"enviar\">Registrar</button>\r\n                        \r\n                    </form>\r\n                    <form action=\"eliminarplancargo\" method=\"POST\" id=\"plancargo\" name=\"plancargo\">\r\n                        <input type=\"hidden\" id=\"idPlanEliminar\" name=\"idPlanEliminar\" value=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plan : depth0)) != null ? stack1.id : stack1), depth0))
    + "\" />\r\n                        <button type=\"submit\" id=\"eliminar\" name=\"eliminar\">Eliminar</button>\r\n                    </form>\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</section>\r\n\r\n\r\n";
},"useData":true});