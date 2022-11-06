const initUrl = 'http://localhost:3000/cards/';
const initMemoryUrlCard = 'http://localhost:3000/cards-memorized/';
let html = ``;
let codeAdmin = 1234;
let isDarkThemeInit = false;
let isTranslate = false;
let deleteCard = true;
let disabledButtonEditAndDelete = true;
let countNumberMemorized = 0;
let countCardNumbers = 0;
let wholeCardWeHave = [];

const enableAdminRights = () => {
   let codeAdminUserEnter = localStorage.getItem('userCode') || document.querySelector('#codeAdmin').value; 
   let htmlAddNewCard = document.querySelector('#cardDisplay');
   if (Number(codeAdminUserEnter) === codeAdmin) {
      localStorage.setItem('userCode', codeAdminUserEnter);
      htmlAddNewCard.classList.remove('hide-card');
      disabledButtonEditAndDelete = false;
   } else {
      htmlAddNewCard.classList.add('hide-card');
      disabledButtonEditAndDelete = true;
      alert('Enter true code to edit');
   }
}

const changeTheme = () => {
   isDarkTheme = !JSON.parse(localStorage.getItem('isDarkTheme'));
   if (isDarkTheme) {
      localStorage.setItem('isDarkTheme', true);
      handleChangeBgToBlack();
   } else {
      localStorage.setItem('isDarkTheme', false);
      handleChangeBgToWhite();
   }
}

const createGroupCardFollowTime = (time) => {   
   const cardGroup = document.createElement('ul');
   cardGroup.setAttribute('class',`list-cards list-cards-${time}`);
   cardGroup.setAttribute('data-index',`${time}`);
   return cardGroup;
}

const showCardInitial = (id, name, numberOfTimes, translate, pronounce, createTime) => {
   document.querySelector(`.each-card-${id}`).innerHTML = `
      <h2 class="title-card">${name}</h2>
      <p class="description">Number Of Times: ${numberOfTimes}</p>
      <p class="created-date">Created Date: ${createTime}</p>
      <div class="btn-each-card">
         <button class="card-btn translate-btn" 
            onclick="handleTranslateCard(${id}, '${name}', ${numberOfTimes}, '${translate}', '${pronounce}', '${createTime}')">Translate
         </button>
         <button class="card-btn delete-btn" 
            onclick="handleDeleteCards(${id}, '${name}', ${numberOfTimes}, '${translate}', '${pronounce}', '${createTime}')"> Delete 
         </button>
         <button class="card-btn edit-btn" 
            onclick="handleEditCards(${id}, '${name}', ${numberOfTimes}, '${translate}', '${pronounce}', '${createTime}')"> Edit 
         </button>
      </div>
   `
   document.querySelector('.delete-btn').removeAttribute('disabled', true);
}

const handleGetCards = () => {
   // localStorage.removeItem('userCode')
   enableAdminRights();
   fetch(initUrl)
      .then(data => data.json())
      .then(data => {
         wholeCardWeHave = wholeCardWeHave.concat(data);
         const firstCard = data[0];
         let initTime = firstCard.createTime;
         let arrDiffTime = [];
         arrDiffTime.push(initTime);
         htmlUl = createGroupCardFollowTime(initTime);
         document.querySelector('.cards-follow-create-time').appendChild(createGroupCardFollowTime(initTime));
         for (let i in data) {
            countCardNumbers += 1;
            if (data[i].createTime != initTime) {
               document.querySelector('.cards-follow-create-time').appendChild(createGroupCardFollowTime(data[i].createTime));
               arrDiffTime.push(data[i].createTime);
               initTime = data[i].createTime;
            } 
         }
         for (let i in data) {
            document.querySelector(`.list-cards-${data[i].createTime}`).appendChild(new DOMParser().parseFromString(`
            <li class="each-card each-card-${data[i].id} each-card-background-${data[i].numberOfTimes}">
               <h2 class="title-card">${data[i].name}</h2>
               <p class="description">Number Of Times: ${data[i].numberOfTimes}</p>
               <p class="created-date">Created Date: ${data[i].createTime}</p>
               <div class="btn-each-card">
                  <button class="card-btn translate-btn" 
                     onclick="handleTranslateCard(${data[i].id},'${data[i].name}', ${data[i].numberOfTimes}, '${data[i].translate}', '${data[i].pronounce}', '${data[i].createTime}')">Translate
                  </button>
                  <button class="card-btn delete-btn" 
                     onclick="handleDeleteCards(${data[i].id},'${data[i].name}', ${data[i].numberOfTimes}, '${data[i].translate}', '${data[i].pronounce}', '${data[i].createTime}')"> Delete 
                  </button>
                  <button class="card-btn edit-btn" 
                     onclick="handleEditCards(${data[i].id},'${data[i].name}', ${data[i].numberOfTimes}, '${data[i].translate}', '${data[i].pronounce}', '${data[i].createTime}')"> Edit 
                  </button>
               </div>
            </li>
            `, "text/html").firstChild)
         }
         document.querySelector('.card-numbers').innerHTML = countCardNumbers;
      });
   }

