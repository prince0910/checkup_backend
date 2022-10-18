var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var db = require('./config');
var app = express();
var cors = require('cors');
var crypto = require("crypto");
var { token } = require('morgan');
const conn = require('./config');
// const multer = require('multer')


//////////
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
    secret: '123456catr',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash());

/////////test
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/',function(req,res,next){
  var sql = `SELECT Emp_ID FROM Employee WHERE Emp_Mail LIKE '443drdgfx@hitmail.com' AND pwd = '5eda9dae99e2aa981ed22246d0c0e6a36768c2d01fb41ab16338e05636b7fafb'`
  console.log(sql)
  db.query(sql, function(err, result){
    if (err) throw err;
    var json = JSON.stringify(result)
    res.end(json);
    
  })
});
/////////////// Employee
app.get('/employee',function(req,res,next){
  var sql = `SELECT * FROM Employee`
  db.query(sql, function(err, result){
    if (err){
      throw err;
    }else{
      var json = JSON.stringify(result)
      res.end(json)

    }
 
  })
});

////////// function
function hashPassword(password){
  try {
    const salt = "some salt2";
    const sha256Hasher = crypto.createHmac("sha256", salt);
    const hash = sha256Hasher.update(password).digest("hex");
    return hash
  } catch (error) {
    console.log('password----------->',password)
    console.log(error)
  }
  
}

function genToken(){
  var result = "-"
  result = crypto.randomBytes(64).toString('hex');
  return result
}



app.post('/checkauthen', function(req, res, next){
 var token = req.body.token
 var path =req.body.path
 console.log('path',path)
 var sql = `SELECT * FROM Employee 
 INNER JOIN PagePrivilege ON Employee.Role = PagePrivilege.Role
 WHERE Employee.token = "${token}"
 AND PagePrivilege.path = "${path}"`
 console.log(sql)
 db.query(sql, function(err, result){
    if (err){
      console.log('Errorrrrrrr')
      throw err;
    }
    row_number = result.length
    console.log('goooooooooooood')
    if(row_number == 1){
      res.json({ 
        isLogin:true,
      });
    }else{
      console.log('baddddddddddddddd')
      res.json({ 
        isLogin:false,
      });
    }
  })
});


app.post('/checklogin', function(req, res, next){
  var Emp_Mail = req.body.Emp_Mail
  var pwd =  hashPassword(req.body.pwd)
  var sql = `SELECT Emp_Mail, pwd  FROM Employee 
   where Emp_Mail= "${Emp_Mail}" AND pwd= "${pwd}" AND Role = "Admin"`
  console.log(sql)
  
  var row_number = 0
  db.query(sql, function(err, result, field){
    if (err) throw err;
    json = JSON.stringify(result)
    row_number = result.length   
    //console.log()
    
    if(row_number === 1){
      var token = genToken() 
      let sql2 = `UPDATE Employee set token = "${token}" where Emp_Mail= "${req.body.Emp_Mail}"`
      db.query(sql2, function(err, result, field){
        if (err) throw err;
        res.json({ 
          message:'ok',
          token:token
        });
      })
    }else{
      res.json({ 
        message:'user or password is incorrect!!!',
      });
    }
  })
})
///////////// login



