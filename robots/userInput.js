const readline = require("readline-sync");
const state = require("./state")

function userInput() {
  const content = {
    maximumSentences: 7
  };

  content.searchTerm = { articleName: askAndReturnSearchTerm(), lang: "pt" };
  content.prefix = askAndReturnPrefix();
  state.save(content)

  function askAndReturnSearchTerm() {
    return readline.question("Digite o termo para ser pesquisado: ");
  }

  function askAndReturnPrefix() {
    const prefixes = ["Quem é", "Oque é", "A Historia de"];
    const selectedPrefixIndex = readline.keyInSelect(
      prefixes,
      "Escolha uma opção: "
    );
    const selectedPrefixText = prefixes[selectedPrefixIndex];

    return selectedPrefixText;
  }
}

module.exports = userInput;
