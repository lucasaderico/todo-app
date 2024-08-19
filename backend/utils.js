import fs from "fs/promises";

export async function dataFormatter(path) {
  const data = await fs.readFile(path, { encoding: "utf8" });
  let formattedData = data
    .replace(/\r?\n|\r/g, "")
    .split(",")
    .filter((n) => n)
    .map((e, i) => ({ id: i + 1, name: e }));

  return formattedData;
}

export async function writeToFile(path, content) {
  await fs.appendFile(path, content);
}

export async function updateFile(path, content) {
  try {
    let str = "";

    for (let i = 0; i < content.length; ++i) {
      str += `${content[i].name},\n`;
    }

    await fs.writeFile(path, str);
  } catch (error) {
    console.log(error);
  }
}
