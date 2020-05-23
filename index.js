const robots = {
  userInput: require("./robots/userInput"),
  text: require("./robots/text"),
};

async function start() {
  const content = {
    maximumSentences: 7
  };

  robots.userInput(content);
  await robots.text(content);

  console.log(JSON.stringify(content, null, 4));
}

start();
