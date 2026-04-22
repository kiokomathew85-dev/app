const form = document.getElementById("searchForm");
const input = document.getElementById("wordInput");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const word = input.value.trim();

  if (word === "") {
    resultDiv.innerHTML = "<p>Please enter a word.</p>";
    return;
  }

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Word not found");
      }
      return response.json();
    })
    .then(data => displayResult(data))
    .catch(error => {
      resultDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
});

function displayResult(data) {
  const wordData = data[0];

  const word = wordData.word;
  const phonetic = wordData.phonetic || "N/A";

  const meaningsHTML = wordData.meanings.map(m => {
    const definition = m.definitions[0].definition;
    const partOfSpeech = m.partOfSpeech;
    const synonyms = m.synonyms.length > 0 ? m.synonyms.join(", ") : "None";

    return `
      <p><strong>${partOfSpeech}</strong>: ${definition}</p>
      <p><em>Synonyms:</em> ${synonyms}</p>
    `;
  }).join("");

  resultDiv.innerHTML = `
    <h2>${word}</h2>
    <p><em>${phonetic}</em></p>
    ${meaningsHTML}
  `;
}