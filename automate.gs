const batch_mail = "" // redacted for privacy reasons
const warnEmail = "" // redacted for privacy reasons
const botReminder = "[This an automatically generated message from 'Palancas for Supremo Lingayen' Google Forms responses. Rest assured that all messages are sent privately without human intervention]".italics()


var unsent = [];
var lastRun;
var lock = LockService.getScriptLock();


const formId = "" // redacted for privacy reasons
// A C C E S S  F O R M S //
const form = FormApp.openById(formId);
var formResponses = form.getResponses(); // gets list of form responses
function checkNumberOfPalancaSent(){
 Logger.log(formResponses.length)
}


// Some classmates wanted their mails be resent
// function resendMailByName() {
// var reference = SpreadsheetApp.openById('1jOLiA_PSm3yhxXQ0klHggFAaPJLJmRbWc0JGEjrrWIk')
// var all_data = reference.getDataRange().getValues();
// var email; var nickname;
// for(var k = 0; k<all_data.length;k++){
//   if(name == all_data[k][0]){
//     email = all_data[k][1]
//     var custom = true;
//     if(all_data[k][2] != "" && all_data[k][2] != null){
//       nickname = all_data[k][2] ;
//     }
//     else{
//       nickname = name.split(",")[1].split(" ")[1];
//       custom = false;
//     }
//     Logger.log("Message for %s (%s) [custom name = %s]", nickname, email, custom)
//   }
// }


 // C H E C K    S P R E A D S H E E T   I N D E X
const spreadsheetId = "" // redacted for privacy reasons
var reference = SpreadsheetApp.openById(formId)
var all_data = reference.getDataRange().getValues();
var email; var nickname;
for(var k = 0; k<all_data.length;k++){
  if(name == all_data[k][0]){
    email = all_data[k][1]
    var custom = true;
    if(all_data[k][2] != "" && all_data[k][2] != null){
      nickname = all_data[k][2] ;
    }
    else{
      nickname = name.split(",")[1].split(" ")[1];
      custom = false;
    }
    Logger.log("Message for %s (%s) [custom name = %s]", nickname, email, custom)
  }
}
formResponses.forEach(function(value) {
  //Logger.log(value.getItemResponses()[2].getResponse());
  if (value.getItemResponses()[2].getResponse() == name){
    //Logger.log(value.getItemResponses()[3].getResponse());
    var sender = value.getItemResponses()[0].getResponse();
    var batch_message = value.getItemResponses()[1].getResponse();
    var message = value.getItemResponses()[3].getResponse();
    //var attached = value.getItemResponses()[4].getResponse();
    //Logger.log(sender + batch_message + message)
    // S E N D    P E R S O N A L    M E S S A G E
    var fileAsBlob = [];
    Logger.log('Sending email to %s from %s with %s attachments', email, sender, fileAsBlob)
    var greetings = "<h1>Hey there, Supling " + nickname + "! " + sender + " would like to tell you: "
    var personalMessage = greetings + "</h1>\n\n<h2><blockquote>" + message + "</blockquote></h2>\n\n" + botReminder
    Logger.log(personalMessage)
    //MailApp.sendEmail(email, "[RESEND] Palanca from " + sender + " <3", message, {attachments: fileAsBlob, htmlBody: personalMessage })
  }
});


}
function sendMail() {
 lastRun = new Date() // date and time of current form response
 var formResponse = formResponses[formResponses.length-1]; //gets the last response
 var itemResponses = formResponse.getItemResponses();
 var responseID = formResponse.getId()
 if (MailApp.getRemainingDailyQuota() > 1){
   Logger.log("Form response [%s]received at %s",responseID, lastRun)
   var success = lock.tryLock(80000) // waits up to 80 seconds until the processes are finished
   const ticketId = formResponse.getId()
   // G E T  F O R M   R E S P O N S E S //
   for (var j = 0; j < itemResponses.length; j++) {
     var itemResponse = itemResponses[j];
     if (j==0){
       var sender = itemResponse.getResponse();
     }
     if (j==1){
       var batch_message = itemResponse.getResponse();
     }
     if (j==2){
       var name = itemResponse.getResponse();
     }
     if (j==3){
       var message = itemResponse.getResponse();
     }
     if (j==4){
       var attached = itemResponse.getResponse();
     }
     //Logger.log(itemResponse.getResponse())
   }
   // S E N D    B A T C H    M E S S A G E
  
   if (batch_message != "" && batch_message != null) {
     Logger.log('Sending batch message from %s with: %s', sender, batch_message )
     var batchMessage = "<h1>Hey there, Supremo Lingayen! "  + sender + " would like to tell you: </h1>\n\n<h2><blockquote>"
      + batch_message + "</blockquote></h2>" + botReminder
     MailApp.sendEmail(batch_mail, "Palanca from "+ sender + " <3", batch_message, {htmlBody: batchMessage})
   }
 
   // C H E C K    S P R E A D S H E E T   I N D E X
   var reference = SpreadsheetApp.openById('1jOLiA_PSm3yhxXQ0klHggFAaPJLJmRbWc0JGEjrrWIk')
   var all_data = reference.getDataRange().getValues();
   var email; var nickname;
   for(var k = 0; k<all_data.length;k++){
     if(name == all_data[k][0]){
       email = all_data[k][1]
       var custom = true;
       if(all_data[k][2] != "" && all_data[k][2] != null){
         nickname = all_data[k][2] ;
       }
       else{
         nickname = name.split(",")[1].split(" ")[1];
         custom = false;
       }
       Logger.log("Message for %s (%s) [custom name = %s]", nickname, email, custom)
     }
   }
   // C H E C K   D R I V E   F O R   A T T A C H E D   F I L E S
   var fileAsBlob = [];
   var checkpoints = [];
   var unprocessed = 0;
   checkpoints.push(lastRun)
   if (attached!= null){
     Logger.log('Number of attachments: %s', attached.length)
     for (var i =0; i < attached.length; i++){
       var fileNotFound = true;
       var file = DriveApp.getFileById(attached[i])
       Logger.log('Looking for [%s] in Drive ...', file)
       while(fileNotFound){
         var files = DriveApp.getFiles()
         if (new Date() - checkpoints[i]> 150000 ){
           fileNotFound = false
           Logger.log('File not yet found after 15 seconds. Skipping ...')
           checkpoints.push(new Date())
           unprocessed += 1;
         }
         else{
           while(files.hasNext()){
             var check = files.next()
             if (check.getId() == file.getId()){
                 fileNotFound = false
                 Logger.log('File [%s] found as [%s]', check.getId(), check.getName())
         
             }
           }
         }
        
        
       }
       if (!file.isTrashed()){
         Logger.log('Attaching [%s] with id [%s]', file.getName(),attached[i])
         file.setName("Attachment " + String(i+1))
         fileAsBlob.push(DriveApp.getFileById(attached[i]))
         file.setTrashed(true) // send to trash after attaching
       }
     }
   }
   // S E N D    P E R S O N A L    M E S S A G E
   Logger.log('Sending email to %s from %s with attachments %s', email, sender, fileAsBlob)
   var greetings = "<h1>Hey there, Supling " + nickname + "! " + sender + " would like to tell you: "
  
   var personalMessage = greetings + "</h1>\n\n<h2><blockquote>" + message + "</blockquote></h2>\n\n" + botReminder
   MailApp.sendEmail(email, "Palanca from " + sender + " <3", message, {attachments: fileAsBlob, htmlBody: personalMessage })
   if (!success){
     unsent.push(responseID)
     Logger.log('Failed to get a lock. Adding to list of failed emails. Resending tomorrow.')
   }
   lock.releaseLock()
 }
 else{
   surpassedEmailQuota()
 }
 
}
function resumeAcceptingResponses(){
 // runs every 12 AM
 //if (MailApp.getRemainingDailyQuota() > 50){
   Logger.log('[%s] Resuming accepting form responses', new Date())
   form.setAcceptingResponses(true)
 //}
 }


