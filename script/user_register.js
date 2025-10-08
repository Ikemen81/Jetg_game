//import { saveUser } from "./shared";

document.getElementById("register-form").onsubmit = async function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const errorMsg = document.getElementById("error-msg");
  errorMsg.textContent = "";

  // バリデーション
  if (username.length === 0 || username.length > 9) {
    errorMsg.textContent = "ユーザー名は1〜9文字で入力してください。";
    return;
  }
  if (password.length === 0 || password.length > 20) {
    errorMsg.textContent = "パスワードは1〜20文字で入力してください。";
    return;
  }

  //const users = getUsers();
  const existingUsernames = await getUsers();
  console.log("existingUsernames: ", existingUsernames)
  if (existingUsernames.includes(username)) {
    errorMsg.textContent = "このユーザー名は既に使われています。";
    return;
  }

  saveUser(username, password)

  alert("登録が完了しました！");
  window.location.href = "login.html";
};