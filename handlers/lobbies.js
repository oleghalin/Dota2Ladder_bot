var Dota2 = require("../index"),
    util = require("util");

Dota2.SeriesType = {
    NONE: 0,
    BEST_OF_THREE: 1,
    BEST_OF_FIVE: 2
};

Dota2._lobbyOptions = {
    game_name: "string",
    server_region: "number",
    game_mode: "number",
    game_version: "number",
    cm_pick: "number",
    allow_cheats: "boolean",
    fill_with_bots: "boolean",
    allow_spectating: "boolean",
    pass_key: "string",
    series_type: "number",
    radiant_series_wins: "number",
    dire_series_wins: "number",
    allchat: "boolean",
    leagueid: "number",
    dota_tv_delay: "number",
    custom_game_mode: "string",
    custom_map_name: "string",
    custom_difficulty: "number",
    custom_game_id: "number",
};

// Methods
Dota2.Dota2Client.prototype.createPracticeLobby = function(password, options, callback) {
        callback = callback || null;
        this.createTournamentLobby(password, -1, -1, options, callback);
    }
    // callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.createTournamentLobby = function(password, tournament_game_id, tournament_id, options, callback) {
    callback = callback || null;
    password = password || "";
    tournament_game_id = tournament_game_id || -1;
    tournament_id = tournament_id || -1;
    var _self = this;

    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending match CMsgPracticeLobbyCreate request");
    var lobby_details = Dota2._parseOptions(options, Dota2._lobbyOptions);
    lobby_details.pass_key = password;
    var command = {
        "lobby_details": lobby_details,
        "pass_key": password
    };

    if (tournament_game_id > 0) {
        command["tournament_game"] = true;
        command["tournament_game_id"] = tournament_game_id;
        command["tournament_id"] = tournament_id;
    }
    var payload = new Dota2.schema.CMsgPracticeLobbyCreate(command);

    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbyCreate;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyResponse.call(_self, body, callback);
        }
    );
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.configPracticeLobby = function(lobby_id, options, callback) {
    callback = callback || null;
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    var command = Dota2._parseOptions(options);
    command["lobby_id"] = lobby_id;

    var payload = new Dota2.schema.CMsgPracticeLobbySetDetails(command);
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbySetDetails;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyResponse.call(_self, body, callback);
        }
    );
};
// callback to onPracticeLobbyListResponse
Dota2.Dota2Client.prototype.requestPracticeLobbyList = function(callback) {
    callback = callback || null;
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending CMsgPracticeLobbyList request");
    var payload = new Dota2.schema.CMsgPracticeLobbyList({});
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbyList;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyListResponse.call(_self, body, callback);
        }
    );
};
// callback to onFriendPracticeLobbyListResponse
Dota2.Dota2Client.prototype.requestFriendPracticeLobbyList = function(callback) {
    callback = callback || null;
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending CMsgFriendPracticeLobbyListRequest request");
    var payload = new Dota2.schema.CMsgFriendPracticeLobbyListRequest({});
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCFriendPracticeLobbyListRequest;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onFriendPracticeLobbyListResponse.call(_self, body, callback);
        }
    );
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.balancedShuffleLobby = function(callback) {
    callback = callback || null;
    var _self = this;

    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }
    var payload = new Dota2.schema.CMsgBalancedShuffleLobby({});
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCBalancedShuffleLobby;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyResponse.call(_self, body, callback);
        }
    );
};

//TODO: figure out the enum for team
/*
Dota2.Dota2Client.prototype.setLobbyTeamSlot = function(team, slot, callback){
  callback = callback || null;
  if (!this._gcReady) {
    if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
    return null;
  }

  if (this.debug) util.log("Sending flip teams request");
  var payload = Dota2.schema.CMsgFlipLobbyTeams.serialize({});

  this._gc.send(
  {
          "msg":    Dota2.schema.EDOTAGCMsg.k_EMsgGCFlipLobbyTeams,
          "proto":  {
            "client_steam_id": this._client.steamID,
            "source_app_id":  this._appid
          }
        },
        payload.toBuffer(),
        callback
  );
};*/
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.flipLobbyTeams = function(callback) {
    callback = callback || null;
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending flip teams request");
    var payload = new Dota2.schema.CMsgFlipLobbyTeams({});
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCFlipLobbyTeams;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyResponse.call(_self, body, callback);
        }
    );
};

