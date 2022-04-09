const fs = require("fs");
const whois = require("whois");
// Ka padaryti?
//
const tldsFile = "tlds.txt";
const pages = ["facebook"];
// Padaryti automatini path'o nustatyma

const settings = {
  follow: 0, // number of times to follow redirects
  timeout: 500, // socket timeout, excluding this doesn't override any default timeout value
  verbose: true, // setting this to true returns an array of responses from all servers
  bind: null, // bind the socket to a local IP address
};

function init() {
  fs.readFile(__dirname + "/" + tldsFile, "utf8", (err, tlds) => {
    if (err) {
      console.log(err);

      return;
    }
    tlds = tlds.split("\n");
    iterateOverData(tlds, pages);
  });
}

function search(name) {
  whois.lookup(name, settings, (err, data) => {
    if (!data) return false;
    if (data[0].data.search("%ERROR:101: no entries found") > 0) {
      console.log(`${name} it's a match`);
      addToFile(name);
      return [true, name];
    }
    return [false, name];
  });
}

async function iterateOverData(tlds, pages) {
  for (let i = 0; i < pages.length; i += 1) {
    addToFile("\n");
    addToFile("\n");
    addToFile("|" + pages[i] + "|");
    for (let v = 0; v < tlds.length; v += 1) {
      let name = `${pages[i]}.${tlds[v].toLowerCase()}`;
      await new Promise((resolve) => setTimeout(resolve, 100));
      search(name);
    }
  }
}

function addToFile(match) {
  fs.appendFile("./src/matches.txt", match + "\n", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}
init();
