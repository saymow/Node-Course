const socket = io();
const $sidebar = document.querySelector("#sidebar");
const $form = document.querySelector("form");
const $formButton = document.querySelector("form button");
const $input = document.querySelector("#message-input");
const $locationButton = document.querySelector("#send-location");
const $messagesContainer = document.querySelector("#messages-container");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const sideBarTemplate = document.querySelector("#sidebar-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  const $lastMessage = $messagesContainer.lastElementChild;
  const visibleHeight = $messagesContainer.offsetHeight;
  const realHeight = $messagesContainer.scrollHeight;
  const totalScrolled = $messagesContainer.scrollTop + visibleHeight;

  const messageStyles = getComputedStyle($lastMessage);
  const messageMargin = parseInt(messageStyles.marginBottom);
  const messageHeight = $lastMessage.offsetHeight + messageMargin;

  if (realHeight - messageHeight <= totalScrolled) {
    $messagesContainer.scrollTop = $messagesContainer.scrollHeight;
  }
};

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messagesContainer.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (message) => {
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messagesContainer.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sideBarTemplate, {
    room,
    users,
  });

  $sidebar.innerHTML = html;
});

$form.onsubmit = (event) => {
  event.preventDefault();
  $formButton.setAttribute("disabled", true);

  const message = $input.value;
  socket.emit("sendMessage", message, (error) => {
    $formButton.removeAttribute("disabled");
    $input.value = "";
    $input.focus();

    if (error) console.log(error);
  });
};

$locationButton.onclick = () => {
  if (!navigator.geolocation) alert("Unable to use location service.");

  $locationButton.setAttribute("disabled", true);

  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }) => {
      socket.emit(
        "sendLocation",
        {
          latitude,
          longitude,
        },
        () => {
          $locationButton.removeAttribute("disabled");
        }
      );
    }
  );
};

socket.emit(
  "join",
  {
    username,
    room,
  },
  (error) => {
    if (error) {
      alert(error);
      location.href = "/";
    }
  }
);