Dota2.Dota2Client.prototype.inviteToLobby = function(steam_id) {
    steam_id = steam_id || null;

    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (steam_id == null) {
        if (this.debug) util.log("Steam ID required to create a lobby invite.");
        return null;
    }

    if (this.debug) util.log("Inviting " + steam_id + " to a lobby.");
    // todo: set client version here?
    var payload = new Dota2.schema.CMsgInviteToLobby({
        "steam_id": steam_id
    });
    this._protoBufHeader.msg = Dota2.schema.EGCBaseMsg.k_EMsgGCInviteToLobby;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer()
    );

};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.practiceLobbyKick = function(account_id, callback) {
    callback = callback || null;
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    account_id = account_id || "";

    if (this.debug) util.log("Sending match CMsgPracticeLobbyKick request");
    var payload = new Dota2.schema.CMsgPracticeLobbyKick({
        "account_id": account_id
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbyKick;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyResponse.call(_self, body, callback);
        }
    );
};
Dota2.Dota2Client.prototype.practiceLobbyKickFromTeam = function(account_id, callback) {
    callback = callback || null;
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    account_id = account_id || "";

    if (this.debug) util.log("Sending match CMsgPracticeLobbyKickFromTeam request");
    var payload = new Dota2.schema.CMsgPracticeLobbyKickFromTeam({
        "account_id": account_id
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbyKickFromTeam;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyResponse.call(_self, body, callback);
        }
    );
};
// callback to onPracticeLobbyJoinResponse
Dota2.Dota2Client.prototype.joinPracticeLobby = function(id, password, callback) {
    callback = callback || null;
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    password = password || "";

    if (this.debug) util.log("Sending match CMsgPracticeLobbyJoin request");
    var payload = new Dota2.schema.CMsgPracticeLobbyJoin({
        "lobby_id": id,
        "pass_key": password
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbyJoin;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyJoinResponse.call(_self, body, callback);
        }
    );
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.leavePracticeLobby = function(callback) {
    callback = callback || null;
    var _self = this;

    /* Sends a message to the Game Coordinator requesting `matchId`'s match details.  Listen for `matchData` event for Game Coordinator's response. */

    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending match CMsgPracticeLobbyLeave request");
    var payload = new Dota2.schema.CMsgPracticeLobbyLeave({});
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbyLeave;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyResponse.call(_self, body, callback);
        }
    );
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.launchPracticeLobby = function(callback) {
    callback = callback || null;
    var _self = this;
    /* Sends a message to the Game Coordinator requesting lobby start. */

    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending match CMsgPracticeLobbyLaunch request");
    var payload = new Dota2.schema.CMsgPracticeLobbyLaunch({});
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbyLaunch;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyResponse.call(_self, body, callback);
        }
    );
};
Dota2.Dota2Client.prototype.abandonCurrentGame  = function(callback) {
    callback = callback || null;
    var _self = this;
    /* Sends a message to the Game Coordinator requesting lobby start. */

    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending match CMsgAbandonCurrentGame request");
    var payload = new Dota2.schema.CMsgAbandonCurrentGame({});
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCAbandonCurrentGame ;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyResponse.call(_self, body, callback);
        }
    );
};
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.joinPracticeLobbyTeam = function(slot, team, callback) {
    callback = callback || null;
    slot = slot || 1;
    team = team || Dota2.schema.DOTA_GC_TEAM.DOTA_GC_TEAM_PLAYER_POOL;
    
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending match CMsgPracticeLobbySetTeamSlot request");
    var payload = new Dota2.schema.CMsgPracticeLobbySetTeamSlot({
        "team": team,
        "slot": slot,
        "bot_difficulty": 0
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbySetTeamSlot;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyResponse.call(_self, body, callback);
        }
    );
}
// callback to onPracticeLobbyResponse
Dota2.Dota2Client.prototype.addBotToPracticeLobby = function(slot, team, bot_difficulty, callback) {
    callback = callback || null;
    slot = slot || 1;
    team = team || Dota2.schema.DOTA_GC_TEAM.DOTA_GC_TEAM_GOOD_GUYS;
    bot_difficulty = bot_difficulty || Dota2.schema.DOTABotDifficulty.BOT_DIFFICULTY_PASSIVE;
    
    var _self = this;
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending match CMsgPracticeLobbySetTeamSlot request");
    var payload = new Dota2.schema.CMsgPracticeLobbySetTeamSlot({
        "team": team,
        "slot": slot,
        "bot_difficulty": bot_difficulty
    });
    this._protoBufHeader.msg = Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbySetTeamSlot;
    this._gc.send(
        this._protoBufHeader,
        payload.toBuffer(),
        function(header, body) {
            onPracticeLobbyResponse.call(_self, body, callback);
        }
    );
}

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

