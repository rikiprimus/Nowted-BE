import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {
    let key = process.env.JWT_KEY;
    console.log(req.headers['authorization'])
    if (req.headers['authorization']) {
      let auth = req.headers['authorization'];
      let Bearer = auth.split(" ");
      let decode = jwt.verify(Bearer[1], key);
    
      req.payload = decode;
      console.log(req.payload)

      next();
    } else {
      return res.status(404).json({ status: 404, message: `Need Token` });
    }
    } catch (err) {
      console.log(err)
        if(err && err.name == 'JsonWebTokenError'){
          return res.status(404).json({ status: 404, message: "Invalid Token" });
        } else if(err && err.name == 'TokenExpiredError'){
          return res.status(404).json({ status: 404, message: "Expired Token" });
        } else {
          console.log(err)
          return res.status(404).json({ status: 404, message: "Login gagal, silahkan login kembali" });
        }
    }
};

export default protect;