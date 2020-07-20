const formEl = document.querySelector(".form-el");
const inputEl = document.querySelector("#location-input");
const responseEl = document.querySelector("#response");
const loadingEl = document.querySelector("#loading-element");

async function handleSubmit(event) {
  event.preventDefault();

  responseEl.innerHTML = "";
  loadingEl.innerHTML = "loading...";

  const response = await apiRequest(inputEl.value);

  responseEl.innerHTML = response;
  loadingEl.innerHTML = "";
  inputEl.value = "";
}

function apiRequest(location) {
  return fetch("http://localhost:3333/weather?address=" + location)
    .then((data) => data.json())
    .then((response) => {
      return response.error ? response.error : `${response.location}<br>${response.data}` 
    });
}

formEl.addEventListener("submit", handleSubmit);