const handleGetMemorizedCards = () => {
   fetch(initMemoryUrlCard)
   .then(data => data.json())
   .then(data => {
      wholeCardWeHave = wholeCardWeHave.concat(data);
      let eachRowOfTable = `
         <tr>
            <th>STT</th>
            <th>Name</th>
            <th>Pronounce</th>
            <th>Translate</th>
         </tr>
      `;

      data.forEach(card => {
         countNumberMemorized = countNumberMemorized + 1;
         eachRowOfTable += `
            <tr>
               <td>${card.id}</td>
               <td>${card.name}</td>
               <td>${card.pronounce}</td>
               <td class="translate-and-delete">${card.translate} 
                  <button onclick="deleteRowMemorized(${card.id})" class="btn-delete-memorized-row">X</button>
               </td>
            </tr>
         `
      })
      document.querySelector('table').innerHTML = eachRowOfTable
      document.querySelector('.memorized-number').innerHTML = countNumberMemorized;
   });
}

handleGetCards();

handleGetMemorizedCards();

const handleChangeBgToBlack = () => {
   document.querySelector('body').style = `
      background-color: rgb(41, 41, 41);
      color: white;
   `
   document.querySelector('.theme-btn').textContent = 'Light Theme';
}

const handleChangeBgToWhite = () => {
   document.querySelector('body').style = `
      background-color: white;
      color: black;
   `
   document.querySelector('.theme-btn').textContent = 'Dark Theme';
}

// localStorage.removeItem('isDarkTheme')
isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme')) || isDarkThemeInit;
isDarkTheme === true ? handleChangeBgToBlack() : handleChangeBgToWhite();

const createCard = (data, callback) => {
   var option = {
      method: 'POST',
      body: JSON.stringify(data)
   };
   fetch(initUrl, option)
      .then(function (res) {
         res.json();
      })
      .then(callback)
}

const getCurrentTime = () => {
   const date = new Date();
   const year = date.getFullYear();
   const month = date.getMonth() + 1;
   const day = date.getDate();
   return `${month}-${day}-${year}`;
}

const handlePostcards = () => {
   fetch(initUrl, {
      method: 'POST', 
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         name: document.querySelector('.card-title').value,
         translate: document.querySelector('.card-translate').value,
         pronounce: document.querySelector('.card-pronounce').value,
         numberOfTimes: 0,
         createTime: getCurrentTime()
      })
   });
}

document.querySelector('.add-btn').onclick = () => {
   if (document.querySelector('.card-title').value.trim() != '' 
         && document.querySelector('.card-translate').value.trim() != '' 
         && document.querySelector('.card-pronounce').value != '') {
      const workDuplicate = wholeCardWeHave.find(card => card.name.trim() 
                              == document.querySelector('.card-title').value.trim());
      if (workDuplicate) {
         alert('This word already existed!')
      } else {
         handlePostcards();
      }
   } else {
      alert('Please fill all the field before submit!');
   }
}

const handleDeleteCards = (id, name, numberOfTimes, translate, pronounce, createTime) => {
   if (window.confirm('Do you want to delete this card!')) {
      deleteCard = true;
      fetch(`${initUrl}${id}`, {
         method: 'DELETE', 
         headers: {
            'Content-Type': 'application/json'
         }
      });
      handleMemorizedCards(id, name, numberOfTimes, translate, pronounce, createTime)
   } else {
      deleteCard = false;
   }
}

