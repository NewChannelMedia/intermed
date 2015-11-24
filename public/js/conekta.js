

$(function () {
    conektaSuccessResponseHandler = function (token) {                
        $("#card-form").append($("<input type='hidden' name='conektaTokenId' />").val(token.id));
        $("#card-form").get(0).submit();
    }

    conektaErrorResponseHandler = function (response) {        
        $("#card-form .card-errors").text(response.message);
        $form.find("button").prop("disabled", false);
    }

    $("#card-form").submit(function (event) {
        $('#enviar').prop("disabled", true);        
        Conekta.token.create($("#card-form"), conektaSuccessResponseHandler, conektaErrorResponseHandler);
        return false;
    });
})