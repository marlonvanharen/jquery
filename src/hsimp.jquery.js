"use strict";

var main = require("main");
var L = require("library");

main.setNamedNumberDictionary(require("named-number/named-number-dictionary"));
main.setPeriodDictionary(require("period/period-dictionary"));
main.setCheckerDictionary(require("checker/checker-dictionary"));

(function ($) {
    var createOutputDiv = function (input) {
        var parent = input.offsetParent(),
            div = $("<div />").addClass("hsimp-results"),
            pos = input.position(),
            padding = {
                top: +(input.css("padding-top").replace("px", "")),
                bottom: +(input.css("padding-bottom").replace("px", ""))
            }

        div.width(parent.width() - pos.left);

        div.css({
            left: pos.left,
            top: pos.top + input.height() + padding.top + padding.bottom
        })

        return div;
    };

    var listify = function (item) {
        var header = $("<h4 />").text(item.name).addClass("hsimp-check__header").addClass("hsimp-check__header--" + item.level),
            message = $("<p />").text(item.message).addClass("hsimp-check__message");

        return $("<li />").append(header, message).addClass("hsimp-results__check");
    };

    var setup = function (index, item) {
        var input = $(item);

        input.addClass("hsimp-level");

        var outputDiv = createOutputDiv(input).hide();
        input.after(outputDiv);

        var result = $("<p />").addClass("hsimp-results__time"),
            resultText = $("<span />"),
            checks = $("<ul />").addClass("hsimp-results__checks");

        result.append($("<strong/ >").text("Time to crack: "), resultText);

        outputDiv.append(result, checks);

        input.on("keyup", function () {
            var value = input.val(),
                password = main(value);

            if (value.length) {
                input.addClass("hsimp-level--" + password.getSecurityLevel());
                outputDiv.fadeIn();
                resultText.text(password.getString());
                checks.html(L.map(listify, password.getChecks()));
            } else {
                input.removeClass("hsimp-level--insecure hsimp-level--bad hsimp-level--ok hsimp-level--good");
                outputDiv.fadeOut();
                resultText.empty();
                checks.empty();
            }
        });
    };

    $.fn.hsimp = function (options) {
        $(this).each(setup);
    };
}(jQuery))
