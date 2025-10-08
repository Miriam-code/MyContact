import jwt from "jsonwebtoken";

export function jwtUtils(req, res, next) {

  const authHeader = req.headers.authorization;
  const token = parse(authHeader);

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token invalide" });
  }
}


export function parse(authorization) {
  return authorization != null ? authorization.replace("Bearer ", "") : null;
}

export function getUser(authorization) {

  const token = parse(authorization);

  if (!token || token === "null") return -1;

  try {
    const jwtToken = jwt.verify(token, process.env.SECRET);
   
    return jwtToken.id || -1;
  } catch (err) {
    console.error("Erreur vérification JWT:", err);
    console.error(err);
    return -1;
  }
}


export function adminUser(authorization) {
  const token = parse(authorization);
  if (!token || token === "null") return false;

  try {
    const jwtToken = jwt.verify(token, process.env.SECRET);
    return jwtToken.is_admin || false;
  } catch (err) {
    console.error(err);
    return false;
  }
}