app.post('/employee', function (req, res, next) {

var token = genToken()
var pwd = hashPassword(req.body.pwd)
var Emp_sick = req.body.Emp_sick
var Emp_Sex = req.body.Emp_Sex
var Emp_Scanpic = req.body.Emp_Scanpic
var Emp_religion = req.body.Emp_religion
var Emp_race = req.body.Emp_race
var Emp_Pic = req.body.Emp_Pic
var Emp_Phone = req.body.Emp_Phone
var Emp_nationality = req.body.Emp_nationality
var Emp_Name = req.body.Emp_Name ///edi
var Emp_Mail = req.body.Emp_Mail
var Emp_IssueDate = req.body.Emp_IssueDate
var Emp_Identity_ID = req.body.Emp_Identity_ID
var Emp_bloodtype = req.body.Emp_bloodtype
var Emp_Birthday = req.body.Emp_Birthday
var Emp_Addressnow = req.body.Emp_Addressnow
var Emp_Address = req.body.Emp_Address
var Role = req.body.Role
var Emp_ID =req.body.Emp_ID


 // คำสั่ง sql ในการยัดข้อมูลลง database
  var sql = `INSERT INTO Employee (
    token,
    pwd,
    Emp_sick, 
    Emp_Sex, 
    Emp_Scanpic, 
    Emp_religion, 
    Emp_race, 
    Emp_Pic,
    Emp_Phone,
    Emp_nationality, 
    Emp_Name, 
    Emp_Mail, 
    Emp_Identity_ID, 
    Emp_bloodtype, 
    Emp_Birthday,
    Emp_Addressnow, 
    Emp_Address,
    Role,
    Emp_ID) VALUES (
    "${token}",
    "${pwd}", 
    "${Emp_sick}", 
    "${Emp_Sex}", 
    "${Emp_Scanpic}", 
    "${Emp_religion}", 
    "${Emp_race}", 
    "/path",
    "${Emp_Phone}",
    "${Emp_nationality}", 
    "${Emp_Name}", 
    "${Emp_Mail}",   
    "${Emp_Identity_ID}", 
    "${Emp_bloodtype}", 
    "${Emp_Birthday}", 
    "${Emp_Addressnow}", 
    "${Emp_Address}",
    "${Role}",
    "${Emp_ID}"  
    )`;
      
      console.log('sql',sql);
      
  // excute คำสั่ง
  db.query(sql, function(err, result) {
    if (err) throw err;
    if (err) {
      res.json({ 
        message:err
      });
    }else{
      res.json({ 
        message:'ok'
        
      });
    }
    // response jason ไปยังหน้าบ้าน
    
  });
});

app.put('/employee', function(req, res, next) {
  var Emp_ID = req.body.Emp_ID // genEmpID()
  var token = req.body.token
  var pwd = req.body.pwd
  var Emp_sick = req.body.Emp_sick
  var Emp_Sex = req.body.Emp_Sex
  var Emp_Scanpic = req.body.Emp_Scanpic
  var Emp_religion = req.body.Emp_religion
  var Emp_race = req.body.Emp_race
  var Emp_Pic = req.body.Emp_Pic
  var Emp_Phone = req.body.Emp_Phone
  var Emp_nationality = req.body.Emp_nationality
  var Emp_Name = req.body.Emp_Name
  var Emp_Mail = req.body.Emp_Mail
  var Emp_IssueDate = req.body.Emp_IssueDate
  var Emp_Identity_ID = req.body.Emp_Identity_ID
  var Emp_bloodtype = req.body.Emp_bloodtype
  var Emp_Birthday = req.body.Emp_Birthday
  var Emp_Addressnow = req.body.Emp_Addressnow
  var Emp_Address = req.body.Emp_Address

  var sql = `UPDATE Employee
  SET token = "${token}",
  pwd = "${pwd}", 
  Emp_sick = "${Emp_sick}", 
  Emp_Sex = "${Emp_Sex}", 
  Emp_Scanpic = "${Emp_Scanpic}", 
  Emp_religion = "${Emp_religion}", 
  Emp_race = "${Emp_race}", 
  Emp_Pic = "${Emp_Pic}",
  Emp_Phone = "${Emp_Phone}",
  Emp_nationality = "${Emp_nationality}",
  Emp_Name = "${Emp_Name}", 
  Emp_Mail = "${Emp_Mail}", 
  Emp_IssueDate = "${Emp_IssueDate}", 
  Emp_Identity_ID = "${Emp_Identity_ID}", 
  Emp_bloodtype = "${Emp_bloodtype}", 
  Emp_Birthday = "${Emp_Birthday}",
  Emp_Addressnow = "${Emp_Addressnow}", 
  Emp_Address = "${Emp_Address}"
  WHERE Emp_ID = "${Emp_ID}"; `
  console.log(sql)
  db.query(sql, function(err, result) {
    if (err) {
      res.json({ 
        message:err
      });
    }else{
      res.json({ 
        message:'ok'
      });
    }
    // response jason ไปยังหน้าบ้าน
  });

});