const handleEditCards = (id, name, numberOfTimes, translate, pronounce, createTime) => {
   document.querySelector(`.each-card-${id}`).innerHTML = `
      <b>New word</b>
      <input class="card-edit-input edit-title-${id}" 
         onkeyup="handleShowSaveButton(${id}, '${name}', ${numberOfTimes}, '${translate}', '${pronounce}')">
      <b>Translate</b>
      <input class="card-edit-input edit-translate-${id}" 
         onkeyup="handleShowSaveButton(${id}, '${name}', ${numberOfTimes}, '${translate}', '${pronounce}')">
      <b>Pronounce</b>
      <input class="card-edit-input edit-pronounce-${id}" 
         onkeyup="handleShowSaveButton(${id}, '${name}', ${numberOfTimes}, '${translate}', '${pronounce}')">
      <b>Number of times (0 -> 3)</b>
      <input name="" class="card-edit-input edit-description-${id}" 
         onkeyup="handleShowSaveButton(${id}, '${name}', ${numberOfTimes}, '${translate}', '${pronounce}')">
      </input>
      <div class="btn-each-card">
         <button class="card-btn save-and-edit-btn save-edit-card-btn" 
            onclick="handleSaveEditCards(${id}, '${name}', ${numberOfTimes}, '${translate}', '${pronounce}', '${createTime}')"> Save 
         </button>
         <button class="card-btn save-and-edit-btn close-edit-card-btn" 
            onclick="handleCloseEditCards(${id}, '${name}', ${numberOfTimes}, '${translate}', '${pronounce}', '${createTime}')"> Close
         </button>
      </div>
   `
   document.querySelector(`.edit-title-${id}`).value = name;
   document.querySelector(`.edit-translate-${id}`).value = translate;
   document.querySelector(`.edit-pronounce-${id}`).value = pronounce;
   document.querySelector(`.edit-description-${id}`).value = numberOfTimes;
   document.querySelector(`.edit-title-${id}`).focus();
   document.querySelector(`.save-edit-card-btn`).setAttribute('disabled', true);
}

const handleSaveEditWhenPressEnter = (event, id, name, numberOfTimes, translate, pronounce, createTime) => {
   if (event.keyCode == 13) {
      handleSaveEditCards(id, name, numberOfTimes, translate, pronounce, createTime);
   }
}

const checkWriting = (event, id, name) => {
   if (event.keyCode == 13) {
      if (event.target.value.trim().toLowerCase() == name.trim().toLowerCase()) {
         document.querySelector(`#infoPassOrFail${id}`).innerHTML = 'CHECK WRITING PASS!';
         document.querySelector(`#infoPassOrFail${id}`).style = 'color: lime';
      } else {
         document.querySelector(`#infoPassOrFail${id}`).innerHTML = 'CHECK WRITING FAIL!';
         document.querySelector(`#infoPassOrFail${id}`).style = 'color: red';

      }
   }
}

const handleTranslateCard = (id, name, numberOfTimes, translate, pronounce, createTime) => {
   isTranslate = !isTranslate;
   if(isTranslate) {
      document.querySelector(`.each-card-${id}`).innerHTML = `
         <h1>${translate}</h1>
         <div style="display: flex"><b>Check writing:</b><input onkeyup="checkWriting(event, ${id}, '${name}')"></div>
         <div id="infoPassOrFail${id}"></div>
         <b>Pronounce: ${pronounce}</b>
         <div class="btn-each-card">
            <button class="card-btn translate-btn" 
               onclick="handleTranslateCard(${id},'${name}', ${numberOfTimes}, '${translate}', '${pronounce}', '${createTime}')">&#x2B05;&#x2B05;  
            </button>
         </div>
      `
   } else {
      showCardInitial(id, name, numberOfTimes, translate, pronounce, createTime);
   }
}

