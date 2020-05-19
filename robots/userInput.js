const readline = require("readline-sync");

function userInput(content) {
  content.searchTerm = { articleName: askAndReturnSearchTerm(), lang: "pt" };
  content.prefix = askAndReturnPrefix();

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
