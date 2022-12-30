import './style.css';
import './forms';

import {contentLogin, contentChat, createTextElement} from './content.js';
import {SendChat, ServerConnect} from '../wailsjs/go/main/App';

class JSServer {
    name = "";
    channels = [];
    users = [];
}

class JSChannel {
    name = "";
    messages = [];
}

class JSMessage {
    username = "";
    encoding = "";
    data = "";
}

var gServers = [];
var gSelectedServer = "";
var gSelectedChannel = "";

var fileReader = new FileReader;
var fileName = "";

window.onAppStartup = function () {
    contentLogin();
};

window.toggleServerElements = function (toggle) {
    var serverPanel = document.getElementById("serverelements");
    var noServerMsg = document.getElementById("serverless");
    
    if (toggle == "off") {
        serverPanel.classList.add("hidden");
        noServerMsg.classList.remove("hidden");
    }

    else {
        serverPanel.classList.remove("hidden");
        noServerMsg.classList.add("hidden");
    }
};

window.getServerIndex = function (server) {
    for(var i = 0; i < gServers.length; i++){ 
        if (gServers[i].name == server) { 
            return i;
        }
    }
    return -1;
}

window.getChannelIndex = function (sIndex, channel) {
    for(var i = 0; i < gServers[sIndex].channels.length; i++) {
        if (gServers[sIndex].channels[i].name == channel) {
            return i;
        }
    }

    return -1;
}

window.appendMessage = function (msg) {
    var chatfeed = document.getElementById("messagecollection");
    var message = document.createElement("div");
    message.id = "message";
    
    var userTag = createTextElement("h2", msg.username);
    message.appendChild(userTag);

    var chatContent;

    if (msg.encoding == "TEXT") {
        chatContent = createTextElement("p", msg.data);
    }

    else if (msg.encoding == "PNG") {
        chatContent = document.createElement("img");
        chatContent.src = "data:image/png;base64," + msg.data;
    }

    else if (msg.encoding == "JPG") {
        chatContent = document.createElement("img");
        chatContent.src = "data:image/jpeg;base64," + msg.data;
    }

    else if (msg.encoding == "GIF") {
        chatContent = document.createElement("img");
        chatContent.src = "data:image/gif;base64," + msg.data;
    }

    else if (msg.encoding == "MP4") {
        chatContent = document.createElement("video");
        chatContent.setAttribute("controls", "");
        chatContent.src = "data:video/mp4;base64," + msg.data;
    }

    else if (msg.encoding == "IMG_URL") {
        chatContent = document.createElement("img");
        chatContent.src = msg.data;
    }

    message.appendChild(chatContent);
    chatfeed.appendChild(message);

    chatfeed.scrollTop = chatfeed.scrollHeight;
    message.scrollIntoView();
};

window.loadChannelContent = function (server, channel) {
    var chatfeed = document.getElementById("messagecollection");
    var sIndex = getServerIndex(server);
    var cIndex = getChannelIndex(sIndex, channel);

    chatfeed.innerHTML = "";

    if (gSelectedChannel != "") {
        var channelLabel = document.getElementById(gSelectedChannel+"label");
        channelLabel.classList.remove("selected-channel");
    }
   
    gSelectedChannel = channel;
    var channelLabel = document.getElementById(gSelectedChannel+"label");
    channelLabel.classList.add("selected-channel");

    var tbegin = createTextElement("h2", "-- Beginning of transmission --");
    tbegin.classList.add("tbegin");
    chatfeed.appendChild(tbegin);

    for (var i = 0; i < gServers[sIndex].channels[cIndex].messages.length; i++) {
        appendMessage(gServers[sIndex].channels[cIndex].messages[i]);
    }
};

window.loadServerContent = function (server) {
    var index = -1;

    for (var i = 0; i < gServers.length; i++){ 
        if (gServers[i].name == server) { 
            index = i;
            break;
        }
    }

    if (index < 0) {
        return;
    }

    gSelectedServer = server;

    var channelList = document.getElementById("channellist");
    var userList = document.getElementById("userlist");

    channelList.innerHTML = "<h3>"+server+"</h3>";
    userList.innerHTML = "<h2>Online Users</h2>";

    for (var i = 0; i < gServers[index].channels.length; i++) {
        var currentChannel = createTextElement("h4", "#"+gServers[index].channels[i].name);
        currentChannel.id = gServers[index].channels[i].name+"label";
        currentChannel.setAttribute("onclick", "loadChannelContent('" + gServers[index].name+"','" + gServers[index].channels[i].name + "');");
        channelList.appendChild(currentChannel);
    }

    for (var i = 0; i < gServers[index].users.length; i++) {
        userList.appendChild(createTextElement("h3", gServers[index].users[i]));
    }

    gSelectedChannel = gServers[index].channels[0].name;
    loadChannelContent(gSelectedServer, gServers[index].channels[0].name);
}; 

window.rebuildServerList = function () {
    var serverPanel = document.getElementById("serverslist");
    serverPanel.innerHTML = "";

    var addServerIcon = document.createElement("button");
    addServerIcon.id = "addServerIcon";
    addServerIcon.innerText = "+";
    addServerIcon.addEventListener("click", joinServerPrompt);
    serverPanel.appendChild(addServerIcon);

    for (var i = 0; i < gServers.length; i++) {
        var serverIcon = document.createElement("button");
        serverIcon.innerText = gServers[i].name.slice(0, 2);
        serverIcon.id = gServers[i].name;
        serverIcon.setAttribute("onclick", "loadServerContent('"+gServers[i].name+"');");
        serverPanel.appendChild(serverIcon);
    }
};

