const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter your name: ", function (answer) {
    console.log("Hello " + answer + "!");

    rl.question("Enter your birth year: ", function (answer) {
        let age = new Date().getFullYear() - Number(answer);
        console.log("You're " + age + " years old");
        rl.close();
    });
});