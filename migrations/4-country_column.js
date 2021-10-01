'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "Country" on table "posts"
 * changeColumn "PostBody" on table "posts"
 *
 **/

var info = {
    "revision": 4,
    "name": "country_column",
    "created": "2021-10-01T15:55:25.457Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "changeColumn",
        params: [
            "posts",
            "Country",
            {
                "type": Sequelize.STRING,
                "field": "Country",
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "posts",
            "PostBody",
            {
                "type": Sequelize.TEXT,
                "field": "PostBody",
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
