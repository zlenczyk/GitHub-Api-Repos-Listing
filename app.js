btn.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("reposList").innerHTML = "";
    let getUsername = document.getElementById('userName');
    let username = getUsername.value;
    makeRequest(username);
});

function makeRequest(username){
    const apiUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
    let reposHeader = document.getElementById('reposHeader');
    let reposArray = [];
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('GET', apiUrl, true);
    xmlHttpRequest.onload = function() {
        const data = JSON.parse(this.response);
        if(data.length === 0){
            reposHeader.innerHTML = `Podany użytkownik nie istnieje.`;
        }
        else{
            if(data.length === 100){
                reposHeader.innerHTML = `Lista publicznych repozytoriów użytkownika ${username} (100 lub więcej):`;
            }
            else{
            reposHeader.innerHTML = `Lista publicznych repozytoriów użytkownika ${username} (${data.length}):`;
            }
            let ul = document.getElementById('reposList');
            for (let repo in data) {
                let li = document.createElement('li');
                li.classList.add('list-group-item');
                li.innerHTML = (`
                <h5><a href="${data[repo].html_url}">${data[repo].name}</a></h5>
                <h6>Gwiazdki: ${data[repo].stargazers_count}</h6>
                `);
                if(data[repo].language != null){
                    li.innerHTML += (`
                    <h6>Użyte języki: ${data[repo].language}</h6>
                `);
                }
                if(data[repo].description != null){
                    li.innerHTML += (`
                    <p><strong>opis:</strong> ${data[repo].description}</p>
                `);
                }
                ul.appendChild(li);
                reposArray.push(data[repo].stargazers_count);
            }
        }
        sortList(reposArray);
    }
    xmlHttpRequest.send();
}

function sortList(array) {
    let list, i, switching, b, shouldSwitch;
    list = document.getElementById("reposList");
    switching = true;
    while (switching) {
      switching = false;
      b = list.getElementsByTagName("LI");
      for (i = 0; i < (b.length - 1); i++) {
        shouldSwitch = false;
        if (Number(array[i]) < Number(array[i + 1])) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        list.insertBefore(b[i + 1], b[i]);
        [array[i], array[i+1]] = [array[i+1], array[i]];
        switching = true;
      }
    }
  }
