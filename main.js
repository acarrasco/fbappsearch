window.fbAsyncInit = function() {
    FB.init({
        appId: '414438422044270',
        xfbml: false,
        version: 'v2.1'
    });


    $('#search').on('click', function() {
        var searchTerm = $('#search_term').val().toLowerCase();
        var applicationsList = $('#applications').empty();
        var progress = $('#progress').empty();

        var processApplicationsResponse = function(response) {
            console.log(response);

            for (var i = 0; i < response.data.length; i++) {
                var app = response.data[i];
                if (app.name && app.name.toLowerCase().indexOf(searchTerm) >= 0 ||
                        app.namespace && app.namespace.toLowerCase().indexOf(searchTerm) >= 0) {
                    var href = 'https://developers.facebook.com/apps/' + app.id;
                    var text = app.name + ' (' + app.namespace + ')';
                    var appListItem = $('<li>').append($('<a>').text(text).attr('href', href));

                    applicationsList.append(appListItem);
                }
            }
            progress.append('.');

            if (response.paging && response.paging.next) {
                $.getJSON(response.paging.next, processApplicationsResponse);
            } else {
                progress.append('done');
            }
        };

        FB.login(function(response) {
            if (response.authResponse) {
                FB.api('/me/applications/developer?limit=200', processApplicationsResponse);
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
    });
};
