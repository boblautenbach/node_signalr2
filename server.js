
//Node JS ==>Signal 2+
//Would be great to use with JQuery Requirement
//Could not get it to with simple require('ms-signalr-client')
var util = require('util');
var jsdom = require('jsdom');

jsdom.env({
    html: '<html><body></body></html>',   
    scripts: [
        'http://code.jquery.com/jquery-2.2.1.min.js',
        'https://ajax.aspnetcdn.com/ajax/signalr/jquery.signalR-2.2.1.min.js'
    ],
    done: function (errors, window) {
   
    try{
        //grab window for signalR
        var $ = window.$;

        //using w/o generated proxy but using generated proxy
        //syntax works too, just need to include the proxy link
        //in the scripts section above i.e.
        //'https://myhub.azurewebsites.net/signalr/hubs'
        var connection = $.hubConnection('https://ewchub.azurewebsites.net');
        var proxy = connection.createHubProxy('messagehub');

        proxy.on('FROM_SomeServerEvent', function(message) {
            console.log(message);
        });

        connection.stateChanged(function (state) {
            console.log('State Changed ' + util.inspect(state, false, null));
        });

        connection.reconnected(function() {
            console.log('reconnected');
        });

        connection.reconnecting(function() {
            console.log('reconnecting');
        });

        connection.disconnected(function() {
            console.log('disconnected');
        });

        //Need this on Azure backend startup class
        //public void Configuration(IAppBuilder app)
        //{
        //    app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
        //    app.MapSignalR();
        //}
        //Need the withCredentials setting to negotiating to succeed
        connection.start({transport: 'auto', withCredentials:false})
            .done(function(connection){ 
                console.log('Now connected, connection ID=' + connection.id);
                // proxy.invoke(
                //     'SOME_SERVER_EVENT', // Method Name (case insensitive)
                //     'SOME_PARAM'
                // );
            })
            .fail(function(error){ console.log('Could not connect',error); });
        }catch(e){
            console.log(e);
        }
	}
});

