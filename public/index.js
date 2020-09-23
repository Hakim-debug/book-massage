/* var firebaseConfig = {
    apiKey: "AIzaSyD8X5-tO3DvwWq9iEFyAWPZGj_z6WSXS1M",
    authDomain: "massageform-86827.firebaseapp.com",
    databaseURL: "https://massageform-86827.firebaseio.com",
    projectId: "massageform-86827",
    storageBucket: "massageform-86827.appspot.com",
    messagingSenderId: "501374351677",
    appId: "1:501374351677:web:d476298770a9ecd421ed54",
    measurementId: "G-ZKHW22WCWD"
}; */

// Initialize Firebase

//firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const dbRef = db.collection("messages");

/* skicka funtionen */
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", submitForm);

const newMessage = document.getElementById("newMessage");
//newMessage.addEventListener('click', messagesTable.style.display = "none");

const messagesTable = document.getElementById("messagesTable");

const url = "https://us-central1-massageform-86827.cloudfunctions.net/messages";

let messages = [];

let messagesRef = db.collection("messages");
/* Sumbit form */
function submitForm(e) {
  e.preventDefault();

  /* Alla värden */
  let name = getInputVal("name");
  let company = getInputVal("company");
  let email = getInputVal("email");
  let phone = getInputVal("phone");
  let message = getInputVal("message");

  /* Spara medellandet */
  addMessage(name, company, email, phone, message);
}

/* Futionen som tar värdet ifrån contactForm till Firebase */

function getInputVal(id) {
  return document.getElementById(id).value;
}

/* Spara meddelande till firebase firestore directly */

function alertForm(message) {
  const alert = document.querySelector(".alert");
  alert.innerHTML = message;

  document.querySelector(".alert").style.display = "block";

  setTimeout(function () {
    document.querySelector(".alert").style.display = "none";
  }, 3000);
}

function readFirebase() {
  dbRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
    });
}

async function addMessage(
  nameValue,
  companyValue,
  emailValue,
  phoneValue,
  messageValue
) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameValue,
        company: companyValue,
        email: emailValue,
        phone: phoneValue,
        message: messageValue,
      }),
    });
    console.log(response);
    if (response.ok) {
      contactForm.reset();
      alertForm("Meddelandet skickat");
      messagesTable.style.display = "block";
      ///messageForm.style.display = "none";
    } else {
      alertForm(response.message);
    }
  } catch (err) {
    alertForm(err.message);
  }
}
const getMessages = async () => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      messages = await response.json();
      renderTable();
    } else {
      throw new Error(response.statusText);
    }
  } catch (err) {
    throw err;
  }
};
const renderTable = () => {
  let tableRow = "";
  const messagesBody = document.getElementById("messagesBody");

  messages.forEach((message) => {
    tableRow += `<tr class="mb-1">
            <td>${message.name}</td>
            <td>${message.email}</td>
            <td>${message.phone}</td>


            <td id=${message.id} onclick="deletMessage"(${message.id})>${deleteBtn}</td>
        </tr>`;
  });

  messagesBody.innerHTML = tableRow;
};
const deleteBtn = `<button type="button" class="btn btn-outline-primary">
<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
</svg>
</button>`;

const deletMessage = async () => {
  //To Do: delete from firebase using fetch API
  if (!message) {
    throw new Error("No user id found.");
  }

  try {
    const response = await fetch(url + message, { method: "DELETE" });

    if (response.ok) {
      // if everything went ok we filter out the user that was removed.
      message = message.filter((user) => user.id !== messages);
      renderTable();
      showTableSection();
    } else {
      throw new Error(response.statusText);
    }
  } catch (err) {
    throw err;
  }

  alert("Deleted");
};
document.addEventListener("load", getMessages());