app.delete('/employee', function(req, res,next) {
  var Emp_ID = req.body.Emp_ID

  // คำสั่ง sql ในการลบข้อมูลใน database////////////////////////////
  var sql = `DELETE FROM Employee 
  WHERE Emp_ID = "${Emp_ID}"`



  db.query(sql, function(err, result) {
    if (err) throw err;
    // response jason ไปยังหน้าบ้าน
    res.json({ 
      message:'ok'
    });
  });
});

/////////////// EmployeeInOut
app.get('/employeeInOut',function(req,res,next){
  var sql = `SELECT * FROM EmployeeInOut`
  db.query(sql, function(err, result){
    if (err) throw err;
    var json = JSON.stringify(result)
    res.end(json);
  })
});

app.post('/employeeInOut', function(req, res, next) {
var Emp_Entry_In = req.body.Emp_Entry_In
var Emp_Entry_Out = req.body.Emp_Entry_Out
var Emp_ID = req.body.Emp_ID 
    // คำสั่ง sql ในการยัดข้อมูลลง database
  var sql = `INSERT INTO EmployeeInOut (
    
    Emp_Entry_In,
    Emp_Entry_Out,
    Emp_ID) VALUES (
    "${Emp_Entry_In}",
    "${Emp_Entry_Out}", 
    "${Emp_ID}" 
  )`;
      // excute คำสั่ง
  db.query(sql, function(err, result) {
    if (err) {
      res.json({ 
        message:err
      });
    }else{
      res.json({ 
        message:'ok'
      });
    }
    // response jason ไปยังหน้าบ้าน
    
  });
});

app.put('/employeeInOut', function(req, res, next) {

  var Emp_Entry_In = req.body.Emp_Entry_In
  var Emp_Entry_Out = req.body.Emp_Entry_Out
  var Emp_ID = req.body.Emp_ID


  var sql = `UPDATE EmployeeInOut 
  SET Emp_Entry_In = "${Emp_Entry_In}", 
  Emp_Entry_Out = "${Emp_Entry_Out}" 
  WHERE Emp_ID = "${Emp_ID}"; `
  console.log(sql)
  // excute คำสั่ง
  db.query(sql, function(err, result) {
    if (err) {
      res.json({ 
        message:err
      });
    }else{
      res.json({ 
        message:'ok'
      });
    }
    // response jason ไปยังหน้าบ้าน
  });

});

app.delete('/employeeInOut', function(req, res,next) {
  var Inout_ID = req.body.Inout_ID

  // คำสั่ง sqlในการลบข้อมูลในdatabase////////////////////////////
  var sql = `DELETE FROM EmployeeInOut 
  WHERE Inout_ID = "${Inout_ID}"`

//
  db.query(sql, function(err, result) {
    if (err) throw err;
    // response jason ไปยังหน้าบ้าน
    res.json({ 
      message:'ok'
    });
  });
});
function checkPagePrivilege(token){
    var sql = `SELECT * 
    FROM Employee 
    INNER JOIN PagePrivilege ON Employee.Role = PagePrivilege.Role
    WHERE Employee.token = "${token}"
    AND PagePrivilege.Page_name = "${Page_name}"`
    db.query(sql, function(err, result) {
      if (err) {
        return false
      }else{
        return true
      }
    })

    return false
  }
  


