document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();

  const input = document.getElementById("usernameInput");
  const username = input.value.trim();

  if (!username) {
    alert("Please enter a GitHub username.");
    return;
  }

  const userUrl = `https://api.github.com/users/${username}`;
  const reposUrl = `https://api.github.com/users/${username}/repos`;

  // Fetch profile info
  fetch(userUrl)
    .then(res => {
      if (!res.ok) {
        throw new Error("User not found");
      }
      return res.json();
    })
    .then(data => {
      document.querySelector(".profile-img").src = data.avatar_url;
      document.querySelector(".profile-name").textContent = `Name: ${data.name || data.login}`;
      document.querySelector(".company").textContent = `Company: ${data.company || "Not specified"}`;
      document.querySelector(".detail").innerHTML = `<h2>Bio:</h2><p>${data.bio || "No bio available."}</p>`;
      document.querySelector(".follow").textContent = `Followers: ${data.followers}`;
      document.querySelector(".following").textContent = `Following: ${data.following}`;
      document.querySelector(".location").textContent = `Location: ${data.location || "Unknown"}`;

      input.value = "";

      return fetch(reposUrl);
    })
    .then(res => res.json())
    .then(repos => {
      const reposContainer = document.querySelector(".repos");
      reposContainer.innerHTML = "<h2>Repositories</h2>"; 

      if (repos.length === 0) {
        reposContainer.innerHTML = "<p>No repositories found.</p>";
        return;
      }

      repos.forEach(repo => {
        const li = document.createElement("li");
        li.className = "repo-card";
        const visibility = repo.private ? "Private" : "Public";
        const language = repo.language || "Unknown";
        li.innerHTML = `
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          <p>${repo.description || "No description"}</p>
          <div class="repo-meta">
            <span><strong>Stack:</strong> ${language}</span> |
            <span><strong>Visibility:</strong> ${visibility}</span>
          </div>
          <div class="repo-stats">
            ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}
          </div>
        `;
        reposContainer.appendChild(li);
      });
    })
    .catch(error => {
      alert(error.message);
      console.error("Error fetching data:", error);
    });
});
