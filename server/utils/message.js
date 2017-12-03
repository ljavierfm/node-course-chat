/*jshint esversion: 6 */

let generateMessage=(from,text)=>{
    return {
        from,
        text,
        createdAt:new Date().getTime()
    };
};

module.exports={generateMessage};