window.joinServerPrompt = function () {
    document.getElementById("ferror").innerText = "";
    document.getElementById("faddr").value = "";

    if (document.getElementById("serverprompt").style.display == "none") {
        document.getElementById("serverprompt").style.display = "block";
        document.getElementById("shadowpanel").style.display = "block";
    }

    else {
        document.getElementById("serverprompt").style.display = "none";
        document.getElementById("shadowpanel").style.display = "none";
    }
};

window.connectToServer = function () {
    var address = document.getElementById("faddr");
    var errField = document.getElementById("ferror");

    if (address.value == "") {
        errField.innerText = "address field cannot be blank";
        return;
    }

    errField.innerText = "waiting...";

    try {
        ServerConnect(address.value)
            .then((result) => {
                if (result != "") {
                    errField.innerText = result;
                    return;
                } else {
                    joinServerPrompt();
                }
            });
    } catch (err) {
        console.error(err);
        return;
    }
};

window.clearFile = function () {
    document.getElementById("imgname").innerText  = "";
    document.getElementById("imgclear").innerText = "";
    fileReader = new FileReader();
    fileName = "";
}

window.loadMain = function () {
    toggleServerElements("off");

    const fileSelector = document.getElementById('chatfile');
    fileSelector.addEventListener('change', (event) => {
        const file = event.target.files[0];
        let filename = file.name;
        fileName = file.name;

        if (filename.length > 40) {
            filename = filename.substring(0, 37);
            filename = filename + "...";
        }

        document.getElementById("imgname").innerText = "file: " + filename;
        document.getElementById("imgclear").innerText = " ❌";

        fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        event.target.value = "";
    });

    document.getElementById("serverprompt").classList.remove("hidden");
    document.getElementById("serverprompt").style.display = "none";

    document.addEventListener("contextmenu", function (e){
        e.preventDefault();
    }, false);

    document.getElementById("msgtextbox").addEventListener("keydown", function(event) {
        if (!event) {
            var event = window.event;
        }

        if (event.keyCode == 13) {
            sendChat();
        }
    }, false);

    window.runtime.EventsOn("AppendMessage", msg => {
        if (msg) {
            var sIndex = getServerIndex(msg.server);
            var cIndex = getChannelIndex(sIndex, msg.channel);

            var message = new JSMessage();
            message.username = msg.username;
            message.encoding = msg.encoding;
            message.data = msg.data;

            gServers[sIndex].channels[cIndex].messages.push(message);

            if (gSelectedServer == msg.server && gSelectedChannel == msg.channel) {
                appendMessage(message);
            }
        }
    })

    window.runtime.EventsOn("RemoveServer", name => {
        if (name) {
            for (var i = 0; i < gServers.length; i++){ 
                if (gServers[i].name == name) { 
                    gServers.splice(i, 1);
                    break;
                }
            }

            if (gServers.length >= 1) {
                loadServerContent(gServers[0].name);
            }

            rebuildServerList();
        }

        if (gServers.length == 0) {
            toggleServerElements("off");
        }
    })

    window.runtime.EventsOn("UpdateUsers", userInfo => {
        var index = -1;

        if (userInfo) {
            for (var i = 0; gServers.length; i++) {
                if (gServers[i].name == userInfo.server) {
                    index = i;
                    break;
                }
            }

            gServers[index].users = [];

            for (var i = 0; i < userInfo.users.length; i++) {
                gServers[index].users.push(userInfo.users[i]);
            }
        }

        loadServerContent(gSelectedServer);
    })

    window.runtime.EventsOn("AppendServer", s => {
        if (s) {
            if (gServers.length == 0) {
                toggleServerElements("on");
            }
            
            var server = new JSServer();
            server.name = s.name;

            for (var i = 0; i < s.channels.length; i++) {
                var channel = new JSChannel();
                channel.name = s.channels[i].name;
                server.channels.push(channel);
            }

            gServers.push(server);
            rebuildServerList();

            if (gServers.length == 1) {
                loadServerContent(gServers[0].name);
            }
        }
    })
};

window.resolveEncoding = function (hint) {
    switch (hint)
    {
        case ("png"):
            return "PNG";
        
        case ("jpeg"):
        case ("jpeg"):
        case ("jfif"):
        case ("jpg"):
            return "JPG";
        
        case ("gif"):
            return "GIF";
        
        case ("mp4"):
            return "MP4";
        
        default:
            return "FILE";
    }
}

window.sendChat = function () {
    var chatbox = document.getElementById("msgtextbox");

    if (fileReader.readyState != 0) {
        let encoding = resolveEncoding(fileName.split('.').pop());
        while (fileReader.readyState == 1) {}

        try {
            SendChat(gSelectedServer, gSelectedChannel, encoding, fileReader.result.split(",", 2)[1])
                .then((result) => {
                    if (result != "") {
                        alert(result);
                        return;
                    }
                });
        } catch (err) {}

        clearFile();
    }

    if (chatbox.value != "") {
        try {
            SendChat(gSelectedServer, gSelectedChannel, "TEXT", chatbox.value)
                .then((result) => {
                    if (result != "") {
                        alert(result);
                        return;
                    }
                });
        } catch (err) {}
    }

    chatbox.value = "";
};

window.contentChat = function() {
    contentChat();
};