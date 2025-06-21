document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault(); 
  const input = document.getElementById("usernameInput");
  const username = document.getElementById("usernameInput").value.trim();
  if (!username) {
    alert("Please enter a GitHub username.");
    return;
  }

  const url = `https://api.github.com/users/${username}`;

  fetch(url)
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
      document.querySelector(".detail").innerHTML = `<h2>Bio:</h2> <p>${data.bio || "No bio available."}</p>`;
      document.querySelector(".follow").textContent = `Followers: ${data.followers}`;
      document.querySelector(".following").textContent = `Following: ${data.following}`;
      document.querySelector(".location").textContent = `Location: ${data.location || "Unknown"}`;
      input.value = "";
      
    })
    .catch(error => {
      alert(error.message);
      console.error("Error fetching profile:", error);
    });
    
});

