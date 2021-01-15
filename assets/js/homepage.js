let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");

let getUserRepos = function (user) {
    // format the github api url
    let apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl)
        
        .then(function(response) {
        // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data, user);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })  

        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        .catch(function(error) {
            alert("Unable to connect to GitHub");
        })
};

let formSubmitHandler = function(event) {
    // stop page from refreshing
    event.preventDefault();

    // get value from input element
    let username = nameInputEl.value.trim();

    // insert username into the api url bay calling the getUserRepos function
    if(username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

let displayRepos = function(repos, searchTerm) {

    // check if api returned any repos
    if (repos.length === 0) {
        repoSearchTerm.textContent = searchTerm; 
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // clear the old content before inserting the new content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;   

    // loop over repos
    for (let i = 0; i < repos.length; i++) {

        // format the repo name
        let repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a link for each repo
        let repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        // add the .html?repo= + repoName to pass it to the next page
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append the container
        repoEl.appendChild(titleEl);

        // create a status element
        let statusEl =document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check the current repo for issues
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></li>" + repos[i].open_issues_count + " issue(s)";
        } else {
          statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to the container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }

};

userFormEl.addEventListener("submit", formSubmitHandler);