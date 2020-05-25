const robots = {
  userInput: require("./robots/userInput"),
  text: require("./robots/text"),
  state: require("./robots/state")
};

async function start() {

  robots.userInput();
  await robots.text();

  const content = robots.state.load()
  console.dir(content, { depth: null})
}

start();
