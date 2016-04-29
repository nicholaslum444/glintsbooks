var bookset = [];
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
                    bookset = data;
                    $("#results").empty();
                    $("#results").append("<h3>Books About \"" + selectedSkill + "\" (" + bookset.length + " books)</h3>");
                    if (bookset.length === 0) {
                        $("#results").append("<p>There are no books for this category!</p><p>Click the \"<strong>Settings</strong>\" button and select \"<strong>Rescrape</strong>\" to scrape Amazon for more books!</p>");
                        return;
                    }
                    bookset.forEach(function(book) {
                        // build book table
                        var panel = "";
                        panel = "<div class='panel panel-default'>";
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
                                        panel += "<p><a href='" + book.url + "' target='_blank'>Visit Amazon page</a></p>";
                                    panel += "</div>";
                                panel += "</div>";
                            panel += "</div>";
                            panel += "<div class='panel-footer'>";
                                panel += "<div type='button' data-toggle='modal' data-target='#editModal' class='btn btn-warning btn-edit' data-id='"+book.id+"'>Edit</div>";
                                panel += "<div type='button' data-toggle='modal' data-target='#deleteModal' class='btn btn-danger btn-delete' data-id='"+book.id+"'>Delete</div>";
                            panel += "</div>";
                        panel += "</div>";
                        $("#results").append(panel);
                    });
                    
                    // set the newly generated edit buttons
                    $(".btn-edit").click(function(event) {
                        var id = $(this).data("id");
                        bookset.filter(function(book) {
                            return book.id === id;
                        }).forEach(function(book) {
                            $(".book-id").val(book.id);
                            $(".book-title").val(book.title);
                            $(".book-author").val(book.author_name);
                            $(".book-author-bio").val(book.author_bio);
                            $(".book-description").val(book.desc);
                            $(".book-price").val(book.price);
                            $(".book-rating").val(book.rating);
                            $(".book-image-url").val(book.image_url);
                            $(".book-url").val(book.url);
                        });
                    });

                    // set the newly generated delete buttons
                    $(".btn-delete").click(function(e) {
                        var id = $(this).data("id"); 
                        $(".delete-book-id").val(id);
                    });
                });
        });
});


// Rescrape onsubmit
$(function() {
    $("#rescrape").on("submit", 
        function(event) {
            event.preventDefault();
            var toRescrape = $("select[name='rescrape-yn'] option:selected").val();
            if (toRescrape === "yes") {
                $("#rescrape").hide();
                $("#spinner").show();
                $.get("http://localhost:3000/scrape",
                    {},
                    function(data) {
                        $("#spinner").hide();
                        $("#filter").submit();
                        $("#settingsModal").modal("hide");
                        $("#rescrape").show();
                    });
            }
        });
});

// Edit onsubmit
$(function() {
    $("#edit").on("submit",
        function(e) {
            e.preventDefault();
            $("#edit-spinner").show();
            var book = bookset.filter(function(book) {
                console.log(book.id);
                return book.id === parseInt($(".book-id").val());
            })[0];

            book.title = $(".book-title").val();
            book.author_name = $(".book-author").val();
            book.author_bio = $(".book-author-bio").val();
            book.desc = $(".book-description").val();
            book.price = $(".book-price").val();
            book.rating = $(".book-rating").val();
            book.image_url = $(".book-image-url").val();
            book.url = $(".book-url").val();

            $.ajax({
                type: "PATCH",
                url: "http://localhost:3000/books/" + book.id,
                data: {
                    book: book
                }
            }).done(function() {
                $("#edit-spinner").hide();
                $("#filter").submit();
                $("#editModal").modal("hide");
            });
        });
});

// Delete onsubmit
$(function() {
    $("#delete").on("submit", 
        function(e) {
            e.preventDefault();
            $("#delete-spinner").show();
            var id = parseInt($(".delete-book-id").val());

            $.ajax({
                type: "DELETE",
                url: "http://localhost:3000/books/" + id
            }).done(function() {
                $("#delete-spinner").hide();
                $("#filter").submit();
                $("#deleteModal").modal("hide");
            });
        });
});
