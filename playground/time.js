/*jshint esversion: 6 */
const moment=require('moment');

let createdAt=1234;
let date= moment(createdAt);
date.locale('es');


console.log(date.format('H:mm a'));

//10:35 am
//6:02 am

