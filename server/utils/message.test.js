/*jshint esversion: 6 */

const expect=require('expect');
const { generateMessage } = require('./message');

describe('generateMessage',()=>{
    it('should generate correct message object',()=>{

        let from='Jen';
        let text='Some message';
        let message = generateMessage(from,text);

        //expect(message.createdAt).toBeA('number');
        //expect(message).toInclude({from,text});
    });
});