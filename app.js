const express=require("express");
const BParser=require("body-parser");
const date=require(__dirname+"/date.js");

const mongoose=require("mongoose");

const app=express();

app.use(BParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost:27017/todosDB",{useNewUrlParser: true });

const itemsSchema=new mongoose.Schema({
    name:String
});

const listSchema=new mongoose.Schema({
    name:String,
    items:[itemsSchema]
});
const Item =mongoose.model("Item",itemsSchema);
const List=mongoose.model("List",listSchema);

const item1=new Item({
    name:"Welcome!"
});

const item2=new Item({
    name:"Click!"
});

const defItems=[item1,item2];

// let todoArr=["Eat food","Revise Web dev"];
 let workList=[];

app.get("/",function(req,res){
  
 //var kday=today.toLocaleDateString("en-US",options)
 Item.find(function(err,item){
    if(err){
      console.log(err);
    }else{
      // console.log(fruits)
      if(item.length===0){
        Item.insertMany(defItems,function(err){
            if(err){
                console.log("Failed");
            }else{
                console.log("Successfully saved");
                res.redirect("/")
            }
        });
      }else{
      let kday = date.getDate();
      res.render("list",{Day:kday, listItems:item});
      }

    }
})

});

app.post("/",function(req,res){
    //console.log(req.body);
     let item= req.body.todo;
     const itemA=new Item({
         name:item
     });
     itemA.save();
     res.redirect("/")
     /*if(req.body.button=="Work list"){
        workList.push(item);
        res.redirect("/work")
     }else{
     todoArr.push(item);
     res.redirect("/");
     }*/
});

app.post("/delete",function(req,res){
    //console.log(req.body);
    const Iid=req.body.checkbox;
    Item.findByIdAndRemove(Iid,function(err){
        if(!err){
            console.log("Successfully deleted");
            res.redirect("/")
        }
    })
})


app.get("/:customListName",function(req,res){
    const cust=req.params.customListName;

    List.findOne({name:cust},function(err,fList){
        if(!err){
            if(fList){
                const list=new List({
                    name:cust,
                    items:defItems
                });
                list.save();
                res.redirect("/"+cust);
            }else{
                let kd=cust+" list"
                res.render("list",{Day:kd, listItems: fList.items})
            }
        }
    })
    
})

app.listen(3000,function(){
    console.log("Running...");
});

