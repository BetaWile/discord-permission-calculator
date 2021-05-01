  var perms = {
            generalCreateInstantInvite: 0x1,
            generalKickMembers: 0x2,
            generalBanMembers: 0x4,
            generalAdministrator: 0x8,
            generalManageChannels: 0x10,
            generalManageServer: 0x20,
            generalChangeNickname: 0x4000000,
            generalManageNicknames: 0x8000000,
            generalManageRoles: 0x10000000,
            generalManageWebhooks: 0x20000000,
            generalManageEmojis: 0x40000000,
            generalViewAuditLog: 0x80,
            textAddReactions: 0x40,
            textReadMessages: 0x400,
            textSendMessages: 0x800,
            textSendTTSMessages: 0x1000,
            textManageMessages: 0x2000,
            textEmbedLinks: 0x4000,
            textAttachFiles: 0x8000,
            textReadMessageHistory: 0x10000,
            textMentionEveryone: 0x20000,
            textUseExternalEmojis: 0x40000,
            voiceViewChannel: 0x400,
            voiceConnect: 0x100000,
            voiceSpeak: 0x200000,
            voiceMuteMembers: 0x400000,
            voiceDeafenMembers: 0x800000,
            voiceMoveMembers: 0x1000000,
            voiceUseVAD: 0x2000000,
            voicePrioritySpeaker: 0x100
        };

        function recalculate(element, perm, noSet) {
            if(element) {
                if(element.id === "textReadMessages") {
                    document.getElementById("voiceViewChannel").checked = element.checked;
                }
                if(element.id === "voiceViewChannel") {
                    document.getElementById("textReadMessages").checked = element.checked;
                }
            }
            var perm = perm || 0;
            var eq = [];
            for(var key in perms) {
                if(key !== "voiceViewChannel" && document.getElementById(key).checked) {
                    perm += perms[key];
                    eq.push("0x" + perms[key].toString(16));
                }
            }
            eq = "  " + eq.join(" + ")
            document.getElementById("number").innerHTML = "" + perm;
            document.getElementById("equation").innerHTML =  eq;

            if(!noSet) {
                setHash("" + perm);
            }

            if(document.getElementById("clientID").value) {
                var clientID = document.getElementById("clientID").value;
                var ok = clientID.match(/^\d{17,18}$/);
                if(ok) {
                    document.getElementById("clientID").className = "";
                    document.getElementById("invite").className = "";
                } else {
                    document.getElementById("clientID").className = "";
                    document.getElementById("invite").className = "disabled";
                }

                var scopes = document.getElementById("oauthScopes").value;
                if(scopes) {
                    scopes = encodeURIComponent(scopes.trim());
                } else {
                    scopes = "bot";
                }

                var url = "https://discord.com/oauth2/authorize?client_id=" + clientID +
                    "&scope=" + scopes +
                    "&permissions=" + perm;

                if(document.getElementById("oauthCodeGrant").checked) {
                    url += "&response_type=code"
                }
                if(document.getElementById("oauthRedirect").value) {
                    url += "&redirect_uri=" + encodeURIComponent(document.getElementById("oauthRedirect").value);
                }

                document.getElementById("invite").innerHTML = document.getElementById("invite").href = url;
            } else {
                document.getElementById("clientID").className = "";
                document.getElementById("invite").className = "disabled";
                document.getElementById("invite").innerHTML = "https://discord.com/oauth2/authorize?client_id=INSERT_CLIENT_ID&scope=bot&permissions=" + (perm + "").split("=")[0].trim();
                document.getElementById("invite").href = "#INSERT_CLIENT_ID";
            }
        }

        function getHash(hash) {
            hash = hash || window.location.hash;
            if(hash && hash.length > 1) {
                return hash.substring(1);
            } else {
                return null;
            }
        }

        function setHash(data) {
            if(history.pushState) {
                history.pushState(null, null, "#" + data);
            } else {
                window.location.hash = "#" + data;
            }
        }

        window.onpopstate = function(event) {
            syncCheckboxes(+getHash(event.target.location.hash));
            recalculate(null, null, true);
        }

        function syncCheckboxes(perm) {
            for(let key in perms) {
                if(perm & perms[key]) {
                    document.getElementById(key).checked = true;
                }
            }
        }

        syncCheckboxes(+getHash());
        recalculate(null, null, true);
