export const checkAuth = async () => {
  const res = await fetch("https://gerardo.augusta2026.online/api/check_auth.php", {
    credentials: "include",
  });
  return res.json();
};