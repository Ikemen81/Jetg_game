
document.getElementById("login-form").onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");
  errorMsg.textContent = "";

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    errorMsg.textContent = "ユーザー名またはパスワードが違います。";
    return;
  }

  // ログイン成功時の処理（例: ユーザー名を保存してゲーム画面へ）
  localStorage.setItem("currentUser", username);
  window.location.href = "game.html";
};
