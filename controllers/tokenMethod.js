require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");


// const access = process.env.ACCESS_SECRET
// const refresh = process.env.REFRESH_SECRET

module.exports = {
    generateAccessToken: (data) => {
      return sign(data, process.env.ACCESS_SECRET, { expiresIn: "3d" });
    },
    generateRefreshToken: (data) => {
      return sign(data, process.env.REFRESH_SECRET, { expiresIn: "30d" });
    },
    // sendRefreshToken: (res, refreshToken) => {
    //   res.cookie("refreshToken", refreshToken, {
    //     httpOnly: true,
    //   });
    // },
    // sendAccessToken: (res, accessToken) => {
    //   res.json({ data: { accessToken }, message: "ok" });
    // },
    resendAccessToken: (res, accessToken) => {
      res.json({ accessToken, message: "ok" });
    },


    //로그인 할 때 준 토큰이 있는지 없는지 확인할때 쓰는 메서드
    isAuthorized: (req) => {
      //console.log(req)
      
      //const authorization = req.body.headers["Authorization"];
      const authorization = req.headers["Authorization"] || req.headers["authorization"] ||req.body.headers.Authorization;
      if (!authorization) {
        return null;
      }
      const token = authorization.split(" ")[1];
      try {
        //console.log(process.env.ACCESS_SECRET)
        //console.log(token)
        //console.log(verify(token, process.env.ACCESS_SECRET))
        return verify(token, process.env.ACCESS_SECRET);
      } catch (err) {
        // return null if invalid token
        return null;
      }
    },

    //리프레쉬 토큰 확인
    checkRefeshToken: (refreshToken) => {
      try {
        return verify(refreshToken, process.env.REFRESH_SECRET);
      } catch (err) {
        // return null if refresh token is not valid
        return null;
      }
    },
  };
  