export function createTextElement(element, text) {
    var elem = document.createElement(element);
    elem.appendChild(document.createTextNode(text));
    return elem;
}

var contentHeader = `

<header id="titlebar" style="--wails-draggable:drag">
    <span id="title-label">Krakyn Desktop</span>
    <span onclick="window.runtime.Quit()"><i>x</i></span>
    <span onclick="window.runtime.WindowMinimise()"><i>-</i></span>
</header>

`;

export function contentChat() {
    document.body.innerHTML = contentHeader + `

<body onload="setupEvents()">
    <div id="serverslist">
        <button id="addServerIcon" class="server-icon" onclick="joinServerPrompt()">+</button>
    </div>

    <div class="hidden" id="shadowpanel"></div>

    <div class="forms hidden" id="serverprompt">
        <div class="formsbanner">
            <h2>Join Server</h2>
            <h3>Specify an ipv4/ipv6 address or a hostname</h3>
        </div>

        <form>
            <label for="faddr">Server Address</label><br>
            <input type="text" placeholder="ex: krakyn.exampleserver.com" id="faddr" name="faddr">
            <input type="button" value="Connect" onclick="connectToServer()">
        </form>

        <p id="ferror" class="error"></p>
    </div>

    <div id="serverelements" class="servercontent"> 
        <div class="serverpanel">
            <div id="channellist" class="channelcontent">
                <h3>No Server</h3>
            </div>

            <div id="userlist" class="userlist">
                <h2>Online Users</h2>
            </div>
        </div>

        <div id="chatfeed">
            <div id="messagecollection">
            </div>
            <div id="chatbar" class="chatbar">
                <p id="imgname"></p>
                <p id="imgclear" onclick="clearFile()"></p>
                <div class="chatbarwrapper">
                    <input id="chatfile" type="file" name="chatfile">
                    <label for="chatfile">\u{1F4C2}</label>
                    <input id="msgtextbox" placeholder="@message" type="text">
                </div>
            </div>
        </div>
    </div>
    <div id="serverless">
    <pre>   
            zzz
        zzz
    zzz
\uFF08\uFE36 - \uFE36\uFF09
    </pre>
        <h2>No servers are currently active...</h2>
    </div>
</body>

    `;

    document.body.onload = loadMain();
}

export function contentLogin() {
    document.body.innerHTML = contentHeader + `

<body>
    <img id="banner" class="banner" alt="Krakyn Logo">
    <p style="text-align:right;width:75%;">(closed alpha)</p>

    <div id="loadform" class="forms hidden">
        <div class="formsbanner">
            <h2>Load Profile</h2>
            <h3>Need to generate one? <a href="javascript:;" onclick="profileFormChange()">Click Here</a></h3>
        </div>

        <form>
            <label for="luser">Username</label><br>
            <input type="text" placeholder="Enter username" id="luser"name="luser"><br>
            <label for="lkey">Masterkey</label><br>
            <input type="password" placeholder="Enter masterkey" id="lkey" name="lkey"><br>
            <input type="button" value="Load Profile" onclick="submitLoad()">
        </form>

        <p id="lerror" class="error"></p>
    </div>

    <div id="generateform" class="forms hidden">
        <div class="formsbanner">
            <h2>Generate Profile</h2>
            <h3>Use existing profile? <a href="javascript:;" onclick="profileFormChange()"> Click Here</a></h3>
        </div>

        <form>
            <label for="guser">Username</label><br>
            <input type="text" placeholder="Create a new username" id="guser" name="guser"><br>
            <label for="gkey">Masterkey</label><br>
            <input type="password" placeholder="Create a new masterkey" id="gkey" name="gkey"><br>
            <input type="button" value="Generate Profile" onclick="submitGenerate()">
        </form>

        <p id="gerror" class="error"></p>
    </div>
</body>

    `;

    document.body.onload = loadForms();
}