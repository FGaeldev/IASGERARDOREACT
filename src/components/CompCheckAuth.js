export const checkAuth = async () => {
  const res = await fetch("http://localhost/IAS/iasfinals/php/check_auth.php", {
    credentials: "include",
  });
  return res.json();
};