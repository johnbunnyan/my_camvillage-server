const { user, post, mainslide } = require("../models"); // 생성한 테이블에서 필요한 모델을 가져온다
const sequelize = require('sequelize');
const Op = sequelize.Op

module.exports = {
  
  mainpageController: (req, res) => {
    mainslide.findAll({
      


    })
  },
  searchController: (req, res) => {
    //  /search?searchType=nickname&searchWord=jordan
    const { searchType, searchWord } = req.body;
    if(searchType === 'nickname'){
      post.findAll({
        where: {
          // Select * from post
          // left join post_user on posts.id = post_user.postId
          // left join users on post_user.userId = users.id
          // where users.nickname = searchWord
          searchWord: users.nickname    
        },
        include: [{
          model: users,
          required: false,
        }, {
          model: post_user,
          required: false
        }]
      })
    } else if(searchType === 'hashtag'){
      post.findAll({
          // Select * from post
          // left join post_tag on posts.id = post_tag.postId
          // left join tags on post_tag.tagId = tags.id
          // where tags.name = searchWord        
      })
    } else {
      post.findAll({
        where: {
          title: {
            [Op.like]: '%' + searchWord + '%'
          }
        }
      })
      .then(result => {
        res.status(200).send(result)
      })
      .catch(err => {
        res.status(500).send('err')
      })
    }

    

  }
};