function warnWhenAccessed() {
 var warningMessage = "<h3>Unauthorized access discovered at " + new Date() + ". Current editors with access are: "
   + form.getEditors() + "</h3>\n\n" + botReminder;
 Logger.log('Sending unuthorized access email ...')
 MailApp.sendEmail(warnEmail, "Unauthorized Access Warning", warningMessage, {htmlBody:warningMessage })
}


function surpassedEmailQuota(){
 form.setAcceptingResponses(false)
 var today = new Date()
 var tomorrow = new Date(today)
 tomorrow.setDate(tomorrow.getDate() + 1)
 tomorrow.setHours(0,0,0,0)
 Logger.log("[%s] Closing form responses ...", today)
 form.setCustomClosedFormMessage("Zzzz. The bot has exhausted its remaining daily quota for emails sent. This form will resume accepting responses at " + tomorrow + "or LATER")
 var fullQuotaMessage = "<h3>I have exhausted my remaining daily quota for emails sent. Last form response was sent at "
   + lastRun + "</h3>\n\n" + botReminder
 MailApp.sendEmail(warnEmail, "Surpassed Daily Quota for Sent Emails", fullQuotaMessage, {htmlBody: fullQuotaMessage})
}


function checkRemaining(){
 Logger.log(MailApp.getRemainingDailyQuota())
}


function testBatchEmail(){
 var batchMessage = "<h1>Hey there, Supremo Lingayen! "  + "Asil" + " would like to tell you: </h1>\n\n<h2><blockquote>"
      + "the window is open and so's that door. i didn't know they did that anymore. who knew we owned a thousand salad plates. for years i've roamed this empty hall. why have a ballroom with no balls. finally they're opening up the gates" + "</blockquote></h2>" + botReminder
 MailApp.sendEmail(warnEmail, "Palanca from "+ "Asil <3", batchMessage, {htmlBody: batchMessage})
}




