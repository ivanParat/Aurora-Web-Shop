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
  constructor(email, username, password){
      this.email=email;
      this.username=username;
      this.password=password;
  }
  addToSessionStorage(){
    sessionStorage.setItem('user', JSON.stringify({email:this.email, username:this.username, password:this.password} ));
}
}

let userList=[];

let currentlyActiveUser=null;

const fetchUserData = (query) => {
  fetch('http://localhost:3000/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then(response => response.json())
    .then(data => {
      // Process the data as needed
      data.data.forEach(element => {
        newUser = new user(element.email, element.username, element.password);
        userList.push(newUser);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
};
const userDataQuery = "SELECT * FROM aurorauser";
fetchUserData(userDataQuery);

console.log(userList);

function readSessionStorage(){
  let userInfo=JSON.parse(sessionStorage.getItem('user'));
  if(userInfo==null){
    currentlyActiveUser=null;
    return 0;
  }
  let email=userInfo.email;
  let username=userInfo.username;
  let password=userInfo.password;
  let newUser=new user(email,username,password);
  console.log(newUser);
  currentlyActiveUser=newUser;
  firstLetterOfUsername.innerHTML=currentlyActiveUser.username[0].toUpperCase()+firstLetterOfUsername.innerHTML;
  firstLetterOfUsername.style.display="flex";
}
readSessionStorage();

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

signUpEnterBtn.addEventListener("click", async function() {
  //korisnik se ne može prijaviti ako nije popunio sva polja ili ako je netko već prijavljen
  if(!(signUpEmail.value && signUpUsername.value && signUpPassword.value) || currentlyActiveUser!=null){
    return 0;
  }
  //ako već postoji registriran taj mail, korisnik se ne može registrirati
  if(signUpCheck(signUpEmail.value)==false){
    return 0;
  }
  
  const postUserData = (query, data) => {
    fetch('http://localhost:3000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, values: Object.values(data) }),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          console.log('Data uploaded successfully:', result.data);
        } else {
          console.error('Error uploading data:', result.error);
        }
      })
      .catch(error => console.error('Error uploading data:', error));
  };
  
  const insertQuery = "INSERT INTO aurorauser (email, username, password) VALUES ($1, $2, $3) RETURNING *";
  const newData = {
    email: signUpEmail.value,
    username: signUpUsername.value,
    password: signUpPassword.value,
  };
  postUserData(insertQuery, newData);
  


  let newUser=new user(signUpEmail.value, signUpUsername.value, signUpPassword.value);
  newUser.addToSessionStorage();
  userList.push(newUser);
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
  sessionStorage.removeItem('user');
}