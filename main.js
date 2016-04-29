// Loads the Skills to the dropdown
$(function() {
    $.get("http://localhost:3000/skills", 
        {}, 
        function(data, status) {
            data.forEach(function(skill) {
                var skillName = skill.value
                $("#skill-filter").append($("<option />").text(skillName).val(skillName));
            });
        });
});

// Book filter onsubmit
$(function() {
    $("#filter").on("submit",
        function(event) {
            event.preventDefault();
            var selectedSkill = $("select[name='skill-filter'] option:selected").text();
            $.get("http://localhost:3000/books/skill/" + selectedSkill, 
                {},
                function(data, status) {
                    $("#results").empty();
                    $("#results").append("<h3>Books Selected</h3>");
                    data.forEach(function(book) {
                        // build book table
                        var panel = "<div class='panel panel-default'>";
                        panel += "<div class='panel-heading'>";
                        panel += "<h3>" + book.title + "</h3>";
                        panel += "</div>";
                        panel += "<div class='panel-body'>";
                        panel += "<div class='row'>";
                        panel += "<div class='col-xs-4'>";
                        panel += "<div class='thumbnail'>";
                        panel += "<img src='" + book.image_url + "'>";
                        panel += "</div>";
                        panel += "</div>";
                        panel += "<div class='col-xs-8'>";
                        panel += "<p><strong>Author</strong>: " + book.author_name + "</p>";
                        panel += "<p><strong>Author Bio</strong>: " + book.author_bio + "</p>";
                        panel += "<p><strong>Book Description</strong>: " + book.desc + "</p>";
                        panel += "<p><strong>Price in USD</strong>: " + book.price + "</p>";
                        panel += "<p><strong>Rating</strong>: " + book.rating + "</p>";
                        panel += "</div>";
                        panel += "</div>";
                        $("#results").append(panel);
                    });
                });
        });
});


// Rescrape onsubmit
$(function() {
    $("#rescrape").on("submit", 
        function(event) {
            event.preventDefault();
            toRescrape = $("select[name='rescrape-yn'] option:selected").val();
            if (toRescrape === "yes") {
                $("#rescrape").hide();
                $("#spinner").show();
                $("#rescrape-success").hide();
                $.get("http://localhost:3000/scrape",
                    {},
                    function(data) {
                        $("#spinner").hide();
                        $("#rescrape-success").show();
                    });
            }
        });
});
