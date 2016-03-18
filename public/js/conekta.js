

$(function () {
    conektaSuccessResponseHandler = function (token) {
        $("#card-form").append($("<input type='hidden' name='conektaTokenId' />").val(token.id));
        $("#card-form").get(0).submit();
    }

    conektaErrorResponseHandler = function (response) {
        $("#card-form .card-errors").text(response.message);
        var $form = $(this);
        //$form.find("button").prop("disabled", false);

    }

    $("#card-form").submit(function (event) {
        var $form = $(this);

        // Previene hacer submit más de una vez
        //$form.find("button").prop("disabled", true);
        Conekta.token.create($form, conektaSuccessResponseHandler, conektaErrorResponseHandler);

        // Previene que la información de la forma sea enviada al servidor
        return false;

        //$("#card-form").find("button").prop("disabled", true);
        //Conekta.token.create($("#card-form"), conektaSuccessResponseHandler, conektaErrorResponseHandler);
        //return false;
    });
})