var onPracticeLobbyJoinResponse = function onPracticeLobbyJoinResponse(message, callback) {
    callback = callback || null;
    var practiceLobbyJoinResponse = Dota2.schema.CMsgPracticeLobbyJoinResponse.decode(message);

    if (this.debug) util.log("Received practice lobby join response " + practiceLobbyJoinResponse.result);
    this.emit("practiceLobbyJoinResponse", practiceLobbyJoinResponse.result, practiceLobbyJoinResponse);
    
    if (callback) {
        if (practiceLobbyJoinResponse.result === Dota2.schema.DOTAJoinLobbyResult.DOTA_JOIN_RESULT_SUCCESS) {
            callback(null, practiceLobbyJoinResponse);
        } else {
            callback(practiceLobbyJoinResponse.result, practiceLobbyJoinResponse);
        }
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbyJoinResponse] = onPracticeLobbyJoinResponse;

var onPracticeLobbyListResponse = function onPracticeLobbyListResponse(message, callback) {
    var practiceLobbyListResponse = Dota2.schema.CMsgPracticeLobbyListResponse.decode(message);

    if (this.debug) util.log("Received practice lobby list response " + practiceLobbyListResponse);
    this.emit("practiceLobbyListData", null, practiceLobbyListResponse);
    if (callback) callback(null, practiceLobbyListResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbyListResponse] = onPracticeLobbyListResponse;

var onPracticeLobbyResponse = function onPracticeLobbyResponse(message, callback) {
    var practiceLobbyResponse = Dota2.schema.CMsgPracticeLobbyJoinResponse.decode(message);

    if (this.debug) util.log("Received create/flip/shuffle/kick/launch/leave response " + JSON.stringify(practiceLobbyResponse));
    this.emit("practiceLobbyResponse", practiceLobbyResponse.result, practiceLobbyResponse);
    
    if (callback) {
        if (practiceLobbyResponse.result === 1) {
            callback(null, practiceLobbyResponse); 
        } else {
            callback(practiceLobbyResponse.result, practiceLobbyResponse); 
        }
    }
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCPracticeLobbyResponse] = onPracticeLobbyResponse;

var onFriendPracticeLobbyListResponse = function onFriendPracticeLobbyListResponse(message, callback) {
    var practiceLobbyListResponse = Dota2.schema.CMsgFriendPracticeLobbyListResponse.decode(message);

    if (this.debug) util.log("Received friend practice lobby list response " + JSON.stringify(practiceLobbyListResponse));
    this.emit("friendPracticeLobbyListData", null, practiceLobbyListResponse);
    if (callback) callback(null, practiceLobbyListResponse);
};
handlers[Dota2.schema.EDOTAGCMsg.k_EMsgGCFriendPracticeLobbyListResponse] = onFriendPracticeLobbyListResponse;

var onInviteCreated = function onInviteCreated(message) {
    var inviteCreated = Dota2.schema.CMsgInvitationCreated.decode(message);
    var is_online = !inviteCreated.user_offline;

    if (this.debug && is_online) util.log("Created invitation to online user " + this.ToAccountID(inviteCreated.steam_id));
    if (this.debug && !is_online) util.log("Created invitation to offline user " + this.ToAccountID(inviteCreated.steam_id));
    this.emit("inviteCreated", inviteCreated.steam_id, inviteCreated.group_id, is_online);
}
handlers[Dota2.schema.EGCBaseMsg.k_EMsgGCInvitationCreated] = onInviteCreated;