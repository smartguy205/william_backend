Deploy To Staging Server.
1. To Deploy Server Application the Staging Server push the latest code to the master branch. After pushing or merging the latest code to the master branch, the latest merged/pushed code will get updated to the server within 5 minutes.
3. Link to the staging server (https://testing-platform-serverstaging.herokuapp.com/) 

Deploy To Production Server.
1. To Deploy Server Application the Production Server push the latest code to the main branch. After pushing or merging the latest code to the main branch, the latest merged/pushed code will get updated to the latest server within 5 minutes.
3. Link to the Production server (https://api.marketingmgmt.net/)

How to change environment variable for Server app.
1. Log into teams heroku account or with account which have admin access to marketing-management teams.
2. After Login go to testing-platform-server app (if you want to change enviroment variable for Production server) or testing-platform-serverstaging (if you want to change enviroment variable for Staging server) and then click on settings. 

![image](https://user-images.githubusercontent.com/50096917/209548870-011ec664-649e-4a45-9db1-276e45c1dc42.png)
3. After clicking on reveal config vars button all the environment will appear. Here you can add, edit or delete environment variables.

Routes Information.

“/admin/login” => it requires email and password

“/admin/getTestDetails” => get all details about all users and their test

"/admin/excelUpload" => get questions of the test

“/admin/getuserPaper” => Here we get to know about (userID,email,score,questionsAttempted,correctAnswers,averageTime,accuracy, Questions:[],userQuestionsAndAnswers,retestisTestCompleted,isTestStarted, isSentToSack,createdAt,updatedAt)

“/user/startTest” => Check if user have already given a test or not .. if not given test , it shows no of questions yet to be answered

“/user/getQuestionFormId” => Available questions with their options , and image if available

“/user/createfeedback” => creates feedback. —-----------------------------------------------------------------------------------------------------------------------