/////////////// Department
app.get('/department',function(req,res,next){
  const page_name = "department"
  
  if(!checkPagePrivilege(token)){
    // กรณีไม่มีสิทเข้าถึง
    res.json({ 
      message:'คุณไม่มีสิทเข้าถึงข้อมูลนี้ กรุณาติดต่อ admin'
    });
    
  }

  var sql = `SELECT * FROM Department`
  db.query(sql, function(err, result){
    if (err) throw err;
    var json = JSON.stringify(result)
    res.end(json);
  })
});
////
app.post('/department', function(req, res, next) {
  var dep_ID = req.body.dep_ID 
  var dep_name = req.body.dep_name
  var Emp_ID = req.body.Emp_ID
 
   // คำสั่ง sql ในการยัดข้อมูลลง database
    var sql = `INSERT INTO Department (
      dep_ID,
      dep_name,
      Emp_ID) VALUES (
      "${dep_ID}",
      "${dep_name}",
      "${Emp_ID}" 
    )`;
    
  
    // excute คำสั่ง
    db.query(sql, function(err, result) {
      if (err) {
        res.json({ 
          message:err
        });
      }else{
        res.json({ 
          message:'ok'
        });
      }
      // response jason ไปยังหน้าบ้าน
      
    });
});
///
app.put('/department', function(req, res, next) {
  var dep_ID = req.body.dep_ID 
  var dep_name = req.body.dep_name
  var Emp_ID = req.body.Emp_ID
  

  var sql = `UPDATE Department 
  SET dep_name = "${dep_name}",
  Emp_ID = "${Emp_ID}"
  WHERE dep_ID = "${dep_ID}"; `
  console.log(sql)
  // excute คำสั่ง
  db.query(sql, function(err, result) {
    if (err) {
      res.json({ 
        message:err
      });
    }else{
      res.json({ 
        message:'ok'
      });
    }
    // response jason ไปยังหน้าบ้าน
  });

});
///
app.delete('/department', function(req, res,next) {
  var dep_ID = req.body.dep_ID 
  // คำสั่ง sqlในการลบข้อมูลในdatabase////////////////////////////
  var sql = `DELETE FROM Department 
  WHERE dep_ID = "${dep_ID}"`

//
  db.query(sql, function(err, result) {
    if (err) throw err;
    // response jason ไปยังหน้าบ้าน
    res.json({ 
      message:'ok'
    });
  });
});
/////**** *เพิ่มลิ้งอนุมัติอัปเดท
/////////////// Leaves
app.get('/leaves',function(req,res,next){
  var Leave_Inform = req.body.Leave_Inform
  var Leave_day = req.body.Leave_day
  var Leave_dayend = req.body.Leave_dayend
  var Leave_type = req.body.Leave_type
  var Emp_ID = req.body.Emp_ID
  var Emp_Name =req.body.Emp_Name
  var sql = `SELECT Leaves.Leave_Inform, Leaves.Leave_day , Leaves.Leave_dayend , Employee.Emp_Name, Leaves.Leave_type   
  FROM Leaves, Employee 
  WHERE Leaves.Emp_ID = Employee.Emp_ID
  `
  console.log(sql)
  db.query(sql, function(err, result){
    if (err) throw err;
    
    var json = JSON.stringify(result)
    res.end(json);
  })
});
///
app.post('/leaves', function(req, res, next) {
  var Leave_Inform = req.body.Leave_Inform
  var Leave_day = req.body.Leave_day
  var Leave_dayend = req.body.Leave_dayend
  var Leave_type = req.body.Leave_type
  var Leave_timetype = req.body.Leave_timetype
  var Emp_ID = req.body.Emp_ID
 
   // คำสั่ง sql ในการยัดข้อมูลลง database
    var sql = `INSERT INTO Leaves (
      Leave_Inform,
      Leave_day,
      Leave_dayend,
      Leave_type,
      Leave_timetype 
      ) VALUES (
      "${Leave_Inform}",
      "${Leave_day}",
      "${Leave_dayend}",
      "${Leave_type}",
      "${Leave_type}"
      
      
    )`;
    console.log(sql)
  
    // excute คำสั่ง
    db.query(sql, function(err, result) {
      if (err) {
        res.json({ 
          message:err
        });
      }else{
        res.json({ 
          message:'ok'
        });
      }
      // response jason ไปยังหน้าบ้าน
      
    });
});
///
app.put('/leaves', function(req, res, next) {
  var Leave_Num = req.body.Leave_Num 
  var Leave_Inform = req.body.Leave_Inform
  var Leave_day = req.body.Leave_day
  var Leave_dayend = req.body.Leave_dayend
  var Leave_Send = req.body.Leave_Send
  var Approve_Date = req.body.Approve_Date
  var Leave_Status = req.body.Leave_Status
  var Leave_approve = req.body.Leave_approve
  var Emp_ID = req.body.Emp_ID
 
   // คำสั่ง sql ในการยัดข้อมูลลง database
   var sql = `UPDATE Leaves 
   SET Leave_Inform = "${Leave_Inform}",
   Leave_day = "${Leave_day}",
   Leave_dayend = "${Leave_dayend}",
   Leave_Send = "${Leave_Send}",
   Approve_Date = "${Approve_Date}",
   Leave_Status = "${Leave_Status}",
   Leave_approve = "${Leave_approve}",
   Emp_ID = "${Emp_ID}"
   WHERE Leave_Num = "${Leave_Num}"; `
   console.log(sql)
    
  
    // excute คำสั่ง
    db.query(sql, function(err, result) {
      if (err) {
        res.json({ 
          message:err
        });
      }else{
        res.json({ 
          message:'ok'
        });
      }
      // response jason ไปยังหน้าบ้าน
      
    });
});
//
app.delete('/leaves', function(req, res,next) {
  var Leave_Num = req.body.Leave_Num 

  // คำสั่ง sqlในการลบข้อมูลในdatabase////////////////////////////
  var sql = `DELETE FROM Leaves 
  WHERE Leave_Num = "${Leave_Num}"`

//
  db.query(sql, function(err, result) {
    if (err) throw err;
    // response jason ไปยังหน้าบ้าน
    res.json({ 
      message:'ok'
    });
  });
})

