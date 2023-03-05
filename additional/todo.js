const Title = document.querySelector(".taskheader #title"),
  Desc = document.querySelector(".taskheader #task"),
  submitTask = document.querySelector(".submit");

let reloadStatus = localStorage.getItem("reload");
window.onload = () => {
  submitTask.disabled = true;
  lockSettingBtn[1].disabled = true;
  if ((authPin !== null) && (lockInp !== null)) {
    lockSettingBtn[0].style.display = "none";
    if (reloadStatus === "false") {
      document.querySelector(".lockedScreen").style.display = "none";
      document.querySelector(".information").style.display = "none";
    } else {
      document.querySelector(".lockedScreen").classList.remove("deactive");
    }

  } else {
    if (reloadStatus === "false") {
      document.querySelector(".lockedScreen").style.display = "none";
      document.querySelector(".information").style.display = "none";
    } else {
      document.querySelector(".lockedScreen").classList.add("deactive");
    }
  }
  setTimeout(() => {
    localStorage.removeItem("reload");
  }, 1000);
}

Title.oninput = () => {
  if (Title.value !== "") {
    submitTask.disabled = false;
  } else {
    submitTask.disabled = true;
  }
}


submitTask.addEventListener("click", () => {
  insertTitle();
  insetDescription();
  location.reload();
  localStorage.setItem("reload", "false");
  Title.value = "";
  Desc.value = "";
});

function insertTitle() {
  let getTitle = JSON.parse(localStorage.getItem("taskTitle"));

  if ((getTitle === null)) {
    taskTitle = [];
  } else {
    taskTitle = getTitle;
  }
  taskTitle.push(Title.value);
  localStorage.setItem("taskTitle", JSON.stringify(taskTitle));
}

function insetDescription() {
  let getDesc = JSON.parse(localStorage.getItem("taskDescription"));

  if ((getDesc === null)) {
    taskDesc = [];
  } else {
    taskDesc = getDesc;
  }
  taskDesc.push(Desc.value);
  localStorage.setItem("taskDescription", JSON.stringify(taskDesc));
}

showTodo();

function showTodo() {
  let output = ``;
  let outPutField = document.querySelector(".addedTask");

  let getDesc = JSON.parse(localStorage.getItem("taskDescription"));
  let getTitle = JSON.parse(localStorage.getItem("taskTitle"));
  if ((getTitle === null) && (getDesc === null)) {
    taskTitle = [];
    taskDesc = [];
  } else {
    taskTitle = getTitle;
    taskDesc = getDesc;
  }

  taskTitle.forEach((data, index) => {
    output += `
  <div class="todoList">
<div class="todoAct">
   <h2>${index+1})</h2>
    <h5>${data}</h5>
    <span class="drp next-arrow">&plus;</span>
    <input type="checkbox" id="checkbox" hidden>
    <div class="button">
      <button onclick="deleteTodo(${index})">Done &#x2713;</button>
    </div>
  </div>
  <p></p>
</div>
  `;
  });
  outPutField.innerHTML = output;
}

function deleteTodo(id) {
  let deletedTitle = taskTitle.filter((data, index) => {
    return index !== id;
  });
  localStorage.setItem("taskTitle", JSON.stringify(deletedTitle));
  let deletedDesc = taskDesc.filter((item, no) => {
    return no !== id;
  });
  localStorage.setItem("taskDescription", JSON.stringify(deletedDesc));

  showTodo();
}


const actionBtn = document.querySelectorAll(".todoAct button"),
  checkbox = document.querySelector("#checkbox"),
  arrowBtn = document.querySelectorAll(".todoList"),
  todoDesc = document.querySelectorAll(".todoList p");

arrowBtn.forEach((openDesc, number) => {
  openDesc.onclick = () => {
    if (todoDesc[number].textContent === '') {
      if (taskDesc[number].length > 500) {
        document.querySelector(".dataViewer").classList.add("active");
        document.querySelector(".dataViewer p").textContent = taskDesc[number];
        todoDesc[number].textContent = "";
      } else {
        todoDesc[number].textContent = taskDesc[number];
      }
    } else {
      todoDesc[number].textContent = "";
    }
  }
});

document.querySelector(".dataViewer .drp.close").onclick = () => {
  document.querySelector(".dataViewer").classList.remove("active");
}
document.querySelector(".copy").onclick = () => {
  navigator.clipboard.writeText(document.querySelector(".dataViewer p").textContent);
}


// lock screen setting ---------
const lockInp = document.querySelectorAll(".lockSetting input"),
  lockSettingBtn = document.querySelectorAll(".lockSetting button"),
  lockInpField = document.querySelector(".lockSetting .lockData");

lockSettingBtn[0].onclick = () => {
  lockInpField.classList.toggle("active");
}
document.querySelector(".lockData .drp.close").onclick = () => {
  lockInpField.classList.remove("active");
}

lockSettingBtn[1].addEventListener("click", () => {
  if (lockInp[0].value.length >= 4) {
    localStorage.setItem("lockPin", lockInp[0].value);
    localStorage.setItem("authPin", lockInp[1].value);
    if (localStorage.getItem("lockPin") !== null) {
      document.querySelector("#status").textContent = 'Success';
      lockInpField.classList.remove("active");
      setTimeout(() => {
        document.querySelector("#status").textContent = '';
      }, 10000);
    }
  }
});

lockInp[1].oninput = () => {
  if ((lockInp[0].value !== "") && (lockInp[1].value !== "")) {
    lockSettingBtn[1].disabled = false;
  } else {
    lockSettingBtn[1].disabled = true;
  }
}

lockInp.forEach(preVent => {
  preVent.onkeypress = () => {
    return (event.charCode != 8 && event.charCode == 0 || (event.charCode >= 48 && event.charCode <= 57));
  }
});

// lock screen-----------------
const pinEnter = document.querySelectorAll(".lockedScreen input"),
  removeBtn = document.querySelector(".lockedScreen a");
let pin = localStorage.getItem("lockPin");
let authPin = localStorage.getItem("authPin");

pinEnter[0].oninput = () => {
  if (pinEnter[0].value === pin) {
    document.querySelector(".lockedScreen").classList.add("deactive");
  }
}
removeBtn.onclick = (evt) => {
  evt.preventDefault();
  document.querySelector(".remove").classList.add("active");
  lockSettingBtn[0].style.display = "block";
}
pinEnter[1].oninput = () => {
  if (pinEnter[1].value === authPin) {
    localStorage.removeItem("lockPin");
    localStorage.removeItem("authPin");
    document.querySelector(".lockedScreen").classList.add("deactive");
  }
}
setTimeout(()=>{
  document.querySelector(".information").style.display = "none";
},5000)