const handleShowSaveButton = (id, name, numberOfTimes, translate, pronounce) => {
   let titleAfterChange = document.querySelector(`.edit-title-${id}`).value;
   let translateAfterChange = document.querySelector(`.edit-translate-${id}`).value;
   let pronounceAfterChange = document.querySelector(`.edit-pronounce-${id}`).value;
   let numberOfTimesAfterChange = document.querySelector(`.edit-description-${id}`).value;
   if (name.trim() != titleAfterChange.trim() 
         || translate.trim() != translateAfterChange.trim() 
         || pronounce.trim() != pronounceAfterChange.trim() 
         || numberOfTimes != numberOfTimesAfterChange) {
      document.querySelector(`.save-edit-card-btn`).removeAttribute('disabled', true);
   }
}

const handleCloseEditCards = (id, name, numberOfTimes, translate, pronounce, createTime) => {
   let titleAfterChange = document.querySelector(`.edit-title-${id}`).value;
   let numberOfTimesAfterChange = document.querySelector(`.edit-description-${id}`).value;
   let translateAfterChange = document.querySelector(`.edit-translate-${id}`).value;
   let pronounceAfterChange = document.querySelector(`.edit-pronounce-${id}`).value;
   if (name.trim() != titleAfterChange.trim() 
         || translate.trim() != translateAfterChange.trim() 
         || pronounce.trim() != pronounceAfterChange.trim() 
         || numberOfTimes != numberOfTimesAfterChange) {
      if (window.confirm("You changed if you close every change of you will lose. Do you want to close?")) {
         showCardInitial(id, name, numberOfTimes, translate, pronounce, createTime);
      }
   } else {
      showCardInitial(id, name, numberOfTimes, translate, pronounce, createTime);
   }
}

const handleSaveEditCards = (id, name, numberOfTimes, translate, pronounce, createTime) => {
   deleteCard = true;
   let titleAfterChange = document.querySelector(`.edit-title-${id}`).value;
   let numberOfTimesAfterChange = document.querySelector(`.edit-description-${id}`).value;
   let translateAfterChange = document.querySelector(`.edit-translate-${id}`).value;
   let pronounceAfterChange = document.querySelector(`.edit-pronounce-${id}`).value;
   if (name.trim() != titleAfterChange.trim() 
         || translate.trim() != translateAfterChange.trim()    
         || pronounce.trim() != pronounceAfterChange.trim() 
         || numberOfTimes != numberOfTimesAfterChange) {
         checkRemoveCardWhenCountEqualOrThanFour(numberOfTimesAfterChange, id);
      if (Number(numberOfTimesAfterChange < 0) || Number(numberOfTimesAfterChange > 3)) {
         alert('Number of times much smaller than 4 and larger than -1!');
      } else {
         if (deleteCard) {
            fetch(`${initUrl}${id}`, {
               method: 'PUT', 
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                  name: titleAfterChange,
                  numberOfTimes: Number(numberOfTimesAfterChange),
                  translate: translateAfterChange,
                  pronounce: pronounceAfterChange,
                  createTime: createTime
               })
            });
         } else {
            showCardInitial(id, name, numberOfTimes, translate, pronounce, createTime);
         }
      }
   } else {
      showCardInitial(id, name, numberOfTimes, translate, pronounce, createTime);
   }
}

const handleMemorizedCards = (id, name, numberOfTimes, translate, pronounce, createTime) => {
   handlePostToMemoryCards(id, name, numberOfTimes, translate, pronounce, createTime);
   fetch(`${initUrl}${id}`, {
      method: 'DELETE', 
      headers: {
         'Content-Type': 'application/json'
      }
   });
}

const handlePostToMemoryCards = (id, name, numberOfTimes, translate, pronounce, createTime) => {
   fetch(initMemoryUrlCard, {
      method: 'POST', 
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         name: name,
         translate: translate,
         pronounce: pronounce,
         numberOfTimes: numberOfTimes,
         createTime: createTime
      })
   });
}

const checkRemoveCardWhenCountEqualOrThanFour = (numberOfTimes, cardId) => {
   if ((numberOfTimes) >= 4) {
      return;
   }
}

const deleteRowMemorized = (id) => {
   fetch(`${initMemoryUrlCard}${id}`, {
      method: 'DELETE', 
      headers: {
         'Content-Type': 'application/json'
      }
   });
}