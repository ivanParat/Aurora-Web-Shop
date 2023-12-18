const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const fistForm = document.getElementById("form1");
const secondForm = document.getElementById("form2");
const container = document.querySelector(".container");
const showButton = document.querySelector(".link--button");
const signInEnterBtn = document.getElementById("signInEnter");
const signUpEnterBtn = document.getElementById("signUpEnter");
const logOutBtn=document.getElementById("logOutBtn");
const signUpUsername = document.getElementById("signUpUsername");
const signUpEmail = document.getElementById("signUpEmail");
const signUpPassword = document.getElementById("signUpPassword");
const signInEmail = document.getElementById("signInEmail");
const signInPassword = document.getElementById("signInPassword");
const firstLetterOfUsername=document.querySelector(".firstLetterOfUsername");

showButton.addEventListener("click", (e) => {
  e.preventDefault(); 
  container.classList.toggle("visibleContainer");
});
signInBtn.addEventListener("click", () => {
	container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
	container.classList.add("right-panel-active");
});

fistForm.addEventListener("submit", (e) => e.preventDefault());
secondForm.addEventListener("submit", (e) => e.preventDefault());

class user{
  constructor(localStorageName, email, username, password){
      this.localStorageName=localStorageName;
      this.email=email;
      this.username=username;
      this.password=password;
  }
  addToLocalStorage(){
      localStorage.setItem(this.localStorageName, JSON.stringify({email:this.email, username:this.username, password:this.password} ));
  }
  addToSessionStorage(){
    sessionStorage.setItem(this.localStorageName, JSON.stringify({email:this.email, username:this.username, password:this.password} ));
}
}

let userList=[];

let currentlyActiveUser=null;

function readSessionStorage(){
  let firstKey=Object.keys(sessionStorage)[0];
  let userInfo=JSON.parse(sessionStorage.getItem(firstKey));
  if(userInfo==null){
    currentlyActiveUser=null;
    return 0;
  }
  let localStorageName=firstKey;
  let email=userInfo.email;
  let username=userInfo.username;
  let password=userInfo.password;
  let newUser=new user(localStorageName,email,username,password);
  currentlyActiveUser=newUser;
  firstLetterOfUsername.innerHTML=currentlyActiveUser.username[0].toUpperCase()+firstLetterOfUsername.innerHTML;
  firstLetterOfUsername.style.display="flex";
}
readSessionStorage();

function readLocalStorage(){
  for(i=0;i<localStorage.length;i++){
      let userInfo=JSON.parse(localStorage.getItem("user"+i));
      let localStorageName="user"+i;
      let email=userInfo.email;
      let username=userInfo.username;
      let password=userInfo.password;
      let newUser=new user(localStorageName,email,username,password);
      userList.push(newUser);
  }
}
readLocalStorage();

function signUpCheck(email){
  for(i=0;i<userList.length;i++){
    //ako već postoji registriran taj mail, korisnik se ne može registrirati
      if(email==userList[i].email){
          return false;
      }
  }
  return true;
}
function signInCheck(email, password){
  for(i=0;i<userList.length;i++){
    //ako se poklapaju i email i lozinka, korisnik se može logirati
      if(email==userList[i].email && password==userList[i].password){
          return userList[i];
      }
  }
  return null;
}

signUpEnterBtn.addEventListener("click", () => {
  //korisnik se ne može prijaviti ako nije popunio sva polja ili ako je netko već prijavljen
  if(!(signUpEmail.value && signUpUsername.value && signUpPassword.value) || currentlyActiveUser!=null){
    return 0;
  }
  //ako već postoji registriran taj mail, korisnik se ne može registrirati
  if(signUpCheck(signUpEmail.value)==false){
    return 0;
  }
  let newUser=new user("user"+localStorage.length, signUpEmail.value, signUpUsername.value, signUpPassword.value);
  newUser.addToLocalStorage();
  newUser.addToSessionStorage();
  currentlyActiveUser=newUser;
  firstLetterOfUsername.innerHTML=currentlyActiveUser.username[0].toUpperCase()+firstLetterOfUsername.innerHTML;
  firstLetterOfUsername.style.display="flex";
  signUpEmail.value="";
  signUpUsername.value="";
  signUpPassword.value="";
  container.classList.toggle("visibleContainer");
});

signInEnterBtn.addEventListener("click", () => {
  //korisnik se ne može prijaviti ako nije popunio sva polja ili ako je netko već prijavljen
  if(!(signInEmail.value && signInPassword.value) || currentlyActiveUser!=null){
    return 0;
  }
  //provjerava se ima li već taj user spremljen
  let user=signInCheck(signInEmail.value,signInPassword.value);
  if(user==null){
    return 0;
  }
  user.addToSessionStorage();
  currentlyActiveUser=user;
  firstLetterOfUsername.innerHTML=currentlyActiveUser.username[0].toUpperCase()+firstLetterOfUsername.innerHTML;
  firstLetterOfUsername.style.display="flex";
  signInEmail.value="";
  signInPassword.value="";
  container.classList.toggle("visibleContainer");
});

//this function is called in html, wouldn't work with event listener for some reason
function logOut(){
  firstLetterOfUsername.innerHTML=firstLetterOfUsername.innerHTML.replace(currentlyActiveUser.username[0].toUpperCase(), '');
  firstLetterOfUsername.style.display="none";
  currentlyActiveUser=null;
  sessionStorage.clear();
}