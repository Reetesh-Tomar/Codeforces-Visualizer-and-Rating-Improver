const express = require('express');
const bodyparser = require('body-parser');
const https = require('https');
const { json } = require('express');
const { copyFileSync, link } = require('fs');

const app = express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

var urlinfo = "https://codeforces.com/api/user.info?handles="

app.post("/", (req, response) => {
    var handle = req.body.handle;

    var info = urlinfo + handle;
    https.get(info, (res) => {
        res.on("data", (data) => {
            if(res.statusCode!=200){
                response.send("INVALID HANDLE");
            }
            else{
            const jankari = JSON.parse(data);
            const rating = jankari.result[0].rating;
            const maxrating = jankari.result[0].maxRating;
            const rank = jankari.result[0].rank;
            const maxrank = jankari.result[0].maxRank;
            const countfriends = jankari.result[0].friendOfCount;

            var url = "https://codeforces.com/api/user.rating?handle=";
            var api = url + handle;
        
            var arr = []
            var arr2=[]        

            https.get(api,(resa)=>{
                var chunks = [];
                resa.on("data", function (chunk) {
                    chunks.push(chunk);
                });
                resa.on("end", function () {
                    var dat = Buffer.concat(chunks);
                    const hdata = JSON.parse(dat);
                    for(key in hdata.result){
                        arr.push(hdata.result[key].newRating);
                        arr2.push(key);
                    }

                    response.render("main",{
                        username: handle,
                        rank: rank,
                        maxrank: maxrank,
                        rating: rating,
                        maxrating: maxrating,
                        friends: countfriends,
                        newitem: arr,
                        newitem2: arr2
                    })
                });
                })
                
            }
                     
        })
    })

})

app.post("/problem",(req,res)=>{
    const minrating = req.body.min;
    const maxrating = req.body.max;
    var problemurl="https://codeforces.com/api/problemset.problems";

    https.get(problemurl,(resa)=>{
        var chunks = [];  var problems=[]; var userproblem=[];  var userlink=[]; var problemrating = [];
        resa.on("data", function (chunk) {
            chunks.push(chunk);
        });
        resa.on("end", function () {
            var dat = Buffer.concat(chunks);
            const hdata = JSON.parse(dat);
            for(key in hdata.result.problems){
                problems.push(hdata.result.problems[key]);
            }

            for(key in problems){
                if(problems[key].rating==null){
                    continue;
                }
                if(problems[key].rating<=req.body.max&&problems[key].rating>=req.body.min){
                    var u ="https://codeforces.com/problemset/problem/";
                    u+=problems[key].contestId;
                    u+='/';
                    u+=problems[key].index;
                    userlink.push(u);
                    userproblem.push(problems[key].name);
                    problemrating.push(problems[key].rating);
                }
            }
            
            var heading=""
            if(userproblem.length==0){
                heading+="NO PROBLEMS FOUND!"
            }
            else{
                heading+="Suggested Problems"
            }

            res.render("problems",{
                problem:userproblem,
                userlink:userlink,
                heading:heading,
                problemrating:problemrating
            })
        });
        })
})

//EXTRA added



app.get("/compare", (req, res) => {
    res.sendFile(__dirname + "/compare.html");
})

app.post("/compare", (req, response) => {
    var handle = req.body.handle;

    var info = urlinfo + handle;
    https.get(info, (res) => {
        res.on("data", (data) => {
            if(res.statusCode!=200){
                response.send("INVALID HANDLE");
            }
            else{
            const jankari = JSON.parse(data);
            const rating = jankari.result[0].rating;
            const maxrating = jankari.result[0].maxRating;
            const rank = jankari.result[0].rank;
            const maxrank = jankari.result[0].maxRank;
            const countfriends = jankari.result[0].friendOfCount;

            var url = "https://codeforces.com/api/user.rating?handle=";
            var api = url + handle;
        
            var arr = []
            var arr2=[]        

            https.get(api,(resa)=>{
                var chunks = [];
                resa.on("data", function (chunk) {
                    chunks.push(chunk);
                });
                resa.on("end", function () {
                    var dat = Buffer.concat(chunks);
                    const hdata = JSON.parse(dat);
                    for(key in hdata.result){
                        arr.push(hdata.result[key].newRating);
                        arr2.push(key);
                    }

                    response.render("main",{
                        username: handle,
                        rank: rank,
                        maxrank: maxrank,
                        rating: rating,
                        maxrating: maxrating,
                        friends: countfriends,
                        newitem: arr,
                        newitem2: arr2
                    })
                });
                })
                
            }
                     
        })
    })

})
//***************************************** */

app.listen(3000, () => {
    console.log("Server running on port 3000")
})





