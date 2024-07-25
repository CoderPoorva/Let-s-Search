const getUserName=document.querySelector('#user') as HTMLInputElement;
const formSubmit=document.querySelector('#form') as HTMLFormElement;
const main_container=document.querySelector('.main_container') as HTMLDivElement;

// so lets define the contract of an object

interface User{
    id:number;
    login:string;
    avatar_url:string;
    location:string;
    url:string;
}

// reusable function to fetch data from the server

async function myCustomFetcher<T>(url:string,options?:RequestInit):Promise<T>{
    const response= await fetch(url,options);

    if(!response.ok){
        throw new Error(`Netword response was not ok Status: ${response.status}`);  
}
 const data= response.json();
 console.log(data);
return data;
}

// let display the card UI

const showResultUI = (singleUser: User) => {
    const { avatar_url, login, url } = singleUser;
    main_container.insertAdjacentHTML(
      "beforeend",
      `<div class='card'> 
      <img src=${avatar_url} alt=${login} />
      <hr />
      <div class="card-footer">
        <img src="${avatar_url}" alt="${login}" /> 
        <p>${login}</p>
        <a href="${url}"> Github </a>
      </div>
      </div>
      `
    );
  };
  

function fetchUserData (url:string){
    myCustomFetcher<User[]>(url,{}).then((userInfo)=>{
        for(const user of userInfo){
            showResultUI(user);
        }
    });
}

//default function call

fetchUserData("https://api.github.com/users");

// let perform search fun

formSubmit.addEventListener('submit',async (e:Event)=>{
e.preventDefault();

const searchTerm=getUserName.value.toLowerCase();

try {
    const url = "https://api.github.com/users";

    const allUserData = await myCustomFetcher<User[]>(url, {});

    const matchingUsers = allUserData.filter((user) => {
      return user.login.toLowerCase().includes(searchTerm);
});

 // we need to clear the previous data
 main_container.innerHTML = "";

if (matchingUsers.length === 0) {
    main_container?.insertAdjacentHTML(
      "beforeend",
        `<p class="empty-msg">No matching users found.</p>`
    );
}else {
    for (const singleUser of matchingUsers) {
      showResultUI(singleUser);
    }
  }
  

} catch (error) {
    console.log(error);
}
});