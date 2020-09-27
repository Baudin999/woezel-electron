/*
This is my Woezel reporter which should...eventually...work better than the standard
reported shipped with mocha. I want more insight into the tests running and working.
*/

var chalk = require('chalk');
var mocha = require('mocha');
var { exec } = require("child_process");
module.exports = MyReporter;

function MyReporter(runner) {
    mocha.reporters.Base.call(this, runner);
    var passes = 0;
    var failures = 0;

    runner.on('start', function () {
        console.log('\033[2J');

        // exec("clear", function () {
        //     console.log("clearing");
        // });
    });

    runner.on('pass', function (test) {
        passes++;
        console.log('pass: %s', test.fullTitle());
    });

    runner.on('fail', function (test, err) {
        failures++;
        console.log('fail: %s -- error: %s', test.fullTitle(), err.message);
    });

    runner.on('end', function () {
        console.log('end: %d/%d', passes, passes + failures);
    });
}