//////////////////// PagePrivilege
app.get('/pageprivilege',function(req,res,next){
  var sql = `SELECT * FROM PagePrivilege`
  db.query(sql, function(err, result){
    if (err) throw err;
    var json = JSON.stringify(result)
    res.end(json);
  })
});
//////
app.post('/pageprivilege', function(req, res, next) {
  var PP_ID = req.body.PP_ID 
  var Role = req.body.Role 
  var path = req.body.path 
  var page_name = req.body.page_name 
   // คำสั่ง sql ในการยัดข้อมูลลง database
    var sql = `INSERT INTO PagePrivilege (
      PP_ID,
      Role,
      path
      page_name) VALUES (
      "${PP_ID}",
      "${Role}",
      "${path}",
      "${page_name}"
    )`;
    // excute คำสั่ง
    db.query(sql, function(err, result) {
      if (err) {
        res.json({ 
          message:err
        });
      }else{
        res.json({ 
          message:'ok'
        });
      }
      // response jason ไปยังหน้าบ้าน
      
    });
});
////
app.put('/pageprivilege', function(req, res, next) {
  var PP_ID = req.body.PP_ID 
  var Role = req.body.Role 
  var path = req.body.path 
  var page_name = req.body.page_name 
  /////////
  var sql = `UPDATE PagePrivilege 
  SET Role = "${Role}",
  path = "${path}",
  page_name = "${page_name}",
  WHERE PP_ID = "${PP_ID}"; `
  console.log(sql)
  // excute คำสั่ง
  db.query(sql, function(err, result) {
    if (err) {
      res.json({ 
        message:err
      });
    }else{
      res.json({ 
        message:'ok'
      });
    }
    // response jason ไปยังหน้าบ้าน
  });

});
///
app.delete('/pageprivilege', function(req, res,next) {
  var PP_ID = req.body.PP_ID 

  // คำสั่ง sqlในการลบข้อมูลในdatabase////////////////////////////
  var sql = `DELETE FROM PagePrivilege 
  WHERE PP_ID = "${PP_ID}"`

//
  db.query(sql, function(err, result) {
    if (err) throw err;
    // response jason ไปยังหน้าบ้าน
    res.json({ 
      message:'ok'
    });
  });
});

///////////////////register












// ================ 404 =================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
 
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
 
// port must be set to 3000 because incoming http requests are routed from port 80 to port 8080
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;