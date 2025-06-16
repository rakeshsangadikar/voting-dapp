export default function handler(req, res) {
  const { role, password } = req.body;
  if (
    (role === "institute" && password === "inst123") ||
    (role === "voter" && password === "voter123")
  )
    return res.status(200).json({ success: true });
  return res.status(401).json({ success: false });
}
