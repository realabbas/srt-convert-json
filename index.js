var fs = require("fs");

let content = [];

fs.readFile("mock/data.srt", function (err, body) {
  let data = body.toString().split("\n");
  let i = 0;
  let obj = {};
  console.log(data.length);
  while (i < data.length - 1) {
    let line = data[i];
    if (line == "\r") {
      i += 1;
      content.push(obj);
      obj = {};
    } else if (Number.isInteger(parseInt(line)) && !line.includes("-->")) {
      obj.position = parseInt(line);
      i = i + 1;
    } else if (line.includes("--")) {
      let part = line.split("-->");
      let start = part[0].split(",")[0].trim();
      let timer1 = part[0].split(",")[1].trim();
      let end = part[1].split(",")[0].trim();
      let timer2 = part[1].split(",")[1].replace("\r", "").trim();
      obj.start = start;
      obj.timer1 = timer1;
      obj.end = end;
      obj.timer2 = timer2;
      i = i + 1;
    } else if (line.match("[a-z|A-Z]")) {
      if (line.includes("i>")) {
        line = line.replace("<i>", "");
        line = line.replace("</i>", "");
      }
      obj.text = line;
      i = i + 1;
    }
  }
  fs.writeFile("subtitle.json", JSON.stringify(content), function () {
    console.log("Wriiten");
  });
});
