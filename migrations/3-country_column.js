'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "Country" to table "posts"
 * changeColumn "Delete" on table "posts"
 * changeColumn "PostBody" on table "posts"
 * changeColumn "PostTitle" on table "posts"
 *
 **/

var info = {
    "revision": 3,
    "name": "country_column",
    "created": "2021-09-30T00:19:54.464Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "addColumn",
        params: [
            "posts",
            "Country",
            {
                "type": Sequelize.STRING,
                "field": "Country"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "posts",
            "Delete",
            {
                "type": Sequelize.BOOLEAN,
                "field": "Delete",
                "defaultValue": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "posts",
            "PostBody",
            {
                "type": Sequelize.STRING,
                "field": "PostBody",
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "posts",
            "PostTitle",
            {
                "type": Sequelize.STRING,
                "field": "PostTitle",
                "allowNull": false
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
