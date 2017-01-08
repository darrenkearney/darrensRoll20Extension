/**
 *  Message module
 *  This module is used to interface with roll20's chat interface, to recieve input and to output text.
 */

var isDebug = true;
function debugLog(msg){
    console.log(msg);
}

// init stuff
// reference the text chat container element
var chatBox = document.getElementById('textchat');
// init messages and last message
messages = chatBox.querySelectorAll('.message.you');
lastMessage = messages[messages.length-1];

function getNewMessage() {
    // Goes through the text chat container and selects the last message
    // if the message is new it returns the message, otherwise it returns false
    messages = chatBox.querySelectorAll('.message.you');
    
    // get the textnode of the last message
    currentMessage = messages[messages.length-1];
    debugLog('current message: ' + currentMessage);

    // get the data off of it and apply str.trim to remove leading and trailing whitespace
    var messageText = currentMessage.lastChild.data.trim();
    debugLog('message text: ' + messageText);

    // checks that triggering message isn't the same id as last message
    if ( typeof lastMessage !== 'undefined' ) {    
        // checks the id of the message against the id of the last used message
        if ( currentMessage.getAttribute('data-messageid') === lastMessage.getAttribute('data-messageid') ) {
            console.log("same message as last message");
            return false;
        }
    }
    
    // The current message has been worked on, let's make sure we don't do that again!
    lastMessage = currentMessage;

    // return the string of the entire message
    return messageText;
}

function splitMessage( messageText ){
    var messSplit = messageText.split( ' ' );
    var command = messSplit.shift();
    var arguments = messSplit.join(' ');
    return [command, arguments];
}

// takes an array of [command, arguments]
function doCommand( commands ) {

    var commandName = commands[0];
    var arguments = commands[1];

    console.log("Trying command...");
    console.log("The command: " + commandName);
    console.log("The arguments: " + arguments);

    switch ( command ) {

        case 'playSound':
            debugLog("You play the mandolin: " + arguments);
            break;
        case 'say':
            rewriteLastMessage( arguments );
            break;
        default:
            debugLog("Not a command: " + command);
    }
}

function rewriteLastMessage( msg ) {
    debugLog(lastMessage);
    debugLog('say msg: ' + msg);

    lastMessage.innerHTML = msg;
}

// Observe a specific DOM element
var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe obj for changes in children
            obs.observe( obj, { childList:true, subtree:true } );
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();

// Start observation
observeDOM( chatBox, function(){
    console.log('dom changed');

    var messageText = getNewMessage();
    debugLog("messageText is typeof: " + typeof messageText);
    if ( typeof messageText === 'string' ) {
        //var commands = parseMessage( messageText );
        doCommand( splitMessage( messageText ) );
    }
});

